/**
 * Decode a JWT token
 */
export function decodeToken(token: string) {
    try {
        const parts = token.split('.');
        if (parts.length < 2) throw new Error('Invalid token');

        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = atob(base64);
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
}

export function isTokenValid(token: string): boolean {
    try {
        const decoded = decodeToken(token);
        if (!decoded?.exp) return false;

        const now = Date.now() / 1000;
        return decoded.exp > now;
    } catch {
        return false;
    }
}

export function setSession(accessToken: string | null) {
    if (accessToken) {
        const decoded = decodeToken(accessToken);
        if (decoded?.exp) {
            const now = Date.now();
            const expiresAt = decoded.exp * 1000;
            const timeout = expiresAt - now;

            if (timeout > 0) {
                setTimeout(() => {
                    alert('Session expired. Please sign in again.');
                    window.location.reload();
                }, timeout);
            }
        }
    }
}
