const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const workspace = 'c:\\Users\\harsh\\OneDrive\\Desktop\\site';
const targetFile = path.join(workspace, 'oauth', 'consent', 'index.html');

// Read index.html for nav and footer
const indexContent = fs.readFileSync(path.join(workspace, 'index.html'), 'utf8');
const $index = cheerio.load(indexContent);
    
let premiumNavbar = $index('nav.premium-navbar').parent().html() ? $index('nav.premium-navbar').prop('outerHTML') : '';
let mobileNav = $index('div.premium-mobile-nav').prop('outerHTML');
let footer = $index('footer.footer').prop('outerHTML');

// Update absolute/relative paths in the nav and footer to point to root using ../../
const fixPaths = (html) => {
    return html
        .replace(/href="([^"h]+)"/g, (match, p1) => {
            if (p1.startsWith('#')) return match;
            if (p1.startsWith('http')) return match;
            return `href="../../${p1}"`;
        })
        .replace(/src="([^"h]+)"/g, (match, p1) => {
            if (p1.startsWith('http')) return match;
            return `src="../../${p1}"`;
        });
};

premiumNavbar = fixPaths(premiumNavbar);
mobileNav = fixPaths(mobileNav);
footer = fixPaths(footer);

const content = fs.readFileSync(targetFile, 'utf8');
const $ = cheerio.load(content);

// Insert Nav
$('body').prepend(premiumNavbar);
$('nav.premium-navbar').after(mobileNav);

// Insert Footer
$('body').append(footer);

fs.writeFileSync(targetFile, $.html(), 'utf8');
console.log(`Successfully injected global UI into oauth/consent/index.html`);
