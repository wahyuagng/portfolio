import type { AxiosResponse } from 'axios';
import type { ApiResponse } from '@services/api/types';
import type { AutocompleteProps } from '@mui/material/Autocomplete';

import React, { useState, useEffect } from 'react';
import { handleFilter, useDebouncedService } from '@components/grid/helpers';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

export type AutocompleteBaseProps = Omit<AutocompleteProps<any, boolean, boolean, boolean>, 'renderInput'>;

export type FieldDropdownProps = AutocompleteBaseProps & {
    value: any;
    setValue: (value: any) => void;

    options: any[];
    filterKey?: string;
    customFilterKey?: (data: any) => string;

    label?: React.ReactNode;
    helperText?: React.ReactNode;

    multiple?: boolean;
    error?: boolean;

    onInputChange?: (value: string) => void;
    required?: boolean;
    readOnly?: boolean;
};

export interface FieldDropdownApiProps
    extends Omit<AutocompleteBaseProps, 'options' | 'onChange' | 'value' | 'multiple'> {
    value: any;
    setValue: (value: any) => void;

    service: { list: (params?: any) => Promise<AxiosResponse<ApiResponse<any>>> };
    filterKey: string;
    valueKey: string;
    customFilterKey?: (data: any) => string;

    label: React.ReactNode;
    helperText?: React.ReactNode;

    onBlur?: () => void;
    multiple?: boolean;
    error?: boolean;
    required?: boolean;
    readOnly?: boolean;
}

export const FieldDropdown: React.FC<FieldDropdownProps> = ({
    value,
    setValue,
    label,
    helperText,
    options,
    multiple = false,
    required = false,
    readOnly = false,
    error,
    onBlur,
    filterKey,
    customFilterKey,
    onInputChange,
    ...other
}) => {
    const handleChange = (_: React.SyntheticEvent, newValue: any) => {
        setValue(multiple ? (Array.isArray(newValue) ? newValue : []) : newValue);
    };

    return (
        <Autocomplete
            key={JSON.stringify(options) + JSON.stringify(value)}
            multiple={multiple}
            getOptionLabel={
                customFilterKey
                    ? customFilterKey
                    : filterKey
                      ? (option) => option[filterKey]
                      : (option) => (typeof option === 'string' ? option : JSON.stringify(option))
            }
            options={options}
            value={multiple ? (value ?? []) : value === '' ? null : value}
            onChange={handleChange}
            onInputChange={(_, inputValue) => {
                if (typeof onInputChange === 'function') {
                    onInputChange(inputValue);
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    error={!!error}
                    helperText={helperText}
                    required={required}
                    fullWidth
                />
            )}
            readOnly={readOnly}
            blurOnSelect
            onBlur={onBlur}
            noOptionsText="No options"
            {...other}
        />
    );
};

export const FieldDropdownApi: React.FC<FieldDropdownApiProps> = ({
    service,
    filterKey,
    customFilterKey,
    value,
    setValue,
    label,
    helperText,
    multiple = false,
    required = false,
    readOnly = false,
    error,
    onBlur,
    valueKey = 'Value', // default Value, bisa diganti jadi 'Id'
    ...other
}) => {
    const debounce = useDebouncedService();
    const [filter, setFilter] = useState<any>();
    const [options, setOptions] = useState<any[]>([]);
    const [params, setParams] = useState<any>();

    const [inputValue, setInputValue] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const getData = async (paramsData?: any) => {
        await service
            .list(paramsData)
            .then((r) => {
                setOptions(r.data.Data);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (params && Object.keys(params).length > 0) {
            const normalizeParams = Object.keys(params).reduce(
                (acc, key) => {
                    acc[key] = {
                        operator: 'LIKE',
                        value: params[key],
                    };
                    return acc;
                },
                {} as Record<string, { operator: string; value: any }>
            );

            getData({ filters: btoa(JSON.stringify(handleFilter(normalizeParams))) });
        } else {
            getData();
        }
    }, [params]);

    useEffect(() => {
        if (setParams) {
            setParams(filter);
        }
    }, [filter]);

    return (
        <div key={JSON.stringify(options) + JSON.stringify(value)}>
            <Autocomplete
                loading={loading}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                multiple={multiple}
                options={options}
                value={
                    multiple
                        ? options.filter((opt) => (value ?? []).includes(opt[valueKey]))
                        : (options.find((opt) => opt[valueKey] === value) ?? null)
                }
                getOptionLabel={
                    customFilterKey
                        ? customFilterKey
                        : filterKey
                          ? (option) => option[filterKey]
                          : (option) => JSON.stringify(option)
                }
                onChange={(_, newValue) => {
                    if (multiple) {
                        setValue(newValue.map((v: any) => v[valueKey]));
                    } else {
                        setValue(newValue ? newValue[valueKey] : null);
                    }
                }}
                isOptionEqualToValue={(option, selected) => option?.[valueKey] === selected?.[valueKey]}
                renderInput={(inputParams) => (
                    <TextField
                        {...inputParams}
                        label={label}
                        error={!!error}
                        helperText={helperText}
                        fullWidth
                        onBlur={onBlur}
                        required={required}
                    />
                )}
            />
        </div>
    );
};
