export async function generateHmacSignature(secret: string, data: string): Promise<string> {
    const enc = new TextEncoder();
    const keyData = enc.encode(secret);
    const message = enc.encode(data);

    // Import key
    const cryptoKey = await window.crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, [
        'sign',
    ]);

    // Sign the message
    const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, message);

    // Convert ArrayBuffer to base64
    const bytes = new Uint8Array(signature);
    return btoa(String.fromCharCode(...bytes));
}
