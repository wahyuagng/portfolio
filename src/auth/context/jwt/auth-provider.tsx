import type { Profile, AuthState, AuthContextValue } from '@auth/types';

import { AuthInfo } from '@auth/utils/auth-info';
import { useSetState } from 'minimal-shared/hooks';
import { RoleEnum } from '@common/enums/role.enum';
import { useMemo, useEffect, useCallback } from 'react';
import { AuthContext } from '@auth/context/auth-context';
import { getProfile, isValidToken } from '@auth/context/jwt/utils';

// ----------------------------------------------------------------------

type Props = {
    children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
    const { state, setState } = useSetState<AuthState>({
        user: null,
        profile: null,
        loading: true,
    });

    const checkUserSession = useCallback(async () => {
        try {
            const accessToken = AuthInfo.getToken();

            if (accessToken && isValidToken(accessToken)) {
                // TODO: fetch actual user data if needed
                setState({
                    user: { displayName: 'default', email: 'email@email.com', accessToken, permissions: [] },
                    loading: false,
                });

                const savedProfile = localStorage.getItem('userProfile');
                if (savedProfile) {
                    try {
                        setState({ profile: JSON.parse(savedProfile) });
                    } catch (error) {
                        console.error('Failed to parse profile:', error);
                    }
                }

                try {
                    const profileData = await getProfile(accessToken, 'App');
                    setState({ profile: profileData });
                    localStorage.setItem('userProfile', JSON.stringify(profileData));
                } catch (error) {
                    console.error('Failed to fetch profile:', error);
                }
            } else {
                setState({ user: null, loading: false });
            }
        } catch (error) {
            console.error('[JWT] checkUserSession failed:', error);
            setState({ user: null, loading: false });
        }
    }, [setState]);

    const revokeSession = useCallback(async () => {
        try {
            AuthInfo.clear();
            localStorage.removeItem('userProfile');
            setState({ user: null });
        } catch (error) {
            console.error('[JWT] revokeSession failed:', error);
        }
    }, [setState]);

    const setProfile = useCallback(
        (profile: Profile | null) => {
            setState({ profile });
            if (profile) {
                localStorage.setItem('userProfile', JSON.stringify(profile));
            } else {
                localStorage.removeItem('userProfile');
            }
        },
        [setState]
    );

    const updateProfile = useCallback(
        (data: Partial<Profile>) => {
            const currentProfile = state.profile;
            if (!currentProfile) return;

            const updated = { ...currentProfile, ...data };
            localStorage.setItem('userProfile', JSON.stringify(updated));
            setState({ profile: updated });
        },
        [setState, state.profile]
    );

    useEffect(() => {
        checkUserSession();
    }, [checkUserSession]);

    const status = state.loading ? 'loading' : state.user ? 'authenticated' : 'unauthenticated';

    const memoizedValue: AuthContextValue = useMemo(
        () => ({
            user: state.user ? { ...state.user, role: state.user.role ?? RoleEnum.USER } : null,
            profile: state.profile,
            setProfile,
            updateProfile,
            checkUserSession,
            revokeSession,
            loading: status === 'loading',
            authenticated: status === 'authenticated',
            unauthenticated: status === 'unauthenticated',
        }),
        [state.user, state.profile, status, setProfile, updateProfile, checkUserSession, revokeSession]
    );

    return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
