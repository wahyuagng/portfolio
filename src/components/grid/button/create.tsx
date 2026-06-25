import type { FC } from 'react';

import { Iconify } from '@components/iconify';

import Button from '@mui/material/Button';

interface CreateButtonProps {
    action: (data: any) => void;
    label?: string;
}

const CreateButton: FC<CreateButtonProps> = ({ action, label }) => (
    <Button
        variant="contained"
        color="primary"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={(data) => action(data)}
    >
        {label ?? 'Create'}
    </Button>
);

const CreateAction = () => (
    <>
        <Iconify icon="solar:pen-bold" sx={{ color: 'green' }} />
        <span>Create</span>
    </>
);

export { CreateButton, CreateAction };
