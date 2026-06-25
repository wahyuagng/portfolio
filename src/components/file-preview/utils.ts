import type { OnlineFile } from '@components/file-upload/types';
import type { IExtractedFileItem } from './types.ts';

import { fileData, fileFormat } from '@components/file-upload/utils';

export type FileExtractorParams = {
    file: File | OnlineFile;
};

export type OnlineFileExtractorParams = {
    file: OnlineFile;
};

export function fileExtractor({ file }: FileExtractorParams): IExtractedFileItem {
    if (file instanceof File) {
        return extractLocalFile(file as File);
    }

    return extractOnlineFile({ file });
}

function extractOnlineFile({ file }: OnlineFileExtractorParams): IExtractedFileItem {
    const IS_ONLINE_FILE = true;

    const extension = file.Extension ?? file.OriginalFileName?.split('.').pop()?.toLowerCase();

    return {
        extractedFile: file.SignedUrl,
        extractedFileInfo: {
            name: file.OriginalFileName,
            size: file.Size,
            format: fileFormat(extension, IS_ONLINE_FILE),
            thumbnail: file.SignedUrl,
        },
    };
}

function extractLocalFile(file: File): IExtractedFileItem {
    const url = file instanceof File ? URL.createObjectURL(file) : file;

    const { path, name, size } = fileData(file);

    const format = fileFormat(path || (url as string));

    return {
        extractedFile: file,
        extractedFileInfo: {
            name,
            format,
            path,
            size: size || 0,
        },
    };
}
