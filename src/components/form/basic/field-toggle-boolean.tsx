import type { MouseEvent } from 'react';

import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';

type FieldToggleBooleanProps = {
    value: any;
    setValue: (value: boolean) => void;
    disabled?: boolean;

    label?: string;
    trueLabel?: string;
    falseLabel?: string;
    trueColor?: string;
    falseColor?: string;
    fullWidth?: boolean;
    width?: number | string;
    height?: number;
    padding?: number;
};

export function FieldToggleBoolean({ value, setValue, label, trueLabel = 'Yes', falseLabel = 'No', trueColor = 'success.main', falseColor = 'error.main', fullWidth, width, height = 56, padding = 1.5, disabled }: FieldToggleBooleanProps) {
    const handleChange = (_event: MouseEvent<HTMLElement>, val: any) => {
        setValue(val);
    };

    return (
        <Box sx={{ position: 'relative', width: fullWidth ? '100%' : width || 'auto' }}>
            {label && (
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
            )}

            <Box
                sx={{
                    border: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: 1,
                    p: padding,
                    minHeight: height,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.paper',
                }}
            >
                <ToggleButtonGroup disabled={disabled} exclusive value={Boolean(value)} onChange={handleChange} size="small">
                    <ToggleButton
                        value
                        sx={{
                            color: value === true ? 'white' : trueColor,
                            backgroundColor: value === true ? trueColor : 'transparent',
                            '&:hover': {
                                backgroundColor: value === true ? trueColor : 'rgba(0,0,0,0.04)',
                            },
                            textTransform: 'none',
                            fontWeight: 500,
                        }}
                    >
                        {trueLabel}
                    </ToggleButton>

                    <ToggleButton
                        value={false}
                        sx={{
                            color: value === false ? 'white' : falseColor,
                            backgroundColor: value === false ? falseColor : 'transparent',
                            '&:hover': {
                                backgroundColor: value === false ? falseColor : 'rgba(0,0,0,0.04)',
                            },
                            textTransform: 'none',
                            fontWeight: 500,
                        }}
                    >
                        {falseLabel}
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Box>
    );
}
