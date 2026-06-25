import type { UploadProps } from '@components/uploadNew/types';

import { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Iconify } from '@components/iconify';

import Box from '@mui/material/Box';

import { uploadClasses } from './classes';

// ----------------------------------------------------------------------

export function UploadBox({ placeholder, error, disabled, className, sx, ...other }: UploadProps) {
    const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
        disabled,
        accept: {
            'image/*': [],
            'application/pdf': [],
        },
        ...other,
    });

    const hasError = isDragReject || error;

    useEffect(() => {
        if (fileRejections.length > 0) {
            window.alert('At the meantime only image and PDF files are allowed.');
        }
    }, [fileRejections]);

    return (
        <Box
            {...getRootProps()}
            className={uploadClasses.uploadBox.concat(className ? ` ${className}` : '')}
            sx={{
                width: 64,
                height: 64,
                flexShrink: 0,
                display: 'flex',
                borderRadius: 1,
                cursor: 'pointer',
                alignItems: 'center',
                color: 'text.disabled',
                justifyContent: 'center',
                ml: -5, // pakai shorthand daripada marginLeft
                bgcolor: (theme) => theme.palette.grey[200], // ✅ pilih salah satu shade
                border: (theme) => `dashed 1px ${theme.palette.grey[500]}`, // ✅ akses index
                ...(isDragActive && { opacity: 0.72 }),
                ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
                ...(hasError && {
                    color: 'error.main',
                    borderColor: 'error.main',
                    bgcolor: (theme) => theme.palette.error.light, // ✅ gunakan shade
                }),
                '&:hover': { opacity: 0.72 },
                ...sx,
            }}
        >
            <input {...getInputProps()} />
            {placeholder || <Iconify icon="eva:cloud-upload-fill" width={50} />}
        </Box>
    );
}
