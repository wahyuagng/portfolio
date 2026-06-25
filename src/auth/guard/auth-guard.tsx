import { paths } from '@routes/paths';
import { Outlet } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuthContext } from '@auth/hooks';
import { useRouter, usePathname } from '@routes/hooks';
import { SplashScreen } from '@components/loading-screen';

import { CONFIG } from '../../global-config';

const signInPaths = {
    jwt: paths.auth.jwt.signIn,
    oidc: paths.auth.oidc.signIn,
    auth0: paths.auth.auth0.signIn,
    amplify: paths.auth.amplify.signIn,
    firebase: paths.auth.firebase.signIn,
    supabase: paths.auth.supabase.signIn,
};

export function AuthGuard() {
    const router = useRouter();
    const pathname = usePathname();
    const { authenticated, loading } = useAuthContext();

    const [isChecking, setIsChecking] = useState(true);

    const returnTo = encodeURIComponent(pathname);
    const methods = CONFIG.auth.methods ?? [CONFIG.auth.defaultMethod];

    const signInFallback = signInPaths[methods[0] as keyof typeof signInPaths] || paths.auth.jwt.signIn;
    const redirectPath = `${signInFallback}?returnTo=${returnTo}`;

    useEffect(() => {
        if (!loading) {
            if (!authenticated) router.replace(redirectPath);
            else setIsChecking(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authenticated, loading]);

    if (isChecking) {
        return <SplashScreen />;
    }

    return <Outlet />;
}
