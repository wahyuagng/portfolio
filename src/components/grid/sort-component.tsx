import React, { useState } from 'react';
import { useTranslate } from '@locales/use-locales';
import { Icon } from '@iconify/react/dist/iconify.js';
import { ThreeStateSwitch } from '@components/grid/form/field-three-state-switch-basic';

import Tooltip from '@mui/material/Tooltip';
import { Box, Stack, Button, Divider, Popover, Typography, FormControlLabel } from '@mui/material';

export interface SortProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    setSort: (data: string) => void;
    fields: SortField[];
}

export interface SortField {
    key: string;
    label?: string;
}

const SortComponent: React.FC<SortProps> = ({ setVisible, fields, setSort }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const { t } = useTranslate();

    const [sortValues, setSortValues] = useState<Record<string, 'asc' | 'desc' | ''>>(
        fields.reduce(
            (acc, field) => ({
                ...acc,
                [field.key]: '',
            }),
            {}
        )
    );

    const handleToggle = (key: string) => {
        setSortValues((prev) => {
            const newSort = prev[key] === 'asc' ? 'desc' : prev[key] === 'desc' ? '' : 'asc';
            return { ...prev, [key]: newSort };
        });
    };

    const handleReset = () => {
        setSortValues(fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {}));
        setSort('');
    };

    const handleApply = () => {
        const sortedFields = Object.entries(sortValues)
            .filter(([_, value]) => value !== '')
            .map(([key, value]) => (value === 'desc' ? `-${key}` : key))
            .join(';');

        setSort(sortedFields);
        setVisible(false);
    };

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <Tooltip title="Sort">
                <Button onClick={handleOpen} startIcon={<Icon icon="mdi:sort" />} sx={{ width: 'auto', height: 25 }}>
                    {t('sort')}
                </Button>
            </Tooltip>
            {/*<Button variant="text" color={hasActiveSorts ? 'primary' : 'inherit'} startIcon={<Icon icon="mdi:sort-alphabetical-ascending" />} onClick={() => setVisible(true)}>*/}
            {/*  Sort*/}
            {/*</Button>*/}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                {fields.map(({ key, label }) => (
                    <Stack key={key} direction="row" spacing={2} alignItems="center">
                        <Typography sx={{ flexBasis: 100, flexShrink: 0 }}>{label || key}</Typography>
                        {/*<FormControlLabel*/}
                        {/*  control={<Switch checked={sortValues[key] !== ''} onChange={() => handleToggle(key)} />}*/}
                        {/*  label={sortValues[key] === 'asc' ? 'ASC' : sortValues[key] === 'desc' ? 'DESC' : 'OFF'}*/}
                        {/*/>*/}
                        <FormControlLabel
                            control={<ThreeStateSwitch onChange={() => handleToggle(key)} sx={{ flexGrow: 1 }} />}
                            label={sortValues[key] === 'asc' ? 'ASC' : sortValues[key] === 'desc' ? 'DESC' : 'OFF '}
                            sx={{ flexGrow: 1 }}
                        />
                    </Stack>
                ))}

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Button
                        color="error"
                        variant="contained"
                        startIcon={<Icon icon="mdi:sort-alphabetical-ascending" />}
                        onClick={handleReset}
                    >
                        Clear
                    </Button>
                    <Button variant="contained" color="success" onClick={handleApply}>
                        Apply
                    </Button>
                </Box>
            </Popover>
        </>
    );
};

export default SortComponent;
