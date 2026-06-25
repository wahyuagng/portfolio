import type { NumericFormatProps } from 'react-number-format';
import type { TextFieldProps } from '@mui/material/TextField';

import React from 'react';
import { NumericFormat } from 'react-number-format';
import { Controller, useFormContext } from 'react-hook-form';

import { TextField } from '@mui/material';

type Props = NumericFormatProps &
    TextFieldProps & {
        name: string;
        prefix?: string;
        suffix?: string;
    };

export function FieldCurrency({ name, helperText, label, prefix, suffix, ...other }: Props) {
    const { control } = useFormContext();

    const currentPrefix = prefix && `${prefix} `;
    const currentSuffix = suffix && ` ${suffix}`;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <NumericFormat
                    {...field}
                    {...other}
                    value={field.value}
                    label={label}
                    customInput={TextField}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix={currentPrefix}
                    suffix={currentSuffix}
                    onValueChange={(values) => {
                        const floatValue = values.floatValue ?? 0;
                        field.onChange(floatValue);
                    }}
                    style={{ width: '100%' }}
                    error={!!error}
                    helperText={error ? error?.message : helperText}
                />
            )}
        />
    );
}
