import React, { useState } from 'react';
import { Iconify } from '@components/iconify';
import { useTranslate } from '@locales/use-locales';

import Button from '@mui/material/Button';
import { Tooltip, useTheme, useMediaQuery } from '@mui/material';

interface RefreshComponentProps {
    onRefresh: () => void;
}

const RefreshComponent: React.FC<RefreshComponentProps> = ({ onRefresh }) => {
    const [isRotating, setIsRotating] = useState(false);

    const { t } = useTranslate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleRefresh = () => {
        setIsRotating(true);
        onRefresh();
        setTimeout(() => setIsRotating(false), 1000);
    };

    return (
        <Tooltip title="Refresh">
            <Button
                sx={{
                    '& .refresh-icon': {
                        animation: isRotating ? 'spin 1s linear' : 'none',
                    },
                    '@keyframes spin': {
                        '0%': {
                            transform: 'rotate(0deg)',
                        },
                        '100%': {
                            transform: 'rotate(360deg)',
                        },
                    },
                }}
                variant="text"
                color="inherit"
                startIcon={<Iconify icon="solar:restart-bold" className="refresh-icon" />}
                onClick={handleRefresh}
            >
                {!isMobile ? t('refresh') : ''}
            </Button>
        </Tooltip>
    );
};

export default RefreshComponent;
