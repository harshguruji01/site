// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-check.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

// Firebase App Check — debug token for local/dev environment
// In production, replace with your reCAPTCHA v3 site key
self.FIREBASE_APPCHECK_DEBUG_TOKEN = "AVweKohTUQ1r1swXYMoNhll-wrj25XchcsuCt2CZsJGPYSgBtKh7lHM-BA7UL9JYiNlh81CZ4imCdXGooc72kEylXopVVi0zYDiz-MMpsu9aczqB6KcAunOnUn_d7xN-CNO0trjFAiAy2E_vHdNpALwejA";

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"), // Replace with your actual reCAPTCHA v3 site key
  isTokenAutoRefreshEnabled: true
});

export { app, analytics, appCheck };
