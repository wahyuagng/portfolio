import { useState } from 'react';
import { LoadingScreen } from '@components/loading-screen';

import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';

interface Props {
    url: string;
}

export function ImagePreview({ url }: Props) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <Stack direction="column" justifyContent="center" gap={24} sx={{ width: 1 }}>
            {isLoading && (
                <Stack justifyContent="center" alignItems="center" minHeight="75vh">
                    <LoadingScreen />
                    {/*<CircularProgress />*/}
                </Stack>
            )}
            <Box
                component="img"
                src={url}
                alt="Image preview"
                onLoad={() => setIsLoading(false)}
                sx={{
                    objectFit: 'cover',
                    width: 1,
                }}
            />
        </Stack>
    );
}
