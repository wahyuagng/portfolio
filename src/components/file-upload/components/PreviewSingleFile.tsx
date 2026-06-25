import type { IconButtonProps } from '@mui/material/IconButton';
import type { SingleFilePreviewProps } from '../types.ts';

import { fData } from '@common/utils/format-number.js';
import { Iconify } from '@components/iconify/iconify.js';
import { fileExtractor } from '@components/file-preview/utils';
import { FileItem, FilePreview } from '@components/file-preview/FilePreview';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { Thumbnail } from './Thumbnail';
import { uploadClasses } from '../classes';

export function SingleFilePreview({
    sx,
    file,
    thumbnail,
    slotProps,
    onDelete,
    className,
    ...other
}: SingleFilePreviewProps) {
    const { extractedFile, extractedFileInfo } = fileExtractor({ file });

    return (
        <Box
            component="ul"
            className={uploadClasses.uploadMultiPreview.concat(className ? ` ${className}` : '')}
            sx={{
                gap: 1,
                display: 'flex',
                flexDirection: 'column',
                ...(thumbnail && {
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                }),
                ...sx,
            }}
            {...other}
        >
            {thumbnail && (
                <Box component="li" sx={{ display: 'inline-flex' }}>
                    <Thumbnail
                        tooltip
                        imageView
                        file={file}
                        fileName={extractedFileInfo.name}
                        sx={{
                            width: 80,
                            height: 80,
                            border: (theme) => `solid 1px ${alpha(theme.palette.grey['500'], 0.16)}`,
                        }}
                        slotProps={{ icon: { width: 36, height: 36 } }}
                        {...slotProps?.thumbnail}
                    />
                </Box>
            )}
            <Box
                component="li"
                key={extractedFileInfo.name}
                sx={{
                    py: 1,
                    pr: 1,
                    pl: 1.5,
                    gap: 1.5,
                    display: 'flex',
                    borderRadius: 1,
                    alignItems: 'center',
                    border: (theme) => `solid 1px ${alpha(theme.palette.grey['500'], 0.16)}`,
                }}
            >
                <Thumbnail file={file} fileName={extractedFileInfo.name} {...slotProps?.thumbnail} />

                <ListItemText
                    primary={extractedFileInfo.name}
                    secondary={fData(extractedFileInfo.size)}
                    secondaryTypographyProps={{ component: 'span', typography: 'caption' }}
                />

                <FilePreview>
                    <FileItem file={file} />
                </FilePreview>

                {onDelete && (
                    <IconButton size="small" onClick={() => onDelete(file)}>
                        <Iconify icon="mingcute:close-line" width={16} />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
}

export function DeleteButton({ sx, ...other }: IconButtonProps) {
    return (
        <IconButton
            size="small"
            sx={{
                top: 16,
                right: 16,
                zIndex: 9,
                position: 'absolute',
                color: (theme) => alpha(theme.palette.common.white, 0.8),
                bgcolor: (theme) => alpha(theme.palette.grey['900'], 0.72),
                '&:hover': { bgcolor: (theme) => alpha(theme.palette.grey['900'], 0.48) },
                ...sx,
            }}
            {...other}
        >
            <Iconify icon="mingcute:close-line" width={18} />
        </IconButton>
    );
}

export function PreviewButton({ sx, ...other }: IconButtonProps) {
    return (
        <IconButton
            size="small"
            sx={{
                top: 16,
                right: 48,
                zIndex: 9,
                position: 'absolute',
                color: (theme) => alpha(theme.palette.common.white, 0.8),
                bgcolor: (theme) => alpha(theme.palette.grey['900'], 0.72),
                '&:hover': { bgcolor: (theme) => alpha(theme.palette.grey['900'], 0.48) },
                ...sx,
            }}
            {...other}
        >
            <Iconify icon="solar:eye-bold" width={18} />
        </IconButton>
    );
}
