import type { Profile, AuthState, UserInfoType, AuthContextValue } from '@auth/types';

import { Amplify } from 'aws-amplify';
import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';
import { RoleEnum, RoleLabels } from '@common/enums/role.enum';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';

import { CONFIG } from 'src/global-config';

import { AuthContext } from '../auth-context';

// ----------------------------------------------------------------------

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: CONFIG.amplify.userPoolId,
            userPoolClientId: CONFIG.amplify.userPoolWebClientId,
        },
    },
});

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
            const session = await fetchAuthSession({ forceRefresh: true });
            const tokens = session.tokens;

            if (tokens) {
                const attrs = await fetchUserAttributes();

                const role = (attrs['custom:role'] as RoleEnum) ?? RoleEnum.USER;

                const user: UserInfoType = {
                    id: attrs.sub,
                    displayName: attrs.given_name && attrs.family_name ? `${attrs.given_name} ${attrs.family_name}` : (attrs.name ?? ''),
                    email: attrs.email,
                    photoURL: attrs.picture,
                    phoneNumber: attrs.phone_number,
                    country: attrs['custom:country'],
                    address: attrs.address,
                    state: attrs['custom:state'],
                    city: attrs['custom:city'],
                    zipCode: attrs['custom:zipCode'],
                    about: attrs['custom:about'],
                    isPublic: attrs['custom:isPublic'] === 'true',
                    isVerified: attrs.email_verified === 'true',
                    role,
                    roleLabel: RoleLabels[role],
                    accessToken: tokens.accessToken?.toString(),
                    permissions: attrs['custom:permissions']?.split(',') ?? [],
                };

                setState({ user, loading: false });

                // Load profile dari localStorage
                const savedProfile = localStorage.getItem('userProfile');
                if (savedProfile) {
                    try {
                        setState({ profile: JSON.parse(savedProfile) });
                    } catch (error) {
                        console.error('Failed to parse profile:', error);
                    }
                }

                // Optional: Fetch profile dari API jika ada endpoint
                // try {
                //     const profileData = await getProfile(tokens.accessToken?.toString(), 'cognito');
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
    }, []);

    const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
    const status = state.loading ? 'loading' : checkAuthenticated;

    const memoizedValue: AuthContextValue = useMemo(
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
