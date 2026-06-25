import type { EditorProps } from '@components/editor';

import { Editor } from '@components/editor';
import { Controller, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';

type FormikEditorProps = EditorProps & {
    name: string;
    label?: string;
    helperText?: string;
};

export function FieldEditor({ name, label, helperText, ...other }: FormikEditorProps) {
    const { control } = useFormContext();

    const theme = useTheme();

    return (
        <Stack gap={1}>
            {label && (
                <Typography variant="body2" fontWeight={700} sx={{ color: theme.palette.grey['600'] }}>
                    {label}
                </Typography>
            )}

            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error }, formState: { isSubmitting } }) => (
                    <Editor
                        {...field}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={() => field.onBlur()}
                        error={!!error}
                        helperText={error?.message || helperText}
                        resetValue={isSubmitting}
                        {...other}
                    />
                )}
            />
        </Stack>
    );
}
