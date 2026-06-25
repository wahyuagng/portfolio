import type { ColumnFormat } from '@components/grid/types';

import dayjs from 'dayjs';
import React from 'react';
import DOMPurify from 'dompurify';
import { Label } from '@components/label';
import { FilePreviewTable } from '@components/file-preview/FilePreview';
import { formatDecimal, formatCurrency, formatPercentage } from '@components/grid/helpers';

import { Box } from '@mui/material';
import Chip from '@mui/material/Chip';

export interface IColumnFormat {
    type?: ColumnFormat;
    value: any;
}

const formatImage = (data: any) => {
    if (!data) return <>-</>;

    if (Array.isArray(data)) {
        return data.map((item: any, index) => (
            <FilePreviewTable title={item?.Media?.OriginalFileName}>
                <Box
                    component="img"
                    src={item?.Media?.SignedUrl}
                    alt="Image preview"
                    sx={{
                        objectFit: 'cover',
                        width: 1,
                    }}
                />
            </FilePreviewTable>
        ));
    }

    return (
        <FilePreviewTable title={data?.Media?.OriginalFileName ?? '-'}>
            <Box
                component="img"
                src={data?.Media?.SignedUrl}
                alt="Image preview"
                sx={{
                    objectFit: 'cover',
                    width: 1,
                }}
            />
        </FilePreviewTable>
    );
};

const formatHtml = (data: any) => {
    const cleanHtml = DOMPurify.sanitize(data);
    return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};

const FormatColumn: React.FC<IColumnFormat> = ({ type, value }) => {
    if (Array.isArray(value) && type !== 'image') {
        return value.map((v) => (typeof v === 'object' ? JSON.stringify(v) : v)).join(', ');
    }
    switch (type) {
        case 'text':
            return value ?? '-';
        case 'number':
            return value ?? 0;
        case 'decimal':
            return formatDecimal(value) ?? 0;
        case 'percentage':
            return formatPercentage(value) ?? 0;
        case 'currency':
            return formatCurrency(value, { maximumFractionDigits: 4, useCeil: false }) ?? 0;
        case 'date':
            return value ? dayjs(value).format('DD MMMM YYYY') : '-';
        case 'date-time':
            return value ? dayjs(value).format('DD MMMM YYYY HH:mm') : '-';
        case 'time':
            return value ? dayjs(value).format('HH:mm') : '-';
        case 'boolean':
            return value ? <Chip label="Yes" color="success" /> : <Chip label="No" color="error" />;
        case 'image':
            return formatImage(value);
        case 'html':
            return formatHtml(value);
        case 'email':
            return formatHtml(`<a href="mailto:${value}">${value}</a>`);
        case 'status':
            return formatStatus(value);
        default:
            return value ?? '-';
    }
};

const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
    const colorMap: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
        active: 'success',
        ya: 'success',
        approved: 'success',
        inactive: 'error',
        tidak: 'error',
        rejected: 'error',
        pending: 'warning',
        draft: 'info',
        exclude: 'error',
        include: 'info',
        new: 'primary',
        completed: 'success',
        cancel: 'error',
        cancelled: 'error',
        sampling: 'primary',
        on: 'success',
        off: 'error',
    };

    return colorMap[status?.toLowerCase()] || 'default';
};

export const formatStatus = (value: any) => {
    const label = typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : String(value);
    const color = getStatusColor(value);
    return <Label color={color}>{label}</Label>;
};

export default FormatColumn;
