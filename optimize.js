const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const CleanCSS = require('clean-css');
const Terser = require('terser');
const minifyHtml = require('html-minifier').minify;
const cheerio = require('cheerio');

const dir = __dirname;

// Helper: Traverse directory recursively
function getFiles(dirPath, ext, filesList = []) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === '.gemini') continue;
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, ext, filesList);
    } else if (fullPath.endsWith(ext)) {
      filesList.push(fullPath);
    }
  }
  return filesList;
}

// 1. Optimize Images (Convert PNG/JPG to WebP)
async function optimizeImages() {
  const images = [...getFiles(dir, '.png'), ...getFiles(dir, '.jpg'), ...getFiles(dir, '.jpeg')];
  console.log(`Found ${images.length} images to optimize.`);
  
  for (const imgPath of images) {
    const ext = path.extname(imgPath);
    const webpPath = imgPath.replace(ext, '.webp');
    if (!fs.existsSync(webpPath)) {
      try {
        await sharp(imgPath).webp({ quality: 80 }).toFile(webpPath);
        console.log(`Optimized: ${path.basename(imgPath)} -> .webp`);
      } catch (err) {
        console.error(`Failed to optimize ${imgPath}:`, err);
      }
    }
  }
}

// 2. Minify CSS
function optimizeCSS() {
  const cssFiles = getFiles(dir, '.css');
  for (const file of cssFiles) {
    if (file.includes('.min.css')) continue;
    const content = fs.readFileSync(file, 'utf8');
    const output = new CleanCSS({ level: 2 }).minify(content);
    if (output.errors.length === 0) {
      fs.writeFileSync(file, output.styles);
      console.log(`Minified CSS: ${path.basename(file)}`);
    }
  }
}

// 3. Minify JS
async function optimizeJS() {
  const jsFiles = getFiles(dir, '.js');
  for (const file of jsFiles) {
    if (file.includes('.min.js') || file.includes('optimize.js') || file.includes('node_modules')) continue;
    const content = fs.readFileSync(file, 'utf8');
    try {
      const minified = await Terser.minify(content, { compress: { drop_console: true }, mangle: true });
      if (minified.code) {
        fs.writeFileSync(file, minified.code);
        console.log(`Minified JS: ${path.basename(file)}`);
      }
    } catch (err) {
      console.error(`Skipped JS minification for ${path.basename(file)} due to error.`);
    }
  }
}

// 4. Optimize HTML (Web Vitals, Lazy Loading, Preloads, Minification)
function optimizeHTML() {
  const htmlFiles = getFiles(dir, '.html');
  for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(content);
    
    // Defer scripts
    $('script').each((i, el) => {
      const src = $(el).attr('src');
      if (src && !$(el).attr('defer') && !$(el).attr('async') && !src.includes('firebase')) {
        $(el).attr('defer', 'true');
      }
    });

    // Optimize images for CLS, LCP, and WebP
    $('img').each((i, el) => {
      let src = $(el).attr('src');
      if (!src) return;

      // Wrap in <picture> for WebP fallback if it's a PNG/JPG
      if (src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.jpeg')) {
        const webpSrc = src.replace(/\.(png|jpg|jpeg)$/, '.webp');
        if (!$(el).parent().is('picture')) {
          $(el).wrap('<picture></picture>');
          $(el).before(`<source srcset="${webpSrc}" type="image/webp">`);
        }
      }

      // Add width/height to prevent CLS if not present (mocking a generic aspect ratio if unknown)
      if (!$(el).attr('width') && !$(el).attr('style')?.includes('width')) {
        $(el).attr('width', '800');
        $(el).attr('height', '600');
      }

      // First image is usually LCP, rest are lazy
      if (i === 0) {
        $(el).attr('fetchpriority', 'high');
        $(el).removeAttr('loading');
      } else {
        $(el).attr('loading', 'lazy');
        $(el).attr('decoding', 'async');
      }
    });

    // Preconnects
    if (!$('link[href="https://fonts.googleapis.com"]').length) {
      $('head').prepend('<link rel="preconnect" href="https://fonts.googleapis.com">');
    }
    
    // Ensure charset and viewport
    if (!$('meta[charset]').length) $('head').prepend('<meta charset="UTF-8">');

    // Security Headers (meta fallback)
    if (!$('meta[http-equiv="X-XSS-Protection"]').length) {
      $('head').append('<meta http-equiv="X-XSS-Protection" content="1; mode=block">');
    }

    content = $.html();
    
    // Minify HTML
    try {
      const minified = minifyHtml(content, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
      });
      fs.writeFileSync(file, minified);
      console.log(`Optimized & Minified HTML: ${path.basename(file)}`);
    } catch (err) {
      // If minification fails, write unminified but optimized DOM back
      fs.writeFileSync(file, content);
      console.log(`Optimized DOM (Minify Failed) HTML: ${path.basename(file)}`);
    }
  }
}

// Run All
async function run() {
  console.log('--- STARTING ENTERPRISE OPTIMIZATION ---');
  await optimizeImages();
  optimizeCSS();
  await optimizeJS();
  optimizeHTML();
  console.log('--- OPTIMIZATION COMPLETE ---');
}

run();
