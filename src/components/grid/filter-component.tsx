import type { FilterOperator } from '@services/api/types';
import type { PaginationProps } from './interfaces/grid.interface';

import { Icon } from '@iconify/react';
import { Iconify } from '@components/iconify';
import React, { useMemo, useState } from 'react';
import { Scrollbar } from '@components/scrollbar';
import { useTranslate } from '@locales/use-locales';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import { Box, Divider, IconButton, Typography } from '@mui/material';

export interface FilterProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    setFilter: (data: Record<string, any>) => void;
    page?: PaginationProps;
    setPage?: (data: PaginationProps) => void;
    config: FilterField[];
}

export interface FilterField {
    attribute: string;
    label?: string;
    // field: (value: any, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => React.ReactNode;
    field: (value: any, onChange: (value: any) => void) => React.ReactNode;
    operator?: FilterOperator;
}

interface FilterOption {
    label: string;
    value: string | number;
}

interface FilterValue {
    operator: string | undefined;
    value: any;
    fullOption?: { label: string; value: string };
}

// const isValueLabelObject = (obj: any): obj is { value: string; label: string } => {
// 	return typeof obj === "object" && obj !== null && "value" in obj && "label" in obj && typeof obj.value === "string" && typeof obj.label === "string";
// };
//
// const isOnlyNumbersAndCommas = (str: string): boolean => {
// 	return /^[\d,]+$/.test(str);
// };
//
// const parseNumber = (str: string) => Number(str.replace(/,/g, ""));

type FilterValuesState = Record<string, FilterValue>;

// Update the buildFilterObject function to include the new type
const buildFilterObject = (filters: FilterField[]): FilterValuesState => {
    const result: FilterValuesState = {};
    for (const filter of filters) {
        result[filter.attribute] = {
            operator: filter.operator ?? 'LIKE',
            value: null,
            fullOption: undefined,
        };
    }
    return result;
};

const FilterComponent: React.FC<FilterProps> = ({ visible, setVisible, config, setFilter, setPage, page }) => {
    const normalizeFilterValues = useMemo(() => buildFilterObject(config), [config]);
    const [filterVals, setFilterVals] = useState<FilterValuesState>(normalizeFilterValues);
    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    const { t } = useTranslate();

    const handleChange =
        (attribute: string, operator: string = 'LIKE') =>
        (e: React.ChangeEvent<HTMLInputElement> | FilterOption | any) => {
            // Handle null/empty values
            if (e === null || e === '') {
                setFilterVals((prev) => {
                    const newVals: FilterValuesState = {
                        ...prev,
                        [attribute]: {
                            operator: operator || 'LIKE',
                            value: null,
                            fullOption: undefined,
                        },
                    };
                    return newVals;
                });
                return;
            }

            // Handle dropdown selection (FilterOption)
            if (e && typeof e === 'object' && 'value' in e && 'label' in e) {
                setFilterVals((prev) => ({
                    ...prev,
                    [attribute]: {
                        operator,
                        value: e.value,
                        fullOption: e,
                    },
                }));
                return;
            }

            // Handle text input
            if (e && typeof e === 'object' && 'target' in e) {
                setFilterVals((prev) => ({
                    ...prev,
                    [attribute]: {
                        operator,
                        value: e.target.value,
                        fullOption: undefined,
                    },
                }));
                return;
            }

            // Handle other types of values
            setFilterVals((prev) => ({
                ...prev,
                [attribute]: {
                    operator,
                    value: e,
                    fullOption: undefined,
                },
            }));
        };

    const handleReset = () => {
        const resetFilters = Object.entries(filterVals).reduce(
            (acc, [attribute, filterValue]) => {
                acc[attribute] = {
                    operator: filterValue.operator,
                    value: null,
                };
                return acc;
            },
            {} as Record<string, any>
        );

        setFilterVals(normalizeFilterValues);
        setFilter((prevFilters: any) => ({
            ...prevFilters,
            ...resetFilters,
        }));
        setHasActiveFilters(false);
    };

    const handleApply = () => {
        const apiFilters = Object.entries(filterVals).reduce(
            (acc, [attribute, filterValue]) => {
                if (filterValue.value !== null) {
                    acc[attribute] = {
                        operator: filterValue.operator,
                        value: filterValue.value,
                    };
                }
                return acc;
            },
            {} as Record<string, any>
        );

        // Check if there are any active filters
        const hasFilters = Object.keys(apiFilters).length > 0;
        setHasActiveFilters(hasFilters);

        if (setPage) {
            if (page) {
                setPage({ page: 1, limit: page.limit });
            }
        }
        setFilter((prevFilters: any) => ({ ...prevFilters, ...apiFilters }));
        setVisible(false);
    };

    return (
        <>
            {/*<Tooltip title="Filter" arrow>*/}
            {/*	<IconButton color="inherit" onClick={() => setVisible(true)}>*/}
            {/*		<Iconify icon="mdi-filter-outline" width="24" height="24" />*/}
            {/*	</IconButton>*/}
            {/*</Tooltip>*/}

            <Button variant="text" color={hasActiveFilters ? 'primary' : 'inherit'} startIcon={<Icon icon="solar:filter-bold" />} onClick={() => setVisible(true)} sx={{ width: 'auto', height: 25 }}>
                {t('filter')}
            </Button>

            <Drawer anchor="right" open={visible} onClose={() => setVisible(false)} PaperProps={{ sx: { width: 320 } }}>
                <Box display="flex" alignItems="center" sx={{ py: 2, pr: 1, pl: 2.5 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Filter
                    </Typography>
                    <IconButton onClick={() => setVisible(false)}>
                        <Iconify icon="mingcute:close-line" />
                    </IconButton>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Scrollbar sx={{ px: 2.5, py: 3 }}>
                    <Stack spacing={2}>
                        {config.map(({ attribute, operator, field }) => {
                            const currentValue = filterVals[attribute]?.fullOption || filterVals[attribute]?.value || '';
                            return (
                                <Box key={attribute} display="flex" flexDirection="column">
                                    {field(currentValue, handleChange(attribute, operator))}
                                </Box>
                            );
                        })}
                    </Stack>
                </Scrollbar>

                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Button color="error" variant="text" startIcon={<Iconify icon="solar:trash-bin-trash-bold" />} onClick={handleReset}>
                        Clear
                    </Button>
                    <Button variant="contained" color="inherit" onClick={handleApply}>
                        Apply
                    </Button>
                </Box>
            </Drawer>
        </>
    );
};

export default FilterComponent;
