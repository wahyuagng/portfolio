import type { FC } from 'react';

import React from 'react';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface FieldToggleButtonProps {
    value: boolean;
    setValue: (value: boolean) => void;
    disabled?: boolean;
}

export const FieldToggleButton: FC<FieldToggleButtonProps> = ({ value, setValue, disabled = false }) => {
    const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: boolean) => {
        if (newValue !== null) {
            setValue(newValue);
        }
    };

    return (
        <ToggleButtonGroup
            value={value}
            exclusive
            onChange={handleChange}
            aria-label="toggle"
            sx={{ borderRadius: 1, border: '1px dashed rgba(125, 125, 125, 0.3)' }}
            disabled={disabled}
        >
            <ToggleButton value color="success">
                Yes
            </ToggleButton>
            <ToggleButton value={false} color="error">
                No
            </ToggleButton>
        </ToggleButtonGroup>
    );
};
