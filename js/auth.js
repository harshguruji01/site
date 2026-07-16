import { auth, googleProvider, githubProvider } from './firebase.js';
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
      updateNavbarUI(user);
      if (AUTH_PAGES.includes(currentPage)) {
        window.location.href = 'dashboard.html';
      }
    } else {
      updateNavbarUI(null);
      if (PROTECTED_PAGES.includes(currentPage)) {
        window.location.href = 'login.html';
      }
    }
  });

  setupDropdownListener();
}

/**
 * Update the Navbar UI based on Auth State
 */
function updateNavbarUI(user) {
  const btnLogin = document.getElementById('btn-login');
  const profileDropdown = document.getElementById('user-profile-dropdown');
  const authLoading = document.getElementById('auth-loading');
  const mobileAuthItem = document.getElementById('mobile-auth-item');
  
  if (!btnLogin && !authLoading) return; // Navbar might not be loaded yet

  if (authLoading) authLoading.style.display = 'none';

  if (user) {
    if (btnLogin) btnLogin.style.display = 'none';
    if (profileDropdown) profileDropdown.style.display = 'block';
    if (mobileAuthItem) mobileAuthItem.style.display = 'block';

    // Populate user info
    const userNameDisplay = user.displayName || 'User';
    const userPhoto = user.photoURL || "https://ui-avatars.com/api/?name=${encodeURIComponent(userNameDisplay)}&background=random";

    const navUserName = document.getElementById('nav-user-name');
    const navUserAvatar = document.getElementById('nav-user-avatar');
    const dropUserName = document.getElementById('dropdown-user-name');
    const dropUserEmail = document.getElementById('dropdown-user-email');
    
    const mobUserAvatar = document.getElementById('mobile-user-avatar');
    const mobUserName = document.getElementById('mobile-user-name');

    if(navUserName) navUserName.textContent = userNameDisplay;
    if(navUserAvatar) navUserAvatar.src = userPhoto;
    if(dropUserName) dropUserName.textContent = userNameDisplay;
    if(dropUserEmail) dropUserEmail.textContent = user.email;
    
    if(mobUserName) mobUserName.textContent = userNameDisplay;
    if(mobUserAvatar) mobUserAvatar.src = userPhoto;

  } else {
    if (btnLogin) btnLogin.style.display = 'inline-flex';
    if (profileDropdown) {
        profileDropdown.style.display = 'none';
        profileDropdown.classList.remove('active');
    }
    if (mobileAuthItem) mobileAuthItem.style.display = 'none';
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
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (PROTECTED_PAGES.includes(currentPage) || AUTH_PAGES.includes(currentPage)) {
       window.location.href = 'index.html';
    }
  } catch (error) {
    console.error("Logout Error:", error);
  }
}

window.logoutUser = logoutUser;

document.addEventListener('DOMContentLoaded', initializeAuth);

/**
 * Handle GitHub Sign-In
 */
export async function signInWithGitHub() {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    if(typeof ensureUserDocument === 'function') {
        await ensureUserDocument(result.user);
    }
  } catch (error) {
    console.error("GitHub Sign-In Error:", error);
    if (error.code === 'auth/account-exists-with-different-credential') {
      alert('You have already signed up with a different provider for that email.');
    }
    throw error;
  }
}
window.signInWithGitHub = signInWithGitHub;
