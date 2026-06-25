import type { Path, PathValue } from 'react-hook-form';

import { Editor } from '@components/editor';

import { Box, Typography, FormHelperText } from '@mui/material';

type RHFTextEditorProps<T> = {
    form: {
        values: T;
        errors: Partial<Record<keyof T, any>>;
        setFieldValue: (name: Path<T>, value: any) => void;
    };
    name: Path<T>;
    label?: string;
    placeholder?: string;
    fullWidth?: boolean;
    height?: number | string;
    helperText?: string;
};

export function FieldRhfTextEditor<T>({ form, name, label, placeholder = 'Write something awesome...', fullWidth = true, height = 200, helperText }: RHFTextEditorProps<T>) {
    const fieldError = form.errors[name as unknown as keyof T];
    const rawValue = form.values[name as unknown as keyof T];
    const value = typeof rawValue === 'string' ? rawValue : '';

    const handleChange = (html: string) => {
        form.setFieldValue(name as Path<T>, html as PathValue<T, Path<T>>);
    };

    return (
        <Box sx={{ width: fullWidth ? '100%' : 'auto', position: 'relative' }}>
            {label && (
                <Typography
                    variant="caption"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 12,
                        transform: 'translateY(-50%)',
                        px: 0.5,
                        fontSize: 12,
                        color: fieldError ? 'error.main' : 'text.secondary',
                        zIndex: 1,
                        backgroundColor: 'background.paper',
                    }}
                >
                    {label}
                </Typography>
            )}

            <Box
                sx={{
                    border: `1px solid ${fieldError ? 'red' : 'rgba(0,0,0,0.2)'}`,
                    borderRadius: 1,
                    p: 1.5,
                    backgroundColor: 'background.paper',
                    minHeight: height,
                    '& .ProseMirror': {
                        minHeight: typeof height === 'number' ? height - 40 : height,
                    },
                }}
            >
                <Editor value={value} onChange={handleChange} placeholder={placeholder} error={fieldError} helperText={helperText} />
            </Box>

            {(fieldError || helperText) && (
                <FormHelperText error={!!fieldError} sx={{ ml: 1 }}>
                    {fieldError?.message ?? helperText}
                </FormHelperText>
            )}
        </Box>
    );
}
