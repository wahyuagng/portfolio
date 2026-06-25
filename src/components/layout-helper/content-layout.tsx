import type { ReactNode } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';

import { Box } from '@mui/material';

interface ContentLayoutProps {
    children: ReactNode;
    spacing?: number;
    sx?: SxProps<Theme>;
}

const ContentLayout = ({ children, spacing = 2, sx }: ContentLayoutProps) => (
    <Box
        sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            overflowX: 'hidden',
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 3 },
            '&::-webkit-scrollbar': {
                width: '8px',
            },
            '&::-webkit-scrollbar-track': {
                bgcolor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
                bgcolor: 'action.hover',
                borderRadius: '4px',
                '&:hover': {
                    bgcolor: 'action.selected',
                },
            },
            ...sx,
        }}
    >
        {/*<Stack spacing={spacing}>{children}</Stack>*/}
        {children}
    </Box>
);

export default ContentLayout;
