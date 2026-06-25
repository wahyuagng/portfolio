import axios from 'axios';
import { AuthMethodEnum } from '@auth/enums';
import { AuthInfo } from '@auth/utils/auth-info';
import { ClientInfo } from '@auth/utils/client-info';

import { paths } from 'src/routes/paths';

import { CONFIG } from '../../../global-config';

// ----------------------------------------------------------------------

export function jwtDecode(token: string) {
    try {
        if (!token) return null;

        const parts = token.split('.');
        if (parts.length < 2) {
            throw new Error('Invalid token!');
        }

        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch (error) {
        console.error('Error decoding token:', error);
        throw error;
    }
}

// ----------------------------------------------------------------------

export function isValidToken(accessToken: string) {
    if (!accessToken) {
        return false;
    }

    try {
        const decoded = jwtDecode(accessToken);

        if (!decoded || !('exp' in decoded)) {
            return false;
        }

        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (error) {
        console.error('Error during token validation:', error);
        return false;
    }
}

// ----------------------------------------------------------------------

export function tokenExpired(exp: number) {
    const currentTime = Date.now();
    const timeLeft = exp * 1000 - currentTime;

    setTimeout(() => {
        try {
            alert('Token expired!');
            window.location.href = paths.auth.jwt.signIn;
        } catch (error) {
            console.error('Error during token expiration:', error);
            throw error;
        }
    }, timeLeft);
}

// ----------------------------------------------------------------------

export async function setSession(accessToken: string) {
    try {
        if (accessToken) {
            AuthInfo.set({ method: AuthMethodEnum.JWT, token: accessToken });
            const decodedToken = jwtDecode(accessToken); // ~3 days by minimals server

            if (decodedToken && 'exp' in decodedToken) {
                tokenExpired(decodedToken.exp);
            } else {
                throw new Error('Invalid access token!');
            }
        }
    } catch (error) {
        console.error('Error during set session:', error);
        throw error;
    }
}

// ----------------------------------------------------------------------

export async function getProfile(accessToken: string, method: any) {
    const clientInfo = ClientInfo.get();
    if (clientInfo) {
        const profile = await axios.get(`${import.meta.env.VITE_API_URL}/account/profile`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'X-Client-Key': import.meta.env.VITE_API_CLIENT_KEY,
                'X-Client-Secret': import.meta.env.VITE_API_CLIENT_SECRET,
                'X-Identity-Method': method,
                'X-Culture-Info': clientInfo.culture,
                'X-Device-Identifier': clientInfo.browserId,
                'X-Device-OsType': clientInfo.osType,
                'X-Device-OsVersion': clientInfo.osVersion,
                'X-Device-PlayerId': clientInfo.browserId,
                'X-Device-AppVersion': CONFIG.appVersion,
                'X-Device-Timezone': clientInfo.timezone,
            },
        });

        return profile.data.Data;
    }

    return null;
}
