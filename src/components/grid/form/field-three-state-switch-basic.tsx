import type { SwitchProps } from '@mui/material/Switch';
import type { BaseOption } from '@components/form/types';

import * as React from 'react';
import { useState } from 'react';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { FormControlLabel } from '@mui/material';
import Switch, { switchClasses } from '@mui/material/Switch';

type TriState = 1 | 2 | 3;

type ThreeStateSwitchProps = Omit<SwitchProps, 'onChange'> & {
    error?: boolean;
    options?: BaseOption[];
    onChange?: (val: number) => void;
};

export function ThreeStateSwitch({ onChange, options, error, ...other }: ThreeStateSwitchProps) {
    const [state, setState] = useState<TriState>(1);

    const theme = useTheme();

    return (
        <Stack spacing={1}>
            <FormControlLabel
                control={
                    <Switch
                        {...other}
                        checked
                        disableRipple
                        onChange={() => {
                            const nextState = ((state % 3) + 1) as TriState;

                            setState(nextState);
                            onChange?.(nextState - 1);
                        }}
                        sx={{
                            width: 84,
                            height: 40,
                            padding: 2,

                            // Switch Base
                            [`& .${switchClasses.switchBase}`]: {
                                padding: 0,
                                left: 8,
                                transform: `translateX(${state * 12}px)`,
                            },

                            // Thumb
                            [`& .${switchClasses.thumb}`]: {
                                width: 20,
                                height: 20,
                                backgroundColor: '#fff',
                            },

                            // Track
                            [`& .${switchClasses.track}`]: {
                                borderRadius: 999,
                                opacity: 1,
                                height: 24,
                                backgroundColor: 'error.main',
                            },

                            [`& .${switchClasses.checked} + .${switchClasses.track}`]: {
                                opacity: 1,
                                backgroundColor: theme.palette.grey[700],
                            },
                        }}
                    />
                }
                label={options && options[state - 1].label}
                sx={{ color: error ? 'error.main' : 'text.primary' }}
            />
        </Stack>
    );
}
