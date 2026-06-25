import type { FC, ReactNode } from 'react';

import { Box } from '@mui/material';

interface Props {
    children?: ReactNode;
}

const FooterFixed: FC<Props> = ({ children }) => (
    <Box
        sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: '1px solid #ddd',
            backgroundColor: 'background.paper',
            p: 2,
            zIndex: 1000,
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        }}
    >
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>{children}</Box>
    </Box>
);

export default FooterFixed;
