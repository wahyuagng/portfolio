import type { ReactNode } from 'react';
import type { BaseOption } from '@components/form/types';

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { Switch, FormGroup, Typography, FormHelperText, FormControlLabel } from '@mui/material';

interface SwitchGroupProps {
    name: string;
    label: ReactNode;
    options: BaseOption[];
    helperText?: ReactNode;
}

export const FieldSwitchGroup = ({ name, label, options, helperText }: SwitchGroupProps) => {
    const { control } = useFormContext();
    const theme = useTheme();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Stack gap={1}>
                    {label && (
                        <Typography variant="body2" fontWeight={700} sx={{ color: theme.palette.grey['600'] }}>
                            {label}
                        </Typography>
                    )}

                    <FormGroup>
                        {options.map((option) => {
                            const isChecked = field.value?.some((item: BaseOption) => item.value === option.value);

                            return (
                                <FormControlLabel
                                    key={option.value}
                                    control={
                                        <Switch
                                            {...field}
                                            checked={isChecked}
                                            onChange={(_, checked) => {
                                                if (checked) {
                                                    field.onChange([...(field.value || []), option]);
                                                } else {
                                                    field.onChange(
                                                        (field.value || []).filter(
                                                            (item: BaseOption) => item.value !== option.value
                                                        )
                                                    );
                                                }
                                            }}
                                            color="primary"
                                        />
                                    }
                                    label={option.label}
                                    sx={{ color: error ? 'error.main' : 'text.primary' }}
                                />
                            );
                        })}

                        <FormHelperText error={!!error}>{error?.message || helperText}</FormHelperText>
                    </FormGroup>
                </Stack>
            )}
        />
    );
};
