const fs = require('fs');
const path = require('path');

const workspace = 'c:\\Users\\harsh\\OneDrive\\Desktop\\site';
const authFiles = ['login.html', 'signup.html', 'forgot-password.html', 'reset-password.html'];

for (const file of authFiles) {
    const filePath = path.join(workspace, file);
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove the light theme media query
    const lightQueryRegex = /@media \(prefers-color-scheme: light\) \{[\s\S]*?:root \{[\s\S]*?\}[\s\S]*?\}/g;
    content = content.replace(lightQueryRegex, '');

    // Replace the dark theme media query wrapper, keeping its contents on the :root
    const darkQueryRegex = /@media \(prefers-color-scheme: dark\) \{[\s\S]*?(:root \{[\s\S]*?\})[\s\S]*?\}/g;
    
    content = content.replace(darkQueryRegex, '$1');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Enforced dark mode on ${file}`);
}
