import { auth, googleProvider } from './firebase.js';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ensureUserDocument } from "./database.js";

const PROTECTED_PAGES = ["dashboard.html", "profile.html", "settings.html", "bookmarks.html", "downloads.html"];
const AUTH_PAGES = ["login.html", "signup.html"];

export function initAuthObserver(redirectOnAuth = true, redirectOnUnauth = true) {
  onAuthStateChanged(auth, async (user) => {
    const page = window.location.pathname.split("/").pop() || "index.html";
    
    if (user) {
      // User is logged in
      updateNavbarUI(user);
      if (redirectOnAuth && AUTH_PAGES.includes(page)) {
        window.location.href = "dashboard.html";
      }
    } else {
      // User is logged out
      updateNavbarUI(null);
      if (redirectOnUnauth && PROTECTED_PAGES.includes(page)) {
        window.location.href = "login.html";
      }
    }
  });
}

function updateNavbarUI(user) {
  // Update Premium Navbar UI
  const loginBtn = document.getElementById("premium-login-btn");
  const userProfile = document.getElementById("premium-user-profile");
  const userName = document.getElementById("premium-user-name");
  const userAvatar = document.getElementById("premium-user-avatar");

  if (user) {
    if (loginBtn) loginBtn.style.display = "none";
    if (userProfile) userProfile.style.display = "flex";
    if (userName) userName.textContent = user.displayName || "User";
    if (userAvatar) userAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=random`;
  } else {
    if (loginBtn) loginBtn.style.display = "inline-flex";
    if (userProfile) userProfile.style.display = "none";
  }
}

export async function registerWithEmail(email, password, fullname) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Attach the fullname to the user object before creating the doc
    userCredential.user.displayName = fullname;
    await ensureUserDocument(userCredential.user);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

export async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await ensureUserDocument(userCredential.user);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await ensureUserDocument(result.user);
    return result.user;
  } catch (error) {
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Logout failed", error);
  }
}

window.logoutUser = logoutUser;

// Initialize observer on DOM load for all pages
document.addEventListener("DOMContentLoaded", () => {
  // Avoid duplicate observer initializations if page calls it
  if (!window.authObserverInitialized) {
    initAuthObserver(true, true);
    window.authObserverInitialized = true;
  }
  
  // Profile Dropdown logic (premium navbar)
  const profileToggle = document.getElementById("premium-user-profile");
  if(profileToggle) {
      profileToggle.addEventListener('click', () => {
         window.location.href = "dashboard.html"; // Simple redirect for now instead of dropdown
      });
  }
});