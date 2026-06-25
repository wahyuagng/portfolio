import type { Dayjs } from 'dayjs';
import type { ReactNode } from 'react';
import type { Path } from 'react-hook-form';

import dayjs from 'dayjs';
import { useState } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Box, Tooltip, IconButton, InputAdornment } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

type RHFDateTimeProps<T> = {
    form: {
        values: T;
        errors: Partial<Record<keyof T, any>>;
        setFieldValue: (name: Path<T>, value: any) => void;
    };
    name: Path<T>;
    label: ReactNode;
    helperText?: ReactNode;
    disabled?: boolean;
    format?: string;
    showErrorAsTooltip?: boolean;
    required?: boolean;
};

type RHFDateProps<T> = RHFDateTimeProps<T> & {
    views?: Array<'year' | 'month' | 'day'>;
};

type RHFTimeProps<T> = {
    form: {
        values: T;
        errors: Partial<Record<keyof T, any>>;
        setFieldValue: (name: Path<T>, value: any) => void;
    };
    name: Path<T>;
    label: ReactNode;
    helperText?: ReactNode;
    disabled?: boolean;
    format?: string;
    showErrorAsTooltip?: boolean;
};

export function FieldRHFDateTime<T>({ form, name, label, helperText, required, disabled = false, format = 'YYYY-MM-DD HH:mm', showErrorAsTooltip = true }: RHFDateTimeProps<T>) {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const fieldError = form.errors[name as unknown as keyof T];
    const errorMessage = fieldError ? (fieldError.message ?? fieldError) : null;
    const displayHelperText = !showErrorAsTooltip && errorMessage ? errorMessage : !fieldError ? helperText : null;

    const value = form.values[name as unknown as keyof T] as string | null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ mb: 1 }}>
                <DateTimePicker
                    ampm={false}
                    label={required ? label + '*' : label}
                    value={value ? dayjs(value as string) : null}
                    onChange={(val: Dayjs | null) => form.setFieldValue(name, val ? val.toISOString() : null)}
                    disabled={disabled}
                    format={format}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            error: !!fieldError,
                            helperText: displayHelperText,
                            InputProps: {
                                startAdornment:
                                    showErrorAsTooltip && errorMessage ? (
                                        <InputAdornment position="start">
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
                                    ) : undefined,
                            },
                        },
                    }}
                />
            </Box>
        </LocalizationProvider>
    );
}

export function FieldRHFDate<T>({ form, name, label, helperText, disabled = false, views = ['day', 'month', 'year'], required = false, format = 'YYYY-MM-DD', showErrorAsTooltip = true }: RHFDateProps<T>) {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const fieldError = form.errors[name as unknown as keyof T];
    const errorMessage = fieldError ? (fieldError.message ?? fieldError) : null;
    const displayHelperText = !showErrorAsTooltip && errorMessage ? errorMessage : !fieldError ? helperText : null;

    const value = form.values[name as unknown as keyof T] as string | null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label={required ? label + '*' : label}
                views={views}
                value={value ? dayjs(value) : null}
                onChange={(val: Dayjs | null) => form.setFieldValue(name, val ? val.toISOString() : null)}
                disabled={disabled}
                format={format}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        error: !!fieldError,
                        helperText: displayHelperText,
                        InputProps: {
                            startAdornment:
                                showErrorAsTooltip && errorMessage ? (
                                    <InputAdornment position="start">
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
                                ) : undefined,
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );
}

export function FieldRHFTime<T>({ form, name, label, helperText, disabled = false, format = 'HH:mm:ss', showErrorAsTooltip = true }: RHFTimeProps<T>) {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const fieldError = form.errors[name as unknown as keyof T];
    const errorMessage = fieldError ? (fieldError.message ?? fieldError) : null;
    const displayHelperText = !showErrorAsTooltip && errorMessage ? errorMessage : !fieldError ? helperText : null;

    const value = form.values[name as unknown as keyof T] as string | null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
                ampm={false}
                label={label}
                value={value ? dayjs(value, 'HH:mm:ss') : null}
                onChange={(val: Dayjs | null) => {
                    form.setFieldValue(name, val ? val.format('HH:mm:ss') : null);
                }}
                disabled={disabled}
                format={format}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        error: !!fieldError,
                        helperText: displayHelperText,
                        InputProps: {
                            startAdornment:
                                showErrorAsTooltip && errorMessage ? (
                                    <InputAdornment position="start">
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
                                ) : undefined,
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );
}
