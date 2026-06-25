import { useState, useEffect } from 'react';
import { AuthMethodEnum } from '@auth/enums';
import { AuthInfo } from '@auth/utils/auth-info';
import { AuthProvider as JwtAuthProvider } from '@auth/context/jwt/auth-provider';
import { AuthProvider as OidcAuthProvider } from '@auth/context/oidc/auth-provider';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [method, setMethod] = useState<AuthMethodEnum | null>(null);

    useEffect(() => {
        const storedMethod = AuthInfo.getMethod() as AuthMethodEnum;
        setMethod(storedMethod || AuthMethodEnum.JWT);
    }, []);

    if (!method) return null;

    switch (method) {
        case AuthMethodEnum.OIDC:
            return <OidcAuthProvider>{children}</OidcAuthProvider>;
        case AuthMethodEnum.JWT:
        default:
            return <JwtAuthProvider>{children}</JwtAuthProvider>;
    }
}
