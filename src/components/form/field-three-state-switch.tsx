import type { SwitchProps } from '@mui/material/Switch';
import type { BaseOption } from '@components/form/types';

import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ThreeStateSwitch } from '@components/grid/form/field-three-state-switch-basic';

import Stack from '@mui/material/Stack';
import { FormHelperText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

type ThreeStateSwitchProps = SwitchProps & {
    name: string;
    label?: string;
    helperText?: string;
    options: BaseOption[];
};

export function FieldThreeStateSwitch({ name, label, helperText, options, ...other }: ThreeStateSwitchProps) {
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
                    <Stack spacing={1}>
                        <ThreeStateSwitch
                            {...field}
                            value={field.value || ''}
                            error={!!error}
                            options={options}
                            onChange={(state) => field.onChange(options[state])}
                        />
                        <FormHelperText error={!!error}>{error?.message || helperText}</FormHelperText>
                    </Stack>
                )}
            />
        </Stack>
    );
}
