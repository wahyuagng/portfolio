import type { ReactNode } from 'react';
import type { CheckboxProps } from '@mui/material';
import type { BaseOption } from '@components/form/types';

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Checkbox, FormGroup, FormHelperText, FormControlLabel } from '@mui/material';

interface CheckboxGroupProps {
    name: string;
    label?: ReactNode;
    options: BaseOption[];
    helperText?: ReactNode;
    checkboxProps?: CheckboxProps;
    storeValueOnly?: boolean; // if true, store string[] instead of BaseOption[]
}

export const FieldCheckboxGroup = ({
    name,
    label,
    options,
    helperText,
    checkboxProps,
    storeValueOnly = true,
}: CheckboxGroupProps) => {
    const { control } = useFormContext();
    const theme = useTheme();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                const valueArray = field.value || [];
                const selectedValues = storeValueOnly
                    ? (valueArray as string[])
                    : (valueArray as BaseOption[]).map((opt) => opt.value);

                const handleToggle = (option: BaseOption) => {
                    const isSelected = selectedValues.includes(option.value);

                    if (storeValueOnly) {
                        field.onChange(
                            isSelected
                                ? selectedValues.filter((v) => v !== option.value)
                                : [...selectedValues, option.value]
                        );
                    } else {
                        field.onChange(
                            isSelected
                                ? (valueArray as BaseOption[]).filter((o) => o.value !== option.value)
                                : [...(valueArray as BaseOption[]), option]
                        );
                    }
                };

                return (
                    <Stack gap={1}>
                        {label && (
                            <Typography variant="body2" fontWeight={700} sx={{ color: theme.palette.grey['600'] }}>
                                {label}
                            </Typography>
                        )}

                        <FormGroup>
                            {options.map((option) => (
                                <FormControlLabel
                                    key={option.value}
                                    control={
                                        <Checkbox
                                            {...checkboxProps}
                                            checked={selectedValues.includes(option.value)}
                                            onChange={() => handleToggle(option)}
                                        />
                                    }
                                    label={option.label}
                                    sx={{ color: error ? 'error.main' : 'text.primary' }}
                                />
                            ))}

                            <FormHelperText error={!!error}>{error?.message || helperText}</FormHelperText>
                        </FormGroup>
                    </Stack>
                );
            }}
        />
    );
};
