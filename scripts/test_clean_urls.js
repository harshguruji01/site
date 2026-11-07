const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 8899;

// Simple static HTTP file server for verification
const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  
  if (reqPath.endsWith('/')) {
    reqPath += 'index.html';
  }

  let filePath = path.join(ROOT_DIR, reqPath);

  // If file doesn't exist, try appending .html
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(`404 Not Found: ${req.url}`);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeMap = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8'
  };

  const contentType = mimeMap[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

function fetchUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', (err) => {
      resolve({ statusCode: 500, error: err.message });
    });
  });
}

async function runTests() {
  server.listen(PORT, async () => {
    console.log(`📡 Local verification server running on http://localhost:${PORT}`);

    const pagesToTest = [
      '/',
      '/explore/',
      '/about/',
      '/contact/',
      '/tools/',
      '/books/',
      '/store/',
      '/daily-special/',
      '/daily-life/',
      '/learning-hub/',
      '/gaming-hub/',
      '/gaming/',
      '/free-tools/',
      '/privacy-policy/',
      '/terms-and-conditions/',
      '/disclaimer/',
      '/ai-hub/',
      '/ai/',
      '/dashboard/',
      '/settings/',
      '/showcase/',
      '/gallery/',
      '/technology/',
      '/education/',
      '/contributor/',
      '/tools/base64/',
      '/tools/json-formatter/',
      '/tools/password-generator/',
      '/tools/bmi-calculator/',
      '/tools/case-converter/',
      '/tools/percentage-calculator/',
      '/tools/word-counter/',
      '/games/snake/',
      '/games/tic-tac-toe/',
      '/games/memory/',
      '/learning/class/',
      '/learning/subject/',
      '/learning/chapter/',
      '/learning/pdf-library/'
    ];

    let passedPages = 0;
    let failedPages = 0;
    let verifiedAssets = 0;
    let failedAssets = 0;

    const checkedAssetUrls = new Set();

    for (const pageRoute of pagesToTest) {
      const pageUrl = `http://localhost:${PORT}${pageRoute}`;
      const res = await fetchUrl(pageUrl);

      if (res.statusCode !== 200) {
        console.error(`❌ PAGE FAILED: ${pageRoute} (HTTP ${res.statusCode})`);
        failedPages++;
        continue;
      }

      // Check title exists
      const titleMatch = res.body.match(/<title>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : '';
      if (!title) {
        console.warn(`⚠️ Warning: Missing <title> on ${pageRoute}`);
      }

      // Check key assets (CSS / JS / Images)
      const assetMatches = [
        ...res.body.matchAll(/<link[^>]+href=["']([^"']+)["']/gi),
        ...res.body.matchAll(/<script[^>]+src=["']([^"']+)["']/gi),
        ...res.body.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)
      ];

      for (const m of assetMatches) {
        const rawHref = m[1];
        if (rawHref.startsWith('http://') || rawHref.startsWith('https://') || rawHref.startsWith('//') || rawHref.startsWith('data:')) {
          continue; // External asset
        }

        const assetUrl = `http://localhost:${PORT}/${rawHref.replace(/^\//, '')}`;
        if (checkedAssetUrls.has(assetUrl)) continue;
        checkedAssetUrls.add(assetUrl);

        const assetRes = await fetchUrl(assetUrl);
        if (assetRes.statusCode === 200) {
          verifiedAssets++;
        } else {
          console.error(`❌ ASSET 404: ${rawHref} referenced in ${pageRoute} (HTTP ${assetRes.statusCode})`);
          failedAssets++;
        }
      }

      passedPages++;
      console.log(`✔ Passed [HTTP 200]: ${pageRoute.padEnd(28)} Title: "${title.slice(0, 35)}..."`);
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`📊 Test Summary:`);
    console.log(`   Pages Tested:     ${pagesToTest.length}`);
    console.log(`   Pages Passed:     ${passedPages}`);
    console.log(`   Pages Failed:     ${failedPages}`);
    console.log(`   Assets Verified:  ${verifiedAssets}`);
    console.log(`   Assets Failed:    ${failedAssets}`);
    console.log('═══════════════════════════════════════════════════════════════');

    server.close(() => {
      console.log('🏁 Verification server stopped.');
      process.exit(failedPages > 0 || failedAssets > 0 ? 1 : 0);
    });
  });
}

runTests();
