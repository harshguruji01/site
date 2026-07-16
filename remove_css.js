const fs = require('fs');

// Remove CSS
const cssLines = fs.readFileSync('style.css', 'utf8').split('\n');
// We want to remove from /* ═══════════════════ PREMIUM NAVIGATION ═══════════════════ */
// until just before @media (prefers-reduced-motion: reduce)
let cssStart = cssLines.findIndex(l => l.includes('/* ═══════════════════ PREMIUM NAVIGATION ═══════════════════ */'));
let cssEnd = cssLines.findIndex(l => l.includes('@media (prefers-reduced-motion: reduce)'));
if (cssStart !== -1 && cssEnd !== -1) {
    cssLines.splice(cssStart, cssEnd - cssStart);
    fs.writeFileSync('style.css', cssLines.join('\n'));
    console.log('Removed navbar CSS');
}

// Remove JS
const jsLines = fs.readFileSync('script.js', 'utf8').split('\n');
let jsStart = jsLines.findIndex(l => l.includes('// ═══════════════════ PREMIUM NAVIGATION LOGIC ═══════════════════'));
let jsEnd = jsLines.findIndex((l, idx) => idx > jsStart && l.includes('// Number Counter Animation'));
if (jsStart !== -1 && jsEnd !== -1) {
    jsLines.splice(jsStart, jsEnd - jsStart);
    fs.writeFileSync('script.js', jsLines.join('\n'));
    console.log('Removed navbar JS');
}
