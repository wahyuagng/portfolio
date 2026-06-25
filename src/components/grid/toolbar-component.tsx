import React from 'react';

import Box from '@mui/material/Box';

export interface ToolbarProps {
    children: React.ReactNode;
}

const ToolbarComponent: React.FC<ToolbarProps> = ({ children }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', overflow: 'auto' }}>
        {children}
    </Box>
);

const ToolbarLeftComponent: React.FC<ToolbarProps> = ({ children }) => (
    <Box sx={{ display: 'flex', gap: 1, px: 2, pt: 2 }}>{children}</Box>
);

const ToolbarRightComponent: React.FC<ToolbarProps> = ({ children }) => (
    <Box sx={{ display: 'flex', gap: 1, px: 2, pt: 2 }}>{children}</Box>
);

export { ToolbarComponent, ToolbarLeftComponent, ToolbarRightComponent };
