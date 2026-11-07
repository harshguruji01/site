const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Directories to skip
const IGNORE_DIRS = new Set([
  '.agents',
  '.git',
  '.vscode',
  'backend',
  'backend_legacy',
  'node_modules',
  'interactive-components'
]);

function getHtmlFiles(dir, baseRel = '') {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    const relPath = baseRel ? path.join(baseRel, entry.name) : entry.name;

    if (entry.isDirectory()) {
      files = files.concat(getHtmlFiles(fullPath, relPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push({
        fullPath,
        relPath: relPath.replace(/\\/g, '/')
      });
    }
  }

  return files;
}

function processHtmlContent(content, cleanRoute, sourceDirRel) {
  let modified = content;

  // 1. Ensure <base href="/"> exists right after <head>
  if (!modified.includes('<base ') && modified.includes('<head>')) {
    modified = modified.replace(/<head>/i, '<head>\n  <base href="/">');
  }

  // 2. Fix subdirectory asset references so they point to absolute root-relative paths
  if (sourceDirRel) {
    // If inside learning/
    if (sourceDirRel.startsWith('learning')) {
      modified = modified.replace(/src=["']js\/curriculumEngine\.js["']/g, 'src="/learning/js/curriculumEngine.js"');
      modified = modified.replace(/src=["']pdf-library\.js["']/g, 'src="/learning/pdf-library.js"');
      modified = modified.replace(/href=["']loading-lines\.css["']/g, 'href="/learning/loading-lines.css"');
      modified = modified.replace(/src=["']loading-lines\.js["']/g, 'src="/learning/loading-lines.js"');
    }
    // If inside tools/
    if (sourceDirRel.startsWith('tools')) {
      modified = modified.replace(/href=["']loading-lines\.css["']/g, 'href="/tools/loading-lines.css"');
      modified = modified.replace(/src=["']loading-lines\.js["']/g, 'src="/tools/loading-lines.js"');
    }
    // If inside games/
    if (sourceDirRel.startsWith('games')) {
      modified = modified.replace(/href=["']loading-lines\.css["']/g, 'href="/games/loading-lines.css"');
      modified = modified.replace(/src=["']loading-lines\.js["']/g, 'src="/games/loading-lines.js"');
    }
  }

  // 3. Update canonical URL to clean trailing slash URL
  const canonicalRegex = /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']\s*\/?>/i;
  const targetCanonical = `https://webguruji.online/${cleanRoute}`;
  if (canonicalRegex.test(modified)) {
    modified = modified.replace(canonicalRegex, `<link rel="canonical" href="${targetCanonical}">`);
  }

  // 4. Update og:url to clean trailing slash URL
  const ogUrlRegex = /<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']\s*\/?>/i;
  if (ogUrlRegex.test(modified)) {
    modified = modified.replace(ogUrlRegex, `<meta property="og:url" content="${targetCanonical}">`);
  }

  return modified;
}

function run() {
  console.log('🚀 Starting Clean URLs generator for HarshGuruJi...');
  const allFiles = getHtmlFiles(ROOT_DIR);

  let createdCount = 0;

  for (const { fullPath, relPath } of allFiles) {
    // If it's already an index.html, skip or process in place
    if (path.basename(relPath) === 'index.html') {
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const sourceDirRel = path.dirname(relPath);

    // Determine target clean folder route
    let cleanRoute = relPath.replace(/\.html$/, '') + '/';
    if (cleanRoute.startsWith('/')) cleanRoute = cleanRoute.slice(1);

    const targetDir = path.join(ROOT_DIR, relPath.replace(/\.html$/, ''));
    const targetFile = path.join(targetDir, 'index.html');

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const processedContent = processHtmlContent(content, cleanRoute, sourceDirRel);
    fs.writeFileSync(targetFile, processedContent, 'utf8');
    createdCount++;
  }

  // Special cases for existing directories:
  // 1. tools.html -> tools/index.html
  if (fs.existsSync(path.join(ROOT_DIR, 'tools.html'))) {
    const toolsContent = fs.readFileSync(path.join(ROOT_DIR, 'tools.html'), 'utf8');
    const processedTools = processHtmlContent(toolsContent, 'tools/', '');
    fs.writeFileSync(path.join(ROOT_DIR, 'tools', 'index.html'), processedTools, 'utf8');
    console.log('✔ Updated tools/index.html');
  }

  // 2. learning.html -> learning/index.html
  if (fs.existsSync(path.join(ROOT_DIR, 'learning.html'))) {
    const learningContent = fs.readFileSync(path.join(ROOT_DIR, 'learning.html'), 'utf8');
    const processedLearning = processHtmlContent(learningContent, 'learning/', '');
    fs.writeFileSync(path.join(ROOT_DIR, 'learning', 'index.html'), processedLearning, 'utf8');
    console.log('✔ Updated learning/index.html');
  }

  // 3. gaming.html -> games/index.html
  if (fs.existsSync(path.join(ROOT_DIR, 'gaming.html'))) {
    const gamingContent = fs.readFileSync(path.join(ROOT_DIR, 'gaming.html'), 'utf8');
    const processedGaming = processHtmlContent(gamingContent, 'games/', '');
    fs.writeFileSync(path.join(ROOT_DIR, 'games', 'index.html'), processedGaming, 'utf8');
    console.log('✔ Updated games/index.html');
  }

  console.log(`✅ Successfully generated ${createdCount} Clean URL directories with index.html!`);
}

run();
