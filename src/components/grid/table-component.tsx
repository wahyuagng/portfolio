import type { ReactElement } from 'react';
import type { Pagination } from '@services/api/types';
import type { ColumnFormat } from '@components/grid/types';
import type { TableColumnProps } from '@components/grid/table-column-component';

import { Icon } from '@iconify/react';
import { useAuthContext } from '@auth/hooks';
import { Iconify } from '@components/iconify';
import FormatColumn from '@components/grid/format-column';
import { CustomPopover } from '@components/custom-popover';
import { useTable } from '@components/grid/table-provider';
import { PinnedTableCell } from '@components/table/table-pinned';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { canRenderAction } from '@components/grid/guard/permission-utils';
import { emptyRows, TableNoData, TableEmptyRows, TableSelectedAction } from '@components/table';

import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import { Box, Card, Paper, Table, Divider, MenuItem, MenuList, Skeleton, Checkbox, TableRow, useTheme, TableBody, TableCell, TableHead, IconButton, Typography, useMediaQuery, TableContainer } from '@mui/material';

const useResizableColumns = (initialColumns: ColumnProps[]) => {
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
    const [isResizing, setIsResizing] = useState(false);
    const resizeData = useRef<{
        columnAttribute: string;
        startX: number;
        startWidth: number;
    } | null>(null);

    useEffect(() => {
        const widths: Record<string, number> = {};
        initialColumns.forEach((col) => {
            widths[col.attribute] = col.width || 150;
        });
        setColumnWidths(widths);
    }, [initialColumns]);

    const startResize = useCallback(
        (e: React.MouseEvent, columnAttribute: string) => {
            e.preventDefault();
            e.stopPropagation();

            const startX = e.pageX;
            const startWidth = columnWidths[columnAttribute];

            resizeData.current = {
                columnAttribute,
                startX,
                startWidth,
            };

            setIsResizing(true);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        },
        [columnWidths]
    );

    const doResize = useCallback(
        (e: MouseEvent) => {
            if (!isResizing || !resizeData.current) return;

            const { columnAttribute, startX, startWidth } = resizeData.current;
            const diff = e.pageX - startX;
            const newWidth = Math.max(150, startWidth + diff);

            setColumnWidths((prev) => ({
                ...prev,
                [columnAttribute]: newWidth,
            }));
        },
        [isResizing]
    );

    const stopResize = useCallback(() => {
        setIsResizing(false);
        resizeData.current = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }, []);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', doResize);
            document.addEventListener('mouseup', stopResize);

            return () => {
                document.removeEventListener('mousemove', doResize);
                document.removeEventListener('mouseup', stopResize);
            };
        }
        return () => {};
    }, [isResizing, doResize, stopResize]);

    return {
        columnWidths,
        startResize,
        isResizing,
    };
};

const ResizeHandle: React.FC<{
    onMouseDown: (e: React.MouseEvent) => void;
    isResizing: boolean;
}> = ({ onMouseDown, isResizing }) => (
    <Box
        onMouseDown={onMouseDown}
        sx={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            height: '60%',
            width: '2px',
            cursor: 'col-resize',
            backgroundColor: isResizing ? 'primary.main' : 'divider',
            transition: 'background-color 0.2s',
            zIndex: 10,

            '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.5)',
            },
        }}
    />
);

export interface ActionColumnProps {
    conditions?: Condition[];
    element: (row: any) => React.ReactNode;
    onClick: (row: any, event?: any, index?: number) => any;
}

interface ColumnProps {
    attribute: string;
    label: string;
    format?: ColumnFormat;
    custom?: (value: any, row: any) => React.ReactNode;
    isVisible?: boolean;
    isPinned?: boolean;
    width?: number;
    resizable?: boolean;
}

export interface ActionCheckboxProps {
    element: (selecteds: any[]) => React.ReactNode;
    onClick: (selecteds: any[], event?: any) => any;
}

export interface Condition {
    key: string;
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'IN' | 'NOT IN';
    value: string | number | boolean | null | (string | number | boolean)[];
}

export interface TableProps {
    data: any[];
    column: ColumnProps[];
    loading?: boolean;
    serialize?: boolean;
    action?: ActionColumnProps[];
    children: React.ReactNode;
    meta?: MetaProps;
    actionType?: 'button' | 'tree_dot';
    checkboxKey?: any;
    checkboxAction?: ActionCheckboxProps[];
    sorts?: string[];
    pagination?: Pagination;
    collapse?: boolean | CollapseConfig;
    width?: number;
    enableColumnResize?: boolean;
}

export interface CollapseConfig {
    enabled: boolean;
    columns?: TableColumnProps[];
    customRenderer?: (row: any) => React.ReactNode;
}

export interface MetaProps {
    Record: { Current: number; Total: number };
    Page: { Current: number; Total: number };
    Links?: { Self: any; First: any; Prev: any; Next: any; Last: any };
}

const TableComponent: React.FC<TableProps> = ({ data, column, loading, sorts, pagination, meta, serialize = false, action, actionType = 'tree_dot', checkboxKey, checkboxAction, children, collapse, enableColumnResize = false }) => {
    const { profile } = useAuthContext();
    const [anchorEl, setAnchorEl] = useState<{ [key: number]: HTMLElement | null }>({});
    const { dense, selected, onSelectRow, onSelectAllRows } = useTable();
    const [dataCollapse, setDataCollapse] = useState<any[]>([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Auto detect mobile

    const { columnWidths, startResize, isResizing } = useResizableColumns(column);

    const collapseConfig = React.useMemo(() => {
        if (typeof collapse === 'boolean') {
            return { enabled: collapse };
        }
        return collapse || { enabled: false };
    }, [collapse]);

    useEffect(() => {
        if (data) {
            setDataCollapse(
                data.map((d) => ({
                    ...d,
                    isCollapse: false,
                }))
            );
        }
    }, [data]);

    const columns = React.Children.map(children, (child) => {
        if (React.isValidElement<TableColumnProps>(child)) {
            return child.props;
        }
        return null;
    })?.filter(Boolean) as TableColumnProps[];

    const mainColumns = columns.filter((col) => col.attribute !== 'collapse');
    const collapseColumn = columns.find((col) => col.attribute === 'collapse');

    const visibleColumns = column.filter((col) => col.isVisible !== false);

    const freezeOffsets: Record<string, number> = {};
    let offset = 0;
    visibleColumns.forEach((col) => {
        const width = columnWidths[col.attribute] || col.width || 150;
        if (col.isPinned) freezeOffsets[col.attribute] = offset += width;
    });

    const getFreezeStyle = (col: ColumnProps) => {
        const width = columnWidths[col.attribute] || col.width || 150;
        return col.isPinned
            ? {
                  position: 'sticky',
                  left: freezeOffsets[col.attribute] - width,
                  zIndex: 2,
                  minWidth: width,
                  maxWidth: width,
                  width,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  '&.MuiTableCell-head': {
                      background: theme.components?.MuiTableHead?.defaultProps?.style?.background,
                  },
                  '&.MuiTableCell-body': {
                      background: theme.palette.background.paper,
                  },
              }
            : {
                  width,
                  minWidth: width,
                  maxWidth: width,
              };
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, rowIndex: number) =>
        setAnchorEl((prev) => ({
            ...prev,
            [rowIndex]: event.currentTarget,
        }));

    const handleClose = (rowIndex: number) => setAnchorEl((prev) => ({ ...prev, [rowIndex]: null }));

    const toggleCollapse = (rowIndex: number) => {
        setDataCollapse((prev) =>
            prev.map((p, i) => {
                if (i === rowIndex) {
                    return {
                        ...p,
                        isCollapse: !p.isCollapse,
                    };
                }
                return p;
            })
        );
    };

    const getNestedValue = (obj: any, path: string): any => {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const value = keys.reduce((acc, key) => acc?.[key], obj);
        const value2 = path.split('.').reduce((acc, key) => acc?.[key], obj);
        if (Array.isArray(value) && keys && lastKey) {
            return obj[keys[0]]
                .map((item: any) => item?.[lastKey] ?? '')
                .filter(Boolean)
                .join(', ');
        } else {
            return value2;
        }
    };

    const checkConditions = (row: any, conditions?: Condition[]) =>
        !conditions ||
        conditions.every(({ key, operator, value }) => {
            const rowValue = getNestedValue(row, key);

            if (value === null || rowValue === null) {
                switch (operator) {
                    case '=':
                        return rowValue === value;
                    case '!=':
                        return rowValue !== value;
                    default:
                        return false;
                }
            }

            switch (operator) {
                case '=':
                    return rowValue === value;
                case '!=':
                    return rowValue !== value;
                case '>':
                    return rowValue > value;
                case '<':
                    return rowValue < value;
                case '>=':
                    return rowValue >= value;
                case '<=':
                    return rowValue <= value;
                case 'IN':
                    return Array.isArray(value) && value.includes(rowValue);
                case 'NOT IN':
                    return Array.isArray(value) && !value.includes(rowValue);
                default:
                    return true;
            }
        });

    const renderCollapseContent = (row: any) => {
        if (collapseConfig.customRenderer) {
            return collapseConfig.customRenderer(row);
        }
        if (collapseColumn?.custom) {
            return collapseColumn.custom(row);
        }
        const columnsToRender = collapseConfig.columns || mainColumns;

        return (
            <Box sx={{ p: 2, backgroundColor: 'grey.50' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>Field</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Value</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {columnsToRender.map((col) => {
                            const rawValue = getNestedValue(row, col.attribute);
                            const formattedValue = col.custom ? col.custom(col.attribute === 'all' ? row : rawValue) : rawValue;

                            return (
                                <TableRow key={col.attribute}>
                                    <TableCell sx={{ fontWeight: 'medium', width: '200px' }}>{col.label}</TableCell>
                                    <TableCell>
                                        <FormatColumn type={col.format ?? 'text'} value={formattedValue} />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Box>
        );
    };

    const showSelectedAction = checkboxKey && selected.length > 0;

    const selectedRows = useCallback(() => data.filter((row) => selected.includes(row[checkboxKey])), [data, selected, checkboxKey])();

    const notFound = meta?.Record?.Total === 0;

    const renderActionCell = (row: any, rowIndex: number) => {
        if (!action || action.length === 0) return null;

        if (actionType === 'tree_dot') {
            return (
                <PinnedTableCell position="end" sx={{ width: 80, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <IconButton onClick={(e) => handleClick(e, rowIndex)}>
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </Box>
                    <CustomPopover open={Boolean(anchorEl[rowIndex])} anchorEl={anchorEl[rowIndex]} onClose={() => handleClose(rowIndex)}>
                        <MenuList>
                            {action.map((act, index) => {
                                const element = act.element(row);
                                if (!checkConditions(row, act.conditions) || !element) return null;
                                return (
                                    <MenuItem
                                        key={index}
                                        onClick={(event) => {
                                            act.onClick(row, event, rowIndex);
                                            handleClose(rowIndex);
                                        }}
                                    >
                                        {element}
                                    </MenuItem>
                                );
                            })}
                        </MenuList>
                    </CustomPopover>
                </PinnedTableCell>
            );
        }

        return (
            <PinnedTableCell position="end" sx={{ width: 80, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    {action.map((act, index) => {
                        const element = act.element(row);
                        const permissions = profile?.Permissions ?? [];
                        if (!canRenderAction(element as ReactElement, permissions, checkConditions(row, act.conditions))) {
                            return null;
                        }
                        return (
                            <Box key={index} onClick={(e) => act.onClick(row, e, rowIndex)}>
                                {element}
                            </Box>
                        );
                    })}
                </Box>
            </PinnedTableCell>
        );
    };

    // ========== MOBILE CARD VIEW ==========
    const renderMobileCard = (row: any, rowIndex: number) => {
        const recordsPerPage = pagination?.limit ?? 10;
        const startNumber = ((meta ? meta.Page.Current : 1) - 1) * recordsPerPage + 1;
        const rowNumber = startNumber + rowIndex;
        const isItemSelected = checkboxKey ? selected.includes(row[checkboxKey]) : false;

        return (
            <Card
                key={`mobile-row-${rowIndex}`}
                sx={{
                    my: 2,
                    mx: 1,
                    p: 2,
                    // m: 1,
                    boxShadow: 2,
                    borderRadius: 2,
                    border: isItemSelected ? 2 : 1,
                    borderColor: isItemSelected ? 'primary.main' : 'divider',
                    transition: 'all 0.2s',
                    '&:hover': {
                        boxShadow: 4,
                        borderColor: 'primary.light',
                    },
                }}
            >
                {loading ? (
                    <Stack spacing={1}>
                        <Skeleton variant="text" width="60%" height={24} />
                        <Skeleton variant="text" width="80%" height={20} />
                        <Skeleton variant="text" width="70%" height={20} />
                    </Stack>
                ) : (
                    <>
                        {/* Checkbox + Serial Number */}
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            {checkboxKey && (
                                <Checkbox
                                    size="small"
                                    checked={isItemSelected}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectRow(row[checkboxKey]);
                                    }}
                                />
                            )}
                            {serialize && (
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    #{rowNumber}
                                </Typography>
                            )}
                        </Stack>

                        {/* Data Fields - Label: Value */}
                        <Stack spacing={1.5}>
                            {visibleColumns.map((col) => {
                                const rawValue = getNestedValue(row, col.attribute);
                                const formattedValue = col.custom ? col.custom(rawValue, row) : rawValue;

                                return (
                                    <Stack key={col.attribute} direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                fontWeight: 600,
                                                minWidth: 100,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {col.label}
                                        </Typography>
                                        <Box sx={{ flex: 1, textAlign: 'right' }}>
                                            <FormatColumn type={col.format} value={formattedValue} />
                                        </Box>
                                    </Stack>
                                );
                            })}
                        </Stack>

                        {/* Divider */}
                        {action && action.length > 0 && <Divider sx={{ my: 2 }} />}

                        {/* Footer Actions */}
                        {action && action.length > 0 && (
                            <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                                {actionType === 'tree_dot' ? (
                                    <>
                                        <IconButton size="small" onClick={(e) => handleClick(e, rowIndex)}>
                                            <Iconify icon="eva:more-vertical-fill" />
                                        </IconButton>
                                        <CustomPopover open={Boolean(anchorEl[rowIndex])} anchorEl={anchorEl[rowIndex]} onClose={() => handleClose(rowIndex)}>
                                            <MenuList>
                                                {action.map((act, index) => {
                                                    const element = act.element(row);
                                                    if (!checkConditions(row, act.conditions) || !element) return null;
                                                    return (
                                                        <MenuItem
                                                            key={index}
                                                            onClick={(event) => {
                                                                act.onClick(row, event, rowIndex);
                                                                handleClose(rowIndex);
                                                            }}
                                                        >
                                                            {element}
                                                        </MenuItem>
                                                    );
                                                })}
                                            </MenuList>
                                        </CustomPopover>
                                    </>
                                ) : (
                                    action.map((act, index) => {
                                        const element = act.element(row);
                                        const permissions = profile?.Permissions ?? [];
                                        if (!canRenderAction(element as ReactElement, permissions, checkConditions(row, act.conditions))) {
                                            return null;
                                        }
                                        return (
                                            <Box key={index} onClick={(e) => act.onClick(row, e, rowIndex)}>
                                                {element}
                                            </Box>
                                        );
                                    })
                                )}
                            </Stack>
                        )}
                    </>
                )}
            </Card>
        );
    };

    // ========== RENDER BASED ON SCREEN SIZE ==========
    if (isMobile) {
        return (
            <>
                {showSelectedAction && checkboxAction && (
                    <TableSelectedAction
                        dense={dense}
                        numSelected={selected.length}
                        rowCount={data.length}
                        onSelectAllRows={(checked) =>
                            onSelectAllRows(
                                checked,
                                data.map((row) => row[checkboxKey])
                            )
                        }
                        action={checkboxAction.map((act, index) => {
                            const element = act.element(selectedRows);
                            if (!element) return null;
                            return (
                                <Box key={index} onClick={(e) => act.onClick(selectedRows, e)}>
                                    {element}
                                </Box>
                            );
                        })}
                        sx={{ borderRadius: '8px 8px 0 0', mb: 2 }}
                    />
                )}

                <Box sx={{ py: 1 }}>
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => renderMobileCard({}, i))
                    ) : notFound ? (
                        <Box sx={{ py: 8, textAlign: 'center' }}>
                            <TableNoData notFound={notFound} />
                        </Box>
                    ) : (
                        dataCollapse.map((row, index) => renderMobileCard(row, index))
                    )}
                </Box>
            </>
        );
    }

    // ========== DESKTOP TABLE VIEW (EXISTING) ==========
    return (
        <>
            {showSelectedAction && checkboxAction && (
                <TableSelectedAction
                    dense={dense}
                    numSelected={selected.length}
                    rowCount={data.length}
                    onSelectAllRows={(checked) =>
                        onSelectAllRows(
                            checked,
                            data.map((row) => row[checkboxKey])
                        )
                    }
                    action={checkboxAction.map((act, index) => {
                        const element = act.element(selectedRows);
                        if (!element) return null;
                        return (
                            <Box key={index} onClick={(e) => act.onClick(selectedRows, e)}>
                                {element}
                            </Box>
                        );
                    })}
                    sx={{ borderRadius: '8px 8px 0 0' }}
                />
            )}

            <TableContainer
                component={Paper}
                sx={{
                    overflow: 'auto',
                    '& ::-webkit-scrollbar': { height: 8, width: 8 },
                    '& ::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
                    '& ::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: 2 },
                    boxShadow: 3,
                    borderRadius: 1,
                    my: 2,
                }}
            >
                <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 1000 }}>
                    <TableHead>
                        <TableRow>
                            {checkboxKey && (
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={!!selected.length && selected.length < data.length}
                                        checked={!!data.length && selected.length === data.length}
                                        onChange={(e) =>
                                            onSelectAllRows(
                                                e.target.checked,
                                                data.map((row) => row[checkboxKey])
                                            )
                                        }
                                    />
                                </TableCell>
                            )}
                            {collapseConfig.enabled && (
                                <PinnedTableCell position="start" sx={{ width: 50, textAlign: 'center' }}>
                                    <Stack gap={2} />
                                </PinnedTableCell>
                            )}
                            {serialize && <TableCell sx={{ width: 50 }}>No</TableCell>}
                            {visibleColumns.map((col) => {
                                const isAsc = sorts?.includes(col.attribute);
                                const isDesc = sorts?.includes(`-${col.attribute}`);

                                return (
                                    <TableCell
                                        key={col.attribute}
                                        sx={{
                                            ...getFreezeStyle(col),
                                            fontWeight: 'bold',
                                            position: 'relative',
                                            ...(col.isPinned && { position: 'sticky' }),
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            {col.label}
                                            {isAsc && <Icon icon="mdi:sort-reverse-variant" width={16} height={16} color="primary" />}
                                            {isDesc && <Icon icon="mdi:sort-variant" width={16} height={16} color="primary" />}
                                        </Box>

                                        {enableColumnResize && col.resizable !== false && <ResizeHandle onMouseDown={(e) => startResize(e, col.attribute)} isResizing={isResizing} />}
                                    </TableCell>
                                );
                            })}

                            {action && action.length > 0 && <PinnedTableCell position="end" />}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {dataCollapse.map((row, rowIndex) => {
                            const recordsPerPage = pagination?.limit ?? 10;
                            const startNumber = ((meta ? meta.Page.Current : 1) - 1) * recordsPerPage + 1;
                            const rowNumber = startNumber + rowIndex;
                            const isItemSelected = checkboxKey ? selected.includes(row[checkboxKey]) : false;

                            return (
                                <React.Fragment key={`row-${rowIndex}`}>
                                    <TableRow selected={isItemSelected}>
                                        {loading ? (
                                            <TableCell colSpan={visibleColumns.length + (checkboxKey ? 1 : 0) + (serialize ? 1 : 0) + (collapseConfig.enabled ? 1 : 0) + (action && action.length > 0 ? 1 : 0)}>
                                                <Skeleton variant="rectangular" width="100%" height={dense ? 34 : 54} />
                                            </TableCell>
                                        ) : (
                                            <>
                                                {checkboxKey && (
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onSelectRow(row[checkboxKey]);
                                                            }}
                                                        />
                                                    </TableCell>
                                                )}
                                                {collapseConfig.enabled && (
                                                    <PinnedTableCell position="start" sx={{ textAlign: 'center' }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => toggleCollapse(rowIndex)}
                                                            sx={{
                                                                transition: 'transform 0.2s',
                                                                transform: row.isCollapse ? 'rotate(180deg)' : 'rotate(0deg)',
                                                            }}
                                                        >
                                                            <Icon icon="mdi:chevron-down" width={20} height={20} />
                                                        </IconButton>
                                                    </PinnedTableCell>
                                                )}
                                                {serialize && <TableCell>{rowNumber}</TableCell>}

                                                {visibleColumns.map((col) => {
                                                    const rawValue = getNestedValue(row, col.attribute);
                                                    const formattedValue = col.custom ? col.custom(rawValue, row) : rawValue;
                                                    return (
                                                        <TableCell key={col.attribute} sx={getFreezeStyle(col)}>
                                                            <FormatColumn type={col.format} value={formattedValue} />
                                                        </TableCell>
                                                    );
                                                })}
                                                {renderActionCell(row, rowIndex)}
                                            </>
                                        )}
                                    </TableRow>

                                    {collapseConfig.enabled && (
                                        <TableRow>
                                            <TableCell colSpan={visibleColumns.length + (checkboxKey ? 1 : 0) + (serialize ? 1 : 0) + (collapseConfig.enabled ? 1 : 0) + (action && action.length > 0 ? 1 : 0)} sx={{ p: 0, border: 'none' }}>
                                                <Collapse in={row.isCollapse} timeout="auto" unmountOnExit>
                                                    {renderCollapseContent(row)}
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            );
                        })}

                        {notFound && (
                            <>
                                <TableEmptyRows height={dense ? 34 : 54} emptyRows={emptyRows(meta?.Page?.Current, meta.Page?.Total, meta?.Record.Total)} />
                                <TableNoData notFound={notFound} sx={{ my: 2 }} />
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default TableComponent;
