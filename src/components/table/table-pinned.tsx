import { styled, TableCell } from '@mui/material';

export const PinnedTableCell = styled(TableCell, {
    shouldForwardProp: (prop) => prop !== 'position' && prop !== 'offset',
})<{ position?: 'start' | 'end'; offset?: number }>(({ theme, position = 'start', offset = 0 }) => ({
    '&.MuiTableCell-head': {
        backgroundColor: theme.palette.background.neutral,
        color: theme.palette.text.secondary,
        left: position === 'start' ? offset : 'auto',
        right: position === 'end' ? offset : 'auto',
        position: 'sticky',
        zIndex: theme.zIndex.appBar + 2,
    },
    '&.MuiTableCell-body': {
        backgroundColor: theme.palette.background.paper,
        minWidth: '50px',
        left: position === 'start' ? offset : 'auto',
        right: position === 'end' ? offset : 'auto',
        position: 'sticky',
        zIndex: theme.zIndex.appBar + 1,
    },
}));
 
