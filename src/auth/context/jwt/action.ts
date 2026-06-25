import { AuthInfo } from '@auth/utils/auth-info';
import { setSession } from '@auth/context/jwt/utils';

import axios, { endpoints } from '../../../services/axios';

// ----------------------------------------------------------------------

export type SignInParams = {
    email: string;
    password: string;
    recaptchaToken: string;
};

export type SignUpParams = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password, recaptchaToken }: SignInParams): Promise<void> => {
    try {
        const params = { email, password, recaptchaToken };

        const res = await axios.post(endpoints.auth.signIn, params);

        const { accessToken } = res.data;

        if (!accessToken) {
            throw new Error('Access token not found in response');
        }

        await setSession(accessToken);
    } catch (error) {
        console.error('Error during sign in:', error);
        throw error;
    }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password, firstName, lastName }: SignUpParams): Promise<void> => {
    const params = {
        email,
        password,
        firstName,
        lastName,
    };

    try {
        const res = await axios.post(endpoints.auth.signUp, params);

        const { accessToken } = res.data;

        if (!accessToken) {
            throw new Error('Access token not found in response');
        }

        await setSession(accessToken);
    } catch (error) {
        console.error('Error during sign up:', error);
        throw error;
    }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
    try {
        AuthInfo.clear();
    } catch (error) {
        console.error('Error during sign out:', error);
        throw error;
    }
};
