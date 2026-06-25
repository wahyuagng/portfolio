import type { FC } from 'react';
import type { AxiosResponse } from 'axios';
import type { ApiResponse } from '@services/api/types';
import type { FilterParamsProps } from '@components/grid/interfaces/grid.interface';
import type { TableColumnProps } from './table-column-component.tsx';

import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Icon } from '@iconify/react';
import autoTable from 'jspdf-autotable';
import React, { useState } from 'react';
import { useTranslate } from '@locales/use-locales';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Alert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

interface ExportProps {
    service: { list: (params?: FilterParamsProps) => Promise<AxiosResponse<ApiResponse<any>>> };
    columns: TableColumnProps[];
    fileName?: string;
    setLoading: (data: boolean) => void;
    params: FilterParamsProps | undefined;
}

const downloadFile = (blob: Blob, fileName?: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `${fileName} Data.xlsx`);

    document.body.appendChild(link);

    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
};

const ExportComponentKam: FC<ExportProps> = ({ service, columns, fileName, setLoading, params }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [alert, setAlert] = useState<{ message: string; severity: 'success' | 'error' | 'info' | 'warning' } | null>(
        null
    );

    const { t } = useTranslate();

    const getData = async () => {
        setLoading(true);
        let allData: any[] = [];
        let currentPage = 1;
        let totalPages = 1;

        try {
            do {
                const response = await service.list({
                    ...params,
                    // "per-page": params?.["per-page"] ?? 1000,
                    limit: 1000,
                    page: currentPage,
                });

                if (response?.data.Data) {
                    allData = [...allData, ...response.data.Data];
                }

                totalPages = response?.data.Meta?.Page?.Total || 1;
                currentPage++;
            } while (currentPage <= totalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }

        return allData;
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getValueByField = (obj: any, field: string): any =>
        field.split('.').reduce((acc, part) => acc?.[part], obj) ?? '';
    const csv = async () => {
        setAlert({ message: 'Sedang mengekspor ke Excel, mohon tunggu...', severity: 'info' });
        try {
            const data = await getData();

            const excelData = data.map((row) =>
                columns.reduce((acc: any, col) => {
                    let value: any;
                    if (typeof col.custom === 'function') {
                        value = col.custom(row);
                    } else {
                        value = getValueByField(row, col.attribute);
                    }
                    acc[col.label] = value;
                    return acc;
                }, {})
            );

            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            downloadFile(blob, fileName);
            setAlert({ message: '✅ Export Excel selesai dan file berhasil disiapkan', severity: 'success' });
        } catch (err) {
            setAlert({ message: '❌ Gagal mengekspor Excel', severity: 'error' });
        }
    };

    const pdf = async () => {
        setAlert({ message: 'Sedang menyiapkan PDF, mohon tunggu...', severity: 'info' });
        try {
            const data = await getData();
            const isLandscape = columns.length > 5;
            const pdfDoc = new jsPDF({ orientation: isLandscape ? 'landscape' : 'portrait' });

            const filteredColumns = columns.filter((col) => col.format !== 'image');
            const head = [['No', ...filteredColumns.map((col) => col.label)]];
            const body = data.map((row, index) => {
                const rowData = filteredColumns.map((col) => {
                    if (typeof col.custom === 'function') {
                        try {
                            return col.custom(row);
                        } catch {
                            return '';
                        }
                    }
                    return getValueByField(row, col.attribute);
                });
                return [index + 1, ...rowData];
            });

            autoTable(pdfDoc, {
                head,
                body,
                styles: { fontSize: 9 },
                theme: 'striped',
                margin: { top: 15 },
                headStyles: { fillColor: [22, 160, 133] },
            });

            pdfDoc.save(`${fileName ?? 'Data'}.pdf`);
            setAlert({ message: '✅ Export PDF selesai dan file berhasil disiapkan', severity: 'success' });
        } catch (err) {
            setAlert({ message: '❌ Gagal mengekspor PDF', severity: 'error' });
        }
    };

    return (
        <>
            <Tooltip title="Export" arrow>
                <Button
                    aria-label="more"
                    aria-controls={anchorEl ? 'three-dot-menu' : undefined}
                    aria-expanded={anchorEl ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={(e) => handleClick(e)}
                    startIcon={<Icon icon="material-symbols:file-export" />}
                    sx={{ width: 'auto', height: 25 }}
                >
                    {t('export')}
                </Button>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleClose()}>
                <MenuItem
                    onClick={() => {
                        csv();
                        handleClose();
                    }}
                >
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                        <Icon icon="mdi:file-excel" color="#217346" width="24" height="24" />
                        <span>Excel</span>
                    </Box>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        pdf();
                        handleClose();
                    }}
                >
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                        <Icon icon="material-symbols-light:picture-as-pdf" width="24" height="24" color="red" />
                        <span>PDF</span>
                    </Box>
                </MenuItem>
            </Menu>
            {alert && (
                <Snackbar
                    open
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{ mt: '64px' }}
                    onClose={alert.severity === 'info' ? undefined : () => setAlert(null)}
                    autoHideDuration={alert.severity === 'info' ? null : 3000}
                >
                    <Alert
                        onClose={alert.severity === 'info' ? undefined : () => setAlert(null)}
                        severity={alert.severity}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {alert.message}
                    </Alert>
                </Snackbar>
            )}
        </>
    );
};

export default ExportComponentKam;
