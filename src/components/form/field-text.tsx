import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

export type TextInputProps = TextFieldProps & {
    name: string;
};

export const FieldText: React.FC<TextInputProps> = ({ name, label, helperText, ...other }) => {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    label={label}
                    type="text"
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                    fullWidth
                    autoComplete="off"
                    error={!!error}
                    helperText={error ? error?.message : helperText}
                    InputProps={{
                        readOnly: other?.InputProps?.readOnly,
                        ...other.InputProps,
                    }}
                    {...other}
                />
            )}
        />
    );
};
