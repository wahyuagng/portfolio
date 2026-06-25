import type { ReactNode } from 'react';

import { Box } from '@mui/material';

interface PageLayoutProps {
    children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => (
    <Box
        // sx={{
        //     display: 'flex',
        //     flexDirection: 'column',
        //     height: '100%',
        //     minHeight: 0,
        //     width: '100%',
        //     overflow: 'hidden',
        // }}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute', // Absolute positioning
            top: 0,
            // left: 0,
            // right: 0,
            bottom: 0,
            overflow: 'hidden', // No scroll di PageLayout
        }}
    >
        {children}
    </Box>
);

export default PageLayout;
