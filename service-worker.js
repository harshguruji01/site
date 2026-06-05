const CACHE_NAME = 'harshguruji-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/logo.png',
  '/favicon.ico'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); })
    ))
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  // For navigation requests, try network first, fallback to cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(r => { caches.open(CACHE_NAME).then(c=>c.put(req, r.clone())); return r; }).catch(()=>caches.match('/index.html'))
    );
    return;
  }
  // For other requests, cache-first strategy
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(r => { 
      // cache images and same-origin assets
      if(req.url.startsWith(self.location.origin)){
        caches.open(CACHE_NAME).then(cache=>cache.put(req, r.clone()));
      }
      return r;
    }).catch(()=>caches.match('/index.html')) )
  );
});

self.addEventListener('message', (event) => {
  if(event.data && event.data.type === 'SKIP_WAITING'){
    self.skipWaiting();
  }
});
