import type { AppState } from '@auth0/auth0-react';
import type { Profile, AuthContextValue } from '@auth/types';

import { AuthContext } from '@auth/context/auth-context';
import { useAuth0, Auth0Provider } from '@auth0/auth0-react';
import { RoleEnum, RoleLabels } from '@common/enums/role.enum';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

type Props = {
    children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
    const { domain, clientId, callbackUrl } = CONFIG.auth0;

    const onRedirectCallback = useCallback((appState?: AppState) => {
        window.location.replace(appState?.returnTo || window.location.pathname);
    }, []);

    if (!(domain && clientId && callbackUrl)) {
        return null;
    }

    return (
        <Auth0Provider domain={domain} clientId={clientId} authorizationParams={{ redirect_uri: callbackUrl }} onRedirectCallback={onRedirectCallback} cacheLocation="localstorage">
            <AuthProviderContainer>{children}</AuthProviderContainer>
        </Auth0Provider>
    );
}

// ----------------------------------------------------------------------

function AuthProviderContainer({ children }: Props) {
    const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [tokenPayload, setTokenPayload] = useState<any>(null);
    const [profile, setProfileState] = useState<Profile | null>(null);

    const getAccessToken = useCallback(async () => {
        try {
            if (isAuthenticated) {
                const token = await getAccessTokenSilently();
                setAccessToken(token);

                // decode token payload
                const payload = JSON.parse(atob(token.split('.')[1]));
                setTokenPayload(payload);

                // Load profile dari localStorage
                const savedProfile = localStorage.getItem('userProfile');
                if (savedProfile) {
                    try {
                        setProfileState(JSON.parse(savedProfile));
                    } catch (error) {
                        console.error('Failed to parse profile:', error);
                    }
                }

                // Optional: Fetch profile dari API jika ada
                // try {
                //     const profileData = await getProfile(token, 'auth0');
                //     setProfileState(profileData);
                //     localStorage.setItem('userProfile', JSON.stringify(profileData));
                // } catch (error) {
                //     console.error('Failed to fetch profile:', error);
                // }
            } else {
                setAccessToken(null);
                setTokenPayload(null);
                setProfileState(null);
            }
        } catch (error) {
            console.error(error);
        }
    }, [getAccessTokenSilently, isAuthenticated]);

    useEffect(() => {
        getAccessToken();
    }, [getAccessToken]);

    const setProfile = useCallback((profileData: Profile | null) => {
        setProfileState(profileData);
        if (profileData) {
            localStorage.setItem('userProfile', JSON.stringify(profileData));
        } else {
            localStorage.removeItem('userProfile');
        }
    }, []);

    const updateProfile = useCallback((data: Partial<Profile>) => {
        setProfileState((prev) => {
            if (!prev) return prev;
            const updated = { ...prev, ...data };
            localStorage.setItem('userProfile', JSON.stringify(updated));
            return updated;
        });
    }, []);

    // ----------------------------------------------------------------------

    const status = isLoading ? 'loading' : isAuthenticated ? 'authenticated' : 'unauthenticated';

    const memoizedValue: AuthContextValue = useMemo(() => {
        let mappedUser = null;

        if (user) {
            const role = (tokenPayload?.roles?.[0] ?? RoleEnum.USER) as RoleEnum;
            const permissions = tokenPayload?.permissions ?? [];

            mappedUser = {
                id: user.sub,
                displayName: user.name,
                email: user.email,
                photoURL: user.picture,
                phoneNumber: user.phone_number,
                accessToken: accessToken ?? undefined,
                role,
                roleLabel: RoleLabels[role],
                isVerified: user.email_verified ?? true,
                permissions: Array.isArray(permissions) ? permissions : [],
            };
        }

        return {
            user: mappedUser,
            profile,
            setProfile,
            updateProfile,
            loading: status === 'loading',
            authenticated: status === 'authenticated',
            unauthenticated: status === 'unauthenticated',
        };
    }, [accessToken, status, tokenPayload, user, profile, setProfile, updateProfile]);

    return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
