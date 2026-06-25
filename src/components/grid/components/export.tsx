import type { Meta, Filter, Pagination } from '@services/api/types';
import type { TableColumnProps } from '@components/grid/table-column-component';

import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '@components/grid/helpers';

import { Box, Menu, Radio, Button, Slider, Divider, Tooltip, useTheme, RadioGroup, Typography, useMediaQuery, LinearProgress, FormControlLabel } from '@mui/material';

interface ExportExcelProps<T> {
    fetchData?: (filters?: Filter[], pagination?: Pagination, sorts?: string[]) => Promise<{ data?: T[] | null; meta?: Meta } | undefined>;
    meta?: Meta;
    pagination?: Pagination;
    filters?: Filter[];
    sorts?: string[];
    fileName?: string;
    columns: TableColumnProps[];
}

const ExportComponent = <T,>({ fetchData, meta, pagination, filters, sorts, columns, fileName = 'export' }: ExportExcelProps<T>) => {
    const lastPage = meta?.Page.Total;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [exportOption, setExportOption] = useState<'current' | 'all' | 'range'>('current');
    const [exportType, setExportType] = useState<'excel' | 'csv' | 'pdf'>('excel');
    const [pageRange, setPageRange] = useState<number[]>([1, lastPage || 1]);
    const [downloading, setDownloading] = useState(false);
    const [progress, setProgress] = useState(0);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleDownload = async () => {
        if (!fetchData) return;

        setDownloading(true);
        setProgress(0);
        const allData: T[] = [];

        const startPage = exportOption === 'range' ? pageRange[0] : 1;
        const endPage = exportOption === 'current' ? meta?.Page.Current || 1 : exportOption === 'range' ? pageRange[1] : lastPage || 1;

        const totalPages = endPage - startPage + 1;

        const resolveValue = (row: any, col: TableColumnProps) => {
            if (typeof col.customExport === 'function') {
                const value = col.attribute?.split('.').reduce((acc: any, key: string) => acc?.[key], row);
                return col.customExport(value, row);
            }

            // if (typeof col.custom === 'function') {
            //     return col.custom(row);
            // }

            if (typeof col.custom === 'function') {
                const value = col.attribute?.split('.').reduce((acc: any, key: string) => acc?.[key], row);
                return col.custom(value, row);
            }

            const value = col.attribute?.split('.').reduce((acc: any, key: string) => acc?.[key], row);
            if (value == null) return '';

            switch (col.format) {
                case 'currency':
                    return formatCurrency(value);
                case 'status':
                    return String(value);
                default:
                    return value;
            }
        };

        for (let i = 0; i < totalPages; i++) {
            const page = startPage + i;
            const res = await fetchData(filters, { page, limit: pagination?.limit || 50 }, sorts);
            if (res?.data) {
                allData.push(...res.data);
                localStorage.setItem(`export_page_${page}`, JSON.stringify(res.data));
            }
            setProgress(Math.round(((i + 1) / totalPages) * 100));
        }

        const processData = allData.map((row) =>
            columns.reduce((acc: Record<string, any>, col) => {
                acc[col.label] = resolveValue(row, col);
                return acc;
            }, {})
        );

        if (exportType === 'excel') {
            const ws = XLSX.utils.json_to_sheet(processData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Export');
            XLSX.writeFile(wb, fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`);
        }

        if (exportType === 'csv') {
            const ws = XLSX.utils.json_to_sheet(processData);
            const csvData = XLSX.utils.sheet_to_csv(ws);
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;
            link.click();
        }

        if (exportType === 'pdf') {
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'pt',
                format: 'a4',
            });

            const tableColumn = columns.map((col) => col.label);
            const tableRows = processData.map((row) => columns.map((col) => row[col.label] ?? ''));

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                styles: { fontSize: 8 },
            });

            doc.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
        }

        setDownloading(false);
        setProgress(0);
        handleMenuClose();
    };

    return (
        <>
            <Tooltip title="Export">
                <Button size="small" onClick={handleMenuOpen} startIcon={<Icon icon="mdi:download" width={20} height={20} />}>
                    {!isMobile ? 'Export' : ''}
                </Button>
            </Tooltip>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <Box sx={{ p: 2, width: 320 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Export Options
                    </Typography>
                    <Divider />

                    <RadioGroup value={exportOption} onChange={(e) => setExportOption(e.target.value as 'current' | 'all' | 'range')}>
                        <FormControlLabel value="current" control={<Radio />} label="Current Page" />
                        <FormControlLabel value="all" control={<Radio />} label="All Pages" />
                        <FormControlLabel value="range" control={<Radio />} label="Page Range" />
                    </RadioGroup>

                    {exportOption === 'range' && (
                        <Box sx={{ mt: 2 }}>
                            <Slider value={pageRange} min={1} max={lastPage || 1} onChange={(_, newValue) => setPageRange(newValue as number[])} valueLabelDisplay="auto" />
                            <Typography variant="caption">
                                {pageRange[0]} - {pageRange[1]}
                            </Typography>
                        </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" gutterBottom>
                        Export Format
                    </Typography>
                    <RadioGroup row value={exportType} onChange={(e) => setExportType(e.target.value as 'excel' | 'csv' | 'pdf')}>
                        <FormControlLabel value="excel" control={<Radio />} label="Excel" />
                        <FormControlLabel value="csv" control={<Radio />} label="CSV" />
                        <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
                    </RadioGroup>

                    {downloading && (
                        <Box sx={{ mt: 2 }}>
                            <LinearProgress variant="determinate" value={progress} />
                            <Typography variant="caption">{progress}%</Typography>
                        </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ textAlign: 'right' }}>
                        <Button variant="contained" color="primary" size="small" onClick={handleDownload} disabled={downloading} startIcon={<Icon icon="mdi:check" />}>
                            {downloading ? 'Downloading...' : 'Download'}
                        </Button>
                    </Box>
                </Box>
            </Menu>
        </>
    );
};

export default ExportComponent;
