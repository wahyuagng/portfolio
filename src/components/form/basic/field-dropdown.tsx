import type { AxiosResponse } from 'axios';
import type { AutocompleteProps } from '@mui/material/Autocomplete';
import type { Filter, Pagination, ApiResponse } from '@services/api/types.js';

import { useDebouncedService } from '@common/helpers';
import React, { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Tooltip, IconButton } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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

    autoSelectFirst?: boolean;
    showErrorAsTooltip?: boolean;
};

export interface FieldDropdownApiProps extends Omit<AutocompleteBaseProps, 'options' | 'onChange' | 'value' | 'multiple'> {
    value: any;
    setValue: (value: any) => void;

    service: {
        list: (filters?: Filter[], sorts?: string[], pagination?: Pagination) => Promise<AxiosResponse<ApiResponse<any[]>>>;
    };
    filterKey: string;
    customFilterKey?: (data: any) => string;

    label: React.ReactNode;
    helperText?: React.ReactNode;

    onBlur?: () => void;
    multiple?: boolean;
    error?: boolean;
    required?: boolean;
    readOnly?: boolean;

    filterCondition?: Filter[];

    autoLoad?: boolean;
    autoSelectFirst?: boolean;
    pageLimit?: number;
    showErrorAsTooltip?: boolean;
}

export const FieldDropdown: React.FC<FieldDropdownProps> = ({ value, setValue, label, helperText, options, multiple = false, required = false, readOnly = false, error, onBlur, filterKey, customFilterKey, onInputChange, autoSelectFirst = false, showErrorAsTooltip = true, ...other }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const hasAutoSelected = useRef(false);
    const hasUserInteracted = useRef(false); // TAMBAH INI

    useEffect(() => {
        if (autoSelectFirst && !hasAutoSelected.current && !hasUserInteracted.current && options.length > 0 && !value) {
            if (multiple) {
                setValue([options[0]]);
            } else {
                setValue(options[0]);
            }
            hasAutoSelected.current = true;
        }
    }, [options, autoSelectFirst, value, multiple, setValue]);

    const handleChange = (_: React.SyntheticEvent, newValue: any) => {
        hasUserInteracted.current = true;
        if (multiple) {
            const cleanedValue = Array.isArray(newValue) ? newValue.filter((v) => v != null) : [];
            setValue(cleanedValue);
        } else {
            setValue(newValue);
        }
    };

    return (
        <Autocomplete
            key={JSON.stringify(options) + JSON.stringify(value)}
            multiple={multiple}
            // getOptionLabel={customFilterKey ? customFilterKey : filterKey ? (option) => option?.[filterKey] ?? '' : (option) => JSON.stringify(option)}
            getOptionLabel={customFilterKey ? customFilterKey : filterKey ? (option) => option?.[filterKey] ?? '' : (option) => (typeof option === 'string' ? option : JSON.stringify(option))}
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
                    helperText={!showErrorAsTooltip ? helperText : undefined}
                    required={required}
                    fullWidth
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {params.InputProps.endAdornment}
                                {showErrorAsTooltip && error && helperText && (
                                    <InputAdornment position="end">
                                        <Tooltip title={helperText} placement="top" arrow open={tooltipOpen} onClose={() => setTooltipOpen(false)} onOpen={() => setTooltipOpen(true)}>
                                            <IconButton
                                                size="small"
                                                onMouseEnter={() => setTooltipOpen(true)}
                                                onMouseLeave={() => setTooltipOpen(false)}
                                                sx={(theme) => ({
                                                    color: theme.palette.error.main,
                                                    p: 0.5,
                                                })}
                                            >
                                                <InfoOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                )}
                            </>
                        ),
                    }}
                />
            )}
            readOnly={readOnly}
            blurOnSelect
            onBlur={onBlur}
            {...other}
        />
    );
};

export const FieldDropdownApi: React.FC<FieldDropdownApiProps> = ({ service, filterKey, customFilterKey, value, setValue, label, helperText, multiple = false, required = false, readOnly = false, error, onBlur, filterCondition, autoLoad = false, autoSelectFirst = false, pageLimit = 10, showErrorAsTooltip = true, freeSolo, ...other }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const debounce = useDebouncedService();
    const [filter, setFilter] = useState<Filter[]>();
    const [options, setOptions] = useState<any[]>([]);

    const [inputValue, setInputValue] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const hasLoadedInitialData = useRef(false);
    const hasAutoSelected = useRef(false);
    const hasUserInteracted = useRef(false); // TAMBAH INI

    const getData = async (filters?: Filter[], page: number = 1, append: boolean = false) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        await service
            .list(filters, undefined, { page, limit: pageLimit })
            .then((r) => {
                const data = r.data.Data ?? [];
                const meta = r.data.Meta;

                if (append) {
                    setOptions((prev) => [...prev, ...data]);
                } else {
                    setOptions(data);
                }

                if (meta) {
                    const recordCurrent = meta.Record?.Current ?? 0;
                    const pageCurrent = meta.Page?.Current ?? 1;
                    const pageTotal = meta.Page?.Total ?? 1;

                    setCurrentPage(pageCurrent);
                    setTotalPages(pageTotal);
                    setHasMore(recordCurrent > 10 && pageTotal > 1 && pageCurrent < pageTotal);
                }

                if (autoSelectFirst && !hasAutoSelected.current && !hasUserInteracted.current && data.length > 0 && !value && !append) {
                    if (multiple) {
                        setValue([data[0]]);
                    } else {
                        setValue(data[0]);
                    }
                    hasAutoSelected.current = true;
                }
            })
            .finally(() => {
                setLoading(false);
                setLoadingMore(false);
            });
    };

    const handleLoadMore = () => {
        const conditionFilter: Filter[] =
            filterCondition?.map((cond) => ({
                attribute: cond.attribute,
                operator: cond.operator,
                value: cond.value,
            })) ?? [];

        const nextPage = currentPage + 1;

        if (filter && filter.length > 0 && conditionFilter.length > 0) {
            void getData([...filter, ...conditionFilter], nextPage, true);
        } else if (filter && filter.length > 0) {
            void getData(filter, nextPage, true);
        } else if (conditionFilter.length > 0) {
            void getData(conditionFilter, nextPage, true);
        } else {
            void getData(undefined, nextPage, true);
        }
    };

    useEffect(() => {
        if (!autoLoad) return;

        const conditionFilter: Filter[] =
            filterCondition?.map((cond) => ({
                attribute: cond.attribute,
                operator: cond.operator,
                value: cond.value,
            })) ?? [];

        if (conditionFilter.length > 0) {
            void getData(conditionFilter);
        } else {
            void getData();
        }

        hasLoadedInitialData.current = true;
    }, [autoLoad, JSON.stringify(filterCondition)]);

    useEffect(() => {
        if (autoLoad) return;

        if (!open && !hasLoadedInitialData.current) {
            return;
        }

        hasLoadedInitialData.current = true;

        const conditionFilter: Filter[] =
            filterCondition?.map((cond) => ({
                attribute: cond.attribute,
                operator: cond.operator,
                value: cond.value,
            })) ?? [];

        setCurrentPage(1);

        if (filter && filter.length > 0 && conditionFilter.length > 0) {
            void getData([...filter, ...conditionFilter]);
        } else if (filter && filter.length > 0) {
            void getData(filter);
        } else if (conditionFilter.length > 0) {
            void getData(conditionFilter);
        } else {
            void getData();
        }
    }, [open, JSON.stringify(filter), JSON.stringify(filterCondition)]);

    const handleChange = (_: React.SyntheticEvent, newValue: any) => {
        hasUserInteracted.current = true;
        setValue(multiple ? (Array.isArray(newValue) ? newValue : []) : newValue);
    };

    useEffect(() => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
            setInputValue('');
            setFilter([]);
        }
    }, [value]);

    return (
        <Autocomplete
            loading={loading}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            multiple={multiple}
            getOptionLabel={customFilterKey ? customFilterKey : filterKey ? (option) => option[filterKey] : (option) => JSON.stringify(option)}
            // getOptionLabel={customFilterKey ? customFilterKey : filterKey ? (option) => option?.[filterKey] ?? '' : (option) => JSON.stringify(option)}
            options={options}
            value={multiple ? (value ?? []) : value === '' ? null : value}
            onChange={handleChange}
            blurOnSelect
            freeSolo={freeSolo}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
                debounce(() => {
                    if (newInputValue) {
                        setFilter([
                            {
                                attribute: filterKey,
                                operator: 'LIKE',
                                value: newInputValue,
                            },
                        ]);
                    } else {
                        setFilter([]);
                    }
                }, 500)();
            }}
            isOptionEqualToValue={(option, optionValue) => option?.Id === optionValue?.Id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    error={!!error}
                    helperText={!showErrorAsTooltip ? helperText : undefined}
                    required={required}
                    fullWidth
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {params.InputProps.endAdornment}
                                {showErrorAsTooltip && error && helperText && (
                                    <InputAdornment position="end">
                                        <Tooltip title={helperText} placement="top" arrow open={tooltipOpen} onClose={() => setTooltipOpen(false)} onOpen={() => setTooltipOpen(true)}>
                                            <IconButton
                                                size="small"
                                                onMouseEnter={() => setTooltipOpen(true)}
                                                onMouseLeave={() => setTooltipOpen(false)}
                                                sx={(theme) => ({
                                                    color: theme.palette.error.main,
                                                    p: 0.5,
                                                })}
                                            >
                                                <InfoOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                )}
                            </>
                        ),
                    }}
                />
            )}
            readOnly={readOnly}
            slotProps={{
                listbox: {
                    onScroll: (event: React.SyntheticEvent) => {
                        const listboxNode = event.currentTarget;
                        const tolerance = 1;

                        if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - tolerance && hasMore && !loadingMore) {
                            handleLoadMore();
                        }
                    },
                    sx: { maxHeight: '400px' },
                    component: React.forwardRef<HTMLUListElement>((props: any, ref) => (
                        <ul {...props} ref={ref}>
                            {props.children}
                            {hasMore && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                                    {loadingMore ? (
                                        <CircularProgress size={20} />
                                    ) : (
                                        <Button size="small" onClick={handleLoadMore}>
                                            Load More
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </ul>
                    )),
                },
            }}
            {...other}
        />
    );
};
