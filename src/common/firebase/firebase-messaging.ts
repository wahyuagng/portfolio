import { getToken, onMessage } from 'firebase/messaging';

import { messaging } from './firebase-config';

type MessageCallback = (payload: any) => void;
const subscribers = new Set<MessageCallback>();

onMessage(messaging, (payload) => {
    subscribers.forEach((cb) => cb(payload));
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'FCM_FOREGROUND') {
            subscribers.forEach((cb) => cb(event.data.payload));
        }
        if (event.data?.type === 'FCM_NAVIGATE') {
            window.location.href = event.data.redirectPath;
        }
    });
}

export const subscribeToForegroundMessage = (callback: MessageCallback) => {
    subscribers.add(callback);
    return () => {
        subscribers.delete(callback);
    };
};

export const getFCMToken = async (): Promise<string | null> => {
    try {
        if (!('Notification' in window)) {
            return null;
        }
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            return null;
        }

        const swUrl = new URL('/firebase-messaging-sw.js', location.origin);
        swUrl.searchParams.set('apiKey', import.meta.env.VITE_FIREBASE_API_KEY);
        swUrl.searchParams.set('authDomain', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
        swUrl.searchParams.set('projectId', import.meta.env.VITE_FIREBASE_PROJECT_ID);
        swUrl.searchParams.set('storageBucket', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
        swUrl.searchParams.set('messagingSenderId', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID);
        swUrl.searchParams.set('appId', import.meta.env.VITE_FIREBASE_APPID);

        const registration = await navigator.serviceWorker.register(swUrl.toString(), { scope: '/' });

        await navigator.serviceWorker.ready;

        const token = await getToken(messaging, { serviceWorkerRegistration: registration });
        return token || null;
    } catch (error: any) {
        console.error('❌ [FCM] Error:', error?.message ?? error);
        console.error('❌ [FCM] Error detail:', error);
        return null;
    }
};
