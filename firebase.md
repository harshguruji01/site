ye firebase ke side se hai
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkexVNkKqPgMy1x1ZBEsHW1pmgT-ygSKo",
  authDomain: "harshguruji.firebaseapp.com",
  projectId: "harshguruji",
  storageBucket: "harshguruji.firebasestorage.app",
  messagingSenderId: "956867958181",
  appId: "1:956867958181:web:8caab80f2e3bddc339044c",
  measurementId: "G-989PHMC4QE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);