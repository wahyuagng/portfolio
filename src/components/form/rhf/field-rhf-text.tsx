import type { ReactNode } from 'react';
import type { Path } from 'react-hook-form';
import type { TextFieldProps } from '@mui/material';

import React, { useState } from 'react';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Tooltip, TextField, IconButton, InputAdornment } from '@mui/material';

import { getValue, getError } from './field-rhf';

type RHFTextInputWithTooltipErrorProps<T> = Omit<TextFieldProps, 'variant'> & {
    form: {
        values: T;
        errors: Partial<Record<keyof T, any>>;
        register: any;
        setFieldValue: (name: Path<T>, value: any) => void;
    };
    name: Path<T>;
    label: ReactNode;
    helperText?: ReactNode;
    variant?: 'outlined' | 'standard' | 'filled';
    showErrorAsTooltip?: boolean;
};

export function FieldRhfText<T>({ form, name, label, helperText, variant = 'outlined', showErrorAsTooltip = true, ...other }: RHFTextInputWithTooltipErrorProps<T>) {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const fieldError = getError(form.errors, name);
    const fieldValue = getValue(form.values, name);

    const errorMessage = fieldError ? (fieldError.message ?? fieldError) : null;
    const displayHelperText = !showErrorAsTooltip && errorMessage ? errorMessage : helperText;

    return (
        <TextField
            label={label}
            name={name}
            value={fieldValue ?? ''}
            error={!!fieldError}
            helperText={displayHelperText}
            fullWidth
            autoComplete="off"
            {...form.register(name)}
            onChange={(e) => form.setFieldValue(name, e.target.value)}
            variant={variant}
            InputProps={{
                ...other.InputProps,
                endAdornment:
                    showErrorAsTooltip && errorMessage ? (
                        <InputAdornment position="end">
                            <Tooltip title={errorMessage} placement="top" arrow open={tooltipOpen} onClose={() => setTooltipOpen(false)} onOpen={() => setTooltipOpen(true)}>
                                <IconButton
                                    size="small"
                                    onMouseEnter={() => setTooltipOpen(true)}
                                    onMouseLeave={() => setTooltipOpen(false)}
                                    sx={(theme) => ({
                                        color: theme.palette.error.main,
                                        p: 0.5,
                                    })}
                                >
                                    <InfoOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    ) : (
                        other.InputProps?.endAdornment
                    ),
            }}
            {...other}
        />
    );
}
