import type { AutocompleteProps } from '@mui/material';

import { Span } from '@components/basic/Span';
import { Controller, useFormContext } from 'react-hook-form';
import React, { useRef, useState, useEffect, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';
import { Chip, TextField, Typography, Autocomplete, CircularProgress } from '@mui/material';

type OptionValueGetter<T> = keyof T | ((item: T) => string);

export interface FieldDropdownAsyncProps<
    T extends Record<string, any>,
    Multiple extends boolean | undefined = boolean,
    DisableClearable extends boolean | undefined = boolean,
    FreeSolo extends boolean | undefined = boolean,
> extends Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'renderInput' | 'options' | 'onChange'> {
    name: string;
    label: string;
    helperText?: string;
    keyAttribute?: keyof T;
    optionValue: OptionValueGetter<T>;
    onValueChange?: (value: T | null) => void;
    loadOptions: (input: string) => Promise<T[]>;
    allowHtml?: boolean;
    placeholder?: string;
    tagStyle?: React.CSSProperties;
    debounceMs?: number;
    required?: boolean;
}

export function FieldDropdownAsync<T extends Record<string, any>>({
    name,
    label,
    onValueChange,
    helperText,
    keyAttribute,
    optionValue,
    loadOptions,
    allowHtml = false,
    placeholder = 'Select...',
    tagStyle = { maxWidth: '360px' },
    debounceMs = 1500,
    multiple,
    required,
    ...autoProps
}: FieldDropdownAsyncProps<T>) {
    const theme = useTheme();
    const { control } = useFormContext();
    const [options, setOptions] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const getLabel = (item: T) => {
        if (!item) return '';
        return typeof optionValue === 'function' ? optionValue(item) : String(item[optionValue] ?? '');
    };

    const getOptionKey = (item: T) => {
        if (!item) return '';
        if (keyAttribute) return String(item[keyAttribute]);
        return JSON.stringify(item);
    };

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

    const renderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: T) => (
        <li {...props} key={getOptionKey(option)}>
            {allowHtml ? <Span allowHtml html={getLabel(option)} /> : <Typography>{getLabel(option)}</Typography>}
        </li>
    );

    const renderTags = (tagValue: T[], getTagProps: any) =>
        tagValue.map((option, index) => (
            <Chip
                {...getTagProps({ index })}
                key={getOptionKey(option)}
                label={
                    <Span
                        allowHtml={allowHtml}
                        html={allowHtml ? getLabel(option) : undefined}
                        style={{
                            display: 'inline-block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            ...tagStyle,
                        }}
                    />
                }
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '& .MuiChip-deleteIcon': {
                        color: theme.palette.primary.contrastText,
                    },
                }}
            />
        ));

    const renderInput = (params: any, error?: string) => (
        <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            error={!!error}
            helperText={error || helperText}
            InputProps={{
                ...params.InputProps,
                endAdornment: (
                    <>
                        {loading && <CircularProgress size={20} />}
                        {params.InputProps.endAdornment}
                    </>
                ),
            }}
            required={required}
        />
    );

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                const currentValue = multiple
                    ? field.value
                        ? ((keyAttribute
                              ? options.filter((opt) => field.value?.includes(opt[keyAttribute]))
                              : options.filter((opt) =>
                                    field.value?.some((val: T) => getOptionKey(val) === getOptionKey(opt))
                                )) ?? [])
                        : []
                    : field.value
                      ? keyAttribute
                          ? options.find((opt) => opt[keyAttribute] === field.value) || null
                          : (field.value as T)
                      : null;

                return (
                    <Autocomplete
                        {...autoProps}
                        multiple={multiple}
                        options={options}
                        value={currentValue}
                        getOptionLabel={(option) => {
                            const div = document.createElement('div');
                            div.innerHTML = getLabel(option as T);
                            return div.textContent || div.innerText || '';
                        }}
                        isOptionEqualToValue={(opt, val) =>
                            keyAttribute
                                ? opt[keyAttribute] === val[keyAttribute]
                                : getOptionKey(opt) === getOptionKey(val)
                        }
                        onChange={(_, newValue) => {
                            if (multiple) {
                                const arr = Array.isArray(newValue) ? newValue : [];
                                field.onChange(keyAttribute ? arr.map((item) => (item as T)[keyAttribute]) : arr);
                            } else {
                                if (keyAttribute && typeof newValue === 'object' && newValue !== null) {
                                    field.onChange((newValue as T)[keyAttribute] ?? null);
                                } else {
                                    field.onChange(newValue ?? null);
                                }
                            }
                            if (onValueChange) {
                                onValueChange(newValue as T | null);
                            }
                        }}
                        renderOption={renderOption}
                        renderTags={renderTags}
                        renderInput={(params) => renderInput(params, fieldState.error?.message)}
                    />
                );
            }}
        />
    );
}
