import type { MultiFilePreviewProps } from '../types';

import { Iconify } from '@components/iconify';
import { fData } from '@common/utils/format-number';
import { fileExtractor } from '@components/file-preview/utils';
import { FileItem, FilePreview } from '@components/file-preview/FilePreview';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { Thumbnail } from './Thumbnail';
import { uploadClasses } from '../classes';

export function MultiFilePreview({
    sx,
    onRemove,
    lastNode,
    thumbnail,
    slotProps,
    firstNode,
    files = [],
    onPreview,
    onClosePreview,
    className,
    ...other
}: MultiFilePreviewProps) {
    const renderFirstNode = firstNode && (
        <Box
            component="li"
            sx={{
                ...(thumbnail && {
                    width: 'auto',
                    display: 'inline-flex',
                }),
            }}
        >
            {firstNode}
        </Box>
    );

    const renderLastNode = lastNode && (
        <Box
            component="li"
            sx={{
                ...(thumbnail && { width: 'auto', display: 'inline-flex' }),
            }}
        >
            {lastNode}
        </Box>
    );

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
            {renderFirstNode}

            {files.map((file, i) => {
                const { extractedFileInfo } = fileExtractor({ file });

                if (thumbnail) {
                    return (
                        <Box component="li" key={i} sx={{ display: 'inline-flex' }}>
                            <Thumbnail
                                tooltip
                                imageView
                                file={file}
                                fileName={extractedFileInfo.name}
                                onRemove={() => onRemove?.(file)}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    border: (theme) => `solid 1px ${alpha(theme.palette.grey['500'], 0.16)}`,
                                }}
                                slotProps={{ icon: { width: 36, height: 36 } }}
                                {...slotProps?.thumbnail}
                            />
                        </Box>
                    );
                }

                return (
                    <Box
                        component="li"
                        key={extractedFileInfo.size}
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

                        {onRemove && (
                            <IconButton size="small" onClick={() => onRemove(file)}>
                                <Iconify icon="mingcute:close-line" width={16} />
                            </IconButton>
                        )}
                    </Box>
                );
            })}

            {renderLastNode}
        </Box>
    );
}
