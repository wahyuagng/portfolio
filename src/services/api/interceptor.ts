import type { AxiosInstance } from 'axios';

import axios, { AxiosHeaders } from 'axios';
import { AuthMethodEnum } from '@auth/enums';
import { AuthInfo } from '@auth/utils/auth-info';
import { CONFIG_API } from '@services/api/config';
import { ClientInfo } from '@auth/utils/client-info';
import { generateHmacSignature } from '@services/util';
import { localesConfig } from '@common/config/locales.config';

import { CONFIG } from '../../global-config';
import { getCurrentLang } from '../../locales';

let axiosInstance: AxiosInstance | undefined;

export const getAxiosInstance = (enableHmac: boolean = false): AxiosInstance => {
    if (typeof window === 'undefined') {
        throw new Error('Axios instance can only be used in browser environment');
    }

    if (axiosInstance) return axiosInstance;

    axiosInstance = axios.create({
        baseURL: CONFIG_API.baseUrl,
    });

    axiosInstance.interceptors.request.use(async (config) => {
        const token = AuthInfo.getToken();
        const clientInfo = ClientInfo.get();

        const headers = new AxiosHeaders();
        const timestamp = new Date().toISOString();

        // headers.set('Content-Type', 'application/json');
        headers.set(CONFIG_API.headerKeys.clientKey, CONFIG_API.clientKey);
        headers.set(CONFIG_API.headerKeys.clientSecret, CONFIG_API.clientSecret);
        headers.set('X-Identity-Method', AuthInfo.getMethod() == AuthMethodEnum.OIDC ? 'Idaman' : 'App');

        if (clientInfo) {
            headers.set('X-Culture-Info', clientInfo.culture);
            headers.set('X-Device-Identifier', clientInfo.browserId ?? '');
            headers.set('X-Device-OsType', clientInfo.osType ?? '');
            headers.set('X-Device-OsVersion', clientInfo.osVersion ?? '');
            headers.set('X-Device-PlayerId', clientInfo.browserId ?? '');
            headers.set('X-Device-AppVersion', CONFIG.appVersion);
            headers.set('X-Device-Timezone', clientInfo.timezone);
        }

        headers.set('X-Device-Language', getCurrentLang().value ?? localesConfig.fallbackLanguage);
        headers.set(CONFIG_API.headerKeys.timestamp, timestamp);

        if (enableHmac) {
            const secret = CONFIG_API.clientSecret;
            const method = config.method?.toUpperCase();
            let rawPayload: any = '';

            if (method === 'GET' || method === 'DELETE') {
                rawPayload = config.params || {};
            } else {
                rawPayload = config.data || {};
            }

            const message = JSON.stringify(rawPayload) + timestamp;
            const signature = await generateHmacSignature(secret, message);
            headers.set(CONFIG_API.headerKeys.signature, signature);
        }

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        config.headers = headers;

        return config;
    });

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error.response?.status;

            // todo: refresh token when 401,
            // when success retry latest request
            // when failed navigate to login page
            // todo: navigate to 500.tsx when returned server error
            if (status === 401) {
                setTimeout(() => {
                    if (AuthInfo.getToken()) {
                        AuthInfo.clear();
                        window.location.reload();
                    }
                }, 1000);
            }

            return Promise.reject(error);
        }
    );

    return axiosInstance;
};
