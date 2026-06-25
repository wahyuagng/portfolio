import type { Profile, AuthState } from '@auth/types';

import { useSetState } from 'minimal-shared/hooks';
import { supabase } from '@services/auth/supabase';
import { useMemo, useEffect, useCallback } from 'react';
import { AuthContext } from '@auth/context/auth-context';

type Props = {
    children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
    const { state, setState } = useSetState<AuthState>({
        user: null,
        profile: null, // tambahkan
        loading: true,
    });

    const checkUserSession = useCallback(async () => {
        try {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error) {
                console.error(error);
                setState({ user: null, profile: null, loading: false });
                return;
            }

            if (session?.user) {
                const accessToken = session.access_token;
                const user = session.user;

                const permissions: string[] = user.app_metadata?.permissions || [];

                const enrichedUser = {
                    id: user.id,
                    email: user.email,
                    isVerified: user.email_confirmed_at != null,
                    displayName: user.user_metadata?.display_name || '',
                    accessToken,
                    permissions,
                    // optional fallback role
                    role: user.app_metadata?.role || 'admin',
                };

                setState({ user: enrichedUser, loading: false });

                // Load profile dari localStorage
                const savedProfile = localStorage.getItem('userProfile');
                if (savedProfile) {
                    try {
                        setState({ profile: JSON.parse(savedProfile) });
                    } catch (errorSave) {
                        console.error('Failed to parse profile:', errorSave);
                    }
                }

                // Optional: Fetch profile dari API jika ada
                // try {
                //     const profileData = await getProfile(accessToken, 'supabase');
                //     setState({ profile: profileData });
                //     localStorage.setItem('userProfile', JSON.stringify(profileData));
                // } catch (error) {
                //     console.error('Failed to fetch profile:', error);
                // }
            } else {
                setState({ user: null, profile: null, loading: false });
            }
        } catch (error) {
            console.error(error);
            setState({ user: null, profile: null, loading: false });
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

    const memoizedValue = useMemo(
        () => ({
            user: state.user,
            profile: state.profile,
            setProfile,
            updateProfile,
            checkUserSession,
            loading: status === 'loading',
            authenticated: status === 'authenticated',
            unauthenticated: status === 'unauthenticated',
        }),
        [checkUserSession, state.user, state.profile, setProfile, updateProfile, status]
    );

    return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
