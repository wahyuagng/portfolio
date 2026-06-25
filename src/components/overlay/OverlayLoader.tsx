import type { Theme, SxProps } from '@mui/material/styles';
import type { LinearProgressProps } from '@mui/material/LinearProgress';

import React, { Fragment } from 'react';

import { styled } from '@mui/material/styles';
import { Box, Portal, LinearProgress } from '@mui/material';

type OverlayLoaderProps = {
    loading: boolean;
    children: React.ReactNode;
    portal?: boolean;
    sx?: SxProps<Theme>;
    slots?: {
        progress?: React.ReactNode;
    };
    slotsProps?: {
        progress?: LinearProgressProps;
    };
};

const OverlayContent = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(2px)',
    zIndex: 9999,
    cursor: 'not-allowed',
    pointerEvents: 'all',
}));

const OverlayLoader: React.FC<OverlayLoaderProps> = ({ loading, children, portal = false, slots, slotsProps, sx }) => {
    const PortalWrapper = portal ? Portal : Fragment;

    return (
        <Box position="relative" sx={{ overflow: 'hidden' }}>
            <Box
                sx={{
                    filter: loading ? 'blur(1px)' : 'none',
                    pointerEvents: loading ? 'none' : 'auto',
                    transition: 'filter 0.2s ease',
                }}
            >
                {children}
            </Box>

            {loading && (
                <PortalWrapper>
                    <OverlayContent sx={sx}>{slots?.progress ?? <LinearProgress color="inherit" sx={[{ width: 1, maxWidth: 360 }, ...(Array.isArray(slotsProps?.progress?.sx) ? slotsProps.progress.sx : [slotsProps?.progress?.sx])]} {...slotsProps?.progress} />}</OverlayContent>
                </PortalWrapper>
            )}
        </Box>
    );
};

export default OverlayLoader;
