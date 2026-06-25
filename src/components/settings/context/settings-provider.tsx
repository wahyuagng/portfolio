import type { SettingsState, SettingsProviderProps } from '../types';

import { isEqual } from 'es-toolkit';
import { useLocalStorage } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { SETTINGS_STORAGE_KEY } from '@common/config/layout.config';
import { getStorage as getStorageValue } from 'minimal-shared/utils';

import { SettingsContext } from './settings-context';

// ----------------------------------------------------------------------

export function SettingsProvider({ children, defaultSettings, storageKey = SETTINGS_STORAGE_KEY }: SettingsProviderProps) {
    const { state, setState, resetState, setField } = useLocalStorage<SettingsState>(storageKey, defaultSettings);
    const [openDrawer, setOpenDrawer] = useState(false);

    const onToggleDrawer = useCallback(() => {
        setOpenDrawer((prev) => !prev);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setOpenDrawer(false);
    }, []);

    const canReset = !isEqual(state, defaultSettings);

    const removeCache = async () => {
        if ('serviceWorker' in navigator) {
            console.log('Removing service workers ...');
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                await registration.unregister();
            }
        }

        if ('caches' in window) {
            console.log('Removing caches ...');
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map((name) => caches.delete(name)));
        }
    };

    const onReset = useCallback(() => {
        resetState(defaultSettings);
    }, [defaultSettings, resetState]);

    const onHardReset = useCallback(async () => {
        try {
            await removeCache();
            onReset();

            // force hard refresh
            window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
        } catch (err) {
            console.error('Failed to force hard reload:', err);
            window.location.reload();
        }
    }, [onReset]);

    useEffect(() => {
        const storedValue = getStorageValue<SettingsState>(storageKey);

        if (storedValue) {
            try {
                if (!storedValue.version || storedValue.version !== defaultSettings.version) {
                    void onHardReset();
                }
            } catch {
                onReset();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const memoizedValue = useMemo(
        () => ({
            canReset,
            onReset,
            openDrawer,
            onCloseDrawer,
            onToggleDrawer,
            state,
            setState,
            setField,
        }),
        [canReset, onReset, openDrawer, onCloseDrawer, onToggleDrawer, state, setField, setState]
    );

    return <SettingsContext value={memoizedValue}>{children}</SettingsContext>;
}
