import type { InitOptions } from 'i18next';
import type { Theme, Components } from '@mui/material/styles';

import { localesConfig } from '@common/config/locales.config';

// ----------------------------------------------------------------------

export type LangCode = (typeof localesConfig.supportedLanguages)[number];

/**
 * @countryCode https://flagcdn.com/en/codes.json
 * @adapterLocale https://github.com/iamkun/dayjs/tree/master/src/locale
 * @numberFormat https://simplelocalize.io/data/locales/
 */
export type LangOption = {
    value: LangCode;
    label: string;
    countryCode: string;
    adapterLocale?: string;
    numberFormat: { code: string; currency: string };
    systemValue?: { components: Components<Theme> };
};

export function i18nOptions(
    lang = localesConfig.fallbackLanguage,
    namespace = localesConfig.defaultNamespace
): InitOptions {
    return {
        // debug: true,
        supportedLngs: localesConfig.supportedLanguages,
        fallbackLng: localesConfig.fallbackLanguage,
        lng: lang,
        /********/
        fallbackNS: localesConfig.defaultNamespace,
        defaultNS: localesConfig.defaultNamespace,
        ns: namespace,
        returnNull: localesConfig.returnNull,
        returnEmptyString: localesConfig.returnEmptyString,
    };
}

export function getCurrentLang(lang?: string): LangOption {
    const fallbackLang =
        localesConfig.options.find((l) => l.value === localesConfig.fallbackLanguage) ?? localesConfig.options[0];

    if (!lang) {
        return fallbackLang;
    }

    return localesConfig.options.find((l) => l.value === lang) ?? fallbackLang;
}

export interface LocaleConfigValue {
    supportedLanguages: string[];
    fallbackLanguage: string;
    defaultNamespace: string;
    returnNull: boolean;
    returnEmptyString: boolean;
    storage: {
        cookie: {
            key: string;
            autoDetection: boolean;
        };
        localStorage: {
            key: string;
            autoDetection: boolean;
        };
    };
    options: LangOption[];
}
