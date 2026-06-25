import type { Filter } from '@services/api/types';

import { Icon } from '@iconify/react';
import { Iconify } from '@components/iconify';
import { useSearchParams } from 'react-router-dom';
import { useTranslate } from '@locales/use-locales';
import React, { useRef, useState, useEffect, useCallback } from 'react';

import { Box, Menu, Button, Divider, Tooltip, useTheme, TextField, IconButton, useMediaQuery, InputAdornment } from '@mui/material';

export interface SearchComponentProps {
    onSearch?: (value: string) => void;
    setFilters?: React.Dispatch<React.SetStateAction<Filter[]>>;
    filterKey?: string;
}

export const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch, setFilters, filterKey = 'Search' }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialValue = searchParams.get(filterKey) || '';
    const [searchTerm, setSearchTerm] = useState<string>(initialValue);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { t } = useTranslate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        if (anchorEl && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [anchorEl]);

    const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const applySearch = useCallback(
        (searchValue: string) => {
            if (setFilters) {
                setFilters((prev) => {
                    const filters = [...prev];
                    const idx = filters.findIndex((f) => f.attribute === filterKey);

                    if (searchValue) {
                        const newFilter: Filter = {
                            attribute: filterKey,
                            operator: 'LIKE',
                            value: searchValue,
                        };
                        if (idx >= 0) {
                            filters[idx] = newFilter;
                        } else {
                            filters.push(newFilter);
                        }
                    } else if (idx >= 0) {
                        filters.splice(idx, 1);
                    }

                    return filters;
                });
            }

            const newParams = new URLSearchParams(searchParams);
            if (searchValue) {
                newParams.set(filterKey, searchValue);
            } else {
                newParams.delete(filterKey);
            }
            setSearchParams(newParams);

            if (onSearch) {
                onSearch(searchValue);
            }
        },
        [setFilters, filterKey, onSearch, searchParams, setSearchParams]
    );

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
    };

    const handleApply = () => {
        applySearch(searchTerm);
        handleMenuClose();
    };

    const handleClear = () => {
        setSearchTerm('');
        applySearch('');
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleApply();
        }
    };

    useEffect(() => {
        const paramValue = searchParams.get(filterKey) || '';
        setSearchTerm(paramValue);
    }, [searchParams, filterKey]);

    // Show badge if search is active
    const isSearchActive = Boolean(initialValue);

    return (
        <>
            <Tooltip title="Search">
                <Button
                    size="small"
                    onClick={handleMenuOpen}
                    startIcon={<Icon icon="eva:search-fill" width={20} height={20} />}
                    sx={{
                        position: 'relative',
                        ...(isSearchActive && {
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                            },
                        }),
                    }}
                >
                    {!isMobile ? 'Search' : ''}
                </Button>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: { width: 400 },
                }}
            >
                <Box sx={{ p: 2 }}>
                    {/*<Typography variant="subtitle1" gutterBottom>*/}
                    {/*    Search*/}
                    {/*</Typography>*/}
                    {/*<Divider sx={{ mb: 2 }} />*/}

                    <TextField
                        fullWidth
                        autoFocus
                        inputRef={inputRef}
                        variant="outlined"
                        placeholder={t('search')}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm ? (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClear} edge="end" size="small">
                                        <Iconify icon="mingcute:close-line" />
                                    </IconButton>
                                </InputAdornment>
                            ) : undefined,
                        }}
                    />

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button size="small" onClick={handleClear} disabled={!searchTerm}>
                            Clear
                        </Button>
                        <Button size="small" variant="contained" color="primary" onClick={handleApply} startIcon={<Icon icon="mdi:check" />}>
                            Apply
                        </Button>
                    </Box>
                </Box>
            </Menu>
        </>
    );
};
