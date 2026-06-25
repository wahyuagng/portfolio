import type { ButtonProps } from '@mui/material/Button';
import type { Theme, SxProps } from '@mui/material/styles';
import type { TextFieldProps } from '@mui/material/TextField';
import type { IconButtonProps } from '@mui/material/IconButton';

import { Icon } from '@iconify/react';
import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
// Import icons (adjust import paths based on your project structure)
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

type BaseProps = Partial<ButtonProps & IconButtonProps>;

export type ToolbarButtonBaseProps = BaseProps & {
    label?: string;
    showLabel?: boolean;
    icon: React.ReactNode;
    loading?: boolean;
};

export function ToolbarButtonBase({
    sx,
    label,
    icon,
    loading = false,
    showLabel = true,
    disabled,
    ...other
}: ToolbarButtonBaseProps) {
    const Component: React.ElementType = showLabel ? Button : IconButton;
    const baseProps: BaseProps = showLabel ? { size: 'small' } : {};

    return (
        <Tooltip title={label}>
            <Component
                {...baseProps}
                {...other}
                disabled={disabled || loading}
                sx={[
                    {
                        gap: showLabel ? 0.75 : 0,
                        minWidth: showLabel ? 'auto' : 40,
                        '& svg': {
                            width: showLabel ? 18 : 20,
                            height: showLabel ? 18 : 20,
                        },
                    },
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
            >
                {loading ? <CircularProgress size={showLabel ? 18 : 20} /> : icon}
                {showLabel && !loading && label}
            </Component>
        </Tooltip>
    );
}

// ----------------------------------------------------------------------

import { ColumnsPanelTrigger } from '@mui/x-data-grid';
import { Checkbox, ListItemText } from '@mui/material';

type CustomColumnsButtonProps = {
    showLabel?: boolean;
    onToggleColumns: (visibility: Record<string, boolean>) => void;
    availableColumns: {
        field: string;
        headerName: string;
        hideable?: boolean;
    }[];
};

export function CustomColumnsButton({ showLabel = true, onToggleColumns, availableColumns }: CustomColumnsButtonProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleToggleColumn = (field: string, isVisible: boolean) => {
        onToggleColumns({ [field]: !isVisible });
    };

    return (
        <>
            <ColumnsPanelTrigger
                render={(props) => (
                    <Tooltip title="Manage Columns">
                        <Button
                            {...props}
                            startIcon={<Icon icon="mdi:view-column" width={20} height={20} />}
                            size="small"
                            sx={{ textTransform: 'none' }}
                        >
                            {showLabel && 'Columns'}
                        </Button>
                    </Tooltip>
                )}
            />
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {availableColumns
                    .filter((col) => col.field !== 'actions' && col.hideable !== false)
                    .map((col) => {
                        const isHidden = col.hideable ?? false;
                        return (
                            <MenuItem key={col.field} onClick={() => handleToggleColumn(col.field, !isHidden)}>
                                <Checkbox checked={!isHidden} />
                                <ListItemText primary={col.headerName} />
                            </MenuItem>
                        );
                    })}
            </Menu>
        </>
    );
}

// ----------------------------------------------------------------------

export interface CustomFilterButtonProps {
    showLabel?: boolean;
    filterCount?: number;
    onOpenFilter?: () => void;
    onClearFilters?: () => void;
    loading?: boolean;
}

export function CustomFilterButton({
    showLabel = true,
    filterCount = 0,
    onOpenFilter,
    onClearFilters,
    loading = false,
}: CustomFilterButtonProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (filterCount > 0) {
            setAnchorEl(event.currentTarget);
        } else {
            onOpenFilter?.();
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenFilter = () => {
        onOpenFilter?.();
        handleClose();
    };

    const handleClearFilters = () => {
        onClearFilters?.();
        handleClose();
    };

    return (
        <>
            <ToolbarButtonBase
                onClick={handleClick}
                label="Filters"
                loading={loading}
                showLabel={showLabel}
                icon={
                    <Badge variant="dot" color="error" invisible={filterCount === 0}>
                        <Icon icon="mdi:filter-variant" width={20} height={20} />
                    </Badge>
                }
                aria-controls={open ? 'filter-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            />

            <Menu
                id="filter-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleOpenFilter}>
                    <Icon icon="mdi:filter-variant" width={20} height={20} />
                    Open Filters
                </MenuItem>
                <MenuItem onClick={handleClearFilters} disabled={filterCount === 0}>
                    <Icon icon="mdi:close-circle" width={20} height={20} />
                    Clear Filters ({filterCount})
                </MenuItem>
            </Menu>
        </>
    );
}

// ----------------------------------------------------------------------

export interface CustomExportButtonProps {
    showLabel?: boolean;
    onExportCSV?: () => void | Promise<void>;
    onExportPrint?: () => void | Promise<void>;
    onExportPDF?: () => void | Promise<void>;
    onExportExcel?: () => void | Promise<void>;
    loading?: boolean;
    availableFormats?: string[];
}

export function CustomExportButton({
    showLabel = true,
    onExportCSV,
    onExportPrint,
    onExportPDF,
    onExportExcel,
    loading = false,
    availableFormats = ['csv', 'print'],
}: CustomExportButtonProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [exportLoading, setExportLoading] = useState<string | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExport = async (type: string, exportFn?: () => void | Promise<void>) => {
        if (!exportFn) return;

        setExportLoading(type);
        try {
            await exportFn();
        } catch (error) {
            console.error(`Export ${type} failed:`, error);
        } finally {
            setExportLoading(null);
            handleClose();
        }
    };

    const exportOptions = [
        {
            key: 'csv',
            label: 'Export CSV',
            handler: onExportCSV,
            icon: <Icon icon="mdi:file-delimited" width={20} height={20} />,
        },
        {
            key: 'excel',
            label: 'Export Excel',
            handler: onExportExcel,
            icon: <Icon icon="mdi:file-excel" width={20} height={20} />,
        },
        {
            key: 'pdf',
            label: 'Export PDF',
            handler: onExportPDF,
            icon: <Icon icon="mdi:file-pdf-box" width={20} height={20} />,
        },
        {
            key: 'print',
            label: 'Print',
            handler: onExportPrint,
            icon: <Icon icon="mdi:printer" width={20} height={20} />,
        },
    ];

    return (
        <>
            <ToolbarButtonBase
                onClick={handleClick}
                label="Export"
                loading={loading}
                showLabel={showLabel}
                icon={<Icon icon="mdi:download" width={20} height={20} />}
                aria-controls={open ? 'export-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            />

            <Menu
                id="export-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {exportOptions
                    .filter((option) => availableFormats.includes(option.key) && option.handler)
                    .map((option) => (
                        <MenuItem
                            key={option.key}
                            onClick={() => handleExport(option.key, option.handler)}
                            disabled={exportLoading === option.key}
                        >
                            {exportLoading === option.key ? (
                                <CircularProgress size={16} sx={{ mr: 1 }} />
                            ) : (
                                React.cloneElement(option.icon, { sx: { mr: 1 } })
                            )}
                            {option.label}
                        </MenuItem>
                    ))}
            </Menu>
        </>
    );
}

// ----------------------------------------------------------------------

export interface CustomQuickFilterProps {
    sx?: SxProps<Theme>;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    loading?: boolean;
    debounceMs?: number;
    slotProps?: {
        textField?: TextFieldProps;
    };
}

export function CustomQuickFilter({
    sx,
    placeholder = 'Search...',
    value = '',
    onChange,
    onSearch,
    loading = false,
    debounceMs = 300,
    slotProps,
}: CustomQuickFilterProps) {
    const [searchValue, setSearchValue] = useState(value);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setSearchValue(newValue);
        onChange?.(newValue);

        // Clear existing timer
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        // Set new timer for API call
        if (onSearch) {
            const timer = setTimeout(() => {
                onSearch(newValue);
            }, debounceMs);
            setDebounceTimer(timer);
        }
    };

    const handleClear = () => {
        setSearchValue('');
        onChange?.('');
        onSearch?.('');
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
    };

    React.useEffect(() => {
        setSearchValue(value);
    }, [value]);

    React.useEffect(
        () => () => {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
        },
        [debounceTimer]
    );

    return (
        <Box sx={[{ width: 1, maxWidth: { md: 260 } }, ...(Array.isArray(sx) ? sx : [sx])]}>
            <TextField
                fullWidth
                value={searchValue}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={loading}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                {loading ? (
                                    <CircularProgress size={20} />
                                ) : (
                                    <Icon icon="mdi:magnify" width={20} height={20} />
                                )}
                            </InputAdornment>
                        ),
                        endAdornment: searchValue ? (
                            <InputAdornment position="end">
                                <IconButton edge="end" size="small" onClick={handleClear} aria-label="Clear search">
                                    <Icon icon="mdi:close-circle" width={20} height={20} />
                                </IconButton>
                            </InputAdornment>
                        ) : null,
                        ...slotProps?.textField?.slotProps?.input,
                    },
                    ...slotProps?.textField?.slotProps,
                }}
                {...slotProps?.textField}
            />
        </Box>
    );
}

// ----------------------------------------------------------------------

// Layout components (same as original)
export const ToolbarContainer = styled('div')(({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    gap: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
        alignItems: 'center',
        flexDirection: 'row',
    },
}));

export const ToolbarLeftPanel = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
    },
}));

export const ToolbarRightPanel = styled('div')(({ theme }) => ({
    flexGrow: 1,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
}));

// ----------------------------------------------------------------------

// Complete Toolbar Component Example
export interface CustomDataGridToolbarProps {
    showLabels?: boolean;
    searchValue?: string;
    filterCount?: number;
    loading?: {
        search?: boolean;
        filter?: boolean;
        export?: boolean;
    };
    availableColumns?: { field: string; headerName: string; visible: boolean }[];
    exportFormats?: string[];
    onSearch?: (value: string) => void;
    onSearchChange?: (value: string) => void;
    onToggleColumns?: (columnVisibility: Record<string, boolean>) => void;
    onOpenFilter?: () => void;
    onClearFilters?: () => void;
    onExportCSV?: () => void | Promise<void>;
    onExportPrint?: () => void | Promise<void>;
    onExportPDF?: () => void | Promise<void>;
    onExportExcel?: () => void | Promise<void>;
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
}

export function CustomDataGridToolbar({
    showLabels = true,
    searchValue = '',
    filterCount = 0,
    loading = {},
    availableColumns = [],
    exportFormats = ['csv', 'print'],
    onSearch,
    onSearchChange,
    onToggleColumns,
    onOpenFilter,
    onClearFilters,
    onExportCSV,
    onExportPrint,
    onExportPDF,
    onExportExcel,
    leftContent,
    rightContent,
}: CustomDataGridToolbarProps) {
    return (
        <ToolbarContainer>
            <ToolbarLeftPanel>
                {leftContent}
                <CustomQuickFilter
                    value={searchValue}
                    onChange={onSearchChange}
                    onSearch={onSearch}
                    loading={loading.search}
                    placeholder="Search data..."
                />
            </ToolbarLeftPanel>

            <ToolbarRightPanel>
                {rightContent}

                <CustomFilterButton
                    showLabel={showLabels}
                    filterCount={filterCount}
                    onOpenFilter={onOpenFilter}
                    onClearFilters={onClearFilters}
                    loading={loading.filter}
                />

                <CustomColumnsButton
                    availableColumns={availableColumns}
                    onToggleColumns={onToggleColumns ?? (() => {})}
                />

                <CustomExportButton
                    showLabel={showLabels}
                    availableFormats={exportFormats}
                    onExportCSV={onExportCSV}
                    onExportPrint={onExportPrint}
                    onExportPDF={onExportPDF}
                    onExportExcel={onExportExcel}
                    loading={loading.export}
                />
            </ToolbarRightPanel>
        </ToolbarContainer>
    );
}
