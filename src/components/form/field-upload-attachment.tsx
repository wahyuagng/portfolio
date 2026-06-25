/* eslint-disable */
import { useFormContext, Controller } from 'react-hook-form';
import FormHelperText from '@mui/material/FormHelperText';
import { Upload, UploadProps } from '../upload';

// ----------------------------------------------------------------------

interface Props extends Omit<UploadProps, 'file' | 'files'> {
    name: string;
    multiple?: boolean;
    helperText?: React.ReactNode;
}

// ----------------------------------------------------------------------

export function FieldUploadAttachment({ name, multiple, helperText, ...other }: Props) {
    const { control, setValue } = useFormContext();

    const handleConvertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                const commonProps = {
                    error: !!error,
                    helperText: (!!error || helperText) && (
                        <FormHelperText error={!!error} sx={{ px: 2 }}>
                            {error ? error.message : helperText}
                        </FormHelperText>
                    ),
                    ...other,
                };

                const onDropSingle = async (acceptedFiles: File[]) => {
                    const file = acceptedFiles[0];
                    if (file) {
                        const base64 = await handleConvertToBase64(file);
                        field.onChange(base64);
                    }
                };

                const onDropMultiple = async (acceptedFiles: File[]) => {
                    const base64List = await Promise.all(acceptedFiles.map((file) => handleConvertToBase64(file)));
                    field.onChange(base64List);
                };

                if (multiple) {
                    return (
                        <Upload
                            multiple
                            accept={{ '*': [] }}
                            value={field.value}
                            onDrop={onDropMultiple}
                            {...commonProps}
                        />
                    );
                }

                return <Upload accept={{ '*': [] }} value={field.value} onDrop={onDropSingle} {...commonProps} />;
            }}
        />
    );
}
