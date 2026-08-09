const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const workspace = 'c:\\Users\\harsh\\OneDrive\\Desktop\\site';

async function run() {
    const files = fs.readdirSync(workspace).filter(f => f.endsWith('.html'));

    // Read index.html
    const indexContent = fs.readFileSync(path.join(workspace, 'index.html'), 'utf8');
    const $index = cheerio.load(indexContent);
    
    const premiumNavbar = $index('nav.premium-navbar').parent().html() ? $index('nav.premium-navbar').prop('outerHTML') : '';
    const mobileNav = $index('div.premium-mobile-nav').prop('outerHTML');
    const footer = $index('footer.footer').prop('outerHTML');

    if (!premiumNavbar || !mobileNav || !footer) {
        console.error("Could not extract nav or footer from index.html");
        process.exit(1);
    }

    for (const file of files) {
        if (file === 'index.html') continue;
        
        const filePath = path.join(workspace, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio.load(content);
        
        let changed = false;

        // 1. Remove light theme media query preference for pure dark mode
        // For inline styles or script logic (mostly handled in CSS, but just to be sure we remove the light class if any)
        if ($('body').hasClass('light-theme')) {
            $('body').removeClass('light-theme');
            changed = true;
        }

        // 2. Replace Nav
        if ($('nav').length) {
            $('nav').first().replaceWith(premiumNavbar);
            changed = true;
        } else {
            $('body').prepend(premiumNavbar);
            changed = true;
        }

        // 3. Replace Mobile Nav
        if ($('div[class*="mobile-nav"]').length) {
            $('div[class*="mobile-nav"]').first().replaceWith(mobileNav);
            changed = true;
        } else {
            $('nav.premium-navbar').after(mobileNav);
            changed = true;
        }

        // 4. Replace Footer
        if ($('footer').length) {
            $('footer').last().replaceWith(footer);
            changed = true;
        } else {
            $('body').append(footer);
            changed = true;
        }

        // 5. CSS and JS dependencies
        if (!$('link[href="navbar-premium.css"]').length) {
            $('head').append('\n  <link rel="stylesheet" href="navbar-premium.css">');
            changed = true;
        }
        
        if (!$('script[src="navbar-premium.js"]').length) {
            $('body').append('\n  <script src="navbar-premium.js" defer></script>');
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(filePath, $.html(), 'utf8');
            console.log(`Updated ${file}`);
        }
    }
    console.log("All pages successfully updated to global layout.");
}

run();
