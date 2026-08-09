import { supabase } from './supabase.js';

const PROTECTED_PAGES = ["dashboard.html", "profile.html", "settings.html", "bookmarks.html", "downloads.html"];
const AUTH_PAGES = ["login.html", "signup.html", "reset-password.html", "forgot-password.html"];

export function initAuthObserver(redirectOnAuth = true, redirectOnUnauth = true) {
  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    const page = window.location.pathname.split("/").pop() || "index.html";
    
    if (session && session.user) {
      // User is logged in
      updateNavbarUI(session.user);
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
    
    // We can fetch from profiles, or use user metadata for now
    const displayName = user.user_metadata?.full_name || "User";
    if (userName) userName.textContent = displayName;
    
    if (userAvatar) {
        userAvatar.src = user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
    }
  } else {
    if (loginBtn) loginBtn.style.display = "inline-flex";
    if (userProfile) userProfile.style.display = "none";
  }
}

export async function registerWithEmail(email, password, data) {
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: data
    }
  });
  if (error) throw error;
  return authData.user;
}

export async function loginWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data.user;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
        redirectTo: window.location.origin + '/dashboard.html'
    }
  });
  if (error) throw error;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout failed", error);
  } else {
    window.location.href = "index.html";
  }
}

export async function sendPasswordReset(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password.html',
    });
    if (error) throw error;
}

export async function updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword
    });
    if (error) throw error;
    return data;
}

window.logoutUser = logoutUser;

// Initialize observer on DOM load for all pages
document.addEventListener("DOMContentLoaded", () => {
  if (!window.authObserverInitialized) {
    initAuthObserver(true, true);
    window.authObserverInitialized = true;
  }
  
  // Profile Dropdown logic
  const profileToggle = document.getElementById("premium-user-profile");
  if(profileToggle) {
      profileToggle.addEventListener('click', () => {
         window.location.href = "dashboard.html"; 
      });
  }
});