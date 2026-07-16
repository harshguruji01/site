// js/storage.js
import { storage } from './firebase.js';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

/**
 * Uploads a profile image for a user.
 * @param {string} uid - User ID
 * @param {File} file - The image file to upload
 * @param {string} type - 'avatar' or 'cover'
 * @returns {Promise<string>} - The download URL of the uploaded image
 */
export async function uploadProfileImage(uid, file, type = 'avatar') {
  if (!file) throw new Error("No file provided");
  
  // Create a reference to 'users/uid/avatar.jpg'
  const fileExt = file.name.split('.').pop();
  const storageRef = ref(storage, `users/${uid}/${type}_${Date.now()}.${fileExt}`);

  // Upload file
  const snapshot = await uploadBytes(storageRef, file);
  
  // Get download URL
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

/**
 * Basic image compression (client-side) using Canvas
 * @param {File} file 
 * @param {number} maxWidth 
 */
export async function compressImage(file, maxWidth = 800) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleSize = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          const newFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(newFile);
        }, 'image/jpeg', 0.8);
      };
      img.onerror = error => reject(error);
    };
    reader.onerror = error => reject(error);
  });
}
