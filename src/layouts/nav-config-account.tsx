import { paths } from '@routes/paths';
import { useTranslation } from 'react-i18next';

import { Iconify } from 'src/components/iconify';

export function useAccountMenu() {
    const { t } = useTranslation('navbar');

    return [
        // { label: t('account.home'), href: '/', icon: <Iconify icon="solar:home-angle-bold-duotone" /> },
        { label: t('account.profile'), href: paths.profile.root, icon: <Iconify icon="custom:profile-duotone" /> },
        // { label: t('account.projects'), href: '#', icon: <Iconify icon="solar:notes-bold-duotone" />, info: '3' },
        // { label: t('account.subscription'), href: '#', icon: <Iconify icon="custom:invoice-duotone" /> },
        // { label: t('account.security'), href: '#', icon: <Iconify icon="solar:shield-keyhole-bold-duotone" /> },
        // { label: t('account.settings'), href: '#', icon: <Iconify icon="solar:settings-bold-duotone" /> },
    ];
}
