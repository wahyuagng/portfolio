import { Box, Radio, Typography, RadioGroup, FormControlLabel } from '@mui/material';

type Option = string | Record<string, any>;

type FieldRadioGroupProps = {
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

export function FieldRadioGroup({ value, setValue, disabled, label, options, direction = 'column', displayKey, fullWidth, height = 56, padding = 1.5, width }: FieldRadioGroupProps) {
    const getNestedValue = (obj: any, path: string) => path.split('.').reduce((acc, key) => acc?.[key], obj);

    const handleChange = (val: any) => {
        setValue(val);
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

    return (
        <Box sx={{ position: 'relative', width: fullWidth ? '100%' : width || 'auto' }}>
            <Typography
                variant="caption"
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 12,
                    transform: 'translateY(-50%)',
                    px: 0.5,
                    fontSize: 12,
                    color: 'text.secondary',
                    zIndex: 1,
                    backgroundColor: 'background.paper',
                }}
            >
                {label}
            </Typography>

            <Box
                sx={{
                    border: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: 1,
                    p: padding,
                    minHeight: height,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'background.paper',
                }}
            >
                <RadioGroup row={direction === 'row'} value={value ?? ''} onChange={(_, val) => handleChange(val)}>
                    {options.map((opt, i) => {
                        const val = getValue(opt);
                        const optionLabel = getLabel(opt);
                        return <FormControlLabel key={i} value={val} control={<Radio disabled={disabled} size="small" />} label={optionLabel} />;
                    })}
                </RadioGroup>
            </Box>
        </Box>
    );
}
