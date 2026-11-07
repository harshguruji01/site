const fs = require('fs');

const js = fs.readFileSync('js/explore.js', 'utf8');
const routes = [];
const re = /route:\s*["']([^"']+)["']/g;
let m;
while ((m = re.exec(js)) !== null) {
  routes.push(m[1]);
}
console.log('Routes in js/explore.js:');
console.log(routes);
