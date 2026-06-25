import { useState, useEffect } from 'react';
import {
    TextViewer,
    SheetViewer,
    VideoViewer,
    AudioViewer,
    ImageViewer,
    FileTypeEnum,
    DocumentViewer,
    PortableDocumentViewer,
} from '@tesseract/react-file-viewer';

import Box from '@mui/material/Box';

type Props = {
    file: File;
};

export const typeExtensions: Record<FileTypeEnum, string[]> = {
    [FileTypeEnum.DOCUMENT]: ['docx'],
    [FileTypeEnum.SHEET]: ['xls', 'xlsx'],
    [FileTypeEnum.IMAGE]: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'],
    [FileTypeEnum.TEXT]: ['txt'],
    [FileTypeEnum.PORTABLE_DOCUMENT]: ['pdf', 'pdfx'],
    [FileTypeEnum.AUDIO]: ['mp3', 'wav', 'ogg', 'aac', 'flac'],
    [FileTypeEnum.VIDEO]: ['mp4', 'webm', 'ogg'],
};

export function LocalOfficeViewer({ file }: Props) {
    const [fileType, setFileType] = useState<FileTypeEnum | null>(null);

    useEffect(() => {
        if (!file) return;

        const extension = file.name.split('.').pop()?.toLowerCase();
        let detectedType: FileTypeEnum | null = null;

        for (const [type, extensions] of Object.entries(typeExtensions)) {
            if (extensions.includes(extension!)) {
                detectedType = type as FileTypeEnum;
                break;
            }
        }

        if (detectedType) {
            setFileType(detectedType);
        } else {
            setFileType(null);
        }
    }, [file]);

    return (
        <Box className="preview-container" height="80vh">
            {file && fileType === FileTypeEnum.SHEET && <SheetViewer file={file} />}
            {file && fileType === FileTypeEnum.DOCUMENT && <DocumentViewer file={file} />}
            {file && fileType === FileTypeEnum.IMAGE && <ImageViewer file={file} />}
            {file && fileType === FileTypeEnum.TEXT && <TextViewer file={file} />}
            {file && fileType === FileTypeEnum.PORTABLE_DOCUMENT && <PortableDocumentViewer file={file} />}
            {file && fileType === FileTypeEnum.AUDIO && <AudioViewer file={file} />}
            {file && fileType === FileTypeEnum.VIDEO && <VideoViewer file={file} />}
        </Box>
    );
}
