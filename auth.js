/**
 * HarshGuruJi local auth — user data stored in users.json format (localStorage mirror).
 * Browser loads users.json on init; new signups append to localStorage copy.
 */
const USERS_STORAGE_KEY = 'harshguruji_users_data';
const USERS_FILE = 'users.json';

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function loadUsersFromFile() {
  try {
    const res = await fetch(USERS_FILE + '?v=' + Date.now());
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function loadUsersFromStorage() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function mergeUsers(fileUsers, storedUsers) {
  const map = new Map();
  fileUsers.forEach(u => { if (u && u.email) map.set(u.email.toLowerCase(), u); });
  storedUsers.forEach(u => { if (u && u.email) map.set(u.email.toLowerCase(), u); });
  return Array.from(map.values());
}

async function getUsers() {
  const fileUsers = await loadUsersFromFile();
  const storedUsers = loadUsersFromStorage();
  return mergeUsers(fileUsers, storedUsers);
}

async function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateMobile(mobile) {
  return /^[6-9]\d{9}$/.test(mobile.replace(/\s+/g, ''));
}

function showAuthMessage(el, text, type) {
  if (!el) return;
  el.style.color = type === 'error' ? '#ff3366' : '#10b981';
  el.textContent = text;
}

async function registerUser({ name, email, mobile, password }) {
  const emailKey = email.toLowerCase().trim();
  const users = await getUsers();

  if (users.some(u => u.email.toLowerCase() === emailKey)) {
    return { success: false, message: 'This email is already registered. Please log in.' };
  }
  if (users.some(u => u.mobile === mobile)) {
    return { success: false, message: 'This mobile number is already registered.' };
  }

  const user = {
    id: Date.now(),
    name: name.trim(),
    email: emailKey,
    mobile: mobile.trim(),
    passwordHash: await hashPassword(password),
    profilePicture: null,
    lastPasswordChange: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  users.push(user);
  await saveUsers(users);
  return { success: true, user: { id: user.id, name: user.name, email: user.email, mobile: user.mobile, profilePicture: user.profilePicture } };
}

async function loginUser({ email, password }) {
  const emailKey = email.toLowerCase().trim();
  const users = await getUsers();
  const user = users.find(u => u.email.toLowerCase() === emailKey);

  if (!user) {
    return { success: false, message: 'No account found with this email. Please sign up first.' };
  }

  const hash = await hashPassword(password);
  if (user.passwordHash !== hash) {
    return { success: false, message: 'Incorrect password. Please try again.', showForgotPassword: true };
  }

  return { success: true, user: { id: user.id, name: user.name, email: user.email, mobile: user.mobile, profilePicture: user.profilePicture, lastPasswordChange: user.lastPasswordChange } };
}

function setSession(user, remember) {
  localStorage.setItem('loggedIn', JSON.stringify({ id: user.id, name: user.name, email: user.email, mobile: user.mobile, profilePicture: user.profilePicture, lastPasswordChange: user.lastPasswordChange }));
  if (remember) {
    localStorage.setItem('rememberLogin', '1');
    localStorage.setItem('rememberEmail', user.email);
  } else {
    localStorage.removeItem('rememberLogin');
    localStorage.removeItem('rememberEmail');
  }
}

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP to email (simulated - requires backend for actual email sending)
async function sendOTP(email) {
  const otp = generateOTP();
  const otpData = {
    email: email.toLowerCase(),
    otp: otp,
    timestamp: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
  };
  
  localStorage.setItem('reset_otp', JSON.stringify(otpData));
  
  // In a real implementation, you would send this OTP via email using a backend service
  // For demo purposes, we'll show it in an alert
  alert(`DEMO: Your OTP is ${otp}. In production, this would be sent to your email.`);
  
  return { success: true, message: 'OTP sent to your email.' };
}

// Verify OTP
function verifyOTP(email, otp) {
  const stored = JSON.parse(localStorage.getItem('reset_otp') || '{}');
  if (!stored || stored.email !== email.toLowerCase()) {
    return { success: false, message: 'Invalid OTP request.' };
  }
  
  if (Date.now() > stored.expiresAt) {
    localStorage.removeItem('reset_otp');
    return { success: false, message: 'OTP has expired. Please request a new one.' };
  }
  
  if (stored.otp !== otp) {
    return { success: false, message: 'Incorrect OTP. Please try again.' };
  }
  
  return { success: true };
}

// Reset password
async function resetPassword(email, newPassword) {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (userIndex === -1) {
    return { success: false, message: 'User not found.' };
  }
  
  users[userIndex].passwordHash = await hashPassword(newPassword);
  users[userIndex].lastPasswordChange = new Date().toISOString();
  await saveUsers(users);
  
  // Clear OTP after successful reset
  localStorage.removeItem('reset_otp');
  
  return { success: true };
}

function initJoinUsPage() {
  const page = document.getElementById('join-us-page');
  if (!page) return;

  const tabSignup = document.getElementById('auth-tab-signup');
  const tabLogin = document.getElementById('auth-tab-login');
  const panelSignup = document.getElementById('auth-panel-signup');
  const panelLogin = document.getElementById('auth-panel-login');
  const panelForgot = document.getElementById('auth-panel-forgot');
  const panelOtp = document.getElementById('auth-panel-otp');
  const panelReset = document.getElementById('auth-panel-reset');
  const signupMsg = document.getElementById('signup-msg');
  const loginMsg = document.getElementById('login-msg');
  const forgotMsg = document.getElementById('forgot-msg');
  const otpMsg = document.getElementById('otp-msg');
  const resetMsg = document.getElementById('reset-msg');

  function switchTab(tab) {
    // Hide all panels
    panelSignup.classList.remove('active');
    panelSignup.hidden = true;
    panelLogin.classList.remove('active');
    panelLogin.hidden = true;
    panelForgot.classList.remove('active');
    panelForgot.hidden = true;
    panelOtp.classList.remove('active');
    panelOtp.hidden = true;
    panelReset.classList.remove('active');
    panelReset.hidden = true;
    
    // Reset tabs
    tabSignup.classList.remove('active');
    tabLogin.classList.remove('active');
    
    // Show selected panel
    if (tab === 'signup') {
      tabSignup.classList.add('active');
      panelSignup.classList.add('active');
      panelSignup.hidden = false;
      if (history.replaceState) history.replaceState(null, '', '#signup');
    } else if (tab === 'login') {
      tabLogin.classList.add('active');
      panelLogin.classList.add('active');
      panelLogin.hidden = false;
      if (history.replaceState) history.replaceState(null, '', '#login');
    } else if (tab === 'forgot') {
      panelForgot.classList.add('active');
      panelForgot.hidden = false;
    } else if (tab === 'otp') {
      panelOtp.classList.add('active');
      panelOtp.hidden = false;
    } else if (tab === 'reset') {
      panelReset.classList.add('active');
      panelReset.hidden = false;
    }
  }

  tabSignup.addEventListener('click', () => switchTab('signup'));
  tabLogin.addEventListener('click', () => switchTab('login'));

  const hash = window.location.hash.replace('#', '');
  switchTab(hash === 'login' ? 'login' : 'signup');

  // Forgot password link
  document.getElementById('forgot-password-link').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('forgot-email').value = document.getElementById('login-email').value;
    switchTab('forgot');
  });

  // Back to login link
  document.getElementById('back-to-login').addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('login');
  });

  // Resend OTP link
  document.getElementById('resend-otp').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;
    if (email) {
      const result = await sendOTP(email);
      showAuthMessage(otpMsg, result.message, result.success ? 'success' : 'error');
    }
  });

  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const mobile = document.getElementById('signup-mobile').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;

    if (!name || !email || !mobile || !password || !confirm) {
      showAuthMessage(signupMsg, 'Please fill all required fields.', 'error');
      return;
    }
    if (!validateEmail(email)) {
      showAuthMessage(signupMsg, 'Please enter a valid email address.', 'error');
      return;
    }
    if (!validateMobile(mobile)) {
      showAuthMessage(signupMsg, 'Enter a valid 10-digit Indian mobile number.', 'error');
      return;
    }
    if (password.length < 6) {
      showAuthMessage(signupMsg, 'Password must be at least 6 characters.', 'error');
      return;
    }
    if (password !== confirm) {
      showAuthMessage(signupMsg, 'Passwords do not match.', 'error');
      return;
    }

    const result = await registerUser({ name, email, mobile, password });
    if (result.success) {
      showAuthMessage(signupMsg, 'Account created! Redirecting to login…', 'success');
      setTimeout(() => {
        switchTab('login');
        document.getElementById('login-email').value = email;
        showAuthMessage(loginMsg, 'Sign up successful. Please log in.', 'success');
      }, 1200);
    } else {
      showAuthMessage(signupMsg, result.message, 'error');
    }
  });

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const remember = document.getElementById('login-remember').checked;

    if (!email || !password) {
      showAuthMessage(loginMsg, 'Email and password are required.', 'error');
      return;
    }
    if (!validateEmail(email)) {
      showAuthMessage(loginMsg, 'Please enter a valid email address.', 'error');
      return;
    }

    const result = await loginUser({ email, password });
    if (result.success) {
      setSession(result.user, remember);
      showAuthMessage(loginMsg, 'Login successful! Redirecting…', 'success');
      setTimeout(() => { window.location.href = 'index.html'; }, 900);
    } else {
      showAuthMessage(loginMsg, result.message, 'error');
      if (result.showForgotPassword) {
        // Show forgot password option after wrong password
        setTimeout(() => {
          const forgotLink = document.getElementById('forgot-password-link');
          forgotLink.style.display = 'block';
        }, 500);
      }
    }
  });

  // Forgot password form
  document.getElementById('forgot-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    
    if (!email || !validateEmail(email)) {
      showAuthMessage(forgotMsg, 'Please enter a valid email address.', 'error');
      return;
    }
    
    // Check if user exists
    const users = await getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      showAuthMessage(forgotMsg, 'No account found with this email.', 'error');
      return;
    }
    
    const result = await sendOTP(email);
    if (result.success) {
      showAuthMessage(forgotMsg, result.message, 'success');
      setTimeout(() => {
        switchTab('otp');
      }, 1000);
    } else {
      showAuthMessage(forgotMsg, result.message, 'error');
    }
  });

  // OTP verification form
  document.getElementById('otp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    const otp = document.getElementById('otp-input').value.trim();
    
    if (!otp || otp.length !== 6) {
      showAuthMessage(otpMsg, 'Please enter a valid 6-digit OTP.', 'error');
      return;
    }
    
    const result = verifyOTP(email, otp);
    if (result.success) {
      showAuthMessage(otpMsg, 'OTP verified successfully!', 'success');
      setTimeout(() => {
        switchTab('reset');
      }, 1000);
    } else {
      showAuthMessage(otpMsg, result.message, 'error');
    }
  });

  // Reset password form
  document.getElementById('reset-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    const newPassword = document.getElementById('reset-password').value;
    const confirmPassword = document.getElementById('reset-confirm').value;
    
    if (!newPassword || newPassword.length < 6) {
      showAuthMessage(resetMsg, 'Password must be at least 6 characters.', 'error');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showAuthMessage(resetMsg, 'Passwords do not match.', 'error');
      return;
    }
    
    const result = await resetPassword(email, newPassword);
    if (result.success) {
      showAuthMessage(resetMsg, 'Password reset successfully! Redirecting to login…', 'success');
      setTimeout(() => {
        switchTab('login');
        document.getElementById('login-email').value = email;
        showAuthMessage(loginMsg, 'Password reset successful. Please log in with your new password.', 'success');
      }, 1500);
    } else {
      showAuthMessage(resetMsg, result.message, 'error');
    }
  });

  const remembered = localStorage.getItem('rememberEmail');
  if (remembered) {
    document.getElementById('login-email').value = remembered;
    document.getElementById('login-remember').checked = true;
  }
}

// Check if user is already logged in (auto-login)
function checkAutoLogin() {
  const loggedIn = localStorage.getItem('loggedIn');
  if (loggedIn) {
    const user = JSON.parse(loggedIn);
    updateNavbarForLoggedInUser(user);
  }
}

// Update navbar to show profile instead of Join Us
function updateNavbarForLoggedInUser(user) {
  const navCta = document.getElementById('nav-cta');
  if (navCta) {
    navCta.innerHTML = `<span style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;" onclick="openProfileModal()">
      ${user.profilePicture ? `<img src="${user.profilePicture}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">` : `<span style="width:32px;height:32px;background:linear-gradient(135deg,#ff3366,#7c3aed);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.9rem;">${user.name.charAt(0).toUpperCase()}</span>`}
      <span>${user.name.split(' ')[0]}</span>
    </span>`;
    navCta.classList.remove('btn-nav');
    navCta.style.padding = '0.5rem 1rem';
    navCta.style.background = 'rgba(255,255,255,0.05)';
    navCta.style.border = '1px solid rgba(255,255,255,0.1)';
    navCta.style.borderRadius = '50px';
  }
}

// Logout function
function logoutUser() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('rememberLogin');
  localStorage.removeItem('rememberEmail');
  window.location.href = 'index.html';
}

// Open profile modal
function openProfileModal() {
  const user = JSON.parse(localStorage.getItem('loggedIn'));
  if (!user) return;

  const modal = document.createElement('div');
  modal.id = 'profile-modal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8); z-index: 10000;
    display: flex; align-items: center; justify-content: center;
  `;

  const lastProfileUpdate = user.lastProfileUpdate ? new Date(user.lastProfileUpdate) : null;
  let remainingDays = 0;
  let canUpdate = true;
  if (lastProfileUpdate) {
    const diffTime = new Date() - lastProfileUpdate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      canUpdate = false;
      remainingDays = 7 - diffDays;
    }
  }

  modal.innerHTML = `
    <div style="background: rgba(25,25,25,0.95); padding: 2.5rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); max-width: 450px; width: 90%; position: relative;">
      <button onclick="document.getElementById('profile-modal').remove()" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">✕</button>
      <h2 style="color: white; margin-bottom: 1.5rem; text-align: center;">My Profile</h2>
      
      <div style="text-align: center; margin-bottom: 2rem;">
        ${user.profilePicture ? `<img src="${user.profilePicture}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;margin-bottom:1rem;">` : `<div style="width:80px;height:80px;background:linear-gradient(135deg,#ff3366,#7c3aed);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:2rem;margin:0 auto 1rem;">${user.name.charAt(0).toUpperCase()}</div>`}
        <input type="file" id="profile-pic-input" accept="image/*" style="display: none;" onchange="handleProfilePictureChange(this)">
        ${canUpdate ? `<button onclick="document.getElementById('profile-pic-input').click()" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 0.5rem 1rem; border-radius: 50px; cursor: pointer; font-size: 0.9rem;">Change Picture</button>` : `<button disabled style="background: rgba(128,128,128,0.1); border: 1px solid rgba(255,255,255,0.05); color: #888; padding: 0.5rem 1rem; border-radius: 50px; cursor: not-allowed; font-size: 0.9rem;">Change Picture (Locked)</button>`}
      </div>

      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; color: #a1a1aa; margin-bottom: 0.5rem; font-size: 0.9rem;">Name</label>
        <input type="text" id="profile-name" value="${user.name}" ${canUpdate ? '' : 'disabled'} style="width: 100%; background: ${canUpdate ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)'}; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.8rem 1rem; color: ${canUpdate ? 'white' : '#888'}; outline: none;">
      </div>

      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; color: #a1a1aa; margin-bottom: 0.5rem; font-size: 0.9rem;">Email</label>
        <input type="email" value="${user.email}" disabled style="width: 100%; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 0.8rem 1rem; color: #a1a1aa; outline: none;">
      </div>

      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; color: #a1a1aa; margin-bottom: 0.5rem; font-size: 0.9rem;">Mobile</label>
        <input type="tel" value="${user.mobile}" disabled style="width: 100%; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 0.8rem 1rem; color: #a1a1aa; outline: none;">
      </div>

      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; color: #a1a1aa; margin-bottom: 0.5rem; font-size: 0.9rem;">Password</label>
        ${canUpdate ? `
          <input type="password" id="profile-new-password" placeholder="New password (min 6 characters)" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.8rem 1rem; color: white; outline: none; margin-bottom: 0.5rem;">
          <input type="password" id="profile-confirm-password" placeholder="Confirm new password" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.8rem 1rem; color: white; outline: none;">
        ` : `
          <p style="color: #ff3366; font-size: 0.85rem; font-weight: 500;">🔒 Profile updates locked. Try again in ${remainingDays} days.</p>
        `}
      </div>

      ${canUpdate ? `
        <button onclick="saveProfileChanges()" style="width: 100%; background: linear-gradient(45deg, #ff3366, #7c3aed); border: none; color: white; padding: 1rem; border-radius: 50px; font-weight: 600; cursor: pointer; margin-bottom: 1rem;">Save Changes</button>
      ` : `
        <button disabled style="width: 100%; background: #222; border: 1px solid #333; color: #555; padding: 1rem; border-radius: 50px; font-weight: 600; cursor: not-allowed; margin-bottom: 1rem;">Locked for ${remainingDays} days</button>
      `}
      <button onclick="logoutUser()" style="width: 100%; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 1rem; border-radius: 50px; font-weight: 600; cursor: pointer;">Logout</button>
    </div>
  `;

  document.body.appendChild(modal);
}

// Handle profile picture change
function handleProfilePictureChange(input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const user = JSON.parse(localStorage.getItem('loggedIn'));
      
      // double check cooldown
      const lastProfileUpdate = user.lastProfileUpdate ? new Date(user.lastProfileUpdate) : null;
      if (lastProfileUpdate) {
        const diffDays = Math.floor((new Date() - lastProfileUpdate) / (1000 * 60 * 60 * 24));
        if (diffDays < 7) {
          alert(`You can only update your profile details once every 7 days.`);
          return;
        }
      }

      user.profilePicture = e.target.result;
      user.lastProfileUpdate = new Date().toISOString();
      localStorage.setItem('loggedIn', JSON.stringify(user));
      updateNavbarForLoggedInUser(user);
      
      // Update user in storage
      updateUserData(user);
      
      // Refresh modal
      document.getElementById('profile-modal').remove();
      openProfileModal();
    };
    reader.readAsDataURL(file);
  }
}

// Update user data in storage
async function updateUserData(updatedUser) {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u.email.toLowerCase() === updatedUser.email.toLowerCase());
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedUser };
    await saveUsers(users);
  }
}

// Save profile changes
async function saveProfileChanges() {
  const user = JSON.parse(localStorage.getItem('loggedIn'));
  if (!user) return;

  const newName = document.getElementById('profile-name').value.trim();
  const newPassword = document.getElementById('profile-new-password')?.value;
  const confirmPassword = document.getElementById('profile-confirm-password')?.value;

  // double check cooldown
  const lastProfileUpdate = user.lastProfileUpdate ? new Date(user.lastProfileUpdate) : null;
  if (lastProfileUpdate) {
    const diffDays = Math.floor((new Date() - lastProfileUpdate) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      alert(`You can only update your profile details once every 7 days.`);
      return;
    }
  }

  if (!newName) {
    alert('Name cannot be empty');
    return;
  }

  let updated = false;
  if (newName !== user.name) {
    user.name = newName;
    updated = true;
  }

  if (newPassword) {
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    user.passwordHash = await hashPassword(newPassword);
    updated = true;
  }

  if (updated) {
    user.lastProfileUpdate = new Date().toISOString();
    localStorage.setItem('loggedIn', JSON.stringify(user));
    await updateUserData(user);
    updateNavbarForLoggedInUser(user);
    alert('Profile updated successfully!');
  }
  
  document.getElementById('profile-modal').remove();
}

// Show login/signup modal on page load
function showAuthModal() {
  // Check if user is already logged in
  const loggedIn = localStorage.getItem('loggedIn');
  if (loggedIn) return;

  // Check if user has chosen to skip this modal before
  const skipAuthModal = localStorage.getItem('skipAuthModal');
  if (skipAuthModal === 'true') return;

  const modal = document.createElement('div');
  modal.id = 'auth-welcome-modal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.85); z-index: 10000;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.3s ease;
  `;

  modal.innerHTML = `
    <style>
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    </style>
    <div style="background: rgba(25,25,25,0.98); padding: 3rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); max-width: 500px; width: 90%; text-align: center; position: relative; animation: slideUp 0.4s ease; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
      <button onclick="closeAuthModal()" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: var(--text-secondary); font-size: 1.5rem; cursor: pointer; transition: color 0.3s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='var(--text-secondary)'">✕</button>
      
      <div style="margin-bottom: 2rem;">
        <img src="logo.png" alt="HarshGuruJi" style="height: 70px; border-radius: 10px; margin-bottom: 1rem;" />
        <h2 style="color: white; margin-bottom: 0.5rem; font-family: 'Space Grotesk', sans-serif; font-size: 1.8rem;">Welcome to <span style="background: linear-gradient(135deg,#ff3366,#7c3aed); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">HarshGuruJi</span></h2>
        <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.6;">Join our community to unlock all features and get personalized experience.</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <a href="join-us.html#signup" style="background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary)); border: none; color: white; padding: 1rem 2rem; border-radius: 50px; font-weight: 600; font-size: 1rem; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; transition: transform 0.3s, box-shadow 0.3s; box-shadow: 0 4px 15px var(--glow-primary);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px var(--glow-primary)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px var(--glow-primary)'">
          <span>📝</span> Sign Up Free
        </a>
        
        <a href="join-us.html#login" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 1rem 2rem; border-radius: 50px; font-weight: 600; font-size: 1rem; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.borderColor='rgba(255,255,255,0.2)'">
          <span>🔐</span> Log In
        </a>
        
        <button onclick="continueWithoutLogin()" style="background: transparent; border: none; color: var(--text-secondary); padding: 0.8rem 2rem; border-radius: 50px; font-weight: 500; font-size: 0.95rem; cursor: pointer; transition: color 0.3s;" onmouseover="this.style.color='var(--text-primary)'" onmouseout="this.style.color='var(--text-secondary)'">
          Continue without login →
        </button>
      </div>

      <p style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 2rem; line-height: 1.5;">
        🔒 Your data is secure. All passwords are encrypted with SHA-256 hashing.
      </p>
    </div>
  `;

  document.body.appendChild(modal);
}

// Close auth modal
function closeAuthModal() {
  const modal = document.getElementById('auth-welcome-modal');
  if (modal) {
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 300);
  }
}

// Continue without login
function continueWithoutLogin() {
  localStorage.setItem('skipAuthModal', 'true');
  closeAuthModal();
}

function runAuthInit() {
  initJoinUsPage();
  checkAutoLogin();
  
  // Show auth modal only on index.html after a short delay
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
    setTimeout(() => {
      showAuthModal();
    }, 1500);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runAuthInit);
} else {
  runAuthInit();
}

