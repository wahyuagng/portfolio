import type { FC } from 'react';
import type { AxiosResponse } from 'axios';
import type { ApiResponse } from '@services/api/types';

import { toast } from 'sonner';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { handleResponseError } from '@common/helpers';

import { Box, Menu, Button, Divider, Typography, LinearProgress } from '@mui/material';

interface ImportProps {
    service: { import: (data: any) => Promise<AxiosResponse<ApiResponse<any>>>; template: () => any };
    fileName: string;
    getData: () => void;
}

const ImportComponent: FC<ImportProps> = ({ service, fileName, getData }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState(0);
    const [importStep, setImportStep] = useState<'idle' | 'uploading' | 'processing'>('idle');

    const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => {
        setAnchorEl(null);
        setFile(null);
        setProgress(0);
        setImportStep('idle');
    };

    const downloadTemplate = async () => {
        try {
            setLoading(true);
            setProgress(10);
            setImportStep('processing');

            const response = await service.template();
            setProgress(70);

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileName ?? 'Template'}_Template.xlsx`);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setProgress(100);
            toast.success('Template berhasil diunduh!');

            setTimeout(() => {
                setLoading(false);
                setProgress(0);
                setImportStep('idle');
            }, 1000);
        } catch (error) {
            setLoading(false);
            setProgress(0);
            setImportStep('idle');
            toast.error('Gagal mengunduh template');
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
            if (!allowedTypes.includes(selectedFile.type)) {
                toast.error('Format file tidak didukung. Hanya Excel (.xlsx) dan CSV yang diizinkan.');
                return;
            }
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (selectedFile.size > maxSize) {
                toast.error('Ukuran file terlalu besar. Maksimal 10MB.');
                return;
            }
            setFile(selectedFile);
            toast.success(`File "${selectedFile.name}" berhasil dipilih`);
        }
    };

    const importData = async () => {
        if (!file) {
            toast.warning('Pilih file terlebih dahulu!');
            return;
        }

        setLoading(true);
        setProgress(0);
        setImportStep('uploading');

        const formData = new FormData();
        formData.append('File', file);

        try {
            const uploadInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 30) {
                        clearInterval(uploadInterval);
                        return 30;
                    }
                    return prev + 10;
                });
            }, 200);

            setImportStep('processing');
            setProgress(40);

            const response = await service.import(formData);

            setProgress(80);

            // Simulate processing time
            await new Promise((resolve) => setTimeout(resolve, 500));

            setProgress(100);
            toast.success('Import berhasil!');
            getData();

            setTimeout(() => {
                handleMenuClose();
            }, 1000);
        } catch (error) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                typeof (error as any).response?.data === 'object'
            ) {
                handleResponseError((error as any).response.data);
            } else {
                toast.error('Import gagal!');
            }
        } finally {
            setLoading(false);
            setProgress(0);
            setImportStep('idle');
        }
    };

    const getProgressText = () => {
        switch (importStep) {
            case 'uploading':
                return 'Mengupload file...';
            case 'processing':
                return 'Memproses data...';
            default:
                return 'Memuat...';
        }
    };

    return (
        <>
            <Button size="small" onClick={handleMenuOpen} startIcon={<Icon icon="mdi:upload" width={20} height={20} />}>
                Import
            </Button>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <Box sx={{ p: 2, width: 320 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Import Options
                    </Typography>
                    <Divider />

                    {/* Download Template Section */}
                    <Box sx={{ mt: 2, mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Download Template
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={downloadTemplate}
                            disabled={loading}
                            startIcon={<Icon icon="mdi:download" />}
                        >
                            Download Template Excel
                        </Button>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* File Upload Section */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Select File
                        </Typography>
                        <input
                            type="file"
                            accept=".xlsx,.csv"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="upload-file-input"
                        />
                        <label htmlFor="upload-file-input">
                            <Button
                                component="span"
                                variant="outlined"
                                size="small"
                                fullWidth
                                disabled={loading}
                                startIcon={<Icon icon="mdi:file-upload" />}
                            >
                                {file ? file.name : 'Choose File'}
                            </Button>
                        </label>

                        {file && (
                            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'success.main' }}>
                                File: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </Typography>
                        )}
                    </Box>

                    {/* Progress Bar */}
                    {loading && (
                        <Box sx={{ mb: 2 }}>
                            <LinearProgress variant="determinate" value={progress} />
                            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                                {getProgressText()} {progress}%
                            </Typography>
                        </Box>
                    )}

                    {/* Import Action */}
                    <Box sx={{ textAlign: 'right' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={importData}
                            disabled={!file || loading}
                            startIcon={<Icon icon="mdi:check" />}
                        >
                            {loading ? 'Importing...' : 'Import Data'}
                        </Button>
                    </Box>

                    {/* File Requirements */}
                    <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            • Supported formats: Excel (.xlsx), CSV
                            <br />
                            • Maximum file size: 10MB
                            <br />• Use downloaded template for best results
                        </Typography>
                    </Box>
                </Box>
            </Menu>
        </>
    );
};

export default ImportComponent;
