import { useCallback } from 'react';
import { Iconify } from '@components/iconify';
import { fileThumb } from '@components/file-thumbnail';
import { downloadFile } from '@components/file-upload/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface Props {
    fileUrl: string;
    fileName: string;
    format?: string;
}

export function NotSupportedPreview({ fileUrl, fileName, format }: Props) {
    const handleDownload = useCallback(() => {
        downloadFile(fileUrl, fileName);
    }, []);

    return (
        <Stack direction="column" justifyContent="center" alignItems="center" gap={2}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                padding={2}
                sx={{ width: 1, borderBottom: '1px solid #ddd' }}
            >
                <Typography sx={{ pl: 2 }}>File preview is not supported.</Typography>
                <Button onClick={handleDownload}>
                    <Typography variant="body1" fontWeight="bold" sx={{ pr: 0.75 }}>
                        Download
                    </Typography>
                    <Iconify icon="solar:download-bold" width={20} />
                </Button>
            </Stack>
            <Stack justifyContent="center" alignItems="center" gap={2} sx={{ height: 1, minHeight: '420px' }}>
                {format && (
                    <Box
                        component="img"
                        alt={fileName}
                        src={fileThumb(format)}
                        sx={{
                            width: 75,
                            height: 75,
                            borderRadius: 1,
                            objectFit: 'cover',
                        }}
                    />
                )}
                <Typography>{fileName}</Typography>
            </Stack>
        </Stack>
    );
}
