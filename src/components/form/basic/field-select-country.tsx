import { useState } from 'react';

import { CountrySelect } from 'src/components/country-select';

export type CountrySelectProps = {
    label?: React.ReactNode;
    value: any;
    setValue: (value: any) => void;
    placeholder?: string;
    helperText?: React.ReactNode;
};

export const FieldCountrySelect: React.FC<CountrySelectProps> = ({ value, setValue, label, helperText, ...other }) => {
    const [localValue, setLocalValue] = useState(value || '');
    const [error, setError] = useState(false);

    const handleChange = (_event: any, newValue: string) => {
        setValue(newValue);
        setLocalValue(newValue);
        setError(!newValue);
    };

    return (
        <CountrySelect
            label={label}
            id="field-country-select"
            value={localValue}
            onChange={handleChange}
            error={error}
            helperText={error ? 'Please select a country' : helperText}
            {...other}
            placeholder="Select your country"
            sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: 'black',
                },
            }}
        />
    );
};
