import type { FC } from 'react';

import { Iconify } from '@components/iconify';

import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

interface DeleteButtonProps {
    action: (data: any) => void;
}

const DeleteButton: FC<DeleteButtonProps> = ({ action }) => (
    <Button
        sx={{ width: '100px', background: 'red', color: 'white' }}
        variant="outlined"
        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        onClick={(data) => action(data)}
    >
        Delete
    </Button>
);

const DeleteAction = () => (
    <>
        <Iconify icon="solar:trash-bin-trash-bold" sx={{ color: 'error.main' }} />
        <span>Delete</span>
    </>
);

const DeleteActionIcon = () => (
    <Tooltip title="Delete" placement="top" arrow>
        <IconButton color="inherit" size="small">
            <Iconify icon="solar:trash-bin-trash-bold" sx={{ width: '1rem', height: 'auto', color: 'error.main' }} />
        </IconButton>
    </Tooltip>
);

export { DeleteButton, DeleteAction, DeleteActionIcon };
