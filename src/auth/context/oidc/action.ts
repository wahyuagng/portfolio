import { useAuth } from 'react-oidc-context';
import { AuthInfo } from '@auth/utils/auth-info';

// ----------------------------------------------------------------------

export const useOidcActions = () => {
    const oidc = useAuth();

    const signIn = () => {
        try {
            sessionStorage.setItem('postLoginRedirect', window.location.pathname);
            oidc.signinRedirect();
        } catch (error) {
            console.error('OIDC sign-in error:', error);
            throw error;
        }
    };

    const clearSession = () => {
        try {
            sessionStorage.removeItem('postLoginRedirect');
            AuthInfo.clear();
        } catch (error) {
            console.error('Error clearing OIDC session:', error);
        }
    };

    const signOut = async () => {
        try {
            clearSession();
            await oidc.signoutRedirect();
        } catch (error) {
            console.error('OIDC sign-out error:', error);
            throw error;
        }
    };

    return {
        signIn,
        signOut,
        clearSession,
    };
};
