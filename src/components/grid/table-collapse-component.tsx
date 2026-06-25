import type { TableColumnProps } from './table-column-component.tsx';

import { Icon } from '@iconify/react';
import { Iconify } from '@components/iconify';
import React, { useState, useEffect } from 'react';
import FormatColumn from '@components/grid/format-column';
import { CustomPopover } from '@components/custom-popover';
import { emptyRows, TableNoData, TableEmptyRows } from '@components/table';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import { Paper, Table, TableRow, TableBody, TableCell, TableHead, TableContainer } from '@mui/material';

import { useTable } from './table-provider.js';

export interface ActionColumnProps {
    conditions?: Condition[];
    element: (row: any) => React.ReactNode;
    onClick: (row: any, event?: any, index?: number) => any;
}

export interface Condition {
    key: string;
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=';
    value: string | number | boolean;
}

export interface CollapseConfig {
    enabled: boolean;
    columns?: TableColumnProps[]; // Kolom khusus untuk collapse view
    customRenderer?: (row: any) => React.ReactNode; // Custom renderer untuk collapse content
}

export interface TableProps {
    data: any[];
    loading?: boolean;
    action?: ActionColumnProps[];
    children: React.ReactNode;
    meta?: MetaProps;
    collapse?: boolean | CollapseConfig; // Enhanced collapse prop
    actionType?: 'button' | 'tree_dot';
}

export interface MetaProps {
    Record: {
        Current: number;
        Total: number;
    };
    Page: {
        Current: number;
        Total: number;
    };
    Links?: {
        Self: any;
        First: any;
        Prev: any;
        Next: any;
        Last: any;
    };
}

const TableCollapseComponent: React.FC<TableProps> = ({
    data,
    loading,
    meta,
    action,
    actionType = 'tree_dot',
    children,
    collapse,
}) => {
    const [anchorEl, setAnchorEl] = useState<{ [key: number]: HTMLElement | null }>({});
    const [dataX, setDataX] = useState<any[]>([]);
    const { dense } = useTable();

    const collapseConfig = React.useMemo(() => {
        if (typeof collapse === 'boolean') {
            return { enabled: collapse };
        }
        return collapse || { enabled: false };
    }, [collapse]);

    useEffect(() => {
        if (data) {
            setDataX(
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

    const checkConditions = (row: any, conditions?: Condition[]): boolean => {
        if (!conditions) return true;

        return conditions.every(({ key, operator, value }) => {
            const rowValue = row[key];

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
                default:
                    return false;
            }
        });
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, rowIndex: number) => {
        setAnchorEl((prev) => ({ ...prev, [rowIndex]: event.currentTarget }));
    };

    const handleClose = (rowIndex: number) => {
        setAnchorEl((prev) => ({ ...prev, [rowIndex]: null }));
    };

    const toggleCollapse = (rowIndex: number) => {
        setDataX((prev) =>
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
                            const formattedValue = col.custom
                                ? col.custom(col.attribute === 'all' ? row : rawValue)
                                : rawValue;

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

    const notFound = meta?.Record?.Total === 0;

    return (
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
            <Table size={dense ? 'small' : 'medium'}>
                <TableHead>
                    <TableRow>
                        <TableCell>No</TableCell>
                        {mainColumns.map((col) => (
                            <TableCell key={col.attribute}>
                                <Stack gap={2}>{col.label}</Stack>
                            </TableCell>
                        ))}
                        {collapseConfig.enabled && (
                            <TableCell sx={{ width: 50, textAlign: 'center' }}>
                                <Stack gap={2}>Detail</Stack>
                            </TableCell>
                        )}
                        {action && action.length > 0 && <TableCell />}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataX &&
                        dataX.map((row, rowIndex) => {
                            const recordsPerPage = 10;
                            const startNumber = ((meta ? meta.Page.Current : 1) - 1) * recordsPerPage + 1;
                            const rowNumber = startNumber + rowIndex;

                            return (
                                <React.Fragment key={`row-${rowIndex}`}>
                                    <TableRow>
                                        {loading ? (
                                            <TableCell
                                                colSpan={
                                                    mainColumns.length +
                                                    (collapseConfig.enabled ? 1 : 0) +
                                                    (action && action.length > 0 ? 1 : 0) +
                                                    1
                                                }
                                            >
                                                <Skeleton variant="rounded" width="100%" height={20} />
                                            </TableCell>
                                        ) : (
                                            <>
                                                <TableCell>{rowNumber}</TableCell>
                                                {mainColumns.map((col) => {
                                                    const rawValue = getNestedValue(row, col.attribute);
                                                    const formattedValue = col.custom
                                                        ? col.custom(col.attribute.startsWith('all') ? row : rawValue)
                                                        : rawValue;

                                                    return (
                                                        <TableCell key={col.attribute}>
                                                            <FormatColumn
                                                                type={col.format ?? 'text'}
                                                                value={formattedValue}
                                                            />
                                                        </TableCell>
                                                    );
                                                })}

                                                {collapseConfig.enabled && (
                                                    <TableCell sx={{ textAlign: 'center' }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => toggleCollapse(rowIndex)}
                                                            sx={{
                                                                transition: 'transform 0.2s',
                                                                transform: row.isCollapse
                                                                    ? 'rotate(180deg)'
                                                                    : 'rotate(0deg)',
                                                            }}
                                                        >
                                                            <Icon icon="mdi:chevron-down" width={20} height={20} />
                                                        </IconButton>
                                                    </TableCell>
                                                )}

                                                {action && action.length > 0 && (
                                                    <TableCell sx={{ width: 80, textAlign: 'center' }}>
                                                        {actionType === 'tree_dot' ? (
                                                            <>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                    }}
                                                                >
                                                                    <IconButton
                                                                        aria-label="more"
                                                                        aria-controls={
                                                                            anchorEl[rowIndex]
                                                                                ? 'three-dot-menu'
                                                                                : undefined
                                                                        }
                                                                        aria-expanded={
                                                                            anchorEl[rowIndex] ? 'true' : undefined
                                                                        }
                                                                        aria-haspopup="true"
                                                                        color={
                                                                            anchorEl[rowIndex] ? 'inherit' : 'default'
                                                                        }
                                                                        onClick={(e) => handleClick(e, rowIndex)}
                                                                    >
                                                                        <Iconify icon="eva:more-vertical-fill" />
                                                                    </IconButton>
                                                                </Box>

                                                                <CustomPopover
                                                                    open={Boolean(anchorEl[rowIndex])}
                                                                    anchorEl={anchorEl[rowIndex]}
                                                                    onClose={() => handleClose(rowIndex)}
                                                                    slotProps={{ arrow: { placement: 'right-top' } }}
                                                                >
                                                                    <MenuList>
                                                                        {action &&
                                                                            action.map((act, index) => {
                                                                                const element = act.element(row);
                                                                                if (
                                                                                    !checkConditions(
                                                                                        row,
                                                                                        act.conditions
                                                                                    ) ||
                                                                                    !element
                                                                                )
                                                                                    return null;

                                                                                return (
                                                                                    <MenuItem
                                                                                        key={index}
                                                                                        onClick={(event) => {
                                                                                            act.onClick(
                                                                                                row,
                                                                                                event,
                                                                                                rowIndex
                                                                                            );
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
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    gap: 0.5,
                                                                    flexWrap: 'nowrap',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                {action.map((act, index) => {
                                                                    if (!checkConditions(row, act.conditions))
                                                                        return null;
                                                                    const element = act.element(row);
                                                                    if (!element) return null;

                                                                    return (
                                                                        <Box
                                                                            component="div"
                                                                            key={index}
                                                                            onClick={(event) =>
                                                                                act.onClick(row, event, rowIndex)
                                                                            }
                                                                        >
                                                                            {element}
                                                                        </Box>
                                                                    );
                                                                })}
                                                            </Box>
                                                        )}
                                                    </TableCell>
                                                )}
                                            </>
                                        )}
                                    </TableRow>
                                    {/* Collapse Content Row */}
                                    {collapseConfig.enabled && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={mainColumns.length + (action && action.length > 0 ? 1 : 0) + 2}
                                                sx={{ p: 0, border: 'none' }}
                                            >
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
                            <TableEmptyRows
                                height={dense ? 34 : 34 + 20}
                                emptyRows={emptyRows(meta?.Page?.Current, meta.Page?.Total, meta?.Record.Total)}
                            />
                            <TableNoData notFound={notFound} />
                        </>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableCollapseComponent;
