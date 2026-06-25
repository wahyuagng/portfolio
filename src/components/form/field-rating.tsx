import type { ReactNode } from 'react';
import type { RatingProps } from '@mui/material/Rating';
import type { Theme, SxProps } from '@mui/material/styles';
import type { FormHelperTextProps } from '@mui/material/FormHelperText';

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';

type FormikRatingProps = RatingProps & {
    name: string;
    label?: string;
    helperText?: ReactNode;
    slotProps?: {
        wrap?: SxProps<Theme>;
        formHelperText?: FormHelperTextProps;
    };
};

export function FieldRating({ name, label, helperText, slotProps, ...other }: FormikRatingProps) {
    const { control } = useFormContext();

    const theme = useTheme();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Stack gap={1} justifyContent="center" sx={{ ...slotProps?.wrap, minHeight: 56 }}>
                    <Stack direction="row" alignItems="center" gap={1.5}>
                        <Rating
                            value={field.value}
                            onChange={(_event, newValue) => field.onChange(newValue)}
                            onBlur={() => field.onBlur()}
                            {...other}
                        />

                        {label && (
                            <Typography variant="body2" fontWeight={700} sx={{ color: theme.palette.grey['600'] }}>
                                {label}
                            </Typography>
                        )}
                    </Stack>

                    <FormHelperText error={!!error}>{error?.message || helperText}</FormHelperText>
                </Stack>
            )}
        />
    );
}
