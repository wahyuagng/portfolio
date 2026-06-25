export interface BaseApiOptions {}

export interface IConfigApi {
    baseUrl: string;
    clientKey: string;
    clientSecret: string;
    payloadToken: string | null;
    headerKeys: {
        clientKey?: string;
        clientSecret?: string;
        signature?: string;
        timestamp?: string;
        idempotency?: string;
    };
}

export const CONFIG_API: IConfigApi = {
    baseUrl: import.meta.env.VITE_API_URL,
    clientKey: import.meta.env.VITE_API_CLIENT_KEY,
    clientSecret: import.meta.env.VITE_API_CLIENT_SECRET,
    payloadToken: import.meta.env.VITE_API_PAYLOAD_TOKEN,
    headerKeys: {
        clientKey: 'X-Client-Key',
        clientSecret: 'X-Client-Secret',
        signature: 'X-Signature',
        timestamp: 'X-Timestamp',
        idempotency: 'X-Idempotency-Key',
    },
};
