import type { PhoneInputProps } from '@components/phone-input';

import { PhoneInput } from '@components/phone-input';
import { Controller, useFormContext } from 'react-hook-form';

export type RHFPhoneInputProps = Omit<PhoneInputProps, 'value' | 'onChange'> & {
    name: string;
};

export function FieldPhoneNumber({ name, label, helperText, placeholder, ...other }: RHFPhoneInputProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <PhoneInput
                    {...field}
                    country="ID"
                    fullWidth
                    error={!!error}
                    placeholder={typeof label === 'string' ? label : placeholder}
                    helperText={error?.message ?? helperText}
                    {...other}
                />
            )}
        />
    );
}
