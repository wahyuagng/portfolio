import type { FC, ReactNode } from 'react';

import { Stack } from '@mui/material';

interface StackGridProps {
    children: ReactNode;
    row: number;
    spacing?: number;
}

const StackGrid: FC<StackGridProps> = ({ children, row, spacing = 2 }) => (
    <Stack
        spacing={spacing}
        sx={{
            my: 2,
            display: 'grid',
            gridTemplateColumns: {
                xs: '1fr',
                sm: `repeat(${row}, 1fr)`,
            },
            columnGap: 2,
            rowGap: 2,
        }}
    >
        {children}
    </Stack>
);

export default StackGrid;
