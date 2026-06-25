import type { AuthProviderProps } from 'react-oidc-context';

import { WebStorageStateStore } from 'oidc-client-ts';

import { CONFIG } from '../../../global-config';

const isBrowser = typeof window !== 'undefined';

export const getOidcConfig = (): AuthProviderProps => {
    if (!isBrowser) return {} as AuthProviderProps;

    return {
        authority: CONFIG.oidc.authority,
        client_id: CONFIG.oidc.clientId,
        redirect_uri: CONFIG.oidc.redirectUrl,
        post_logout_redirect_uri: CONFIG.oidc.logout,
        silent_redirect_uri: `${window.location.origin}/auth/oidc/silent-renew`, // 👈 safe window.location usage
        response_type: 'code',
        scope: 'openid profile email api.auth user.role user.read user.readAll position.read position.readAll unit.read unit.readAll',

        monitorSession: true,
        revokeTokensOnSignout: true,
        automaticSilentRenew: true,
        loadUserInfo: true,

        userStore: new WebStorageStateStore({ store: window.localStorage }),

        onSigninCallback: () => {
            const redirect = sessionStorage.getItem('postLoginRedirect') || '/';
            window.history.replaceState({}, '', redirect);
        },
    };
};
