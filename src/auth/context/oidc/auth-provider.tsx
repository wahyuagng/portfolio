import type { AuthProviderProps } from 'react-oidc-context';
import type { Profile, UserInfoType, AuthContextValue } from '@auth/types';

import { getProfile } from '@auth/context/jwt';
import { AuthInfo } from '@auth/utils/auth-info';
import { AuthContext } from '@auth/context/auth-context';
import { getOidcConfig } from '@auth/context/oidc/config';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useAuth, AuthProvider as OidcContextProvider } from 'react-oidc-context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<AuthProviderProps | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setConfig(getOidcConfig());
        }
    }, []);

    if (!config) return null;

    return (
        <OidcContextProvider {...config}>
            <OidcInnerProvider>{children}</OidcInnerProvider>
        </OidcContextProvider>
    );
}

function OidcInnerProvider({ children }: { children: React.ReactNode }) {
    const auth = useAuth();
    const [profile, setProfileState] = useState<Profile | null>(null);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const checkUserSession = useCallback(async () => {
        try {
            const result = await auth.signinSilent();
        } catch (error) {
            console.error('[OIDC] Silent sign-in failed:', error);
        }
    }, [auth]);

    const revokeSession = useCallback(async () => {
        try {
            await auth.signoutRedirect();
            localStorage.removeItem('userProfile');
            setProfileState(null);
            setProfileError(null);
            setInitialized(false);
            AuthInfo.clear();
        } catch (error) {
            console.error('[OIDC] Sign-out failed:', error);
        }
    }, [auth]);

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

    useEffect(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                setProfileState(parsed);
            } catch (error) {
                console.error('Failed to parse saved profile:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (!auth.isAuthenticated || !auth.user?.access_token) {
            return;
        }

        if (initialized) {
            return;
        }

        const method = AuthInfo.getMethod();

        setProfileLoading(true);

        getProfile(auth.user.access_token, method)
            .then((profileData) => {
                if (!profileData) {
                    setProfileError('USER_NOT_FOUND');
                    return;
                }

                if (!profileData?.Role) {
                    setProfileState(profileData);
                    setProfileError('ROLE_NOT_ASSIGNED');
                    return;
                }

                AuthInfo.set({
                    method: method!,
                    token: auth.user!.access_token,
                });

                setProfileState(profileData);
                localStorage.setItem('userProfile', JSON.stringify(profileData));
                setProfileError(null);
            })
            .catch((error) => {
                if (error?.response?.status === 404) {
                    setProfileError('USER_NOT_FOUND');
                } else if (error?.response?.status === 403) {
                    setProfileError('ACCESS_FORBIDDEN');
                } else {
                    setProfileError('FAILED_TO_FETCH_PROFILE');
                }
            })
            .finally(() => {
                setProfileLoading(false);
                setInitialized(true);
            });
    }, [auth.isAuthenticated, auth.user?.access_token, initialized]);

    const value: AuthContextValue = useMemo(() => {
        let user: UserInfoType | null = null;

        const isAuthenticated = auth.isAuthenticated;

        if (isAuthenticated && profile && !profileError) {
            user = {
                displayName: profile.Name,
                email: profile.Email,
                role: profile.Role,
                accessToken: AuthInfo.getToken() ?? undefined,
                permissions: profile.Permissions ?? [],
            };
        }

        return {
            user,
            profile,
            profileError,
            setProfile,
            setProfileError,
            updateProfile,
            checkUserSession,
            revokeSession,
            loading: auth.isLoading || profileLoading || (isAuthenticated && !profile && !profileError),
            authenticated: isAuthenticated && !profileError,
            unauthenticated: !auth.isAuthenticated && !auth.isLoading && !profileLoading,
        };
    }, [auth.isAuthenticated, auth.isLoading, profile, profileError, profileLoading]);

    return <AuthContext value={value}>{children}</AuthContext>;
}
