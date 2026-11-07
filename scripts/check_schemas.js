const fs = require('fs');

['tools/bmi-calculator/index.html', 'games/snake/index.html', 'ai-hub/index.html'].forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log('Schemas in', f, ':');
  const schemas = content.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi) || [];
  schemas.forEach(s => {
    try {
      const json = JSON.parse(s.replace(/<\/?script[^>]*>/gi, ''));
      console.log('  @type:', json['@type']);
    } catch(e) {
      console.log('  Invalid JSON-LD');
    }
  });
});
