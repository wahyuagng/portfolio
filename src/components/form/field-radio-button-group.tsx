import type { ReactNode } from 'react';
import type { BaseOption } from '@components/form/types';
import type { RadioGroupProps } from '@mui/material/RadioGroup';

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { Radio, RadioGroup, Typography, FormControl, FormHelperText, FormControlLabel } from '@mui/material';

interface RadioButtonGroupProps extends RadioGroupProps {
    name: string;
    label: ReactNode;
    options: BaseOption[];
    helperText?: ReactNode;
}

export const FieldRadioButtonGroup = ({ name, label, options, helperText }: RadioButtonGroupProps) => {
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

                    <FormControl component="fieldset" error={!!error}>
                        <RadioGroup
                            {...field}
                            name={name}
                            value={field.value?.value ?? ''}
                            onChange={(event) => {
                                const selectedValue = event.target.value;
                                const selectedOption = options.find((opt) => opt.value === selectedValue);
                                if (selectedOption) {
                                    field.onChange(selectedOption);
                                }
                            }}
                        >
                            {options.map((option) => (
                                <FormControlLabel
                                    key={option.value}
                                    value={option.value}
                                    control={<Radio />}
                                    label={option.label}
                                    sx={{ color: error ? 'error.main' : 'text.primary' }}
                                />
                            ))}
                        </RadioGroup>

                        <FormHelperText error={!!error}>{error?.message || helperText}</FormHelperText>
                    </FormControl>
                </Stack>
            )}
        />
    );
};
