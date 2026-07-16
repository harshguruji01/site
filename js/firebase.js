// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqlPNMNAGwU7-Ip8rr-W8SJqRiqiCoMoc",
  authDomain: "hgjsite-dea61.firebaseapp.com",
  projectId: "hgjsite-dea61",
  storageBucket: "hgjsite-dea61.firebasestorage.app",
  messagingSenderId: "474003019776",
  appId: "1:474003019776:web:a88684049d17b273e5e0e5",
  measurementId: "G-DHW0NSWF76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Authentication Providers
export const googleProvider = new GoogleAuthProvider();

export default app;
