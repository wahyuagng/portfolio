importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const params = new URLSearchParams(location.search);

firebase.initializeApp({
    apiKey: params.get('apiKey'),
    authDomain: params.get('authDomain'),
    projectId: params.get('projectId'),
    storageBucket: params.get('storageBucket'),
    messagingSenderId: params.get('messagingSenderId'),
    appId: params.get('appId'),
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        const activeClient = clientList.find(
            (client) =>
                client.url.startsWith(self.location.origin) &&
                (client.focused || client.visibilityState === 'visible')
        );

        if (activeClient) {
            activeClient.postMessage({ type: 'FCM_FOREGROUND', payload });
            return;
        }

        const title = payload.notification?.title ?? 'Notifikasi';
        const notificationOptions = {
            body: payload.notification?.body ?? '',
            icon: '/logo/logo-single.png',
            badge: '/logo/logo-single.png',
            data: payload.data ?? {},
            tag: 'firebase-notification',
            requireInteraction: false,
            silent: false,
            vibrate: [200, 100, 200],
            actions: [
                { action: 'open', title: 'Open App' },
                { action: 'close', title: 'Dismiss' },
            ],
        };
        self.registration.showNotification(title, notificationOptions);
    });
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.action === 'close') return;

    const redirectPath = event.notification.data?.RedirectPath ?? '/';
    const targetUrl = self.location.origin + redirectPath;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            const existingClient = clientList.find(client =>
                client.url.startsWith(self.location.origin)
            );

            if (existingClient) {
                existingClient.postMessage({ type: 'FCM_NAVIGATE', redirectPath });
                return existingClient.focus();
            }

            return clients.openWindow(targetUrl);
        })
    );
});
