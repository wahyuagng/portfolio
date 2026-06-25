import type { MuiOtpInputProps } from 'mui-one-time-password-input';

import { useState } from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';

import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';

export type OTPInputProps = MuiOtpInputProps & {
    label?: string;
    value: any;
    setValue: (value: any) => void;
    helperText?: React.ReactNode;
};

export const FieldOtp: React.FC<OTPInputProps> = ({ value, setValue, helperText, ...other }) => {
    const [localValue, setLocalValue] = useState(value || '');
    const [touched, setTouched] = useState(false);
    const [error, setError] = useState(false);

    const handleChange = (val: string) => {
        setValue(val);
        setLocalValue(val);
    };

    const handleBlur = () => {
        setTouched(true);
        setError(localValue.length < 6);
    };

    return (
        <Box sx={{ width: '50%', height: '50%' }}>
            <MuiOtpInput
                value={localValue}
                onChange={handleChange}
                onBlur={handleBlur}
                gap={1.5}
                length={6}
                TextFieldsProps={{
                    error: error && touched,
                    placeholder: '-',
                }}
                {...other}
            />

            {((error && touched) || helperText) && (
                <FormHelperText sx={{ px: 2 }} error={error && touched}>
                    {error && touched ? 'Invalid OTP' : helperText}
                </FormHelperText>
            )}
        </Box>
    );
};
