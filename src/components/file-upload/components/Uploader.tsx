import type { OnlineFile, OutletUploadProps } from '../types.ts';

import { useDropzone } from 'react-dropzone';
import { Iconify } from '@components/iconify/iconify.js';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';

import { uploadClasses } from '../classes';
import { UploadPlaceholder } from './Placeholder';
import { RejectionFiles } from './RejectionFiles';
import { MultiFilePreview } from './PreviewMultifile';
import { SingleFilePreview } from './PreviewSingleFile';

const maxFileSize = 100 * 1024 * 1024; // 10 MB in bytes

export function Uploader({ sx, value, error, disabled, onDelete, onUpload, onRemove, onPreview, onClosePreview, thumbnail, helperText, onRemoveAll, className, dropzonePlaceholder, multiple = false, accept, ...other }: OutletUploadProps) {
    const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
        multiple,
        disabled,
        accept,
        ...other,
        maxSize: maxFileSize,
    });

    const isArray = Array.isArray(value) && multiple;

    const hasFile = !isArray && !!value;

    const hasFiles = isArray && !!value.length;

    const hasError = isDragReject || !!error;

    const renderMultiPreview = hasFiles && (
        <>
            <MultiFilePreview files={value} thumbnail={thumbnail} onRemove={onRemove} sx={{ my: 3 }} />

            {(onRemoveAll || onUpload) && (
                <Box gap={1.5} display="flex" justifyContent="flex-end">
                    {onRemoveAll && (
                        <Button color="inherit" variant="outlined" size="small" onClick={onRemoveAll}>
                            Remove all
                        </Button>
                    )}

                    {onUpload && (
                        <Button size="small" variant="contained" onClick={onUpload} startIcon={<Iconify icon="eva:cloud-upload-fill" />}>
                            Upload
                        </Button>
                    )}
                </Box>
            )}
        </>
    );

    return (
        <Box className={uploadClasses.upload.concat(className ? ` ${className}` : '')} sx={{ width: 1, position: 'relative', ...sx }}>
            <Box
                {...getRootProps()}
                sx={{
                    p: 5,
                    outline: 'none',
                    borderRadius: 1,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                    bgcolor: (theme) => alpha(theme.palette.grey['500'], 0.08),
                    border: (theme) => `1px dashed ${alpha(theme.palette.grey['500'], 0.2)}`,
                    transition: (theme) => theme.transitions.create(['opacity', 'padding']),
                    '&:hover': { opacity: 0.72 },
                    ...(isDragActive && { opacity: 0.72 }),
                    ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
                    ...(hasError && {
                        color: 'error.main',
                        borderColor: 'error.main',
                        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                    }),
                    // ...(hasFile && { padding: '28% 0' }),
                }}
            >
                <UploadPlaceholder dropzonePlaceholder={dropzonePlaceholder} accept={accept} maxSize={maxFileSize} />

                <input {...getInputProps()} />
            </Box>

            {/* Single file */}
            {hasFile && <SingleFilePreview file={value as File | OnlineFile} thumbnail={thumbnail} onDelete={onDelete} sx={{ my: 3 }} />}

            {helperText && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                    {helperText}
                </FormHelperText>
            )}

            <RejectionFiles files={fileRejections} />

            {/* Multi files */}
            {renderMultiPreview}
        </Box>
    );
}
