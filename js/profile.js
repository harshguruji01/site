// js/profile.js
import { updateUserProfile } from './database.js';
import { uploadProfileImage, compressImage } from './storage.js';

let currentUserUid = null;

// Populate Form on Load
document.addEventListener('userDataLoaded', (e) => {
  const user = e.detail;
  currentUserUid = user.uid;

  document.getElementById('displayName').value = user.displayName || '';
  document.getElementById('username').value = user.username || '';
  document.getElementById('email').value = user.email || '';
  document.getElementById('phone').value = user.phone || '';
  document.getElementById('bio').value = user.bio || '';
  document.getElementById('gender').value = user.gender || '';
  document.getElementById('dob').value = user.dob || '';
  document.getElementById('country').value = user.country || '';
  document.getElementById('city').value = user.city || '';
  document.getElementById('language').value = user.language || 'English';
  document.getElementById('website').value = user.website || '';

  const avatarDisplay = document.getElementById('profile-avatar-display');
  if (user.photoURL) {
    avatarDisplay.style.backgroundImage = `url(${user.photoURL})`;
    avatarDisplay.textContent = '';
  } else {
    avatarDisplay.textContent = (user.displayName || user.email).charAt(0).toUpperCase();
  }
});

// Show Toast
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.background = isError ? 'var(--error-color)' : 'var(--success-color)';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Handle Form Submission
const profileForm = document.getElementById('profile-form');
if (profileForm) {
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUserUid) return;

    const saveBtn = document.getElementById('save-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;

    try {
      const dataToUpdate = {
        displayName: document.getElementById('displayName').value,
        username: document.getElementById('username').value,
        phone: document.getElementById('phone').value,
        bio: document.getElementById('bio').value,
        gender: document.getElementById('gender').value,
        dob: document.getElementById('dob').value,
        country: document.getElementById('country').value,
        city: document.getElementById('city').value,
        language: document.getElementById('language').value,
        website: document.getElementById('website').value,
      };

      await updateUserProfile(currentUserUid, dataToUpdate);
      showToast('Profile updated successfully!');
      
      // Update header avatar dropdown name
      const dropName = document.getElementById('dropdownName');
      if (dropName) dropName.textContent = dataToUpdate.displayName || dataToUpdate.username;

    } catch (error) {
      console.error(error);
      showToast('Failed to update profile.', true);
    } finally {
      saveBtn.textContent = originalText;
      saveBtn.disabled = false;
    }
  });
}

// Handle Avatar Upload
const avatarUpload = document.getElementById('avatar-upload');
if (avatarUpload) {
  avatarUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUserUid) return;

    // Show preview immediately
    const reader = new FileReader();
    const avatarDisplay = document.getElementById('profile-avatar-display');
    reader.onload = (e) => {
      avatarDisplay.style.backgroundImage = `url(${e.target.result})`;
      avatarDisplay.textContent = '';
    };
    reader.readAsDataURL(file);

    try {
      showToast('Uploading image...');
      // Compress image before upload
      const compressedFile = await compressImage(file, 400);
      
      // Upload to Storage
      const photoURL = await uploadProfileImage(currentUserUid, compressedFile, 'avatar');
      
      // Update Firestore profile
      await updateUserProfile(currentUserUid, { photoURL });
      
      // Update Header avatar
      const headerAvatar = document.getElementById('headerAvatar');
      if (headerAvatar) headerAvatar.style.backgroundImage = `url(${photoURL})`;
      
      showToast('Profile picture updated!');
    } catch (error) {
      console.error(error);
      showToast('Failed to upload image.', true);
    }
  });
}
