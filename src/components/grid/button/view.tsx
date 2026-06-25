import type { FC } from 'react';

import { Iconify } from '@components/iconify';

import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

interface ViewButtonProps {
    action: (data: any) => void;
}

const ViewButton: FC<ViewButtonProps> = ({ action }) => (
    <Button
        sx={{ width: '100px', background: 'grey', color: 'white' }}
        variant="outlined"
        startIcon={<Iconify icon="solar:eye-bold" />}
        onClick={(data) => action(data)}
    >
        View
    </Button>
);

const ViewAction = () => (
    <>
        <Iconify icon="solar:eye-bold" sx={{ color: 'grey' }} />
        <span>View</span>
    </>
);

const ViewActionIcon = () => (
    <Tooltip title="View" placement="top" arrow>
        <IconButton color="inherit" size="small">
            <Iconify icon="solar:eye-bold" sx={{ width: '1rem', height: 'auto' }} />
        </IconButton>
    </Tooltip>
);

export { ViewButton, ViewAction, ViewActionIcon };
