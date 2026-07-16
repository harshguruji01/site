const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. Fluid Typography
css = css.replace(/font-size:\s*([0-9.]+)rem;/g, (match, p1) => {
    const val = parseFloat(p1);
    if (val > 2) {
        return `font-size: clamp(${val * 0.6}rem, ${val * 1.5}vw, ${val}rem);`;
    } else if (val > 1.2) {
        return `font-size: clamp(${val * 0.8}rem, ${val * 1.2}vw, ${val}rem);`;
    } else if (val >= 1) {
        return `font-size: clamp(${val * 0.9}rem, 1vw, ${val * 1.1}rem);`;
    }
    return match;
});

// 2. Fluid Grids
// Replace any explicit grid-template-columns: repeat(X, 1fr) with auto-fit
css = css.replace(/grid-template-columns:\s*repeat\(\s*\d+\s*,\s*1fr\s*\);/g, 
    'grid-template-columns: repeat(auto-fit, minmax(clamp(260px, 30vw, 320px), 1fr));');

// 3. Fluid Spacing (Padding/Margins on large sections)
css = css.replace(/padding:\s*([0-9.]+)rem\s+([0-9.]+)%;/g, (match, p1, p2) => {
    return `padding: clamp(${parseFloat(p1) * 0.5}rem, ${parseFloat(p1)}vh, ${p1}rem) ${p2}%;`;
});
css = css.replace(/padding:\s*10rem\s+5%\s+4rem;/g, 'padding: clamp(6rem, 15vh, 10rem) 5% clamp(2rem, 5vh, 4rem);');

// 4. Removing hardcoded widths and heights (where appropriate, like 500px, 400px, 300px etc.)
// Specially targeting the .orb-container, .orb-main, .glow-1, .glow-2 etc.
css = css.replace(/width:\s*([3-9]\d{2})px;/g, 'width: 100%; max-width: $1px; aspect-ratio: 1 / 1;');
css = css.replace(/height:\s*([3-9]\d{2})px;/g, ''); // Let aspect-ratio handle height

// Replace orbit sizes to be fluid as well
css = css.replace(/width:\s*([1-9]\d{2})px;\s*height:\s*([1-9]\d{2})px;/g, (match, p1, p2) => {
    if (p1 === p2) {
        return `width: clamp(${parseFloat(p1) * 0.4}px, ${parseFloat(p1) / 10}vw, ${p1}px); aspect-ratio: 1 / 1;`;
    }
    return match;
});

// 5. Enhance images
if (!css.includes('img { max-width: 100%;')) {
    css += '\n\n/* Fluid Images Default */\nimg { max-width: 100%; height: auto; object-fit: cover; }\n';
}

// 6. Auth Card Width
css = css.replace(/width:\s*100%;\s*max-width:\s*450px;/g, 'width: 100%; max-width: min(90vw, 450px);');
css = css.replace(/max-width:\s*480px;/g, 'max-width: min(95vw, 480px);');

fs.writeFileSync('style.css', css);
console.log('style.css refactored for fluidity successfully.');
