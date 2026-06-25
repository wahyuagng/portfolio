import type { ColumnFormatEnum } from '../enums/column-format.enum.ts';
import type { ColumnOptionVerticalAlignment, ColumnOptionHorizontalAlignment } from '../enums/column-option.enum.ts';

export interface IColumn {
    attribute: string;
    label: string;
    format: ColumnFormatEnum;
    value?: (data: any) => void;
    sortable?: boolean;
    nullValue?: string | number;
    options?: IColumnOptions;
}

export interface IColumnOptions {
    class?: string;
    headerClass?: boolean;
    horizontalAlignment?: ColumnOptionHorizontalAlignment;
    verticalAlignment?: ColumnOptionVerticalAlignment;
}

export interface ITableFeature {
    serialize?: boolean;
    bulkAction?: (data: any) => void;
    expandAction?: (data: any) => void;
}

export interface ITableAction {
    type: 'dropdown' | 'button';
    class?: string;
    items: ITableActionItem[];
    data: any;
    conditionDisable?: IConditionsActions;
    conditionHide?: IConditionsActions;
}

export interface IConditionsActions {
    actionType: ColumnFormatEnum[];
    condition: {
        key: string;
        value?: any;
        type?: boolean;
        actionDate?: 'before' | 'after';
        notNull?: boolean;
    }[];
}

export interface ITableActionItem {
    type: ColumnFormatEnum;
    label?: string;
    class?: string;
    color?: string;
    icon?: string;
    action: (data: any) => void;
    visible?: (params: any) => boolean;
}

export interface ITable {
    data: any[];
    columns: IColumn[];
    fetchAction?: (params: any) => void;

    feature?: ITableFeature;
    actions?: ITableAction;
    // layout?: ITableLayout;
    // options?: ITableOptions;
}

export interface FilterParamsProps {
    filters?: string;
    page?: number;
    limit?: number;
    sort?: string;
}

export interface PaginationProps {
    page: number;
    limit: number;
}
