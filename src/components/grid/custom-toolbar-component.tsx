import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useTranslate } from '@locales/use-locales';

import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Button, Checkbox, ListItemText } from '@mui/material';

type CustomColumnsButtonProps = {
    showLabel?: boolean;
    onToggleColumns: (visibility: Record<string, boolean>) => void;
    availableColumns: {
        field: string;
        headerName: string;
        hideable?: boolean;
        isVisible: boolean;
    }[];
};

export function CustomColumnsButton({ showLabel = true, onToggleColumns, availableColumns }: CustomColumnsButtonProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const { t } = useTranslate();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleToggleColumn = (field: string, isVisible: boolean) => {
        onToggleColumns({ [field]: !isVisible });
    };

    return (
        <>
            <Tooltip title="Manage Columns">
                <Button
                    onClick={handleClick}
                    startIcon={<Icon icon="mdi:view-column" />}
                    sx={{ textTransform: 'none', width: 'auto', height: 25 }}
                >
                    {showLabel && t('columns')}
                </Button>
            </Tooltip>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {availableColumns
                    .filter((col) => col.field !== 'actions' && col.hideable !== false)
                    .map((col) => (
                        <MenuItem key={col.field} onClick={() => handleToggleColumn(col.field, col.isVisible)}>
                            <Checkbox checked={col.isVisible} />
                            <ListItemText primary={col.headerName} />
                        </MenuItem>
                    ))}
            </Menu>
        </>
    );
}
