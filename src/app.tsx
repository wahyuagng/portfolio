import 'src/global.css';

import { useEffect } from 'react';
import { Router } from '@routes/router';
import { ClientInfo } from '@auth/utils/client-info';
import { AuthProvider } from '@auth/context/auth-provider';
import { useFCMNotification } from '@common/firebase/useFCMNotification';

import { usePathname } from 'src/routes/hooks';

import { LocalizationProvider } from 'src/locales';
import { themeConfig, ThemeProvider } from 'src/theme';
import { I18nProvider } from 'src/locales/i18n-provider';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { layoutConfig, SettingsDrawer, SettingsProvider } from 'src/components/settings';

export default function App() {
    useScrollToTop();
    useFCMNotification();
    useEffect(() => {
        ClientInfo.initialize();
    }, []);

    return (
        <I18nProvider>
            <AuthProvider>
                <SettingsProvider defaultSettings={layoutConfig}>
                    <LocalizationProvider>
                        <ThemeProvider modeStorageKey={themeConfig.modeStorageKey} defaultMode={themeConfig.defaultMode}>
                            <MotionLazy>
                                <Snackbar />
                                <ProgressBar />
                                <SettingsDrawer defaultSettings={layoutConfig} />
                                <Router />
                            </MotionLazy>
                        </ThemeProvider>
                    </LocalizationProvider>
                </SettingsProvider>
            </AuthProvider>
        </I18nProvider>
    );
}

function useScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
