import type { Profile, AuthState, UserInfoType, AuthContextValue } from '@auth/types';

import { doc, getDoc } from 'firebase/firestore';
import { useSetState } from 'minimal-shared/hooks';
import { RoleEnum } from '@common/enums/role.enum';
import { useMemo, useEffect, useCallback } from 'react';
import { AUTH, FIRESTORE } from '@services/auth/firebase';
import { getIdTokenResult, onAuthStateChanged } from 'firebase/auth';

import { AuthContext } from '../auth-context';

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
            onAuthStateChanged(AUTH, async (user) => {
                if (user && user.emailVerified) {
                    // Get profile from Firestore
                    const userProfile = doc(FIRESTORE, 'users', user.uid);
                    const docSnap = await getDoc(userProfile);
                    const profileData = docSnap.data() ?? {};

                    // Get custom claims from token
                    const tokenResult = await getIdTokenResult(user);
                    const claims = tokenResult.claims || {};

                    const permissions = Array.isArray(claims.permissions) ? claims.permissions : [];

                    const enrichedUser: UserInfoType = {
                        id: user.uid,
                        displayName: user.displayName ?? undefined,
                        email: user.email ?? undefined,
                        photoURL: user.photoURL ?? undefined,
                        role: profileData.role ?? RoleEnum.USER,
                        isVerified: user.emailVerified,
                        accessToken: tokenResult.token,
                        permissions,
                    };

                    setState({ user: enrichedUser, loading: false });

                    // Load profile dari localStorage
                    const savedProfile = localStorage.getItem('userProfile');
                    if (savedProfile) {
                        try {
                            setState({ profile: JSON.parse(savedProfile) });
                        } catch (error) {
                            console.error('Failed to parse profile:', error);
                        }
                    }

                    // Optional: Fetch profile dari API jika ada
                    // try {
                    //     const profileData = await getProfile(tokenResult.token, 'firebase');
                    //     setState({ profile: profileData });
                    //     localStorage.setItem('userProfile', JSON.stringify(profileData));
                    // } catch (error) {
                    //     console.error('Failed to fetch profile:', error);
                    // }
                } else {
                    setState({ user: null, profile: null, loading: false });
                }
            });
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
    const status = state.loading ? 'loading' : checkAuthenticated;

    const memoizedValue: AuthContextValue = useMemo(
        () => ({
            user: state.user
                ? {
                      ...state.user,
                      id: state.user?.id,
                      accessToken: state.user?.accessToken,
                      displayName: state.user?.displayName,
                      photoURL: state.user?.photoURL,
                      role: state.user?.role ?? RoleEnum.USER,
                  }
                : null,
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
