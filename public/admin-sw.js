self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

self.addEventListener('push', (event) => {
  let payload = {
    title: 'August Catering Admin',
    body: 'New activity received.',
    target: '/admin',
  };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch {
      payload.body = event.data.text();
    }
  }

  const title = payload.title || 'August Catering Admin';
  const options = {
    body: payload.body || 'New activity received.',
    icon: '/logo-nobg.png',
    badge: '/logo-nobg.png',
    tag: payload.sourceId ? `gk-admin-${payload.sourceId}` : 'gk-admin-notification',
    data: {
      target: payload.target || '/admin',
      sourceId: payload.sourceId || null,
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data?.target || '/admin';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client && client.url.includes(target)) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(target);
      }

      return undefined;
    })
  );
});