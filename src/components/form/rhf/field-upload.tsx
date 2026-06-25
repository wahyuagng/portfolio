import type { ReactNode } from 'react';
import type { IFileInfo as UploaderFileInfo } from '@components/file-preview/types.ts';
import type { UploadProps as UploaderProps, OnlineFile as UploaderOnlineFile, FileUploadType as UploaderFileUploadType, FilesUploadType as UploaderFilesUploadType } from 'src/components/file-upload/types'; // <-- sesuaikan path

import React, { useState } from 'react';
import { BoxDetail } from '@components/box-detail/boxDetail';
import { Uploader } from '@components/file-upload/components/Uploader';

import { Stack, useTheme } from '@mui/material';

type RHFFileValue = UploaderFileUploadType | UploaderFilesUploadType | null;
type UploaderSingle = UploaderFileUploadType;
type UploaderArray = UploaderFilesUploadType;

type RHFFileUploadProps<T> = {
    form: {
        values: T;
        errors: Partial<Record<keyof T, any>>;
        setFieldValue: (name: keyof T, value: any) => void;
    };
    name: keyof T;
    label?: ReactNode;
    helperText?: ReactNode;
    required?: boolean;
    multiple?: boolean;
    accept?: string;
    dropzonePlaceholder?: string;
    fileInfos?: UploaderFileInfo[];
} & Omit<UploaderProps, 'file' | 'value' | 'onDrop' | 'onRemove' | 'onDelete'>;

export function FieldRHFFileUpload<T>({ form, name, label, helperText, required, multiple, accept, dropzonePlaceholder, fileInfos, ...other }: RHFFileUploadProps<T>) {
    const theme = useTheme();

    const fieldError = form.errors[name];
    const displayHelperText = fieldError ? ((fieldError as any)?.message ?? fieldError) : helperText;

    const value = (form.values[name] as unknown as RHFFileValue) ?? null;

    const [registeredFileInfos, setRegisteredFileInfos] = useState<UploaderFileInfo[] | undefined>(fileInfos);

    const handleDrop = (acceptedFiles: File[]) => {
        const cleanedFiles = acceptedFiles.map((f) => new File([f], f.name, { type: f.type }));

        let newValue: RHFFileValue;
        if (multiple) {
            const current = Array.isArray(value) ? (value as UploaderArray) : [];
            newValue = [...current, ...cleanedFiles] as UploaderArray;
        } else {
            newValue = (cleanedFiles[0] ?? null) as UploaderSingle | null;
        }

        form.setFieldValue(name, newValue);
    };

    const handleRemove = (selectedFile: File | UploaderOnlineFile) => {
        if (Array.isArray(value)) {
            const arr = value as UploaderArray;
            const updated = arr.filter((file) => file !== selectedFile);
            form.setFieldValue(name, updated);

            const deletedIndex = arr.indexOf(selectedFile as any);
            if (registeredFileInfos?.length && deletedIndex < registeredFileInfos.length) {
                setRegisteredFileInfos((prev) => prev?.filter((_, i) => i !== deletedIndex));
            }
        } else {
            form.setFieldValue(name, null);
        }
    };

    const handleDelete = () => {
        form.setFieldValue(name, multiple ? ([] as UploaderArray) : null);
    };

    return (
        <Stack direction="column" gap={1}>
            <BoxDetail.Type1 label={required ? `${String(label)}*` : String(label)} value={<Uploader multiple={multiple} accept={accept} value={(value ?? undefined) as UploaderFileUploadType | UploaderFilesUploadType | undefined} error={!!fieldError} helperText={displayHelperText} onDrop={handleDrop} onRemove={handleRemove} onDelete={handleDelete} dropzonePlaceholder={dropzonePlaceholder} {...other} />} />
        </Stack>
    );
}
