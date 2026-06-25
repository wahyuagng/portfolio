import 'yet-another-react-lightbox/styles.css';

import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import { useTranslate } from '@locales/use-locales';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

import { Link } from '@mui/material';

interface Props {
    title?: string;
    text: string;
    url: string;
}

const MediaText = ({ title, text, url }: Props) => {
    const { t } = useTranslate();
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <>
            <Link
                component="button"
                variant="body1"
                onClick={() => setVisible(true)}
                sx={{
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': {
                        textDecoration: 'underline',
                    },
                }}
            >
                {text}
            </Link>

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

export default MediaText;
