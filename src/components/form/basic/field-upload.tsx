import type { ReactNode } from 'react';
import type { IFileInfo as UploaderFileInfo } from '@components/file-preview/types.ts';
import type { UploadProps as UploaderProps, FileUploadType as UploaderFileUploadType, FilesUploadType as UploaderFilesUploadType } from 'src/components/file-upload/types';

import { Uploader } from '@components/file-upload/components/Uploader';

type FieldFileUploadProps = {
    value: any;
    setValue: (value: any) => void;
    onRemove?: (value: any) => void;
    onDelete?: (() => void) | undefined;
    disabled?: boolean;

    label?: ReactNode;
    helperText?: ReactNode;
    required?: boolean;
    multiple?: boolean;
    accept?: string;
    dropzonePlaceholder?: string;
    fileInfos?: UploaderFileInfo[];
} & Omit<UploaderProps, 'file' | 'value' | 'onDrop' | 'onRemove' | 'onDelete'>;

export function FieldUpload({ value, setValue, disabled, dropzonePlaceholder, ...other }: FieldFileUploadProps) {
    return <Uploader value={(value ?? undefined) as UploaderFileUploadType | UploaderFilesUploadType | undefined} onDrop={setValue} {...other} />;
}
