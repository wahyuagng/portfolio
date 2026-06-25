import type { Client } from '@auth/types';

import { UAParser } from 'ua-parser-js';

const CLIENT_KEY = 'client';

export class ClientInfo {
    /**
     * Get full Client object from localStorage
     */
    static get(): Client | null {
        try {
            const raw = localStorage.getItem(CLIENT_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    /**
     * Save full Client object to localStorage
     */
    static set(client: Client): void {
        try {
            localStorage.setItem(CLIENT_KEY, JSON.stringify(client));
        } catch {
            // ignore
        }
    }

    /**
     * Clear stored Client object
     */
    static clear(): void {
        try {
            localStorage.removeItem(CLIENT_KEY);
        } catch {
            // ignore
        }
    }

    /**
     * Generate browserId based on UUID and client info
     */
    private static generateBrowserId(client: Omit<Client, 'browserId'>): string {
        const uuid = crypto.randomUUID().replace(/-/g, '');
        const firstPart = uuid.slice(0, 16);
        const secondPart = uuid.slice(16);

        const content =
            firstPart +
            (client.osType ?? '') +
            (client.osVersion ?? '') +
            (client.browserName ?? '') +
            (client.browserModel ?? '') +
            secondPart;

        return btoa(content);
    }

    /**
     * Validate if the browserId is still compatible with current device info
     */
    private static isValidBrowserId(browserId: string, client: Omit<Client, 'browserId'>): boolean {
        try {
            const decoded = atob(browserId);
            const core = decoded.slice(16, -16); // Remove first and last uuid parts

            return (
                core.includes(client.osType ?? '') &&
                core.includes(client.osVersion ?? '') &&
                core.includes(client.browserName ?? '') &&
                core.includes(client.browserModel ?? '')
            );
        } catch {
            return false;
        }
    }

    /**
     * Detect the client info using UAParser and browser APIs
     */
    static detectClientInfo(): Omit<Client, 'browserId'> {
        const parser = new UAParser();
        return {
            osType: parser.getOS().name ?? undefined,
            osVersion: parser.getOS().version ?? undefined,
            browserName: parser.getBrowser().name ?? undefined,
            browserModel: parser.getDevice().model || 'Desktop',
            culture: navigator.language || 'en-US',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        };
    }

    /**
     * Initialize Client info (persistent across reloads)
     */
    static initialize(): Client {
        const detected = this.detectClientInfo();
        const saved = this.get();

        let browserId = saved?.browserId;

        if (!browserId || !this.isValidBrowserId(browserId, detected)) {
            browserId = this.generateBrowserId(detected);
        }

        const client: Client = {
            ...detected,
            browserId,
        };

        this.set(client);
        return client;
    }
}
