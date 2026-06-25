import type { FC } from 'react';
import type { DateTimePickerProps, PickersActionBarProps } from '@mui/x-date-pickers';

import { normalizeDateValue } from '@components/form/utils';
import { Controller, useFormContext } from 'react-hook-form';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

interface FieldDateTimeProps extends Omit<DateTimePickerProps, 'value' | 'onChange' | 'renderInput'> {
    name: string;
    label?: string;
    helperText?: string;
}

export const FieldDateTime: FC<FieldDateTimeProps> = ({ name, label, helperText, ...props }) => {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                const slotPropsConfig = {
                    textField: {
                        label,
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message ?? helperText,
                    },
                    actionBar: {
                        actions: ['clear', 'cancel', 'accept'],
                    } as PickersActionBarProps,
                };

                return (
                    <DateTimePicker
                        {...field}
                        {...props}
                        ampm={false}
                        format="YYYY-MM-DD HH:mm"
                        value={normalizeDateValue(field.value)}
                        onChange={(newValue) => field.onChange(newValue ? newValue.toISOString() : null)}
                        slotProps={slotPropsConfig}
                    />
                );
            }}
        />
    );
};
