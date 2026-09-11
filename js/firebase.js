// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-check.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDO_VMTBX1yggvaNj4c2gOZYFasxno2TOY",
  authDomain: "site-a87b0.firebaseapp.com",
  projectId: "site-a87b0",
  storageBucket: "site-a87b0.firebasestorage.app",
  messagingSenderId: "546060150405",
  appId: "1:546060150405:web:61e76590238699cc09abec",
  measurementId: "G-SH2ZDP9CHQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

// Initialize Cloud Firestore
const db = getFirestore(app);

// Initialize Analytics (optional / safe)
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (err) {
  console.warn("Analytics initialization skipped or failed:", err);
}

// Firebase App Check (safely initialized)
let appCheck = null;
try {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = "AVweKohTUQ1r1swXYMoNhll-wrj25XchcsuCt2CZsJGPYSgBtKh7lHM-BA7UL9JYiNlh81CZ4imCdXGooc72kEylXopVVi0zYDiz-MMpsu9aczqB6KcAunOnUn_d7xN-CNO0trjFAiAy2E_vHdNpALwejA";
  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider("6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"),
    isTokenAutoRefreshEnabled: true
  });
} catch (err) {
  console.warn("App Check initialization skipped or failed:", err);
}

export { app, auth, db, googleProvider, analytics, appCheck };
