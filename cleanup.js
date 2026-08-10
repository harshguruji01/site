const fs = require("fs");
const path = require("path");

const files = fs.readdirSync(__dirname);

files.forEach(file => {
  if (file.endsWith(".html")) {
    let content = fs.readFileSync(file, "utf8");

    // 1. Remove the old `<nav>` tags completely
    content = content.replace(/<nav (class="premium-navbar"|id="navbar"|id="premium-navbar")[\s\S]*?<\/nav>/g, '');

    // 2. Remove all `premium-mobile-nav` blocks completely (the ones with wrappers)
    content = content.replace(/<div class="premium-mobile-nav" id="premium-mobile-nav">[\s\S]*?<a href="about\.html" class="mobile-nav-link">About Us<\/a>\s*<\/div>\s*<\/div>\s*<\/div>/g, '');

    // 3. Remove all orphaned `mobile-nav-item` blocks (the ones WITHOUT wrappers)
    // We can do this by just aggressively matching anything from `<!-- Mobile Full Screen Menu -->` (or `<div class="mobile-nav-item">` if the comment is missing) 
    // up to the main content tag.
    
    // Instead of complex regex, let's just find the start of the real content.
    // Real content usually starts with <main, <section, <div class="hero", <div class="auth-container", <div class="daily-special-banner", <div class="privacy-container", <div class="terms-container", <div class="contact-container"
    
    content = content.replace(/(?:<!-- Mobile Full Screen Menu -->|<div class="mobile-nav-item">)[\s\S]*?(?=<main|<section|<div class="hero"|<div class="auth-container"|<div class="daily-special-banner"|<div class="privacy-container"|<div class="terms-container"|<div class="contact-container"|<div class="cookie-container"|<div class="store-container"|<div id="scroll-progress"|<div class="dashboard-container"|<div class="contributor-container")/, '');

    fs.writeFileSync(file, content, "utf8");
  }
});
console.log("Cleanup done.");
