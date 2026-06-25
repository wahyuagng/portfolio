import { HexColorPicker } from 'react-colorful';
// Field.ColorPickerSpectrum.tsx
import { Controller, useFormContext } from 'react-hook-form';

import { Stack, TextField } from '@mui/material';

type FieldColorPickerSpectrumProps = {
    name: string;
    label?: string;
};

export function FieldColorPickerSpectrum({ name, label }: FieldColorPickerSpectrumProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Stack spacing={1}>
                    {label && <label>{label}</label>}

                    {/* Komponen spectrum color picker */}
                    <HexColorPicker color={field.value || '#ffffff'} onChange={field.onChange} />

                    {/* Auto generate hex code ke input */}
                    <TextField
                        size="small"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                    />
                </Stack>
            )}
        />
    );
}
