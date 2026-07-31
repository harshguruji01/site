import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "harsh-guru-ji-93963.firebaseapp.com",
  projectId: "harsh-guru-ji-93963",
  storageBucket: "harsh-guru-ji-93963.firebasestorage.app",
  messagingSenderId: "608363765469",
  appId: "1:608363765469:web:6eba382f98e13690358534"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Expose to window for global access
window.firebaseModular = {
  app,
  auth,
  db,
  storage,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  ref,
  uploadBytes,
  getDownloadURL
};

console.log("Firebase initialized successfully with Auth, Firestore, and Storage.");