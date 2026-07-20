const fs = require('fs');
const path = require('path');

const cssDir = __dirname;
const cssFiles = [
  'style.css',
  'navbar.css',
  'signup.css',
  'login.css',
  'premium.css',
  'css/store.css',
  'css/dashboard-theme.css'
];

const newVariables = `
:root {
  --bg-primary: #0B0F19;
  --bg-secondary: #111827;
  --bg-card: #1A2235;
  --hover: #202B42;
  --text-primary: #FFFFFF;
  --text-secondary: #CBD5E1;
  --text-muted: #94A3B8;
  --accent: #2563EB;
  --accent-secondary: #7C3AED;
  --border: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.18);
  --shadow: 0 12px 35px rgba(0, 0, 0, 0.45);
  --glass-bg: rgba(255, 255, 255, 0.04);
  --glass-blur: blur(18px);
  --link-color: #60A5FA;
  
  --nav-height: 72px;
  --transition-fast: 0.25s ease;
  --transition-normal: 0.35s ease;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: var(--bg-primary);
}
::-webkit-scrollbar-thumb {
  background: var(--bg-card);
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--hover);
}

::selection {
  background: rgba(37, 99, 235, 0.3);
  color: var(--text-primary);
}

body {
  background-color: var(--bg-primary) !important;
  color: var(--text-primary) !important;
  background-image: none !important;
}

body::before {
  display: none !important;
}

.btn-primary, .btn-submit, .btn-buy, .btn-modal-buy, .nav-login-btn {
  background: linear-gradient(135deg, var(--accent), var(--accent-secondary)) !important;
  border: none !important;
  color: #fff !important;
  transition: transform 0.25s ease, box-shadow 0.25s ease !important;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2) !important;
}

.btn-primary:hover, .btn-submit:hover, .btn-buy:hover, .btn-modal-buy:hover, .nav-login-btn:hover {
  transform: scale(1.03) !important;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4) !important;
}

input.form-control, .input-wrapper input, .store-search-bar {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border) !important;
  transition: 0.25s ease !important;
}

input.form-control:focus, .input-wrapper input:focus, .store-search-bar:focus {
  border-color: var(--link-color) !important;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.25) !important;
}

.card, .auth-container, .store-sidebar, .cat-card, .product-card, .app-card, .glass-card {
  background: var(--bg-card) !important;
  border: 1px solid var(--border) !important;
  backdrop-filter: var(--glass-blur) !important;
  -webkit-backdrop-filter: var(--glass-blur) !important;
  box-shadow: var(--shadow) !important;
}

.card:hover, .cat-card:hover, .product-card:hover, .app-card:hover {
  background: var(--hover) !important;
  border-color: var(--border-hover) !important;
}
`;

cssFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let css = fs.readFileSync(filePath, 'utf8');

  // Strip existing :root in style.css and inject the new one
  if (file === 'style.css') {
    css = css.replace(/:root\s*\{[^}]+\}/, '');
    css = newVariables + '\n' + css;
  } else {
    // For other files, remove any remaining :root declarations
    css = css.replace(/:root\s*\{[^}]+\}/g, '');
  }

  // Refactor existing variable usages to map to the new variables
  const varMap = {
    'var(--bg-main)': 'var(--bg-primary)',
    'var(--bg-dark)': 'var(--bg-primary)',
    'var(--store-bg)': 'var(--bg-primary)',
    'var(--nav-bg-dark)': 'var(--bg-secondary)',
    
    'var(--bg-elevated)': 'var(--bg-card)',
    'var(--bg-surface)': 'var(--bg-card)',
    'var(--card-bg)': 'var(--bg-card)',
    'var(--store-card-bg)': 'var(--bg-card)',
    'var(--surface-color)': 'var(--bg-card)',
    
    'var(--text-primary)': 'var(--text-primary)',
    'var(--store-text)': 'var(--text-primary)',
    'var(--nav-text-dark)': 'var(--text-primary)',
    
    'var(--text-secondary)': 'var(--text-secondary)',
    'var(--store-text-muted)': 'var(--text-muted)',
    
    'var(--glass-border)': 'var(--border)',
    'var(--store-border)': 'var(--border)',
    'var(--border-color)': 'var(--border)',
    'var(--nav-border-dark)': 'var(--border)',
    
    'var(--shadow-lg)': 'var(--shadow)',
    'var(--shadow-xl)': 'var(--shadow)',
    
    'var(--accent-primary)': 'var(--accent)',
    'var(--store-primary)': 'var(--accent)',
    'var(--google-blue)': 'var(--link-color)',
    'var(--color-info)': 'var(--link-color)',
    
    'var(--nav-hover-dark)': 'var(--hover)',
  };

  for (const [oldVar, newVar] of Object.entries(varMap)) {
    // using split join to replace all instances globally
    css = css.split(oldVar).join(newVar);
  }

  // Clamp excessive padding/margins
  css = css.replace(/padding:\s*([4-9]|1[0-9])rem/g, 'padding: 3rem');
  css = css.replace(/margin-bottom:\s*([4-9]|1[0-9])rem/g, 'margin-bottom: 3rem');
  css = css.replace(/margin-top:\s*([4-9]|1[0-9])rem/g, 'margin-top: 3rem');

  // Strip white backgrounds 
  css = css.replace(/background:\s*#fff(?:fff)?/gi, 'background: var(--bg-card)');
  css = css.replace(/background-color:\s*#fff(?:fff)?/gi, 'background-color: var(--bg-card)');

  fs.writeFileSync(filePath, css, 'utf8');
  console.log(`Applied Premium Dark Theme to ${file}`);
});
