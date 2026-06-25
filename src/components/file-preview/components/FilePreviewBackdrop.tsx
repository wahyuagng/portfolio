import type { ReactNode } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';

import { Iconify } from '@components/iconify';

import Box from '@mui/material/Box';
import { Modal } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

interface Props {
    open: boolean;
    onClose: () => void;
    children?: ReactNode;
    sx?: SxProps<Theme>;
}

export function FilePreviewBackdrop({ open, onClose, children, sx }: Props) {
    const theme = useTheme();

    return (
        <Modal
            open={open}
            aria-labelledby="custom-modal-title"
            aria-describedby="custom-modal-description"
            slots={{
                backdrop: () => (
                    <Box
                        onClick={onClose}
                        sx={{
                            backgroundColor: theme.palette.common.black,
                            opacity: 0.9,
                            width: '100vw',
                            height: '100vh',
                            zIndex: -1,
                        }}
                    />
                ),
            }}
        >
            <>
                <Stack
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        maxHeight: '75vh',
                        width: '75vw',
                        // minWidth: { xs: '50vw', sm: '50vw' },
                        ...sx,
                    }}
                >
                    <Stack sx={{ borderRadius: 2, overflowY: 'auto' }}>{children}</Stack>
                </Stack>
                <Button
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 0,
                        color: theme.palette.background.paper,
                        bgcolor: 'transparent',
                    }}
                >
                    <Iconify icon="mingcute:close-line" width={18} />
                </Button>
            </>
        </Modal>
    );
}
