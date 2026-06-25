import type { SettingsState } from '@components/settings/types';

import { themeConfig } from '@theme/theme-config';

import { CONFIG } from '../../global-config';

// ----------------------------------------------------------------------

export const SETTINGS_STORAGE_KEY: string = 'app-settings';
export const SETTING_VISIBLE = true;

export const layoutConfig: SettingsState = {
    mode: themeConfig.defaultMode,
    direction: themeConfig.direction,
    contrast: 'default',
    navLayout: 'vertical',
    primaryColor: 'preset3',
    navColor: 'integrate',
    compactLayout: false,
    fontSize: 16,
    fontFamily: themeConfig.fontFamily.primary,
    version: CONFIG.appVersion,
};
