import type { FC } from 'react';

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Iconify } from '@components/iconify';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import { Tooltip, DialogActions, DialogContent } from '@mui/material';

interface BackButtonProps {
    href: string;
    label?: string;
}

const BackFormButton: FC<BackButtonProps> = ({ href, label }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleConfirm = () => {
        setAnchorEl(null);
        navigate(href);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <Tooltip title={label ?? 'Back'}>
                <Button onClick={handleClick} variant="contained" color="primary" startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}>
                    {label ?? 'Back'}
                </Button>
            </Tooltip>

            <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
                <DialogTitle sx={{ pb: 2 }}>Confirmation</DialogTitle>

                <DialogContent sx={{ typography: 'body2' }}>
                    <Typography sx={{ mb: 2 }}>Are you sure you want to leave this page? </Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleConfirm}>
                        Yes
                    </Button>
                    <Button variant="outlined" color="inherit" onClick={handleClose}>
                        No
                    </Button>
                </DialogActions>
            </Dialog>

            {/*<Popover*/}
            {/*    open={open}*/}
            {/*    anchorEl={anchorEl}*/}
            {/*    onClose={handleClose}*/}
            {/*    anchorOrigin={{*/}
            {/*        vertical: 'center',*/}
            {/*        horizontal: 'center',*/}
            {/*    }}*/}
            {/*    transformOrigin={{*/}
            {/*        vertical: 'center',*/}
            {/*        horizontal: 'center',*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Box sx={{ p: 2, maxWidth: 300 }}>*/}
            {/*        <Typography sx={{ mb: 2 }}>Are you sure you want to close this form? Any unsaved changes will be lost.</Typography>*/}
            {/*        <Stack direction="row" spacing={2} justifyContent="space-between">*/}
            {/*            <Button variant="outlined" color="inherit" onClick={handleClose}>*/}
            {/*                No, Continue*/}
            {/*            </Button>*/}
            {/*            <Button variant="contained" color="error" onClick={handleConfirm}>*/}
            {/*                Yes, Close*/}
            {/*            </Button>*/}
            {/*        </Stack>*/}
            {/*    </Box>*/}
            {/*</Popover>*/}
        </>
    );
};

export default BackFormButton;
