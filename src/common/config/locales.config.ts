import type { LocaleConfigValue } from '../../locales';

import { enUS as enUSDate, frFR as frFRDate, viVN as viVNDate, zhCN as zhCNDate } from '@mui/x-date-pickers/locales';
import {
    frFR as frFRCore,
    idID as idIDCore,
    viVN as viVNCore,
    zhCN as zhCNCore,
    arSA as arSACore,
} from '@mui/material/locale';
import {
    enUS as enUSDataGrid,
    frFR as frFRDataGrid,
    viVN as viVNDataGrid,
    zhCN as zhCNDataGrid,
    arSD as arSDDataGrid,
} from '@mui/x-data-grid/locales';

export const localesConfig: LocaleConfigValue = {
    supportedLanguages: ['en', 'id', 'fr', 'vi', 'cn', 'ar'],
    fallbackLanguage: 'en',
    defaultNamespace: 'common',
    returnNull: false,
    returnEmptyString: false,
    storage: {
        cookie: { key: 'i18next', autoDetection: false },
        localStorage: { key: 'language', autoDetection: true },
    },
    options: [
        {
            value: 'en',
            label: 'English',
            countryCode: 'GB',
            adapterLocale: 'en',
            numberFormat: { code: 'en-US', currency: 'USD' },
            systemValue: {
                components: { ...enUSDate.components, ...enUSDataGrid.components },
            },
        },
        {
            value: 'id',
            label: 'Indonesia',
            countryCode: 'ID',
            adapterLocale: 'id',
            numberFormat: { code: 'id-ID', currency: 'IDR' },
            systemValue: {
                components: { ...idIDCore.components },
            },
        },
        {
            value: 'fr',
            label: 'French',
            countryCode: 'FR',
            adapterLocale: 'fr',
            numberFormat: { code: 'fr-FR', currency: 'EUR' },
            systemValue: {
                components: { ...frFRCore.components, ...frFRDate.components, ...frFRDataGrid.components },
            },
        },
        {
            value: 'vi',
            label: 'Vietnamese',
            countryCode: 'VN',
            adapterLocale: 'vi',
            numberFormat: { code: 'vi-VN', currency: 'VND' },
            systemValue: {
                components: { ...viVNCore.components, ...viVNDate.components, ...viVNDataGrid.components },
            },
        },
        {
            value: 'cn',
            label: 'Chinese',
            countryCode: 'CN',
            adapterLocale: 'zh-cn',
            numberFormat: { code: 'zh-CN', currency: 'CNY' },
            systemValue: {
                components: { ...zhCNCore.components, ...zhCNDate.components, ...zhCNDataGrid.components },
            },
        },
        {
            value: 'ar',
            label: 'Arabic',
            countryCode: 'SA',
            adapterLocale: 'ar-sa',
            numberFormat: { code: 'ar-SA', currency: 'SAR' },
            systemValue: {
                components: { ...arSACore.components, ...arSDDataGrid.components },
            },
        },
    ],
};
