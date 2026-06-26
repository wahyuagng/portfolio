import { useMemo } from 'react';

import { AuthContext } from './auth-context';

type Props = { children: React.ReactNode };

export function AuthProvider({ children }: Props) {
    const memoizedValue = useMemo(
        () => ({
            user: null,
            profile: null,
            loading: false,
            authenticated: false,
            unauthenticated: true,
            checkUserSession: async () => {},
            setProfile: () => {},
            updateProfile: async () => {},
        }),
        []
    );

    return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
