const fs = require('fs');
const path = require('path');

const dirPath = __dirname;

fs.readdir(dirPath, (err, files) => {
    if (err) throw err;
    const htmlFiles = files.filter(f => f.endsWith('.html'));
    
    const replacements = [
        // Tools Hub Mega Menu
        ['<a href="#" class="mega-link"><div class="mega-link-icon">👨‍💻</div><span>Developer</span></a>', '<a href="https://github.com" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">👨‍💻</div><span>Developer</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">🌐</div><span>Network</span></a>', '<a href="https://www.speedtest.net" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">🌐</div><span>Network</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">📈</div><span>SEO</span></a>', '<a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">📈</div><span>SEO</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">🎨</div><span>Design</span></a>', '<a href="https://www.figma.com" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">🎨</div><span>Design</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">🔄</div><span>Converters</span></a>', '<a href="https://cloudconvert.com/" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">🔄</div><span>Converters</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">⚡</div><span>Generators</span></a>', '<a href="https://coolors.co/" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">⚡</div><span>Generators</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">🧰</div><span>Utilities</span></a>', '<a href="https://gchq.github.io/CyberChef/" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">🧰</div><span>Utilities</span></a>'],

        // Learning Mega Menu
        ['<a href="#" class="mega-link"><div class="mega-link-icon">💻</div><span>Programming</span></a>', '<a href="https://www.freecodecamp.org/" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">💻</div><span>Programming</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">🔬</div><span>Science</span></a>', '<a href="https://www.khanacademy.org/science" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">🔬</div><span>Science</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">📐</div><span>Math</span></a>', '<a href="https://www.desmos.com/" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">📐</div><span>Math</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">🏺</div><span>History</span></a>', '<a href="https://www.history.com/" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">🏺</div><span>History</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">📱</div><span>Technology</span></a>', '<a href="https://techcrunch.com/" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">📱</div><span>Technology</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">🛡️</div><span>Cybersecurity</span></a>', '<a href="https://tryhackme.com/" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">🛡️</div><span>Cybersecurity</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">📖</div><span>Tutorials</span></a>', '<a href="https://www.w3schools.com/" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">📖</div><span>Tutorials</span></a>'],

        // Gaming Mega Menu
        ['<a href="#" class="mega-link"><div class="mega-link-icon">💻</div><span>PC Games</span></a>', '<a href="https://store.steampowered.com/" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">💻</div><span>PC Games</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">📱</div><span>Android Games</span></a>', '<a href="https://play.google.com/store/games" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">📱</div><span>Android Games</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">🔥</div><span>Free Fire</span></a>', '<a href="https://ff.garena.com/" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">🔥</div><span>Free Fire</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">🧱</div><span>Minecraft</span></a>', '<a href="https://www.minecraft.net/" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">🧱</div><span>Minecraft</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">🎯</div><span>Esports</span></a>', '<a href="https://esports.com/" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">🎯</div><span>Esports</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">⚙️</div><span>Game Tools</span></a>', '<a href="https://blitz.gg/" target="_blank" rel="noopener noreferrer" class="mega-link"><div class="mega-link-icon">⚙️</div><span>Game Tools</span></a>'],

        // Store Mega Menu (Local links without target="_blank")
        ['<a href="#" class="mega-link"><div class="mega-link-icon">🪟</div><span>Windows</span></a>', '<a href="store-windows.html" class="mega-link"><div class="mega-link-icon">🪟</div><span>Windows</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">🤖</div><span>Android</span></a>', '<a href="store-android.html" class="mega-link"><div class="mega-link-icon">🤖</div><span>Android</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">🐧</div><span>Linux</span></a>', '<a href="store-linux.html" class="mega-link"><div class="mega-link-icon">🐧</div><span>Linux</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">🍎</div><span>Mac</span></a>', '<a href="store-mac.html" class="mega-link"><div class="mega-link-icon">🍎</div><span>Mac</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">📱</div><span>Apps</span></a>', '<a href="store-apps.html" class="mega-link"><div class="mega-link-icon">📱</div><span>Apps</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">🧩</div><span>Extensions</span></a>', '<a href="store-extensions.html" class="mega-link"><div class="mega-link-icon">🧩</div><span>Extensions</span></a>'],
        ['<a href="#" class="mega-link"><div class="mega-link-icon">💾</div><span>Software</span></a>', '<a href="store-software.html" class="mega-link"><div class="mega-link-icon">💾</div><span>Software</span></a>'],

        // Tools Hub & Learning Mobile Sub Menu
        ['<a href="#" class="mobile-sub-link">Developer</a>', '<a href="https://github.com" target="_blank" rel="noopener noreferrer" class="mobile-sub-link">Developer</a>'],
        ['<a href="#" class="mobile-sub-link">SEO</a>', '<a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" class="mobile-sub-link">SEO</a>'],
        ['<a href="#" class="mobile-sub-link">Design</a>', '<a href="https://www.figma.com" target="_blank" rel="noopener noreferrer" class="mobile-sub-link">Design</a>'],
        ['<a href="#" class="mobile-sub-link">Programming</a>', '<a href="https://www.freecodecamp.org/" target="_blank" rel="noopener noreferrer" class="mobile-sub-link">Programming</a>'],
        ['<a href="#" class="mobile-sub-link">Science</a>', '<a href="https://www.khanacademy.org/science" target="_blank" rel="noopener noreferrer" class="mobile-sub-link">Science</a>'],
        ['<a href="#" class="mobile-sub-link">Cybersecurity</a>', '<a href="https://tryhackme.com/" target="_blank" rel="noopener noreferrer" class="mobile-sub-link">Cybersecurity</a>']
    ];

    let count = 0;
    
    htmlFiles.forEach(file => {
        const filePath = path.join(dirPath, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;
        
        replacements.forEach(([oldStr, newStr]) => {
            newContent = newContent.split(oldStr).join(newStr);
        });
        
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            count++;
        }
    });
    
    console.log(`Updated ${count} files.`);
});
