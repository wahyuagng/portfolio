// RHFFieldDropdownAsyncLoadMore.tsx

import type { AutocompleteRenderInputParams } from '@mui/material';

import { useState, useEffect, useCallback } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { Box, TextField, Autocomplete, CircularProgress } from '@mui/material';

type OptionType = {
    value: string;
    label: string;
    [key: string]: any;
};

type RHFFieldDropdownAsyncLoadMoreProps = {
    name: string;
    label: string;
    loadOptions: (
        input: string,
        page: number
    ) => Promise<{
        options: OptionType[];
        hasMore: boolean;
    }>;
};

export function RHFFieldDropdownAsyncLoadMore({ name, label, loadOptions }: RHFFieldDropdownAsyncLoadMoreProps) {
    const { control } = useFormContext();
    const {
        field: { value, onChange, ...field },
        fieldState: { error },
    } = useController({ name, control });

    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<OptionType[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchOptions = useCallback(
        async (search: string, pageToFetch: number) => {
            setLoading(true);
            try {
                const res = await loadOptions(search, pageToFetch);
                setOptions((prev) => (pageToFetch === 1 ? res.options : [...prev, ...res.options]));
                setHasMore(res.hasMore);
                setPage(pageToFetch);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        },
        [loadOptions]
    );

    // Initial & search
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchOptions(inputValue, 1);
        }, 300);

        return () => clearTimeout(timeout);
    }, [inputValue, fetchOptions]);

    // Handle "Load More"
    const handleLoadMore = () => {
        if (hasMore && !loading) {
            fetchOptions(inputValue, page + 1);
        }
    };

    // Inject "Load More" item
    const optionsWithLoadMore = hasMore ? [...options, { value: '__load_more__', label: 'Load more...' }] : options;

    return (
        <Autocomplete
            {...field}
            value={value ?? null}
            onChange={(_, newValue) => {
                if (newValue?.value === '__load_more__') {
                    handleLoadMore();
                } else {
                    onChange(newValue);
                }
            }}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            options={optionsWithLoadMore}
            getOptionLabel={(option) => option?.label ?? ''}
            isOptionEqualToValue={(option, val) => option?.value === val?.value}
            loading={loading}
            filterOptions={(opts) => opts} // prevent MUI from filtering already loaded items
            renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField {...params} label={label} error={!!error} helperText={error?.message} />
            )}
            renderOption={(props, option) =>
                option.value === '__load_more__' ? (
                    <Box component="li" {...props} sx={{ justifyContent: 'center' }}>
                        {loading ? <CircularProgress size={20} /> : 'Load more...'}
                    </Box>
                ) : (
                    <Box component="li" {...props}>
                        {option.label}
                    </Box>
                )
            }
        />
    );
}
