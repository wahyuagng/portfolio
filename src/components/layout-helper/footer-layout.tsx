import type { ReactNode } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';

import { Box, Stack } from '@mui/material';

interface FooterLayoutProps {
    left?: ReactNode;
    right?: ReactNode;
    children?: ReactNode;
    sx?: SxProps<Theme>;
}

const FooterLayout = ({ left, right, children, sx }: FooterLayoutProps) => {
    if (children) {
        return (
            <Box
                sx={{
                    flexShrink: 0, // Don't shrink
                    bgcolor: 'background.default',
                    // px: { xs: 2, md: 3 },
                    py: { xs: 1.5, md: 2 },
                    ...sx,
                }}
            >
                {children}
            </Box>
        );
    }

    return (
        <Box
            sx={{
                flexShrink: 0, // Don't shrink
                bgcolor: 'background.default',
                // px: { xs: 2, md: 3 },
                py: { xs: 1.5, md: 2 },
                ...sx,
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Box>{left}</Box>
                <Box>{right}</Box>
            </Stack>
        </Box>
    );
};

export default FooterLayout;
