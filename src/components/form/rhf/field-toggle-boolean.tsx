import type { Path, PathValue } from 'react-hook-form';

import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';

type FieldRhfToggleBooleanProps<T> = {
    form: {
        values: T;
        errors: Partial<Record<keyof T, any>>;
        setFieldValue: (name: Path<T>, value: any) => void;
    };
    name: Path<T>;
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

export function FieldRhfToggleBoolean<T>({ form, name, label, trueLabel = 'Yes', falseLabel = 'No', trueColor = 'success.main', falseColor = 'error.main', fullWidth, width, height = 56, padding = 1.5 }: FieldRhfToggleBooleanProps<T>) {
    const fieldError = form.errors[name as unknown as keyof T];
    const value = form.values[name as unknown as keyof T] as PathValue<T, Path<T>>;

    const handleChange = (_: React.MouseEvent<HTMLElement>, newValue: boolean | null) => {
        if (newValue !== null) {
            form.setFieldValue(name as Path<T>, newValue as PathValue<T, Path<T>>);
        }
    };

    return (
        <Box
            sx={(theme) => ({
                position: 'relative',
                '&:hover .border-box': {
                    borderColor: theme.palette.text.primary,
                },
            })}
        >
            {label && (
                <Typography
                    variant="caption"
                    sx={(theme) => ({
                        position: 'absolute',
                        top: 0,
                        left: 10,
                        transform: 'translateY(-50%)',
                        px: '4px',
                        fontSize: 12,
                        color: theme.palette.text.secondary,
                        backgroundColor: theme.palette.background.paper,
                    })}
                >
                    {label}
                </Typography>
            )}

            <Box
                className="border-box"
                sx={(theme) => ({
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    borderRadius: 1,
                    minHeight: 56,
                    // p: 2,
                    py: 1,
                    px: 1,
                    // pt: 2.5,
                    transition: 'border-color 0.2s ease',

                    '&:focus-within': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                        // padding: '7px 15px 7px 15px',
                    },
                })}
            >
                <ToggleButtonGroup exclusive value={value} onChange={handleChange} size="small">
                    {/* TRUE BUTTON */}
                    <ToggleButton
                        value
                        sx={(theme) => ({
                            color: value === true ? 'white' : theme.palette.success.main,
                            backgroundColor: value === true ? theme.palette.success.main : 'transparent',
                            '&:hover': {
                                backgroundColor: value === true ? theme.palette.success.dark : theme.palette.action.hover,
                            },
                            textTransform: 'none',
                            fontWeight: 500,
                        })}
                    >
                        {trueLabel}
                    </ToggleButton>

                    {/* FALSE BUTTON */}
                    <ToggleButton
                        value={false}
                        sx={(theme) => ({
                            color: value === false ? 'white' : theme.palette.error.main,
                            backgroundColor: value === false ? theme.palette.error.dark : 'transparent',
                            '&:hover': {
                                backgroundColor: value === false ? theme.palette.error.dark : theme.palette.action.hover,
                            },
                            textTransform: 'none',
                            fontWeight: 500,
                        })}
                    >
                        {falseLabel}
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {fieldError && (
                <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                    {fieldError.message ?? fieldError.toString()}
                </Typography>
            )}
        </Box>
    );
}
