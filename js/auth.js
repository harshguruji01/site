import { auth, googleProvider } from './firebase.js';
import { ensureUserDocument } from './database.js'; // Ensure this file exists and exports ensureUserDocument
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// List of pages that require authentication
const PROTECTED_PAGES = ['dashboard.html', 'profile.html', 'settings.html', 'bookmarks.html', 'downloads.html'];

// List of pages users shouldn't access if ALREADY logged in
const AUTH_PAGES = ['login.html', 'signup.html'];

/**
 * Initialize Auth State Listener & Session Persistence
 */
export function initializeAuth() {
  // Set persistence to Local (survives browser restart)
  setPersistence(auth, browserLocalPersistence)
    .catch((error) => console.error("Auth Persistence Error:", error));

  onAuthStateChanged(auth, (user) => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (user) {
      // User is signed in
      updateNavbarUI(user);
      
      // If user is on login/signup, redirect to dashboard
      if (AUTH_PAGES.includes(currentPage)) {
        window.location.href = 'dashboard.html';
      }
    } else {
      // User is signed out
      updateNavbarUI(null);
      
      // If user is on a protected page, redirect to login
      if (PROTECTED_PAGES.includes(currentPage)) {
        window.location.href = 'login.html';
      }
    }
  });

  // Setup dropdown toggle logic
  setupDropdownListener();
}

/**
 * Update the Navbar UI based on Auth State
 */
function updateNavbarUI(user) {
  const btnLogin = document.getElementById('btn-login');
  const profileDropdown = document.getElementById('user-profile-dropdown');
  
  if (!btnLogin || !profileDropdown) return; // Navbar might not be loaded yet

  if (user) {
    // Hide Login Button, Show Profile
    btnLogin.style.display = 'none';
    profileDropdown.style.display = 'block';

    // Populate user info
    const userNameDisplay = user.displayName || 'User';
    const userPhoto = user.photoURL || https://ui-avatars.com/api/?name=\&background=random;

    const navUserName = document.getElementById('nav-user-name');
    const navUserAvatar = document.getElementById('nav-user-avatar');
    const dropUserName = document.getElementById('dropdown-user-name');
    const dropUserEmail = document.getElementById('dropdown-user-email');

    if(navUserName) navUserName.textContent = userNameDisplay;
    if(navUserAvatar) navUserAvatar.src = userPhoto;
    if(dropUserName) dropUserName.textContent = userNameDisplay;
    if(dropUserEmail) dropUserEmail.textContent = user.email;

  } else {
    // Show Login Button, Hide Profile
    btnLogin.style.display = 'inline-flex';
    profileDropdown.style.display = 'none';
    
    // Close dropdown if open
    profileDropdown.classList.remove('active');
  }
}

/**
 * Setup Dropdown Click Listener
 */
function setupDropdownListener() {
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('user-profile-dropdown');

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
    });

    // Close when clicking outside
    window.addEventListener('click', (e) => {
      if (!profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove('active');
      }
    });
  }
}

/**
 * Handle Google Sign-In
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if(typeof ensureUserDocument === 'function') {
        await ensureUserDocument(result.user);
    }
    // Redirection is handled by onAuthStateChanged
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
}

/**
 * Handle Logout
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    // Redirection is handled by onAuthStateChanged if they are on a protected page, 
    // otherwise they just see the UI update instantly.
    
    // Force redirect if not protected but want to go home
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (!PROTECTED_PAGES.includes(currentPage) && !AUTH_PAGES.includes(currentPage)) {
       // if they were on index, stay there, UI just updates.
    } else {
       window.location.href = 'index.html';
    }
  } catch (error) {
    console.error("Logout Error:", error);
  }
}

// Make logoutUser globally available for inline onclick handlers in HTML
window.logoutUser = logoutUser;

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeAuth);
