import type { FC, ReactNode } from 'react';

import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

interface Type1Props {
    label: string;
    value: ReactNode;
    fullWidth?: boolean;
    height?: number;
    padding?: number;
    width?: number | string;
    rightComponent?: ReactNode;
}

const Type1: FC<Type1Props> = ({ label, value, fullWidth, height = 56, padding = 1.5, width, rightComponent }) => {
    const isString = typeof value === 'string';
    return (
        <Box
            sx={(theme) => ({
                position: 'relative',
                '&:hover .border-box': {
                    borderColor: theme.palette.text.primary,
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
                    color: theme.palette.text.secondary,
                    backgroundColor: theme.palette.background.paper,
                })}
            >
                {label}
            </Typography>

            <Box
                sx={(theme) => ({
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    borderRadius: 1,
                    minHeight: 56,
                    p: 2,
                    pt: 2.5,
                    transition: 'border-color 0.2s ease',
                    display: rightComponent ? 'flex' : '',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    '&:focus-within': {
                        borderColor: theme.palette.text.primary,
                        borderWidth: 2,
                        // padding: '7px 15px 7px 15px',
                    },
                })}
            >
                {isString ? <Typography variant="body1">{value}</Typography> : value}
                {rightComponent && <Box>{rightComponent}</Box>}
            </Box>
        </Box>
    );
};

export default Type1;
