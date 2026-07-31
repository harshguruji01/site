import { db } from "./firebase.js";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export async function ensureUserDocument(user) {
  if (!user) return null;
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data();
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
      loginCount: (data.loginCount || 0) + 1,
      verified: user.emailVerified
    });
    return { ...data, lastLogin: new Date() };
  } else {
    // Extensive User Profile Structure as per 1.md App architecture
    const newUserData = {
      uid: user.uid,
      displayName: user.displayName || "",
      username: user.email ? user.email.split("@")[0] + Math.floor(1000 * Math.random()) : "user" + Math.floor(1000 * Math.random()),
      email: user.email || "",
      phone: user.phoneNumber || "",
      photoURL: user.photoURL || "",
      bio: "",
      gender: "",
      dob: "",
      country: "",
      state: "",
      city: "",
      language: "English",
      occupation: "",
      education: "",
      website: "",
      socialLinks: { twitter: "", linkedin: "", github: "", instagram: "" },
      theme: "auto",
      notifications: { email: true, push: true, newsletter: true },
      lastLogin: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      premium: false,
      role: "user",
      status: "active",
      verified: user.emailVerified || false,
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
        currency: "USD",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12h"
      }
    };
    await setDoc(userRef, newUserData);
    return newUserData;
  }
}

export async function getUserProfile(uid) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(uid, data) {
  const userRef = doc(db, "users", uid);
  data.updatedAt = serverTimestamp();
  await updateDoc(userRef, data);
}