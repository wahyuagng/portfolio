import type { Accept } from 'react-dropzone';
import type { BoxProps } from '@mui/material/Box';

import mimeDb from 'mime-db';
import { Iconify } from '@components/iconify';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

type Props = BoxProps & {
    dropzonePlaceholder?: string;
    accept?: Accept;
    maxSize: number;
};

export function UploadPlaceholder({ sx, dropzonePlaceholder, accept, maxSize, ...other }: Props) {
    const maxSizeInMb = maxSize / (1024 * 1024);
    const mimes = accept ? Object.keys(accept) : [];

    const extensions = getFileExtension(mimes);

    return (
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" sx={sx} {...other}>
            {/*<UploadIllustration sx={{ width: 200 }} />*/}

            <Stack justifyContent="center" alignItems="center" sx={{ textAlign: 'center' }}>
                <Iconify icon="eva:cloud-upload-fill" width={35} sx={{ mb: 0.5 }} />
                <Box sx={{ typography: 'body1' }}>
                    Drag and drop your file(s) here or{' '}
                    <Box component="span" sx={{ color: 'primary.main' }}>
                        Browse
                    </Box>{' '}
                </Box>
                <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
                    {dropzonePlaceholder || generatePlaceholderSubtitle(extensions, maxSizeInMb)}
                </Box>
            </Stack>
        </Box>
    );
}

function generatePlaceholderSubtitle(extensions: string[], maxSizeInMb: number) {
    if (extensions.length > 1) {
        return `Supported Format: ${extensions.join(', ')} (Max ${maxSizeInMb} MB)`;
    }

    return `All File Format Supported (Max ${maxSizeInMb} MB)`;
}

function getFileExtension(mimeTypes: string[]) {
    return mimeTypes
        .map((type) => {
            const entry = mimeDb[type];
            return entry && entry.extensions ? entry.extensions.map((ext) => ext.toUpperCase()) : [];
        })
        .flat()
        .filter((ext, i, arr) => arr.indexOf(ext) === i);
}
