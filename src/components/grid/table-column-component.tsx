import type React from 'react';
import type { ColumnFormat } from '@components/grid/types';

export interface TableColumnProps {
    attribute: string;
    label: string;
    format?: ColumnFormat;
    statusColors?: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'>;
    // custom?: (data: any) => any;
    custom?: (data: any, row?: any) => any;
    customExport?: (data: any, row?: any) => string | number;
    isVisible?: boolean;
    resizable?: boolean;
}

const TableColumnComponent: React.FC<TableColumnProps> = () => null;

export default TableColumnComponent;
