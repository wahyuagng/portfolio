import type { Filter, FilterOperator } from '@services/api/types';

import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { Iconify } from '@components/iconify';

import IconButton from '@mui/material/IconButton';
import { Box, Drawer, Button, Divider, Tooltip, useTheme, Typography, useMediaQuery } from '@mui/material';

interface FilterConfig {
    attribute: string;
    field: (value: any, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => React.ReactNode;
    operator?: FilterOperator;
    allowNullOrEmptyFilter?: boolean;
}

interface FilterComponentProps {
    filters: Filter[];
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
    configs: FilterConfig[];
}

const FilterComponent: React.FC<FilterComponentProps> = ({ filters, setFilters, configs }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState<Filter[]>(filters);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleChange = (attribute: string, value: any, operator: FilterOperator, allowNullOrEmptyFilter?: boolean) => {
        if ((value === null || value === '') && !allowNullOrEmptyFilter) {
            setLocalFilters((prev) => prev.filter((f) => f.attribute !== attribute));
            return;
        }

        setLocalFilters((prev) => {
            const idx = prev.findIndex((f) => f.attribute === attribute);
            const updatedFilter: Filter = { attribute, value, operator };
            if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = updatedFilter;
                return updated;
            }
            return [...prev, updatedFilter];
        });
    };

    const handleReset = () => {
        setLocalFilters([]);
        setFilters([]);
    };

    const handleApply = () => {
        setFilters(localFilters);
        setDrawerOpen(false);
    };

    const handleOpen = () => {
        setLocalFilters(filters);
        setDrawerOpen(true);
    };

    return (
        <>
            <Tooltip title="Filters">
                <Button color={filters.length > 0 ? 'primary' : 'inherit'} size="small" onClick={handleOpen} startIcon={<Icon icon="mdi:filter-variant" width={20} height={20} />}>
                    {!isMobile ? 'Filters' : ''}
                </Button>
            </Tooltip>

            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box
                    sx={{
                        width: 320,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 3,
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Filters</Typography>
                        <IconButton onClick={() => setDrawerOpen(false)}>
                            <Iconify icon="mingcute:close-line" />
                        </IconButton>
                    </Box>

                    <Divider />

                    <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 1 }}>
                        {configs.map((config) => {
                            const currentFilter = localFilters.find((f) => f.attribute === config.attribute);
                            const value = currentFilter?.value ?? '';
                            const operator = currentFilter?.operator ?? config.operator ?? 'LIKE';

                            const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement> | number | string) => {
                                if (typeof e === 'object' && 'target' in e) {
                                    handleChange(config.attribute, e.target.value, operator, config.allowNullOrEmptyFilter);
                                    return;
                                }

                                handleChange(config.attribute, e, operator, config.allowNullOrEmptyFilter);
                            };

                            return (
                                <Box key={config.attribute} sx={{ mb: 2, mt: 2 }}>
                                    {config.field(value, handleFieldChange)}
                                </Box>
                            );
                        })}
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="outlined" onClick={handleReset} startIcon={<Icon icon="mdi:refresh" />} sx={{ height: 25 }}>
                            Reset
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleApply} startIcon={<Icon icon="mdi:check" />} sx={{ height: 25 }}>
                            Apply
                        </Button>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};

export default FilterComponent;
