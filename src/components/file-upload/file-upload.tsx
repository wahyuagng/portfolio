import type { ReactNode } from 'react';
import type { IFileInfo } from '@components/file-preview/types.ts';
import type { OnlineFile, UploadProps } from './types.ts';

import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Uploader } from '@components/file-upload/components/Uploader';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

interface Props extends Omit<UploadProps, 'file'> {
    name: string;
    multiple?: boolean;
    label?: ReactNode;
    required?: boolean;
    dropzonePlaceholder?: string;
    fileInfos?: IFileInfo[];
    fileInfo?: IFileInfo;
}

export function FileUpload({
    name,
    required,
    label,
    multiple,
    helperText,
    accept,
    dropzonePlaceholder,
    fileInfos,
    ...other
}: Props) {
    const theme = useTheme();

    const { control, setValue } = useFormContext();

    const [registeredFileInfos, setRegisteredFileInfos] = useState<IFileInfo[] | undefined>(fileInfos);

    return (
        <Stack direction="column" gap={1}>
            <Typography variant="body2" fontWeight={700} sx={{ color: theme.palette.grey['600'] }}>
                {label}{' '}
                {required && (
                    <Box component="span" sx={{ color: theme.palette.error.dark }}>
                        *
                    </Box>
                )}
            </Typography>

            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => {
                    const uploadProps = {
                        multiple,
                        // accept: other.accept,
                        error: !!error,
                        helperText: error?.message ?? helperText,
                    };

                    const handleDrop = async (acceptedFiles: File[]) => {
                        const cleanedFiles = acceptedFiles.map((f) => new File([f], f.name, { type: f.type }));
                        const value = multiple ? [...(field.value || []), ...cleanedFiles] : cleanedFiles[0];

                        setValue(name, value, { shouldValidate: true });
                    };

                    // const handleDrop = async (acceptedFiles: File[]) => {
                    //   const value = multiple ? [...(field.value || []), ...acceptedFiles] : acceptedFiles[0];
                    //   setValue(name, value, { shouldValidate: true });
                    // };

                    const handleRemove = (selectedFile: File | OnlineFile) => {
                        const updated = (field.value || []).filter((file: File | OnlineFile) => file !== selectedFile);
                        setValue(name, updated, { shouldValidate: true });

                        const deletedIndex = (field.value || []).indexOf(selectedFile);
                        if (registeredFileInfos?.length && deletedIndex < registeredFileInfos.length) {
                            const newFileInfos = registeredFileInfos.filter((_, index) => index !== deletedIndex);
                            setRegisteredFileInfos(newFileInfos);
                        }
                    };

                    const handleDelete = () => {
                        setValue(name, '', { shouldValidate: true });
                    };

                    return (
                        <Uploader
                            {...uploadProps}
                            accept={accept}
                            value={field.value}
                            onDrop={handleDrop}
                            onRemove={handleRemove}
                            onDelete={handleDelete}
                            dropzonePlaceholder={dropzonePlaceholder}
                            {...other}
                        />
                    );
                }}
            />
        </Stack>
    );
}
