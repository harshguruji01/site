// js/database.js
import { db } from './firebase.js';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * Ensures a user document exists in Firestore. 
 * Creates a new one if it doesn't exist (e.g., first time Google Login).
 * @param {Object} user - The Firebase Auth user object
 */
export async function ensureUserDocument(user) {
  if (!user) return null;

  const userRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    // New user, create initial profile
    const newUserProfile = {
      uid: user.uid,
      displayName: user.displayName || '',
      username: user.email.split('@')[0] + Math.floor(Math.random() * 1000), // Default username
      email: user.email,
      phone: user.phoneNumber || '',
      photoURL: user.photoURL || '',
      bio: '',
      gender: '',
      dob: '',
      country: '',
      state: '',
      city: '',
      language: 'English',
      occupation: '',
      education: '',
      website: '',
      socialLinks: {
        twitter: '',
        linkedin: '',
        github: '',
        instagram: ''
      },
      theme: 'auto',
      notifications: {
        email: true,
        push: true,
        newsletter: true
      },
      lastLogin: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      premium: false,
      role: 'user',
      status: 'active',
      verified: user.emailVerified,
      loginCount: 1,
      coins: 0,
      points: 0,
      badges: [],
      followers: 0,
      following: 0,
      bookmarks: [],
      favorites: [],
      history: [],
      preferences: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
      }
    };
    await setDoc(userRef, newUserProfile);
    return newUserProfile;
  } else {
    // Existing user, update last login and login count
    const data = docSnap.data();
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
      loginCount: (data.loginCount || 0) + 1,
      verified: user.emailVerified
    });
    return { ...data, lastLogin: new Date() };
  }
}

/**
 * Retrieves the full user profile from Firestore.
 * @param {string} uid - User ID
 */
export async function getUserProfile(uid) {
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

/**
 * Updates specific fields in the user profile.
 * @param {string} uid - User ID
 * @param {Object} dataToUpdate - Object containing fields to update
 */
export async function updateUserProfile(uid, dataToUpdate) {
  const userRef = doc(db, 'users', uid);
  dataToUpdate.updatedAt = serverTimestamp();
  await updateDoc(userRef, dataToUpdate);
}
