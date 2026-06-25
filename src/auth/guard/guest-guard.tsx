// src/auth/guard/guest-guard.tsx

import { Outlet } from 'react-router';
import { paths } from '@routes/paths';
import { useState, useEffect } from 'react';
import { useAuthContext } from '@auth/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { SplashScreen } from 'src/components/loading-screen';

export function GuestGuard() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const returnTo = searchParams.get('returnTo') ?? CONFIG.auth.redirectPath;

    const { loading, authenticated, user, profile, revokeUserSession } = useAuthContext();
    const [isChecking, setIsChecking] = useState(true);
    const [showNoRoleMessage, setShowNoRoleMessage] = useState(false);

    const checkPermissions = async (): Promise<void> => {
        if (loading) return;

        // Path khusus (MFA, OIDC callback) -> bypass
        if (pathname === paths.auth.jwt.verify_login || pathname === paths.auth.jwt.recovery_login || pathname === paths.auth.oidc.signIn) {
            setIsChecking(false);
            return;
        }

        // Sudah authenticated (user + profile + role) -> redirect ke dashboard
        if (authenticated) {
            router.replace(returnTo);
            return;
        }

        // Ada user tapi tidak authenticated -> berarti Role kosong
        if (user && !authenticated && profile !== null) {
            console.warn('[GuestGuard] User has no role:', profile);
            setShowNoRoleMessage(true);
        }

        setIsChecking(false);
    };

    useEffect(() => {
        checkPermissions();
    }, [authenticated, loading, pathname, user, profile]);

    if (isChecking) {
        return <SplashScreen />;
    }

    // Tampilkan pesan "No Role"
    if (showNoRoleMessage) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    gap: 3,
                    px: 3,
                    maxWidth: 500,
                    mx: 'auto',
                }}
            >
                <Alert severity="warning" sx={{ width: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                        Role Belum Ditentukan
                    </Typography>
                    <Typography variant="body2">
                        Akun Anda berhasil terautentikasi, tetapi belum memiliki role yang ditetapkan.
                        <strong> Silakan hubungi administrator untuk mengatur role Anda</strong> sebelum dapat mengakses aplikasi.
                    </Typography>
                </Alert>

                <Box sx={{ textAlign: 'center', width: '100%' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Login sebagai: <strong>{user?.email || user?.displayName || 'Unknown'}</strong>
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={async () => {
                        try {
                            if (revokeUserSession) {
                                await revokeUserSession();
                            }
                            setShowNoRoleMessage(false);
                            router.replace(paths.auth.jwt.signIn);
                        } catch (error) {
                            console.error('[GuestGuard] Logout error:', error);
                            router.replace(paths.auth.jwt.signIn);
                        }
                    }}
                >
                    Kembali ke Login
                </Button>
            </Box>
        );
    }

    return <Outlet />;
}
