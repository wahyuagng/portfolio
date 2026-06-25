import type { InitOptions } from 'i18next';
import type { LangCode } from './types';

import i18next from 'i18next';
import { getStorage } from 'minimal-shared/utils';
import { localesConfig } from '@common/config/locales.config';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next, I18nextProvider as Provider } from 'react-i18next';

import { i18nOptions } from './types';

// ----------------------------------------------------------------------
const i18nextLng = getStorage(
    localesConfig.storage.localStorage.key,
    localesConfig.storage.localStorage.autoDetection ? undefined : localesConfig.fallbackLanguage
) as LangCode;

/**
 * Initialize i18next
 */
const initOptions: InitOptions = {
    ...i18nOptions(i18nextLng),
    detection: { lookupLocalStorage: localesConfig.storage.localStorage.key, caches: ['localStorage'] },
};

const i18nResourceLoader = resourcesToBackend(
    (lang: LangCode, namespace: string) => import(`./langs/${lang}/${namespace}.json`)
);

i18next.use(LanguageDetector).use(initReactI18next).use(i18nResourceLoader).init(initOptions);

// ----------------------------------------------------------------------

type I18nProviderProps = {
    children: React.ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
    return <Provider i18n={i18next}>{children}</Provider>;
}
