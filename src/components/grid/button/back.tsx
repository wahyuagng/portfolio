import type { FC } from 'react';

import { useNavigate } from 'react-router';
import { Iconify } from '@components/iconify';

import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';

interface BackButtonProps {
    href: string;
    label?: string;
}

const BackButton: FC<BackButtonProps> = ({ href, label }) => {
    const navigate = useNavigate();
    return (
        <Tooltip title={label ?? 'Back'}>
            <Button variant="contained" color="primary" size="small" startIcon={<Iconify icon="eva:arrow-ios-back-fill" />} onClick={() => navigate(href)}>
                {label ?? 'Back'}
            </Button>
        </Tooltip>
    );
};

export default BackButton;
