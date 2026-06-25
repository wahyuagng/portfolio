import { useState } from 'react';

import { Box, Stack, Button, Popover, Typography } from '@mui/material';

type CancelButtonProps = {
    onConfirm: () => void;
    disabled?: boolean;
    label?: string;
    onClick?: () => void;
};

export function CancelButton({ onConfirm, disabled, label = 'Cancel' }: CancelButtonProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleConfirm = () => {
        setAnchorEl(null);
        onConfirm();
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <Button onClick={handleClick} variant="contained" color="error" disabled={disabled}>
                {label}
            </Button>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
            >
                <Box sx={{ p: 2, maxWidth: 300 }}>
                    <Typography sx={{ mb: 2 }}>Are you sure you want to close this form? Any unsaved changes will be lost.</Typography>
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Button variant="outlined" color="inherit" onClick={handleClose}>
                            No, Continue
                        </Button>
                        <Button variant="contained" color="error" onClick={handleConfirm}>
                            Yes, Close
                        </Button>
                    </Stack>
                </Box>
            </Popover>
        </>
    );
}
