import type { OnlineFile } from '@components/file-upload/types';

export type IFileItem = {
    file: File | OnlineFile;
};

export type IExtractedFileItem = {
    extractedFile: File | string;
    extractedFileInfo: {
        name: string;
        size: number;
        format: string;
        thumbnail?: string;
        path?: string;
    };
};

export type IFileInfo = {
    name: string;
    size: number;
    format?: string;
    thumbnail?: string;
    path?: string;
};
