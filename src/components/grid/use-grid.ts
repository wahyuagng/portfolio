import type { ColumnFormat } from '@components/grid/types';
import type { Meta, Filter, Pagination } from '@services/api/types';

import { useState, useEffect, useCallback } from 'react';

export interface UseGridColumn {
    attribute: string;
    label: string;
    format?: ColumnFormat;
    statusColors?: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'>;
    custom?: (value: any, row?: any) => React.ReactNode;
    customExport?: (data: any, row?: any) => string | number;
    switchVisibility?: boolean;
    sortable?: boolean;
    width?: number;
    isVisible?: boolean;
    isPinned?: boolean;
    resizable?: boolean;
}

interface UseGridOptions<T> {
    fetchData?: (filters?: Filter[], pagination?: Pagination, sorts?: string[]) => Promise<{ data?: T[] | null; meta?: Meta } | undefined>;
    initialPage?: Pagination;
    initialFilter?: Filter[];
    initialSort?: string[];
    columns: UseGridColumn[];
}

export function useGrid<T>({ columns: initialColumns, fetchData, initialPage, initialFilter, initialSort }: UseGridOptions<T>) {
    // DATA
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<T[]>([]);
    const [meta, setMeta] = useState<Meta>();

    // TABLE
    const [columns, setColumns] = useState<UseGridColumn[]>(
        initialColumns.map((col) => ({
            ...col,
            isVisible: col.isVisible ?? true,
            isPinned: col.isPinned ?? false,
            switchVisibility: col.switchVisibility ?? true,
            format: col.format ?? 'text',
            sortable: col.sortable ?? true,
            width: col.width ?? 150,
        }))
    );
    const [filters, setFilters] = useState<Filter[]>(initialFilter ?? []);
    const [sorts, setSorts] = useState<string[]>(initialSort ?? []);
    const [pagination, setPagination] = useState<Pagination>(initialPage ?? { page: 1, limit: 10 });

    // RELOAD FUNCTION
    const reload = useCallback(async () => {
        if (!fetchData) return;
        setLoading(true);
        try {
            const result = await fetchData(filters, pagination, sorts);
            setRows(result?.data ?? []);
            setMeta(result?.meta ?? { Record: { Current: 1, Total: 10 }, Page: { Current: 1, Total: 10 } });
        } catch (error) {
            console.error('Failed to load grid data:', error);
        } finally {
            setLoading(false);
        }
    }, [fetchData, filters, pagination, sorts]);

    useEffect(() => {
        reload();
    }, [filters, sorts, pagination]);

    const onVisibilityChange = useCallback((attribute: string, visible: boolean) => {
        setColumns((prev) => prev.map((col) => (col.attribute === attribute ? { ...col, isVisible: visible } : col)));
    }, []);

    return {
        // DATA
        rows,
        setRows,
        meta,
        setMeta,
        loading,
        setLoading,
        // TABLE
        columns,
        setColumns,
        filters,
        setFilters,
        sorts,
        setSorts,
        pagination,
        setPagination,
        // COLUMN VISIBILITY
        onVisibilityChange,
        // ACTION
        reload,
    };
}
