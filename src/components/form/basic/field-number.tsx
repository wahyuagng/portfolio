import type { TextFieldProps } from '@mui/material/TextField';
import type { NumericFormatProps } from 'react-number-format';

import { useState } from 'react';
import { NumericFormat } from 'react-number-format';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Tooltip, TextField, IconButton, InputAdornment } from '@mui/material';

export type FormikNumberInputProps = Omit<NumericFormatProps, 'onValueChange' | 'customInput' | 'value'> &
    Omit<TextFieldProps, 'value'> & {
        label: any;
        value: any;
        setValue: (value: any) => void;
        showErrorAsTooltip?: boolean;
        prefix?: string;
        suffix?: string;
        thousandSeparator?: string;
        decimalSeparator?: string;
    };

export const FieldNumber: React.FC<FormikNumberInputProps> = ({ label, value, setValue, showErrorAsTooltip = true, error, helperText, prefix = '', suffix = '', thousandSeparator = '.', decimalSeparator = ',', InputProps, ...other }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const errorMessage = error && helperText ? helperText : null;
    const displayHelperText = !showErrorAsTooltip && errorMessage ? errorMessage : !error ? helperText : null;

    const rawValue = value;
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
            error={error}
            helperText={displayHelperText}
            allowNegative={other.allowNegative ?? true}
            onValueChange={(values) => {
                // const newValue = values.floatValue ?? null;
                const newValue = values.floatValue ?? 0;
                setValue(newValue);
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
};
