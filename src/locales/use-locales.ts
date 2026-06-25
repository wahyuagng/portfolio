import type { LangCode } from './types';

import dayjs from 'dayjs';
import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { localesConfig } from '@common/config/locales.config';

import { toast } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';

import { getCurrentLang } from './types';

// ----------------------------------------------------------------------

export function useTranslate() {
    const settings = useSettingsContext();

    // const { t, i18n } = useTranslation(namespace, 'common']);
    const { t, i18n } = useTranslation(['common', 'messages', 'navbar', 'validation']);
    // const { t: tMessages } = useTranslation('messages'); // example for custom translation

    const currentLang = getCurrentLang(i18n.resolvedLanguage);

    const updateDirection = useCallback(
        (lang: LangCode) => {
            settings.setState({ direction: i18n.dir(lang) });
        },
        [i18n, settings]
    );

    const updateDayjsLocale = useCallback((lang: LangCode) => {
        const updatedLang = getCurrentLang(lang);
        dayjs.locale(updatedLang.adapterLocale);
    }, []);

    const handleChangeLang = useCallback(
        async (lang: LangCode) => {
            try {
                const changeLangPromise = i18n.changeLanguage(lang);

                toast.promise(changeLangPromise, {
                    loading: t('messages:languageSwitch.loading'),
                    success: () => t('messages:languageSwitch.success'),
                    error: () => t('messages:languageSwitch.error'),
                });

                await changeLangPromise;

                updateDirection(lang);
                updateDayjsLocale(lang);
            } catch (error) {
                console.error(error);
            }
        },
        [i18n, t, updateDayjsLocale, updateDirection]
    );

    const handleResetLang = useCallback(() => {
        handleChangeLang(localesConfig.fallbackLanguage);
    }, [handleChangeLang]);

    return {
        t,
        i18n,
        currentLang,
        onChangeLang: handleChangeLang,
        onResetLang: handleResetLang,
    };
}

// ----------------------------------------------------------------------

export function useLocaleDirectionSync() {
    const { i18n, currentLang } = useTranslate();
    const { state, setState } = useSettingsContext();

    const handleSync = useCallback(async () => {
        if (state.direction !== i18n.dir(currentLang.value)) {
            setState({ direction: i18n.dir(currentLang.value) });
        }

        if (i18n.resolvedLanguage !== currentLang.value) {
            await i18n.changeLanguage(currentLang.value);
        }
    }, [currentLang.value, i18n, setState, state.direction]);

    useEffect(() => {
        handleSync();
    }, [handleSync]);

    return null;
}
