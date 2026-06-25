import type { ReactNode } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';

import { Box, Modal, Typography } from '@mui/material';

interface Props {
    open: boolean;
    onClose: () => void;
    title: string;
    children?: ReactNode;
    footer?: ReactNode;
    sx?: SxProps<Theme>;
    maxWidth?: string;
    fullWidth?: boolean;
}

export const CustomModal = ({ open, onClose, title, children, footer, sx, maxWidth, fullWidth }: Props) => (
    <Modal
        open={open}
        onClose={(_, reason) => {
            if (reason !== 'backdropClick') {
                onClose();
            }
        }}
        aria-labelledby="custom-modal-title"
        aria-describedby="custom-modal-description"
        disableEscapeKeyDown
    >
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: {
                    xs: '100%',
                    md: maxWidth ?? '50%',
                },
                backgroundColor: 'background.paper',
                borderRadius: {
                    xs: 0,
                    md: 2,
                },
                boxShadow: 24,
                maxHeight: '90vh',
                ...sx,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 2,
                    borderBottom: '1px solid #ddd',
                }}
            >
                <Typography id="custom-modal-title" variant="h4">
                    {title}
                </Typography>

                {/*<IconButton onClick={onClose}>*/}
                {/*  <Icon icon="mdi:close-circle" width={24} height={24} />*/}
                {/*</IconButton>*/}
            </Box>

            {/* Body */}
            <Box
                sx={{
                    pt: 2,
                    px: 2,
                    flex: 1, // Mengisi sisa ruang antara header & footer
                    overflowY: 'auto',
                    maxHeight: {
                        xs: 'unset',
                        md: 'calc(90vh - 120px)',
                    },
                }}
            >
                {children}
            </Box>

            {footer && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1,
                        padding: 2,
                        borderTop: '1px solid #ddd',
                        position: 'sticky',
                        bottom: 0,
                        backgroundColor: 'background.paper',
                        zIndex: 10,
                    }}
                >
                    {footer}
                </Box>
            )}
        </Box>
    </Modal>
);

export default CustomModal;
