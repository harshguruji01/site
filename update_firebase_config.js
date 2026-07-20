const fs = require('fs');
const path = require('path');

const newConfigStr = 'apiKey:"AIzaSyAkexVNkKqPgMy1x1ZBEsHW1pmgT-ygSKo",authDomain:"harshguruji.firebaseapp.com",projectId:"harshguruji",storageBucket:"harshguruji.firebasestorage.app",messagingSenderId:"956867958181",appId:"1:956867958181:web:8caab80f2e3bddc339044c",measurementId:"G-989PHMC4QE"';

function replaceConfig(filePath, oldRegex, prefix) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(oldRegex, prefix + '{' + newConfigStr + '}');
  fs.writeFileSync(filePath, content);
  console.log('Updated', filePath);
}

// js/firebase.js
replaceConfig(
  path.join(__dirname, 'js/firebase.js'),
  /const firebaseConfig=\{[^\}]+\}/,
  'const firebaseConfig='
);

// firebase-init.js
replaceConfig(
  path.join(__dirname, 'firebase-init.js'),
  /const firebaseConfig=\{[^\}]+\}/,
  'const firebaseConfig='
);

// script.js
replaceConfig(
  path.join(__dirname, 'script.js'),
  /H=\{apiKey:"YOUR_FIREBASE_API_KEY"[^\}]+\}/,
  'H='
);
