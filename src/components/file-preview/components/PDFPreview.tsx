import type { OnlineFile } from '@components/file-upload/types';

import { fileData } from '@components/file-upload/utils';

import Stack from '@mui/material/Stack';

interface Props {
    file: File | OnlineFile;
}

export function PdfPreview({ file }: Props) {
    const fileUrl = file instanceof File ? URL.createObjectURL(file) : file.SignedUrl;

    const { name } = fileData(file);

    return (
        <Stack justifyContent="center" height="80vh" padding={2}>
            <iframe id={`pdf-${name}`} title={name} src={fileUrl} style={{ width: '100%', height: '100%' }}>
                Your browser doesnt support iframes
            </iframe>
        </Stack>
    );
}
