import type { FC } from 'react';
import type { TimePickerProps, PickersActionBarProps } from '@mui/x-date-pickers';

import { normalizeDateValue } from '@components/form/utils';
import { Controller, useFormContext } from 'react-hook-form';

import { TimePicker } from '@mui/x-date-pickers/TimePicker';

interface FieldTimeProps extends Omit<TimePickerProps, 'value' | 'onChange' | 'renderInput'> {
    name: string;
    label?: string;
    helperText?: string;
}

export const FieldTime: FC<FieldTimeProps> = ({ name, label, helperText, ...props }) => {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                field.value = normalizeDateValue(field.value);

                const slotPropsConfig = {
                    textField: {
                        label,
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message ?? helperText,
                    },
                    actionBar: {
                        actions: ['accept'],
                    } as PickersActionBarProps,
                };

                return (
                    <TimePicker
                        {...field}
                        {...props}
                        ampm={false}
                        label={label}
                        format="HH:mm"
                        onChange={(newValue) => field.onChange(newValue ? newValue.toISOString() : null)}
                        slotProps={slotPropsConfig}
                    />
                );
            }}
        />
    );
};
