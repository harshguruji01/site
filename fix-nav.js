const fs = require('fs');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const indexLines = indexHtml.split('\n');

const startIndex = indexLines.findIndex(line => line.includes('<!-- ═══════════════════ NAVBAR ═══════════════════ -->'));
const endIndex = indexLines.findIndex(line => line.includes('<!-- ═══════════════════ HERO ═══════════════════ -->'));

const fullNavbarLines = indexLines.slice(startIndex, endIndex);
const fullNavbarStr = fullNavbarLines.join('\n');

function updateFile(filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const lines = content.split('\n');
  const startAuth = lines.findIndex(line => line.includes('<!-- ═══════════════════ NAVBAR ═══════════════════ -->'));
  
  let endMobileMenu = -1;
  for(let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<main class="auth-container">')) {
      endMobileMenu = i - 1;
      break;
    }
  }

  if (startAuth !== -1 && endMobileMenu !== -1) {
    const before = lines.slice(0, startAuth).join('\n');
    const after = lines.slice(endMobileMenu + 1).join('\n');
    const newContent = before + '\n' + fullNavbarStr + '\n' + after;
    fs.writeFileSync(filename, newContent);
    console.log('Fixed', filename);
  } else {
    console.log('Could not find boundaries in', filename);
  }
}

updateFile('login.html');
updateFile('signup.html');
