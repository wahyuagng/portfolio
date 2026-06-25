import React from 'react';

import Stack from '@mui/material/Stack';

interface Props {
    url: string;
}

export function VideoPreview({ url }: Props) {
    const [loading, setLoading] = React.useState(false);

    if (loading) return <p>Loading..</p>;

    return (
        <Stack direction="row" justifyContent="center" sx={{ width: 1 }}>
            <video controls onLoadedData={() => setLoading(false)} style={{ width: '100%', height: 'auto' }}>
                <source src={url} type="video/mp4" />
                <track kind="caption" src="" label="English" default />
                Your browser doesn&apos;t support the video element
            </video>
        </Stack>
    );
}
