import type { FC, ReactNode, ChangeEvent } from 'react';
import type { TextFieldProps } from '@mui/material/TextField';

import { useState } from 'react';

import { Tooltip } from '@mui/material';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export type TextInputProps = TextFieldProps & {
    label: string;
    value: any;
    helperText?: ReactNode;
    setValue: (value: any) => void;
    disabled?: boolean;
    variant?: 'outlined' | 'standard' | 'filled';
    showErrorAsTooltip?: boolean;
};

export const FieldText: FC<TextInputProps> = ({ label, value, setValue, helperText, showErrorAsTooltip = true, error, InputProps, ...other }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const errorMessage = error && helperText ? helperText : null;
    const displayHelperText = !showErrorAsTooltip && errorMessage ? errorMessage : !error ? helperText : null;

    return (
        <TextField
            label={label}
            type="text"
            value={value}
            error={error}
            helperText={displayHelperText}
            onChange={handleChange}
            fullWidth
            autoComplete="off"
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
            {...other}
        />
    );
};
