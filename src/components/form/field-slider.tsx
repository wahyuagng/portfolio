import type { ReactNode } from 'react';
import type { SliderProps } from '@mui/material/Slider';

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';

export type FormikSliderProps = SliderProps & {
    name: string;
    label?: string;
    helperText?: ReactNode;
};

export const FieldSlider: React.FC<FormikSliderProps> = ({ name, helperText, label, ...other }) => {
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

                    <Slider
                        value={field.value}
                        onChange={(_event, value) => field.onChange(value)}
                        onBlur={() => field.onBlur()}
                        valueLabelDisplay="auto"
                        {...other}
                    />

                    <FormHelperText error={!!error}>{error?.message || helperText}</FormHelperText>
                </Stack>
            )}
        />
    );
};
