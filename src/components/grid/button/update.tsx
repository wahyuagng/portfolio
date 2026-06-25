import type { FC } from 'react';

import { Iconify } from '@components/iconify';

import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

interface UpdateButtonProps {
    action: (data: any) => void;
}

const UpdateButton: FC<UpdateButtonProps> = ({ action }) => (
    <Button
        sx={{ width: '100px', background: 'blue', color: 'white' }}
        variant="outlined"
        startIcon={<Iconify icon="solar:pen-bold" />}
        onClick={(data) => action(data)}
    >
        Update
    </Button>
);

const UpdateAction = () => (
    <>
        <Iconify icon="solar:pen-bold" color="blue" />
        <span>Update</span>
    </>
);

const UpdateActionIcon = () => (
    <Tooltip title="Update" placement="top" arrow>
        <IconButton color="inherit" size="small">
            <Iconify icon="solar:pen-bold" sx={{ width: '1rem', height: 'auto' }} color="blue" />
        </IconButton>
    </Tooltip>
);

export { UpdateButton, UpdateAction, UpdateActionIcon };
