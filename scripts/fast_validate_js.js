const fs = require('fs');
const path = require('path');
const vm = require('vm');

let errorCount = 0;
let fileCount = 0;

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (['.git', '.agents', 'node_modules', 'backend', 'backend_legacy'].includes(f)) continue;
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      walk(p);
    } else if (f.endsWith('.js') && !p.includes('scripts')) {
      checkJsFile(p);
    } else if (f.endsWith('.html')) {
      checkHtmlFile(p);
    }
  }
}

function checkJsCode(code, identifier) {
  try {
    new vm.Script(code, { filename: identifier });
    return true;
  } catch (err) {
    if (err.message.includes('Cannot use import statement outside a module') ||
        err.message.includes("Unexpected token 'export'") ||
        err.message.includes('Unexpected token export')) {
      try {
        new vm.SourceTextModule(code, { identifier });
        return true;
      } catch (modErr) {
        console.error(`[SYNTAX ERROR] ${identifier}:\n  ${modErr.message}`);
        errorCount++;
        return false;
      }
    } else {
      console.error(`[SYNTAX ERROR] ${identifier}:\n  ${err.message}`);
      errorCount++;
      return false;
    }
  }
}

function checkJsFile(filePath) {
  fileCount++;
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    checkJsCode(code, filePath);
  } catch (err) {
    console.error(`[ERROR reading JS] ${filePath}: ${err.message}`);
    errorCount++;
  }
}

function checkHtmlFile(filePath) {
  fileCount++;
  try {
    const html = fs.readFileSync(filePath, 'utf8');
    const regex = /<script(?![^>]*src=)(?![^>]*application\/ld\+json)(?![^>]*type=["']text\/(?:template|plain)["'])[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let scriptIdx = 0;
    while ((match = regex.exec(html)) !== null) {
      scriptIdx++;
      const scriptCode = match[1];
      if (!scriptCode || !scriptCode.trim()) continue;
      checkJsCode(scriptCode, `${filePath} <script #${scriptIdx}>`);
    }
  } catch (err) {
    console.error(`[ERROR reading HTML] ${filePath}: ${err.message}`);
    errorCount++;
  }
}

console.log('Validating JavaScript in all .js and .html files...');
walk('.');
console.log(`\nScanned ${fileCount} files.`);
if (errorCount === 0) {
  console.log('SUCCESS: ZERO JavaScript syntax errors found across all files!');
  process.exit(0);
} else {
  console.error(`FAILED: Found ${errorCount} syntax error(s).`);
  process.exit(1);
}
