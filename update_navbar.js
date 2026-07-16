const fs = require('fs');
const path = require('path');

const workspace = 'c:/Users/harsh/OneDrive/Desktop/webguruji';

const newNavContent = `<ul class="nav-links" id="nav-links">
        <li><a href="index.html" class="nav-link">Home</a></li>
        <li><a href="daily-special.html" class="nav-link">Daily Special</a></li>
        <li><a href="contributor.html" class="nav-link">Contributors</a></li>
        <li><a href="store.html" class="nav-link">Store</a></li>
        <li><a href="categories.html" class="nav-link">Categories</a></li>
      </ul>
      <div class="nav-search">
        <input type="text" id="site-search" placeholder="Search entire site..." />
        <button id="search-btn">🔍</button>
      </div>
      <a href="login.html" class="btn btn-nav" id="nav-cta">Login</a>
      <button class="hamburger"`;

const pattern = /<ul class="nav-links".*?<button class="hamburger"/s;

fs.readdirSync(workspace).forEach(file => {
  if (file.endsWith('.html')) {
    const filePath = path.join(workspace, file);
    const content = fs.readFileSync(filePath, 'utf8');
    if (pattern.test(content)) {
      const newContent = content.replace(pattern, newNavContent);
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${file}`);
    } else {
      console.log(`No match in ${file}`);
    }
  }
});
