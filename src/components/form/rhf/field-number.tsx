import type { ReactNode } from 'react';
import type { TextFieldProps } from '@mui/material';
import type { Path, FieldValues } from 'react-hook-form';
import type { NumericFormatProps } from 'react-number-format';
import type { FormHelperReturn } from '@common/helpers/useRhfForm';

import { useState } from 'react';
import { NumericFormat } from 'react-number-format';

import IconButton from '@mui/material/IconButton';
import { Tooltip, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export type RHFFieldNumberProps<T extends FieldValues> = Omit<NumericFormatProps, 'onValueChange' | 'customInput' | 'value' | 'form'> &
    Omit<TextFieldProps, 'form'> & {
        form: FormHelperReturn<T>;
        name: Path<T>;
        label?: ReactNode;
        helperText?: ReactNode;
        prefix?: string;
        suffix?: string;
        thousandSeparator?: string;
        decimalSeparator?: string;
        showErrorAsTooltip?: boolean;
    };

export function FieldRhfNumber<T extends FieldValues>({ form, name, label, helperText, prefix = '', suffix = '', thousandSeparator = '.', decimalSeparator = ',', showErrorAsTooltip = true, InputProps, ...other }: RHFFieldNumberProps<T>) {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const fieldError = form.errors[name as keyof T];
    const errorMessage = fieldError ? ((fieldError as any).message ?? fieldError) : null;
    const displayHelperText = !showErrorAsTooltip && errorMessage ? errorMessage : !fieldError ? helperText : null;

    const rawValue = form.values[name as keyof T];
    let numericValue: string | number = '';

    if (typeof rawValue === 'number') {
        numericValue = rawValue.toString().replace('.', decimalSeparator);
    } else if (typeof rawValue === 'string') {
        numericValue = rawValue.replace('.', decimalSeparator);
    }

    return (
        <NumericFormat
            {...other}
            value={numericValue}
            label={label}
            customInput={TextField}
            thousandSeparator={thousandSeparator}
            decimalSeparator={decimalSeparator}
            prefix={prefix}
            suffix={suffix}
            fullWidth
            autoComplete="off"
            {...form.register(name)}
            error={!!fieldError}
            helperText={displayHelperText}
            allowNegative={other.allowNegative ?? true}
            onValueChange={(values) => {
                const newValue = values.floatValue ?? 0;
                form.setFieldValue(name, newValue);
            }}
            InputProps={{
                ...InputProps,
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
                        InputProps?.endAdornment
                    ),
            }}
        />
    );
}
