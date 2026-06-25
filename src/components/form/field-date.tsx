import type { FC } from 'react';
import type { Dayjs } from 'dayjs';
import type { DatePickerProps, PickersActionBarProps } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import { Field } from '@components/hook-form';
import { normalizeDateValue } from '@components/form/utils';
import { Controller, useFormContext } from 'react-hook-form';

import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface FieldDateProps extends Omit<DatePickerProps, 'value' | 'onChange' | 'renderInput'> {
    name: string;
    label?: string;
    helperText?: string;
    disabledDates?: (Dayjs | Date | string)[];
}

export function FieldDate({ name, label, helperText, disabledDates, ...other }: FieldDateProps) {
    const { control } = useFormContext();

    const disabled = disabledDates?.map((value) => dayjs(value)) ?? [];

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
                    <DatePicker
                        {...field}
                        {...other}
                        format="YYYY-MM-DD"
                        value={normalizeDateValue(field.value)}
                        onChange={(newValue) => field.onChange(newValue ? newValue.toISOString() : null)}
                        shouldDisableDate={(date) => disabled.some((day) => date.isSame(day, 'day'))}
                        slotProps={slotPropsConfig}
                    />
                );
            }}
        />
    );
}

interface YearPickerProps {
    label?: string;
    name?: string;
}

const getYears = (startYear = 2000, endOffset = 20) => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - startYear + endOffset + 1 }, (_, i) => startYear + i);
};

const YearPicker: FC<YearPickerProps> = ({ label = 'Pilih Tahun', name = 'Year' }) => {
    const years = getYears();

    return (
        <Field.Select name={name} label={label}>
            <MenuItem value="">-- Pilih Tahun --</MenuItem>
            {years.map((year) => (
                <MenuItem key={year} value={year}>
                    {year}
                </MenuItem>
            ))}
        </Field.Select>
    );
};

export default YearPicker;
