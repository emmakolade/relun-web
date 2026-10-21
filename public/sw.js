// Caches the app shell so the installed app opens fast, and shows push
// notifications (sent through Firebase Cloud Messaging, see src/util/webPush.ts).
// API and socket traffic always goes to the network. Bump VERSION to drop old caches.
// The app is served at /app/ (every /app/* path gets the same app.html); the
// public pages outside it are separate prerendered files.
const VERSION = 'relun-shell-v3';
const APP = '/app/';
const SHELL = [APP, '/manifest.webmanifest', '/favicon.svg', '/icons/icon-192.png', '/fonts/outfit.ttf', '/fonts/pacifico.ttf'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/socket.io')) return;
  // The dev server's modules change on every edit; never cache them.
  if (/^\/(src|node_modules|@)/.test(url.pathname)) return;

  // Pages: network first so a deploy shows up at once; the cached copy when offline.
  // Every app screen shares one cached shell; each public page caches on its own.
  if (request.mode === 'navigate') {
    const inApp = url.pathname === '/app' || url.pathname.startsWith(APP);
    const key = inApp ? APP : url.pathname;
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(VERSION).then((cache) => cache.put(key, copy));
          }
          return response;
        })
        .catch(() => caches.match(key).then((cached) => cached || caches.match(APP))),
    );
    return;
  }

  // Hashed build assets, fonts and icons never change under the same URL.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});

// ---------- Push ----------

// Where a tap goes, from the push's data (the same types the Android app reads).
const urlFor = (data) => {
  const userId = data && data.userId;
  switch (data && data.type) {
    case 'message':
    case 'message_request':
    case 'match':
      return userId ? `${APP}chat/${encodeURIComponent(userId)}` : APP;
    default:
      return APP;
  }
};

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { notification: { title: 'Relun', body: event.data ? event.data.text() : '' } };
  }
  const notification = payload.notification || {};
  const data = payload.data || {};

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      // Relun is open and on screen: it already shows this live.
      if (windows.some((w) => w.visibilityState === 'visible')) return;
      return self.registration.showNotification(notification.title || 'Relun', {
        body: notification.body || '',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: data.userId ? `${data.type}-${data.userId}` : data.type,
        data: { url: urlFor(data) },
      });
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || APP;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const open = windows.find((w) => new URL(w.url).origin === self.location.origin);
      if (open) return open.focus().then((w) => (w && 'navigate' in w ? w.navigate(url) : undefined));
      return self.clients.openWindow(url);
    }),
  );
});
