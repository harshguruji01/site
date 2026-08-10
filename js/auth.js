import { supabase } from './supabase.js';
import { getProfile, updateProfile } from './profile.js';
import { trackActivity } from './activity-tracker.js';

// Expose AuthManager globally for convenience or use via exports
export const AuthManager = {
  supabase,
  currentUser: null,
  currentProfile: null,

  async init() {
    // Check initial session
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await this.handleUserLogin(session.user);
    } else {
      this.handleUserLogout();
    }

    // Listen to changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      if (event === 'SIGNED_IN' && session) {
        await this.handleUserLogin(session.user);
      } else if (event === 'SIGNED_OUT') {
        this.handleUserLogout();
      } else if (event === 'INITIAL_SESSION') {
          if(session) await this.handleUserLogin(session.user);
      }
    });
  },

  async handleUserLogin(user) {
    this.currentUser = user;
    
    // Check if profile exists, if not, create one
    let profile = await getProfile(user.id);
    if (!profile) {
      console.log("No profile found, creating one from Google metadata...");
      const userMetadata = user.user_metadata || {};
      const newProfile = {
        id: user.id, // Ensure id matches the auth user id
        display_name: userMetadata.full_name || user.email.split('@')[0],
        avatar_url: userMetadata.avatar_url || null,
        email: user.email,
        updated_at: new Date().toISOString(),
      };
      profile = await updateProfile(user.id, newProfile);
      
      // Log account created event
      await trackActivity({
          activity_type: 'account_created',
          page_type: 'system',
          page_name: 'Account Setup',
          metadata: { provider: user.app_metadata.provider }
      });
    }
    this.currentProfile = profile;

    // Track a standard page view once we're sure the user is logged in
    await trackActivity({ activity_type: 'page_view' });

    // Dispatch global event for UI updates
    window.dispatchEvent(new CustomEvent('auth-state-changed', { 
      detail: { user: this.currentUser, profile: this.currentProfile } 
    }));
  },

  handleUserLogout() {
    this.currentUser = null;
    this.currentProfile = null;
    window.dispatchEvent(new CustomEvent('auth-state-changed', { 
      detail: { user: null, profile: null } 
    }));
  }
};

// Export individual utility functions for backwards compatibility
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }
    }
  });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard.html'
    }
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.href = '/index.html';
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

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

// Initialize AuthManager
AuthManager.init();