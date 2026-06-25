import React from 'react';
import { TableProvider } from '@components/grid/table-provider';

import { Box } from '@mui/material';

export interface LayoutProps {
    children: React.ReactNode;
}

const LayoutComponent: React.FC<LayoutProps> = ({ children }) => (
    <TableProvider>
        <Box sx={{ position: 'relative' }}>{children}</Box>
    </TableProvider>
);

export default LayoutComponent;
