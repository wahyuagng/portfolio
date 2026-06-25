import type { Path, PathValue } from 'react-hook-form';

import { BoxDetail } from '@components/box-detail/boxDetail';

import { Box, Checkbox, FormHelperText, FormControlLabel } from '@mui/material';

type Option = string | Record<string, any>;

type RHFCheckboxGroupProps<T> = {
    form: {
        values: T;
        errors: Partial<Record<keyof T, any>>;
        setFieldValue: (name: Path<T>, value: any) => void;
    };
    name: Path<T>;
    label: string;
    options: Option[];
    direction?: 'row' | 'column';
    displayKey?: string;
    fullWidth?: boolean;
    height?: number;
    padding?: number;
    width?: number | string;
};

export function FieldRhfCheckboxGroup<T>({ form, name, label, options, direction = 'column', displayKey, fullWidth = true, height = 56, padding = 1.5, width }: RHFCheckboxGroupProps<T>) {
    const fieldError = form.errors[name as unknown as keyof T];
    const selectedValues = (form.values[name as unknown as keyof T] ?? []) as (string | number)[];

    const getNestedValue = (obj: any, path: string) => path.split('.').reduce((acc, key) => acc?.[key], obj);

    const handleChange = (value: any) => {
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
        const newValues = Array.isArray(selectedValues) ? [...selectedValues] : [];
        const index = newValues.indexOf(stringValue);
        if (index > -1) newValues.splice(index, 1);
        else newValues.push(stringValue);
        form.setFieldValue(name as Path<T>, newValues as PathValue<T, Path<T>>);
    };

    const getLabel = (option: Option) => {
        if (typeof option === 'string') return option;
        if (displayKey) return getNestedValue(option, displayKey);
        console.warn("⚠️ 'displayKey' harus diisi jika options berupa objek.", option);
        return JSON.stringify(option);
    };

    const getValue = (option: Option) => {
        if (typeof option === 'string') return option;
        return option.value ?? JSON.stringify(option);
    };

    const checkboxContent = (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: direction === 'row' ? `repeat(${options.length}, 1fr)` : 'none',
                width: '100%',
                gap: 1,
                flexDirection: direction === 'column' ? 'column' : undefined,
            }}
        >
            {options.map((opt, i) => {
                const val = getValue(opt);
                const optionLabel = getLabel(opt);
                const checked = selectedValues.includes(val);
                return <FormControlLabel key={i} control={<Checkbox checked={checked} onChange={() => handleChange(val)} size="small" />} label={optionLabel} />;
            })}
        </Box>
    );

    return (
        <Box sx={{ width: fullWidth ? '100%' : width || 'auto' }}>
            <BoxDetail.Type1 label={label} value={checkboxContent} fullWidth={fullWidth} height={height} padding={padding} width={width} />
            {fieldError && (
                <FormHelperText error sx={{ mt: 0.5, ml: 1.75 }}>
                    {fieldError.message ?? fieldError.toString()}
                </FormHelperText>
            )}
        </Box>
    );
}
