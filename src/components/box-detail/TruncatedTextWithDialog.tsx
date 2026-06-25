import React, { useState } from 'react';
import { Iconify } from '@components/iconify';
import { useTranslate } from '@locales/use-locales';

import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Button, Typography, DialogActions, DialogContent } from '@mui/material';

interface Props {
    title: string;
    text: string;
    maxLength?: number;
}

const TruncatedTextWithDialog = ({ title, text, maxLength = 75 }: Props) => {
    const { t } = useTranslate();
    const [visible, setVisible] = useState<boolean>(false);

    const isLong = text.length > maxLength;
    const truncated = isLong ? text.substring(0, maxLength) + '...' : text;

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" sx={{ flex: 1 }}>
                    {truncated}
                </Typography>

                {isLong && (
                    <IconButton color="primary" size="small" onClick={() => setVisible(true)}>
                        <Iconify icon="solar:eye-bold" />
                    </IconButton>
                )}
            </Box>

            <Dialog fullWidth maxWidth="xs" open={visible} onClose={() => setVisible(false)}>
                <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>
                <DialogContent sx={{ typography: 'body2' }}>{text}</DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="inherit" onClick={() => setVisible(false)}>
                        {t('Close')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TruncatedTextWithDialog;
