import type { MuiOtpInputProps } from 'mui-one-time-password-input';
import type { FormHelperTextProps } from '@mui/material/FormHelperText';

import { MuiOtpInput } from 'mui-one-time-password-input';
import { Controller, useFormContext } from 'react-hook-form';
import { HelperText } from '@components/hook-form/help-text';

import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box, { type BoxProps } from '@mui/material/Box';
import { inputBaseClasses } from '@mui/material/InputBase';

export interface FormikOTPInputProps extends Omit<MuiOtpInputProps, 'sx'> {
    name: string;
    label?: string;
    maxSize?: number;
    placeholder?: string;
    helperText?: React.ReactNode;
    slotProps?: {
        wrapper?: BoxProps;
        helperText?: FormHelperTextProps;
        textField?: MuiOtpInputProps['TextFieldsProps'];
    };
}

export const FieldOtp: React.FC<FormikOTPInputProps> = ({
    name,
    label,
    slotProps,
    helperText,
    maxSize = 56,
    placeholder = '-',
    ...other
}) => {
    const { control } = useFormContext();

    const theme = useTheme();

    return (
        <Stack gap={1}>
            {label && (
                <Typography variant="body2" fontWeight={700} sx={{ color: theme.palette.grey['600'] }}>
                    {label}
                </Typography>
            )}
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <Box
                        {...slotProps?.wrapper}
                        sx={[
                            {
                                [`& .${inputBaseClasses.input}`]: {
                                    p: 0,
                                    height: 'auto',
                                    aspectRatio: '1/1',
                                    maxWidth: maxSize,
                                },
                            },
                            ...(Array.isArray(slotProps?.wrapper?.sx)
                                ? slotProps.wrapper.sx
                                : [slotProps?.wrapper?.sx]),
                        ]}
                    >
                        <MuiOtpInput
                            {...field}
                            gap={1.5}
                            length={6}
                            TextFieldsProps={{
                                placeholder,
                                error: !!error,
                                ...slotProps?.textField,
                            }}
                            {...other}
                        />

                        <HelperText {...slotProps?.helperText} errorMessage={error?.message} helperText={helperText} />
                    </Box>
                )}
            />
        </Stack>
    );
};
