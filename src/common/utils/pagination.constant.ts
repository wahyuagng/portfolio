import type { Meta, Pagination } from '@services/api/types';

export const DEFAULT_META: Meta = {
    Record: {
        Current: 1,
        Total: 1,
    },
    Page: {
        Current: 1,
        Total: 1,
    },
    Links: {
        Self: '',
        First: '',
        Prev: '',
        Next: '',
        Last: '',
    },
};

export const DEFAULT_PAGINATION: Pagination = {
    page: 1,
    limit: 10,
};

Object.freeze(DEFAULT_META);
Object.freeze(DEFAULT_PAGINATION);
