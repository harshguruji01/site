// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

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

export { app, analytics };
