// Backend API Auth Module - Replaces Supabase auth
const API_BASE = '/api';

const PROTECTED_PAGES = ["dashboard.html", "profile.html", "settings.html", "bookmarks.html", "downloads.html"];
const AUTH_PAGES = ["login.html", "signup.html", "reset-password.html", "forgot-password.html"];

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important for cookies
    ...options,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
}

export async function registerWithEmail(email, password, userData) {
  const data = {
    email,
    password,
    username: userData.username,
    name: userData.full_name || userData.username,
    fullName: userData.full_name,
    mobile: userData.mobile,
    dob: userData.dob,
    gender: userData.gender,
    country: userData.country,
    secretPin: userData.secret_pin,
  };
  
  const result = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  return result.data;
}

export async function loginWithEmail(identifier, password) {
  const result = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: identifier, password }),
  });
  
  return result.data;
}

export async function logoutUser() {
  await apiRequest('/auth/logout', { method: 'POST' });
  window.location.href = 'index.html';
}

export async function getCurrentUser() {
  const result = await apiRequest('/auth/me');
  return result.user;
}

export async function getUserProfile() {
  const result = await apiRequest('/users/me');
  return result.data;
}

export async function updateUserProfile(data) {
  const result = await apiRequest('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function verifySecretPin(pin) {
  const result = await apiRequest('/auth/verify-pin', {
    method: 'POST',
    body: JSON.stringify({ pin }),
  });
  return result;
}

export async function signInWithGoogle() {
  window.location.href = `${API_BASE}/auth/google`;
}

export function signInWithGoogleRedirect(redirectTo) {
  const params = redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : '';
  window.location.href = `${API_BASE}/auth/google${params}`;
}

export function initAuthObserver(redirectOnAuth = true, redirectOnUnauth = true) {
  // Check auth status on page load
  checkAuthStatus(redirectOnAuth, redirectOnUnauth);
  
  // Listen for storage events (for multi-tab sync)
  window.addEventListener('storage', (e) => {
    if (e.key === 'auth_update') {
      checkAuthStatus(redirectOnAuth, redirectOnUnauth);
    }
  });
}

async function checkAuthStatus(redirectOnAuth, redirectOnUnauth) {
  const page = window.location.pathname.split("/").pop() || "index.html";
  
  try {
    const user = await getCurrentUser();
    
    if (user) {
      updateNavbarUI(user);
      if (redirectOnAuth && AUTH_PAGES.includes(page)) {
        window.location.href = "dashboard.html";
      }
    } else {
      updateNavbarUI(null);
      if (redirectOnUnauth && PROTECTED_PAGES.includes(page)) {
        window.location.href = "login.html";
      }
    }
  } catch (error) {
    // Not authenticated
    updateNavbarUI(null);
    if (redirectOnUnauth && PROTECTED_PAGES.includes(page)) {
      window.location.href = "login.html";
    }
  }
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
    
    const displayName = user.fullName || user.name || user.username || "User";
    if (userName) userName.textContent = displayName;
    
    if (userAvatar) {
      userAvatar.src = user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
    }
  } else {
    if (loginBtn) loginBtn.style.display = "inline-flex";
    if (userProfile) userProfile.style.display = "none";
  }
}

// Initialize observer on DOM load for all pages
document.addEventListener("DOMContentLoaded", () => {
  if (!window.authObserverInitialized) {
    initAuthObserver(true, true);
    window.authObserverInitialized = true;
  }
  
  // Profile Dropdown logic
  const profileToggle = document.getElementById("premium-user-profile");
  if (profileToggle) {
    profileToggle.addEventListener('click', () => {
      window.location.href = "dashboard.html"; 
    });
  }
});

// Make logout globally available
window.logoutUser = logoutUser;