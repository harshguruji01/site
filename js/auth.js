import { supabase } from './supabase.js';
import { getProfile, updateProfile } from './profile.js';
import { trackActivity } from './activity-tracker.js';

// Expose AuthManager globally for convenience or use via exports
export const AuthManager = {
  supabase,
  currentUser: null,
  currentProfile: null,

  async init() {
    try {
      // Check initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session && session.user) {
        await this.handleUserLogin(session.user);
      } else {
        this.handleUserLogout();
      }
    } catch (err) {
      console.warn("Session check notice:", err);
      this.handleUserLogout();
    }

    // Listen to Supabase Auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Supabase Auth Event:', event);
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session && session.user) {
        await this.handleUserLogin(session.user);
      } else if (event === 'SIGNED_OUT') {
        this.handleUserLogout();
      }
    });
  },

  async handleUserLogin(user) {
    this.currentUser = user;
    
    // Ensure both user.id and user.uid are available for backward compatibility
    user.uid = user.id;

    // Check if profile exists, if not, create one
    let profile = await getProfile(user.id);
    if (!profile) {
      console.log("No profile found in Supabase, creating from metadata...");
      const userMetadata = user.user_metadata || {};
      const newProfile = {
        id: user.id,
        display_name: userMetadata.full_name || userMetadata.name || (user.email ? user.email.split('@')[0] : 'User'),
        avatar_url: userMetadata.avatar_url || userMetadata.picture || null,
        email: user.email,
        golden_tick: false,
        updated_at: new Date().toISOString(),
      };
      profile = await updateProfile(user.id, newProfile);
      
      // Log account created event
      await trackActivity({
        activity_type: 'account_created',
        page_type: 'system',
        page_name: 'Account Setup',
        metadata: { provider: user.app_metadata?.provider || 'supabase' }
      });
    }

    // Track standard page view
    await trackActivity({ activity_type: 'page_view' });

    // Verify contributor and golden_tick integrity
    const userEmail = (user.email || '').toLowerCase();
    const isOwner = userEmail === 'harshguruji01@gmail.com';
    let isContributor = isOwner;

    try {
      // Check if user has an active, verified contributor record
      const { data: contributorData } = await supabase
        .from('contributors')
        .select('id, status, verified')
        .eq('user_id', user.id)
        .in('status', ['ACTIVE', 'approved'])
        .maybeSingle();

      if (contributorData && (contributorData.verified === true || contributorData.status === 'ACTIVE')) {
        isContributor = true;
      }

      // Safety: If profile has golden_tick = true but user is NOT the owner and NOT an active approved contributor, revoke golden_tick immediately!
      if (profile && profile.golden_tick === true && !isContributor) {
        profile.golden_tick = false;
        await supabase
          .from('profiles')
          .update({ golden_tick: false })
          .eq('id', user.id);
      }

      // Conversely, if user IS owner or verified contributor, ensure golden_tick is true
      if (profile && profile.golden_tick !== true && isContributor) {
        profile.golden_tick = true;
        await supabase
          .from('profiles')
          .update({ golden_tick: true })
          .eq('id', user.id);
      }

      // Hide contributor CTA buttons if already a verified contributor or owner
      if (isContributor) {
        const indexCta = document.getElementById('contributor-cta');
        if (indexCta) indexCta.style.display = 'none';
        const pageCta = document.getElementById('become-cta');
        if (pageCta) pageCta.style.display = 'none';
      }
    } catch(err) {
      console.warn("Contributor status check notice:", err);
    }

    this.currentProfile = profile;

    // Dispatch global event for UI updates (navbar, dashboard, settings, contributor)
    window.dispatchEvent(new CustomEvent('auth-state-changed', { 
      detail: { user: this.currentUser, profile: this.currentProfile } 
    }));
  },

  handleUserLogout() {
    this.currentUser = null;
    this.currentProfile = null;
    const indexCta = document.getElementById('contributor-cta');
    if (indexCta) indexCta.style.display = '';
    const pageCta = document.getElementById('become-cta');
    if (pageCta) pageCta.style.display = '';
    window.dispatchEvent(new CustomEvent('auth-state-changed', { 
      detail: { user: null, profile: null } 
    }));
  }
};

/**
 * Sign In with Supabase Email & Password
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("Supabase sign in error:", error);
    let msg = error.message;
    if (msg.includes('Invalid login credentials')) {
      msg = "Invalid email or password. Please check your credentials.";
    } else if (msg.includes('Email not confirmed')) {
      msg = "Please verify your email before signing in.";
    }
    throw new Error(msg);
  }
  return data;
}

/**
 * Sign Up with Supabase Email & Password
 */
export async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { 
        full_name: name,
        name: name
      }
    }
  });
  if (error) {
    console.error("Supabase sign up error:", error);
    throw error;
  }
  return data;
}

/**
 * Sign In with Supabase Google OAuth
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard.html'
    }
  });
  if (error) {
    console.error("Supabase Google sign in error:", error);
    throw error;
  }
  if (data && data.url) {
    window.location.href = data.url;
  }
  return data;
}

/**
 * Sign Out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Supabase sign out error:", error);
    throw error;
  }
  window.location.href = '/index.html';
}

/**
 * Get Current Session
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return null;
  return session;
}

/**
 * Phone OTP Auth (Optional)
 */
export async function signInWithPhone(phone) {
  const { data, error } = await supabase.auth.signInWithOtp({ phone });
  if (error) throw error;
  return data;
}

export async function verifyPhoneOtp(phone, token) {
  const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
  if (error) throw error;
  return data;
}

// Automatically start AuthManager listener and expose on window
window.AuthManager = AuthManager;
AuthManager.init();