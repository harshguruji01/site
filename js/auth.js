import { auth, googleProvider, db } from './firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile as updateAuthProfile 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getProfile, updateProfile } from './profile.js';
import { trackActivity } from './activity-tracker.js';

// Expose AuthManager globally for convenience or use via exports
export const AuthManager = {
  auth,
  currentUser: null,
  currentProfile: null,
  _initialResolve: null,
  _initialized: false,

  init() {
    if (this._initialized) return;
    this._initialized = true;

    // Listen to Firebase Auth state changes
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Ensure user.id matches user.uid for compatibility with legacy templates
        user.id = user.uid;
        await this.handleUserLogin(user);
      } else {
        this.handleUserLogout();
      }

      if (this._initialResolve) {
        this._initialResolve(this.currentUser ? { user: this.currentUser } : null);
        this._initialResolve = null;
      }
    });
  },

  async handleUserLogin(user) {
    user.id = user.uid;
    user.app_metadata = {
      provider: user.providerData?.[0]?.providerId || 'password',
      providers: (user.providerData || []).map(p => p.providerId.replace('.com', ''))
    };
    this.currentUser = user;
    
    // Check if profile exists in Firestore, if not, create one
    let profile = await getProfile(user.uid);
    if (!profile) {
      console.log("No profile found in Firestore, creating default profile...");
      const displayName = user.displayName || (user.email ? user.email.split('@')[0] : "User");
      const newProfile = {
        id: user.uid,
        display_name: displayName,
        avatar_url: user.photoURL || null,
        email: user.email,
        updated_at: new Date().toISOString(),
      };
      profile = await updateProfile(user.uid, newProfile);
      
      // Log account created event
      await trackActivity({
        activity_type: 'account_created',
        page_type: 'system',
        page_name: 'Account Setup',
        metadata: { provider: user.providerData?.[0]?.providerId || 'password' }
      });
    }
    this.currentProfile = profile;

    // Track a standard page view once user is logged in
    await trackActivity({ activity_type: 'page_view' });

    // Check contributor status if collection exists
    try {
      const contribDoc = await getDoc(doc(db, 'contributors', user.uid));
      if (contribDoc.exists()) {
        const indexCta = document.getElementById('contributor-cta');
        if (indexCta) indexCta.style.display = 'none';
        const pageCta = document.getElementById('become-cta');
        if (pageCta) pageCta.style.display = 'none';
      }
    } catch (err) {
      // Non-critical, ignore error
    }

    // Dispatch global event for UI updates (navbar, dashboard, settings)
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

/**
 * Sign in with Email and Password
 */
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    user.id = user.uid;
    return { user };
  } catch (error) {
    console.error("Firebase Sign In error:", error);
    let message = error.message;
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      message = "Invalid email or password. Please check your credentials.";
    } else if (error.code === 'auth/too-many-requests') {
      message = "Too many failed attempts. Please try again later.";
    }
    throw new Error(message);
  }
}

/**
 * Sign up with Email and Password and optional Name
 */
export async function signUp(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    user.id = user.uid;

    if (name) {
      await updateAuthProfile(user, { displayName: name });
    }

    // Store profile in Firestore
    await updateProfile(user.uid, {
      id: user.uid,
      display_name: name || email.split('@')[0],
      email: email,
      avatar_url: null,
      created_at: new Date().toISOString()
    });

    return { user };
  } catch (error) {
    console.error("Firebase Sign Up error:", error);
    let message = error.message;
    if (error.code === 'auth/email-already-in-use') {
      message = "This email is already registered. Please log in instead.";
    } else if (error.code === 'auth/weak-password') {
      message = "Password should be at least 6 characters.";
    } else if (error.code === 'auth/invalid-email') {
      message = "Please provide a valid email address.";
    }
    throw new Error(message);
  }
}

/**
 * Sign in / Sign up with Google Popup
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    user.id = user.uid;

    // Ensure Firestore profile is updated with Google photo and name
    const existing = await getProfile(user.uid);
    if (!existing) {
      await updateProfile(user.uid, {
        id: user.uid,
        display_name: user.displayName || user.email.split('@')[0],
        avatar_url: user.photoURL || null,
        email: user.email,
        created_at: new Date().toISOString()
      });
    }

    return { user };
  } catch (error) {
    console.error("Firebase Google Sign In error:", error);
    let message = error.message;
    if (error.code === 'auth/popup-closed-by-user') {
      message = "Google sign-in popup was closed before completing.";
    } else if (error.code === 'auth/unauthorized-domain') {
      message = "This domain is not authorized in Firebase Console (Authentication > Settings > Authorized domains).";
    }
    throw new Error(message);
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  try {
    await firebaseSignOut(auth);
    window.location.href = '/index.html';
  } catch (error) {
    console.error("Firebase Sign Out error:", error);
    throw error;
  }
}

/**
 * Get current session / user
 */
export async function getSession() {
  if (auth.currentUser) {
    auth.currentUser.id = auth.currentUser.uid;
    return { user: auth.currentUser };
  }

  return new Promise((resolve) => {
    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(auth.currentUser ? { user: auth.currentUser } : null);
      }
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        unsubscribe();
        if (user) {
          user.id = user.uid;
          resolve({ user });
        } else {
          resolve(null);
        }
      }
    });
  });
}

/**
 * Phone Auth helpers
 */
export async function signInWithPhone(phone) {
  throw new Error("Phone OTP is optional and requires RecaptchaVerifier setup. Please use Email/Password or Google Sign-In.");
}

export async function verifyPhoneOtp(phone, token) {
  throw new Error("Phone OTP verification not configured. Please use Email/Password or Google Sign-In.");
}

// Automatically start AuthManager listener and expose on window
window.AuthManager = AuthManager;
AuthManager.init();