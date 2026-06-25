import type { ReactNode } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';

import { Box } from '@mui/material';

interface HeaderLayoutProps {
    children: ReactNode;
    sx?: SxProps<Theme>;
}

const HeaderLayout = ({ children, sx }: HeaderLayoutProps) => (
    <Box
        sx={{
            flexShrink: 0,
            bgcolor: 'background.default',
            top: 0,
            px: { xs: 2, md: 3 },
            py: { xs: 1.5, md: 2 },
            ...sx,
        }}
    >
        {children}
    </Box>
);
export default HeaderLayout;
