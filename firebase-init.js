// Initialize Firebase using the modular SDK (ES modules) from CDN
// This file is loaded via <script type="module" src="firebase-init.js"></script>
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.24.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "harsh-guru-ji-93963.firebaseapp.com",
  projectId: "harsh-guru-ji-93963",
  storageBucket: "harsh-guru-ji-93963.firebasestorage.app",
  messagingSenderId: "608363765469",
  appId: "1:608363765469:web:6eba382f98e13690358534"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Expose modular firebase objects for other scripts (non-module scripts can read window.firebaseModular)
window.firebaseModular = { app, auth };

console.log('Firebase modular initialized');
