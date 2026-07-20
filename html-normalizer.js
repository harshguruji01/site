const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const html = fs.readFileSync(filePath, 'utf8');
  
  // Use Cheerio to parse and modify HTML
  const $ = cheerio.load(html, { recognizeSelfClosing: true });
  
  let modified = false;

  // Add lazy loading to images that don't have loading attributes and aren't critical
  $('img:not([loading]):not([fetchpriority="high"])').each((i, el) => {
    $(el).attr('loading', 'lazy');
    modified = true;
  });

  // Ensure all buttons have aria-label if they don't have text
  $('button:not([aria-label])').each((i, el) => {
    const text = $(el).text().trim();
    if (!text) {
      $(el).attr('aria-label', 'Button');
      modified = true;
    }
  });

  // Ensure links opening in new tabs have rel="noopener noreferrer"
  $('a[target="_blank"]:not([rel="noopener noreferrer"])').each((i, el) => {
    $(el).attr('rel', 'noopener noreferrer');
    modified = true;
  });

  // Find completely empty divs (no text, no children, no specific classes that might be used for layout)
  // Be careful not to remove JS targets like `#auth-loading`
  $('div:empty:not([id])').each((i, el) => {
    const classes = $(el).attr('class') || '';
    if (!classes.includes('ambient-orb') && !classes.includes('orb-') && !classes.includes('glow-')) {
      $(el).remove();
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, $.html(), 'utf8');
    console.log(`Normalized ${file}`);
  }
});
