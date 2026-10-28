const CACHE_NAME = 'nemo-cooking-v7';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './title.jpg'
];

self.addEventListener('install', event => {
  // Zwingt den Service Worker, sofort aktiv zu werden (überspringt die Wartezeit)
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  // Löscht rigoros alle alten Caches, die nicht dem aktuellen CACHE_NAME entsprechen
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Übernimmt sofort die Kontrolle über alle offenen Seiten
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
