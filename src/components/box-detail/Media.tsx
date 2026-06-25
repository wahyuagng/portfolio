import React, { useState } from 'react';
import { Iconify } from '@components/iconify';
import Lightbox from 'yet-another-react-lightbox';
import { useTranslate } from '@locales/use-locales';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

import { Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';

interface Props {
    title: string;
    text: string;
    url: string;
}

const Media = ({ title, text, url }: Props) => {
    const { t } = useTranslate();

    const [visible, setVisible] = useState<boolean>(false);

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" sx={{ flex: 1 }}>
                    {text}
                </Typography>

                <IconButton color="primary" size="small" onClick={() => setVisible(true)}>
                    <Iconify icon="solar:eye-bold" />
                </IconButton>
            </Box>

            <Lightbox
                open={visible}
                close={() => setVisible(false)}
                slides={[{ src: url, title }]}
                plugins={[Zoom]}
                zoom={{
                    maxZoomPixelRatio: 3,
                    scrollToZoom: true,
                }}
            />
        </>
    );
};

export default Media;
