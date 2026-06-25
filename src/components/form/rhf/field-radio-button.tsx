import type { Path, PathValue } from 'react-hook-form';

import { Box, Radio, FormLabel, FormControl, OutlinedInput, FormHelperText, FormControlLabel } from '@mui/material';

type Option = string | Record<string, any>;

type RHFRadioGroupProps<T> = {
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

export function FieldRhfRadioGroup<T>({ form, name, label, options, direction = 'column', displayKey, fullWidth = true, height = 56, padding = 1.5, width }: RHFRadioGroupProps<T>) {
    const fieldError = form.errors[name as unknown as keyof T];
    const selectedValue = form.values[name as unknown as keyof T] as PathValue<T, Path<T>>;

    const getNestedValue = (obj: any, path: string) => path.split('.').reduce((acc, key) => acc?.[key], obj);

    const handleChange = (value: any) => {
        form.setFieldValue(name as Path<T>, value as PathValue<T, Path<T>>);
    };

    const getLabel = (option: Option) => {
        if (typeof option === 'string') return option;
        if (displayKey) return getNestedValue(option, displayKey);
        console.warn("⚠️ 'displayKey' harus diisi jika options berupa objek.", option);
        return JSON.stringify(option);
    };

    const getValue = (option: Option) => {
        // Jika option adalah object, kembalikan object-nya langsung
        if (typeof option === 'string') return option;
        return option;
    };

    const isOptionSelected = (option: Option) => {
        if (typeof option === 'string') {
            return selectedValue === option;
        }
        // bandingkan isi object secara sederhana (berdasarkan Id jika ada)
        if (selectedValue && typeof selectedValue === 'object') {
            if ('Id' in option && 'Id' in (selectedValue as any)) {
                return (selectedValue as any).Id === option.Id;
            }
            // fallback: deep compare JSON
            return JSON.stringify(selectedValue) === JSON.stringify(option);
        }
        return false;
    };

    return (
        <FormControl
            fullWidth={fullWidth}
            error={!!fieldError}
            variant="outlined"
            sx={{
                width: fullWidth ? '100%' : width || 'auto',
            }}
        >
            <FormLabel
                sx={{
                    fontSize: 13,
                    mb: 0.5,
                    color: fieldError ? 'error.main' : 'text.secondary',
                }}
            >
                {label}
            </FormLabel>

            <OutlinedInput
                notched
                readOnly
                sx={{
                    p: 0,
                    backgroundColor: 'background.paper',
                    minHeight: height,
                    alignItems: 'center',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: fieldError ? 'error.main' : 'divider',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: fieldError ? 'error.main' : 'text.secondary',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: fieldError ? 'error.main' : 'primary.main',
                        borderWidth: 2,
                    },
                }}
                inputComponent={() => (
                    <Box
                        sx={{
                            p: padding,
                            display: 'grid',
                            gridTemplateColumns: direction === 'row' ? 'repeat(auto-fit, minmax(120px, 1fr))' : '1fr',
                            width: '100%',
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        {options.map((opt, i) => {
                            const optionLabel = getLabel(opt);
                            const checked = isOptionSelected(opt);

                            return (
                                <FormControlLabel
                                    key={i}
                                    value={typeof opt === 'string' ? opt : JSON.stringify(opt)}
                                    control={<Radio checked={checked} onChange={() => handleChange(getValue(opt))} size="small" />}
                                    label={optionLabel}
                                    sx={{
                                        width: '100%',
                                        m: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        '& .MuiTypography-root': {
                                            textAlign: 'left',
                                            flexGrow: 1,
                                        },
                                    }}
                                />
                            );
                        })}
                    </Box>
                )}
            />

            {fieldError && <FormHelperText>{fieldError.message ?? fieldError.toString()}</FormHelperText>}
        </FormControl>
    );
}
