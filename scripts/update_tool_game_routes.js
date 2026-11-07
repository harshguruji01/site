const fs = require('fs');
const path = require('path');

// 1. Update js/tool-hub.js
const toolHubPath = path.join(__dirname, '../js/tool-hub.js');
if (fs.existsSync(toolHubPath)) {
  let content = fs.readFileSync(toolHubPath, 'utf8');
  content = content.replace(/route:\s*["']tools\/([a-zA-Z0-9-]+)\.html["']/g, 'route: "/tools/$1/"');
  fs.writeFileSync(toolHubPath, content, 'utf8');
  console.log('Updated tool routes in js/tool-hub.js');
}

// 2. Update js/tools.js
const toolsPath = path.join(__dirname, '../js/tools.js');
if (fs.existsSync(toolsPath)) {
  let content = fs.readFileSync(toolsPath, 'utf8');
  content = content.replace(/route:\s*["']tools\/([a-zA-Z0-9-]+)\.html["']/g, 'route: "/tools/$1/"');
  fs.writeFileSync(toolsPath, content, 'utf8');
  console.log('Updated tool routes in js/tools.js');
}

// 3. Update js/gaming.js
const gamingPath = path.join(__dirname, '../js/gaming.js');
if (fs.existsSync(gamingPath)) {
  let content = fs.readFileSync(gamingPath, 'utf8');
  content = content.replace(/route:\s*["']games\/([a-zA-Z0-9-]+)\.html["']/g, 'route: "/games/$1/"');
  fs.writeFileSync(gamingPath, content, 'utf8');
  console.log('Updated game routes in js/gaming.js');
}

// 4. Update js/gaming-hub.js
const gamingHubPath = path.join(__dirname, '../js/gaming-hub.js');
if (fs.existsSync(gamingHubPath)) {
  let content = fs.readFileSync(gamingHubPath, 'utf8');
  content = content.replace(/route:\s*["']games\/([a-zA-Z0-9-]+)\.html["']/g, 'route: "/games/$1/"');
  fs.writeFileSync(gamingHubPath, content, 'utf8');
  console.log('Updated game routes in js/gaming-hub.js');
}
