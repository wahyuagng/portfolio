import type { ReactNode } from 'react';
import type { TextFieldProps } from '@mui/material/TextField';

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FieldToggleButton } from '@components/grid/form/field-toggle-button';

import Stack from '@mui/material/Stack';
import { useTheme, Typography, FormHelperText } from '@mui/material';

export type ToggleButtonProps = TextFieldProps & {
    name: string;
    label?: ReactNode;
    helperText?: ReactNode;
    disabled?: boolean;
};

export const FieldToggle = ({ name, label, helperText, disabled = false }: ToggleButtonProps) => {
    const { control } = useFormContext();

    const theme = useTheme();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Stack gap={1} sx={{ position: 'relative' }}>
                    <Stack
                        direction="row"
                        gap={2}
                        alignItems="center"
                        sx={{
                            overflow: 'hidden',
                            minHeight: 56,
                        }}
                    >
                        <FieldToggleButton
                            value={field.value}
                            setValue={(newValue) => {
                                if (!disabled) {
                                    field.onChange(newValue);
                                }
                            }}
                            disabled={disabled}
                        />

                        {label && (
                            <Typography variant="body2" fontWeight={700} sx={{ color: theme.palette.grey['600'] }}>
                                {label}
                            </Typography>
                        )}
                    </Stack>

                    <FormHelperText error={!!error}>{error?.message || helperText}</FormHelperText>
                </Stack>
            )}
        />
    );
};
