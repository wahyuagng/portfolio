import type { Dayjs } from 'dayjs';
import type { FC, ReactNode } from 'react';

import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Tooltip, IconButton, InputAdornment } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface FieldDateProps {
    label?: string;
    value?: any;
    setValue: (value: any) => void;
    format?: string;
    helperText?: ReactNode;
    disabled?: boolean;
    error?: any;
    showErrorAsTooltip?: boolean;
}

interface FieldTimeProps {
    label?: string;
    value?: string | null;
    setValue: (value: string | null) => void;
    format?: string;
    helperText?: ReactNode;
    disabled?: boolean;
    error?: any;
    showErrorAsTooltip?: boolean;
}

const FieldDate: FC<FieldDateProps> = ({ label, value, setValue, format, helperText, error, showErrorAsTooltip = true, ...other }) => {
    const [valueData, setValueData] = useState<Dayjs | null>(null);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const handleChange = (valueChange: Dayjs | null) => {
        setValueData(valueChange);
        setValue(valueChange?.format(format ?? 'YYYY-MM-DD'));
    };

    useEffect(() => {
        if (value) {
            setValueData(dayjs(value));
        } else {
            setValueData(null);
        }
    }, [value]);

    const errorMessage = error && helperText ? helperText : null;
    const displayHelperText = !showErrorAsTooltip && errorMessage ? errorMessage : !error ? helperText : null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label={label}
                value={valueData}
                onChange={handleChange}
                slotProps={{
                    textField: {
                        helperText: displayHelperText,
                        error: !!error,
                        fullWidth: true,
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
                {...other}
            />
        </LocalizationProvider>
    );
};

const FieldDateTime: FC<FieldDateProps> = ({ label, value, setValue, format, helperText, error, showErrorAsTooltip = true, ...other }) => {
    const [valueData, setValueData] = useState<Dayjs | null>(null);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const handleChange = (valueChange: Dayjs | null) => {
        setValueData(valueChange);
        setValue(valueChange?.format(format ?? 'YYYY-MM-DD HH:mm:ss'));
    };

    useEffect(() => {
        if (value) {
            setValueData(dayjs(value));
        } else {
            setValueData(null);
        }
    }, [value]);

    const errorMessage = error && helperText ? helperText : null;
    const displayHelperText = !showErrorAsTooltip && errorMessage ? errorMessage : !error ? helperText : null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
                label={label}
                value={valueData}
                onChange={handleChange}
                format={format}
                slotProps={{
                    textField: {
                        helperText: displayHelperText,
                        error: !!error,
                        fullWidth: true,
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
                {...other}
            />
        </LocalizationProvider>
    );
};

const FieldTime: FC<FieldTimeProps> = ({ label, value, setValue, format = 'HH:mm:ss', error, helperText, disabled, showErrorAsTooltip = true, ...other }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const errorMessage = error && helperText ? (typeof helperText === 'string' ? helperText : (helperText as any)?.message || String(helperText)) : null;
    const displayHelperText = !showErrorAsTooltip && errorMessage ? errorMessage : !error ? helperText : null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
                ampm={false}
                label={label}
                value={value ? dayjs(value, format) : null}
                onChange={(val: Dayjs | null) => {
                    setValue(val ? val.format(format) : null);
                }}
                format={format}
                disabled={disabled}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        error: !!error,
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
                {...other}
            />
        </LocalizationProvider>
    );
};

export { FieldDate, FieldTime, FieldDateTime };
