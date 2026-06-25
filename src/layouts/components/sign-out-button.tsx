import type { ButtonProps } from '@mui/material/Button';

import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AuthInfo } from '@auth/utils/auth-info';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';
import { useOidcActions } from 'src/auth/context/oidc/action';
import { signOut as jwtSignOut } from 'src/auth/context/jwt/action';
import { signOut as amplifySignOut } from 'src/auth/context/amplify/action';
import { signOut as supabaseSignOut } from 'src/auth/context/supabase/action';
import { signOut as firebaseSignOut } from 'src/auth/context/firebase/action';

import { useTranslate } from '../../locales';

// ----------------------------------------------------------------------

type Props = ButtonProps & {
    onClose?: () => void;
};

export function SignOutButton({ onClose, sx, ...other }: Props) {
    const router = useRouter();
    const { checkUserSession } = useAuthContext();
    const { logout: auth0Logout } = useAuth0();
    const { signOut: oidcSignOut } = useOidcActions();
    const { t } = useTranslate();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
        const method = AuthInfo.getMethod();

        if (method === 'Idaman') {
            setAnchorEl(event.currentTarget); // munculkan popover
            return;
        }

        proceedLogout(method ?? 'jwt');
    };

    const proceedLogout = async (method: string) => {
        try {
            switch (method) {
                case 'firebase':
                    await firebaseSignOut();
                    break;
                case 'supabase':
                    await supabaseSignOut();
                    break;
                case 'amplify':
                    await amplifySignOut();
                    break;
                case 'auth0':
                    await auth0Logout();
                    return;
                case 'Idaman':
                case 'oidc':
                    await oidcSignOut();
                    return;
                case 'jwt':
                default:
                    await jwtSignOut();
                    break;
            }

            AuthInfo.clear();
            await checkUserSession?.();
            onClose?.();
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Unable to logout!');
        }
    };

    return (
        <>
            <Button fullWidth variant="soft" size="large" color="error" onClick={handleLogout} sx={sx} {...other}>
                {t('navbar:account.logout')}
            </Button>

            <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} transformOrigin={{ vertical: 'bottom', horizontal: 'left' }} PaperProps={{ sx: { p: 2, width: 260, mb: 3 } }}>
                <Typography variant="subtitle2" sx={{ mb: 3 }} gutterBottom>
                    Are you sure you want to log out?
                </Typography>
                <Stack spacing={2}>
                    <Button
                        fullWidth
                        onClick={() => {
                            AuthInfo.clear();
                            checkUserSession?.();
                            onClose?.();
                            router.refresh();
                            setAnchorEl(null);
                        }}
                        color="info"
                        variant="outlined"
                    >
                        Exit App
                    </Button>

                    <Button
                        fullWidth
                        color="error"
                        variant="outlined"
                        onClick={() => {
                            setAnchorEl(null);
                            proceedLogout('oidc');
                        }}
                    >
                        Logout IdAMan
                    </Button>
                </Stack>
            </Popover>
        </>
    );
}
