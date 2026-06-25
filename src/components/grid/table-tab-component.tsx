import type { Filter } from '@services/api/types';
import type { LabelColor } from '@components/label';

import { Label } from '@components/label';
import React, { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';

export interface TabConfig {
    attribute: string;
    options: {
        name: string;
        label: string;
        color: LabelColor;
    }[];
}

interface TabComponentProps {
    filters: Filter[];
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
    config: TabConfig;
}

export function TabComponent({ filters, setFilters, config }: TabComponentProps) {
    const { attribute, options } = config;

    const [activeTab, setActiveTab] = useState<string>(options[0].name);

    const baseFilter: Filter = { attribute, operator: '=', value: '' };

    const handleChangeTab = useCallback(
        (_event: React.SyntheticEvent, newValue: string) => {
            setActiveTab(newValue);

            if (newValue) return setFilters([...filters, { ...baseFilter, value: newValue }]);
            return setFilters(filters.filter((filter) => filter.attribute !== attribute));
        },
        [filters]
    );

    return (
        <Tabs
            value={activeTab}
            onChange={handleChangeTab}
            sx={{
                px: 2.5,
                boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
        >
            {options.map((option, i) => (
                <Tab
                    key={i}
                    iconPosition="end"
                    value={option.name}
                    icon={
                        <Label
                            variant={((option.name === '' || option.name === activeTab) && 'filled') || 'soft'}
                            color={option.color}
                            sx={{ cursor: 'pointer' }}
                        >
                            {option.label || 'All'}
                        </Label>
                    }
                />
            ))}
        </Tabs>
    );
}
