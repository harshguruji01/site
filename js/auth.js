// js/auth.js
import { auth, googleProvider } from './firebase.js';
import { ensureUserDocument } from './database.js';
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/**
 * Handle Google Sign-In
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Ensure document exists in Firestore
    await ensureUserDocument(result.user);
    window.location.href = 'dashboard.html';
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
}

/**
 * Handle Email/Password Registration
 */
export async function registerWithEmail(email, password, name) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Add temporary display name to user object before creating doc
    result.user.displayName = name;
    
    // Create Firestore document
    await ensureUserDocument(result.user);
    
    // Send verification email
    await sendEmailVerification(result.user);
    
    // Log them out temporarily so they must verify (optional based on UX)
    // or keep them logged in but show banner. We will keep them logged in.
    window.location.href = 'dashboard.html';
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
}

/**
 * Handle Email/Password Login
 */
export async function loginWithEmail(email, password, rememberMe = true) {
  try {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);
    
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Update last login
    await ensureUserDocument(result.user);
    window.location.href = 'dashboard.html';
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
}

/**
 * Handle Logout
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    window.location.href = 'login.html';
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
}

/**
 * Handle Password Reset
 */
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Reset Password Error:", error);
    throw error;
  }
}

/**
 * Auth State Observer for Protected Routes
 * @param {function} callback - Function to run when user is authenticated
 * @param {boolean} requiresAuth - If true, redirects to login when not authenticated
 */
export function initAuthObserver(callback, requiresAuth = true) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in.
      if (callback) await callback(user);
    } else {
      // No user is signed in.
      if (requiresAuth) {
        window.location.href = 'login.html';
      } else {
        if (callback) callback(null);
      }
    }
  });
}
