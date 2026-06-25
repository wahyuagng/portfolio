import { toast } from 'sonner';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { subscribeToForegroundMessage } from './firebase-messaging';

export const useFCMNotification = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = subscribeToForegroundMessage((payload) => {
            const title = payload.notification?.title ?? 'Notifikasi';
            const body = payload.notification?.body ?? '';
            const redirectPath = payload.data?.RedirectPath;

            toast.info(title, {
                description: body,
                duration: 5000,
                icon: <img src="/logo/logo-single.svg" width={40} height={40} style={{ objectFit: 'contain' }} />,
                ...(redirectPath && {
                    action: {
                        label: 'View Detail',
                        onClick: () => navigate(redirectPath),
                    },
                }),
            });
        });
        return () => unsubscribe();
    }, [navigate]);
};
