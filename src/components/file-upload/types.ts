import type { BoxProps } from '@mui/material/Box';
import type { DropzoneOptions } from 'react-dropzone';
import type { Theme, SxProps } from '@mui/material/styles';
import type { MediaResponse } from '@services/api/modules/media';

export interface OnlineFile extends MediaResponse {}

export interface CustomFile extends File {
    path?: string;
    preview?: string;
    lastModifiedDate?: Date;
}

export interface UploadProps extends DropzoneOptions {
    error?: boolean;
    sx?: SxProps<Theme>;
    thumbnail?: boolean;
    placeholder?: React.ReactNode;
    helperText?: React.ReactNode;
    disableMultiple?: boolean;
    //
    file?: CustomFile | string | null;
    onDelete?: VoidFunction;
    //
    files?: (File | string)[];
    onUpload?: VoidFunction;
    onRemove?: (file: File | OnlineFile) => void;
    onRemoveAll?: VoidFunction;
}

export type FileUploadType = File | string | null;

export type FilesUploadType = (File | OnlineFile)[];

export type SingleFilePreviewProps = BoxProps & {
    file: File | OnlineFile;
    thumbnail: UploadProps['thumbnail'];
    onDelete: UploadProps['onRemove'];
    slotProps?: {
        thumbnail?: Omit<FileThumbnailProps, 'file'>;
    };
};

export type MultiFilePreviewProps = BoxProps & {
    files: FilesUploadType;
    lastNode?: React.ReactNode;
    firstNode?: React.ReactNode;
    onRemove: UploadProps['onRemove'];
    onPreview?: OutletUploadProps['onPreview'];
    onClosePreview?: OutletUploadProps['onClosePreview'];
    thumbnail: UploadProps['thumbnail'];
    slotProps?: {
        thumbnail?: Omit<FileThumbnailProps, 'file'>;
    };
};

export type OutletUploadProps = DropzoneOptions & {
    error?: boolean;
    sx?: SxProps<Theme>;
    className?: string;
    thumbnail?: boolean;
    onDelete?: () => void;
    onUpload?: () => void;
    onRemoveAll?: () => void;
    onPreview?: (file: File | string) => void;
    onClosePreview?: () => void;
    helperText?: React.ReactNode;
    placeholder?: React.ReactNode;
    value?: FileUploadType | FilesUploadType;
    onRemove?: (file: File | OnlineFile) => void;
    dropzonePlaceholder?: string;
};

export interface ExtendFile extends File {
    preview?: string;
    path?: string;
    lastModifiedDate?: string;
}

export type FileThumbnailProps = BoxProps & {
    tooltip?: boolean;
    file: File | OnlineFile;
    imageView?: boolean;
    sx?: SxProps<Theme>;
    onDownload?: () => void;
    onRemove?: () => void;
    slotProps?: {
        img?: SxProps<Theme>;
        icon?: SxProps<Theme>;
        removeBtn?: SxProps<Theme>;
        downloadBtn?: SxProps<Theme>;
    };
    fileName?: string;
};
