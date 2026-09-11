import { db, auth } from './firebase.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { updateProfile as updateAuthProfile } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

/**
 * Fetch user profile from Firestore 'users' collection
 */
export async function getProfile(userId) {
  if (!userId) return null;
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching profile from Firestore:", error);
    return null;
  }
}

/**
 * Create or update user profile document in Firestore 'users' collection
 */
export async function updateProfile(userId, profileData) {
  if (!userId) throw new Error("userId is required to update profile");
  try {
    const docRef = doc(db, 'users', userId);
    const dataToSave = {
      ...profileData,
      id: userId,
      updated_at: new Date().toISOString()
    };
    await setDoc(docRef, dataToSave, { merge: true });

    // Update Firebase Auth user profile if displayName or avatar_url changed
    if (auth.currentUser && auth.currentUser.uid === userId) {
      const updates = {};
      if (profileData.display_name) updates.displayName = profileData.display_name;
      if (profileData.avatar_url) updates.photoURL = profileData.avatar_url;
      if (Object.keys(updates).length > 0) {
        await updateAuthProfile(auth.currentUser, updates);
      }
    }

    return dataToSave;
  } catch (error) {
    console.error("Error updating profile in Firestore:", error);
    throw error;
  }
}

/**
 * Upload avatar (stores base64 or custom URL in profile)
 */
export async function uploadAvatar(userId, file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const avatarUrl = reader.result;
      try {
        await updateProfile(userId, { avatar_url: avatarUrl });
        resolve(avatarUrl);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Remove avatar URL from user profile
 */
export async function deleteAvatar(userId) {
  await updateProfile(userId, { avatar_url: null });
  if (auth.currentUser && auth.currentUser.uid === userId) {
    await updateAuthProfile(auth.currentUser, { photoURL: "" });
  }
}
