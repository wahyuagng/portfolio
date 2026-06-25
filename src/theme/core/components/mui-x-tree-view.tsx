import type { Theme, Components } from '@mui/material/styles';

// ----------------------------------------------------------------------

const MuiTreeItem: Components<Theme>['MuiTreeItem'] = {
    // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
    styleOverrides: {
        label: ({ theme }) => ({
            ...theme.typography.body2,
        }),
        iconContainer: {
            width: 18,
        },
    },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const treeView: Components<Theme> = {
    MuiTreeItem,
};
