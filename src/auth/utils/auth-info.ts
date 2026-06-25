import type { Session } from '@auth/types';
import type { AuthMethodEnum } from '@auth/enums';

import { AUTH_INFO_KEY } from '@auth/constant';

import { CONFIG } from '../../global-config';

export class AuthInfo {
    /**
     * Save session data to localStorage
     */
    static set(data: Session): void {
        try {
            localStorage.setItem(AUTH_INFO_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to set session data:', error);
        }
    }

    /**
     * Get session data from localStorage
     */
    static get(): Session | null {
        try {
            const raw = localStorage.getItem(AUTH_INFO_KEY);
            return raw ? (JSON.parse(raw) as Session) : null;
        } catch (error) {
            console.error('Failed to parse session data:', error);
            return null;
        }
    }

    /**
     * Remove session data from localStorage
     */
    static clear(): void {
        try {
            localStorage.removeItem(AUTH_INFO_KEY);
        } catch (error) {
            console.error('Failed to clear session data:', error);
        }
    }

    /**
     * Get auth method only
     */
    static getMethod(): AuthMethodEnum | null {
        return this.get()?.method ?? CONFIG.auth.defaultMethod;
    }

    /**
     * Get token only
     */
    static getToken(): string | null {
        return this.get()?.token ?? null;
    }
}
