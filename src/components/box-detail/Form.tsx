import type { FC, ReactNode } from 'react';

import { useState } from 'react';

import Typography from '@mui/material/Typography';
import { Box, Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface FormProps {
    label: string;
    value: ReactNode;
    fullWidth?: boolean;
    height?: number;
    padding?: number;
    width?: number | string;
    rightComponent?: ReactNode;
    error?: boolean;
    helperText?: string;
}

const Form: FC<FormProps> = ({ label, value, fullWidth, height = 56, padding = 1.5, width, rightComponent, error = false, helperText }) => {
    const isString = typeof value === 'string';
    const [tooltipOpen, setTooltipOpen] = useState(false);

    return (
        <Box
            sx={(theme) => ({
                position: 'relative',
                '&:hover .border-box': {
                    borderColor: error ? theme.palette.error.main : theme.palette.text.primary,
                },
            })}
        >
            <Typography
                variant="caption"
                sx={(theme) => ({
                    position: 'absolute',
                    top: 0,
                    left: 10,
                    transform: 'translateY(-50%)',
                    px: '4px',
                    fontSize: 12,
                    color: error ? theme.palette.error.main : theme.palette.text.secondary,
                    backgroundColor: theme.palette.background.paper,
                    zIndex: 1,
                })}
            >
                {label}
            </Typography>

            <Box
                className="border-box"
                sx={(theme) => ({
                    border: '1px solid',
                    borderColor: error ? theme.palette.error.main : theme.palette.divider,
                    borderRadius: 1,
                    minHeight: 56,
                    p: 2,
                    pt: 2.5,
                    transition: 'border-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    '&:focus-within': {
                        borderColor: error ? theme.palette.error.main : theme.palette.text.primary,
                        borderWidth: 2,
                        p: '7px 15px 7px 15px',
                        pt: '11px',
                    },
                })}
            >
                <Box sx={{ flex: 1, overflow: 'hidden' }}>{isString ? <Typography variant="body1">{value}</Typography> : value}</Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {rightComponent && <Box>{rightComponent}</Box>}

                    {helperText && (
                        <Tooltip title={helperText} placement="top" arrow open={tooltipOpen} onClose={() => setTooltipOpen(false)} onOpen={() => setTooltipOpen(true)}>
                            <IconButton
                                size="small"
                                onMouseEnter={() => setTooltipOpen(true)}
                                onMouseLeave={() => setTooltipOpen(false)}
                                sx={(theme) => ({
                                    color: error ? theme.palette.error.main : theme.palette.action.active,
                                    p: 0.5,
                                })}
                            >
                                <InfoOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Form;
