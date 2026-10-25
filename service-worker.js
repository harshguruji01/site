// HarshGuruJi PWA Service Worker
const CACHE_NAME = 'harshguruji-v3';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './navbar-premium.css',
  './footer-premium.css',
  './css/pwa-install.css',
  './js/pwa-install.js',
  './logo.png',
  './logo-192.png',
  './logo-512.png',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.debug('Asset caching skipped:', url, err);
          })
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.debug('HarshGuruJi SW: Deleting outdated cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests with HTTP/HTTPS
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  const isNavigation = event.request.mode === 'navigate' || 
                       event.request.destination === 'document' ||
                       event.request.headers.get('accept')?.includes('text/html');

  // Network-First for HTML navigation requests (ensures users ALWAYS see fresh updates online)
  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  // Stale-while-revalidate for static assets (CSS, JS, images, icons)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});