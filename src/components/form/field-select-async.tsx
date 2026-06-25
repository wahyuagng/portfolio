import type { SelectProps } from '@mui/material';

import { Icon } from '@iconify/react';
import { Controller, useFormContext } from 'react-hook-form';
import React, { useState, useEffect, useCallback } from 'react';

import {
    Select,
    MenuItem,
    TextField,
    Typography,
    InputLabel,
    FormControl,
    ListSubheader,
    FormHelperText,
    CircularProgress,
} from '@mui/material';

type OptionValueGetter<T> = keyof T | ((item: T) => string);

export interface RHFDropdownAsyncProps<T> extends Omit<SelectProps, 'onChange' | 'value'> {
    name: string;
    label: string;
    helperText?: string;
    keyAttribute?: keyof T;
    optionValue: OptionValueGetter<T>;
    loadOptions: (input: string) => Promise<T[]>;
    allowHtml?: boolean;
    placeholder?: string;
}

export function FieldSelectAsync<T extends Record<string, any>>({
    name,
    label,
    helperText,
    keyAttribute,
    optionValue,
    loadOptions,
    allowHtml = false,
    placeholder = 'Select...',
    multiple,
    ...selectProps
}: RHFDropdownAsyncProps<T>) {
    const { control } = useFormContext();
    const [options, setOptions] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const fetchOptions = useCallback(
        async (input: string) => {
            setLoading(true);
            try {
                const result = await loadOptions(input);
                setOptions(result);
            } finally {
                setLoading(false);
            }
        },
        [loadOptions]
    );

    useEffect(() => {
        fetchOptions('');
    }, [fetchOptions]);

    const getLabel = (item: T) => {
        if (!item) return '';
        if (typeof optionValue === 'function') return optionValue(item);
        return String(item[optionValue] ?? '');
    };

    const getOptionKey = (item: T) => {
        if (keyAttribute) return String(item[keyAttribute]);
        return typeof optionValue === 'function' ? getLabel(item) : String(item[optionValue] ?? JSON.stringify(item));
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                const isMultiple = !!multiple;
                const normalizedValue = isMultiple ? (Array.isArray(field.value) ? field.value : []) : field.value;

                const selectValue = (() => {
                    if (isMultiple) {
                        return keyAttribute
                            ? (normalizedValue as any[]).map((v) => String(v))
                            : (normalizedValue as T[]).map((obj) => getOptionKey(obj));
                    }
                    if (!normalizedValue) return '';
                    return keyAttribute ? String(normalizedValue) : getOptionKey(normalizedValue as T);
                })();

                const hasValue = isMultiple
                    ? Array.isArray(normalizedValue) && normalizedValue.length > 0
                    : !!normalizedValue;

                return (
                    <FormControl fullWidth error={!!fieldState.error}>
                        <InputLabel>{label}</InputLabel>
                        <Select
                            {...selectProps}
                            multiple={isMultiple}
                            label={label}
                            value={selectValue}
                            displayEmpty
                            renderValue={(selected) => {
                                if (!hasValue) {
                                    return <Typography color="textSecondary">{placeholder}</Typography>;
                                }

                                if (isMultiple) {
                                    const items = keyAttribute
                                        ? options.filter((o) => (selected as string[]).includes(getOptionKey(o)))
                                        : (normalizedValue as T[]);

                                    return (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {items.map((item) => (
                                                <span key={getOptionKey(item)}>{getLabel(item)}</span>
                                            ))}
                                            <Icon
                                                icon="mdi:close-circle"
                                                style={{ cursor: 'pointer', fontSize: 18, color: '#888' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    field.onChange([]);
                                                }}
                                            />
                                        </div>
                                    );
                                }

                                const selectedItem = keyAttribute
                                    ? options.find((o) => getOptionKey(o) === selected)
                                    : normalizedValue;

                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {selectedItem &&
                                            (allowHtml ? (
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: getLabel(selectedItem as T),
                                                    }}
                                                />
                                            ) : (
                                                getLabel(selectedItem as T)
                                            ))}
                                        <Icon
                                            icon="mdi:close-circle"
                                            style={{ cursor: 'pointer', fontSize: 18, color: '#888' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                field.onChange(isMultiple ? [] : '');
                                            }}
                                        />
                                    </div>
                                );
                            }}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (isMultiple) {
                                    if (keyAttribute) {
                                        field.onChange(val);
                                    } else {
                                        const selectedObjects = options.filter((opt) =>
                                            (val as string[]).includes(getOptionKey(opt))
                                        );
                                        field.onChange(selectedObjects);
                                    }
                                } else {
                                    if (keyAttribute) {
                                        field.onChange(val ?? null);
                                    } else {
                                        const selected = options.find((opt) => getOptionKey(opt) === val);
                                        field.onChange(selected ?? null);
                                    }
                                }
                            }}
                            onOpen={() => fetchOptions(search)}
                            MenuProps={{
                                PaperProps: { style: { maxHeight: 300 } },
                            }}
                        >
                            <ListSubheader>
                                <TextField
                                    size="small"
                                    placeholder="Search..."
                                    fullWidth
                                    value={search}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSearch(val);
                                        fetchOptions(val);
                                    }}
                                />
                            </ListSubheader>

                            {loading && (
                                <MenuItem disabled>
                                    <CircularProgress size={20} />
                                </MenuItem>
                            )}

                            {!loading &&
                                options.map((option) => (
                                    <MenuItem key={getOptionKey(option)} value={getOptionKey(option)}>
                                        {allowHtml ? (
                                            <span dangerouslySetInnerHTML={{ __html: getLabel(option) }} />
                                        ) : (
                                            <Typography>{getLabel(option)}</Typography>
                                        )}
                                    </MenuItem>
                                ))}

                            {!loading && options.length === 0 && <MenuItem disabled>No results found</MenuItem>}
                        </Select>

                        <FormHelperText>{fieldState.error?.message || helperText}</FormHelperText>
                    </FormControl>
                );
            }}
        />
    );
}
