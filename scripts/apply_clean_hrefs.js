const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const IGNORE_DIRS = new Set([
  '.agents',
  '.git',
  '.gemini',
  '.vscode',
  'backend',
  'backend_legacy',
  'node_modules',
  'interactive-components'
]);

function getHtmlFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getHtmlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function transformHref(href) {
  if (
    !href ||
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('javascript:') ||
    href.startsWith('data:')
  ) {
    return href;
  }

  // Only transform relative HTML links
  if (!href.includes('.html')) return href;

  let urlPart = href;
  let suffix = '';
  const hashIdx = urlPart.indexOf('#');
  if (hashIdx !== -1) {
    suffix = urlPart.slice(hashIdx);
    urlPart = urlPart.slice(0, hashIdx);
  }
  const queryIdx = urlPart.indexOf('?');
  if (queryIdx !== -1) {
    suffix = urlPart.slice(queryIdx) + suffix;
    urlPart = urlPart.slice(0, queryIdx);
  }

  let clean = urlPart.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');

  if (clean === 'index.html' || clean === '/index.html') {
    return '/' + suffix;
  }

  if (clean.endsWith('/index.html')) {
    let route = clean.replace(/\/index\.html$/, '');
    if (!route.startsWith('/')) route = '/' + route;
    return route + '/' + suffix;
  }

  if (clean.endsWith('.html')) {
    let route = clean.replace(/\.html$/, '');
    if (!route.startsWith('/')) route = '/' + route;
    return route + '/' + suffix;
  }

  return href;
}

function run() {
  const allFiles = getHtmlFiles(ROOT_DIR);
  let totalFilesUpdated = 0;
  let totalLinksUpdated = 0;

  for (const file of allFiles) {
    const original = fs.readFileSync(file, 'utf8');
    let fileLinksCount = 0;

    const updated = original.replace(/(href=["'])([^"']+\.html[^"']*)(["'])/g, (match, p1, p2, p3) => {
      const newHref = transformHref(p2);
      if (newHref !== p2) {
        fileLinksCount++;
        return `${p1}${newHref}${p3}`;
      }
      return match;
    });

    if (fileLinksCount > 0) {
      fs.writeFileSync(file, updated, 'utf8');
      totalFilesUpdated++;
      totalLinksUpdated += fileLinksCount;
    }
  }

  console.log(`✅ Successfully updated ${totalLinksUpdated} links across ${totalFilesUpdated} HTML files!`);
}

run();
