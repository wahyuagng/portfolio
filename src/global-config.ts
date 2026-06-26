import { AuthMethodEnum } from '@auth/enums';
import { EnvironmentEnum } from '@common/enums/environment.enum';

import { paths } from 'src/routes/paths';

import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
    appName: string;
    appPort: number | null;
    appVersion: string;
    appEnvironment: EnvironmentEnum;
    serverUrl: string;
    assetsDir: string;
    auth: {
        methods: Array<AuthMethodEnum>;
        defaultMethod: AuthMethodEnum;
        skip: boolean;
        redirectPath: string;
    };
    mapboxApiKey: string;
    amplify: { userPoolId: string; userPoolWebClientId: string; region: string };
    auth0: { clientId: string; domain: string; callbackUrl: string };
    supabase: { url: string; key: string };
    oidc: { authority: string; clientId: string; redirectUrl: string; logout: string };
    google: { recaptcha: { key: string } };
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
    appName: import.meta.env.VITE_APP_NAME ?? 'React Boilerplate Minimals UI',
    appPort: import.meta.env.VITE_APP_PORT ?? '8080',
    appVersion: packageJson.version,
    appEnvironment: import.meta.env.VITE_APP_ENVIRONMENT ?? EnvironmentEnum.DEVELOPMENT,
    serverUrl: import.meta.env.VITE_SERVER_URL ?? '',
    assetsDir: import.meta.env.VITE_ASSETS_DIR ?? '',
    auth: {
        methods: [AuthMethodEnum.JWT, AuthMethodEnum.OIDC],
        defaultMethod: AuthMethodEnum.JWT,
        skip: false,
        redirectPath: paths.display,
    },
    /**
     * Oidc
     */
    oidc: {
        authority: import.meta.env.VITE_OIDC_AUTHORITY ?? '',
        clientId: import.meta.env.VITE_OIDC_CLIENT_ID ?? '',
        redirectUrl: import.meta.env.VITE_OIDC_REDIRECT_URI ?? '',
        logout: import.meta.env.VITE_OIDC_LOGOUT ?? '',
    },
    /**
     * Mapbox
     */
    mapboxApiKey: import.meta.env.VITE_MAPBOX_API_KEY ?? '',
    /**
     * Amplify
     */
    amplify: {
        userPoolId: import.meta.env.VITE_AWS_AMPLIFY_USER_POOL_ID ?? '',
        userPoolWebClientId: import.meta.env.VITE_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID ?? '',
        region: import.meta.env.VITE_AWS_AMPLIFY_REGION ?? '',
    },
    /**
     * Auth0
     */
    auth0: {
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID ?? '',
        domain: import.meta.env.VITE_AUTH0_DOMAIN ?? '',
        callbackUrl: import.meta.env.VITE_AUTH0_CALLBACK_URL ?? '',
    },
    /**
     * Supabase
     */
    supabase: {
        url: import.meta.env.VITE_SUPABASE_URL ?? '',
        key: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
    },
    /**
     * Google
     */
    google: {
        /**
         * Recaptcha V3
         */
        recaptcha: {
            key: import.meta.env.VITE_GOOGLE_RECAPTCHA_KEY ?? '',
        },
    },
};
