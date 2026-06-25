export interface ApiResponse<T> {
    Name: string;
    Message: string;
    Code: number;
    Status: number;
    RequestTime?: number;
    Data: T | null;
    Meta?: Meta;
    Errors?: Errors;
}

export interface Meta {
    Record: Page;
    Page: Page;
    Links?: Links;
}

interface Links {
    Self: any;
    First: any;
    Prev: any;
    Next: any;
    Last: any;
}

interface Page {
    Current: number;
    Total: number;
}

export interface Errors {
    Validation?: any;
    StackTrace?: any;
}

export interface Pagination {
    page?: number;
    limit?: number;
}

export type FilterOperator = 'LIKE' | 'IN' | 'NOT IN' | 'BETWEEN' | '=' | '!=' | '>' | '>=' | '<' | '<=';

export interface Filter {
    attribute: string;
    operator: FilterOperator;
    value: string | string[] | number | number[];
}

export interface ApiRequest<T = undefined> {
    data?: T extends undefined ? never : T;
    filters?: Filter[];
    pagination?: Pagination;
    sorts?: string[];
    firstRequest?: string;
}

export interface FilterParamsProps {
    filters?: string;
    page?: number;
    limit?: number;
    sort?: string;
}
