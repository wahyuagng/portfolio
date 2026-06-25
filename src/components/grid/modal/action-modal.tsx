import type { FC } from 'react';

import React from 'react';

import { Box } from '@mui/material';

export interface ActionModalProps {
    children: React.ReactNode;
}

const ActionModal: FC<ActionModalProps> = ({ children }) => (
    <Box
        sx={{
            position: 'sticky',
            bottom: 0,
            borderTop: '1px solid #ddd',
            p: 2,
            backgroundColor: 'background.paper',
            zIndex: 1,
            mt: 3
        }}
    >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {children}
        </Box>
    </Box>
);


export default ActionModal;
