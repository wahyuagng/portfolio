import { BoxDetail } from '@components/box-detail/boxDetail';

import { Box, Checkbox, FormControlLabel } from '@mui/material';

type Option = string | Record<string, any>;

type FieldCheckboxGroupProps = {
    value: any;
    setValue: (value: any) => void;
    disabled?: boolean;

    label: string;
    options: Option[];
    direction?: 'row' | 'column';
    displayKey?: string;
    fullWidth?: boolean;
    height?: number;
    padding?: number;
    width?: number | string;
};

export function FieldCheckboxGroup({ value, setValue, disabled, label, options, direction = 'column', displayKey, fullWidth, height = 56, padding = 1.5, width }: FieldCheckboxGroupProps) {
    const selectedValues = (value ?? []) as (string | number)[];

    const getNestedValue = (obj: any, path: string) => path.split('.').reduce((acc, key) => acc?.[key], obj);

    const handleChange = (val: any) => {
        const newValues = Array.isArray(selectedValues) ? [...selectedValues] : [];
        const index = newValues.indexOf(val);
        if (index > -1) newValues.splice(index, 1);
        else newValues.push(val);
        setValue(newValues);
    };

    const getLabel = (option: Option) => {
        if (typeof option === 'string') return option;
        if (displayKey) return getNestedValue(option, displayKey);
        console.warn("⚠️ 'displayKey' harus diisi jika options berupa objek.", option);
        return JSON.stringify(option);
    };

    const getValue = (option: Option) => {
        if (typeof option === 'string') return option;
        return option.value ?? option;
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

                return <FormControlLabel key={i} control={<Checkbox checked={checked} onChange={() => handleChange(val)} size="small" disabled={disabled} />} label={optionLabel} />;
            })}
        </Box>
    );

    return (
        <Box sx={{ width: fullWidth ? '100%' : width || 'auto' }}>
            <BoxDetail.Type1 label={label} value={checkboxContent} fullWidth={fullWidth} height={height} padding={padding} width={width} />
        </Box>
    );
}
