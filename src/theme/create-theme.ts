import type { Theme, Shadows, Components } from '@mui/material/styles';
import type { ThemeOptions } from './types';
import type { SettingsState } from 'src/components/settings';

import { createTheme as createMuiTheme } from '@mui/material/styles';

import { mixins } from './core/mixins';
import { opacity } from './core/opacity';
import { shadows } from './core/shadows';
import { palette } from './core/palette';
import { themeConfig } from './theme-config';
import { components } from './core/components';
import { typography } from './core/typography';
import { customShadows } from './core/custom-shadows';
import { applySettingsToTheme, applySettingsToComponents } from './with-settings';

// ----------------------------------------------------------------------

export const baseTheme: ThemeOptions = {
    colorSchemes: {
        light: {
            palette: palette.light,
            shadows: shadows.light,
            customShadows: customShadows.light,
            opacity,
        },
        dark: {
            palette: palette.dark,
            shadows: shadows.dark,
            customShadows: customShadows.dark,
            opacity,
        },
    },
    mixins,
    components,
    typography,
    shape: { borderRadius: 8 },
    direction: themeConfig.direction,
    cssVariables: themeConfig.cssVariables,
};

// ----------------------------------------------------------------------

type CreateThemeProps = {
    settingsState?: SettingsState;
    themeOverrides?: ThemeOptions;
    localeComponents?: { components?: Components<Theme> };
};

export function createTheme({
    settingsState,
    themeOverrides = {},
    localeComponents = {},
}: CreateThemeProps = {}): Theme {
    const updatedCore = settingsState ? applySettingsToTheme(baseTheme, settingsState) : baseTheme;

    if (updatedCore && updatedCore.colorSchemes) {
        const mode = settingsState?.mode || 'light';

        const activeScheme = updatedCore.colorSchemes[mode];

        const themeOptions: ThemeOptions = {
            ...updatedCore,
            palette: activeScheme?.palette,
            shadows: activeScheme?.shadows as Shadows,
            customShadows: activeScheme?.customShadows,
        };

        const updatedComponents = settingsState ? applySettingsToComponents(settingsState) : {};

        return createMuiTheme(themeOptions, updatedComponents, localeComponents, themeOverrides);
    }

    return createMuiTheme(baseTheme);
}
