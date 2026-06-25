import type { ReactNode } from 'react';

import { useAuthContext } from '@auth/hooks';

import { ViewForbidden } from '../../../sections/error/view-forbidden';

type Props = {
    children: ReactNode;
    alloweds: string[];
    isPage?: boolean;
};

export function PermissionBasedGuard({ children, alloweds = [], isPage }: Props) {
    const { profile } = useAuthContext();

    if (!profile) {
        console.log('user tidak ada');
        return null;
    }

    const userPermissions = profile.Permissions || [];

    if (!userPermissions.length) {
        console.log('permission tidak ada');
        return <ViewForbidden />;
    }

    const isAllowed = userPermissions.some((permission: string) => alloweds.includes(permission));

    if (!isAllowed) {
        console.log('tidak di ijinkan');
        if (isPage) {
            console.log('ini halaman');
            return <ViewForbidden />;
        }

        return null;
    }

    return <>{children}</>;
}
