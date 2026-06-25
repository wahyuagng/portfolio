import type { ReactNode } from 'react';
import type { ButtonProps } from '@mui/material/Button';
import type { Theme, SxProps } from '@mui/material/styles';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { type IFileItem } from './types';
import { Previewer } from './components/Previewer';
import { FilePreviewBackdrop } from './components/FilePreviewBackdrop';
import { FilePreviewCarousel } from './components/FilePreviewCarousel';

type Props = {
    children: ReactNode;
    sx?: SxProps<Theme>;
    variant?: ButtonProps['variant'];
    size?: ButtonProps['size'];
    fullWidth?: boolean;
};

type FilePreviewTableProps = {
    children: ReactNode;
    sx?: SxProps<Theme>;
    variant?: ButtonProps['variant'];
    size?: ButtonProps['size'];
    fullWidth?: boolean;
    title: string;
};

export function FilePreview({ children, variant, size, fullWidth, sx }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Box width={fullWidth ? '100%' : 'auto'} sx={{ ...sx }}>
            <Button fullWidth={fullWidth} variant={variant} size={size} onClick={() => setIsOpen(true)}>
                Preview
            </Button>
            <FilePreviewBackdrop open={isOpen} onClose={() => setIsOpen(false)}>
                <FilePreviewCarousel>{children}</FilePreviewCarousel>
            </FilePreviewBackdrop>
        </Box>
    );
}

export function FilePreviewTable({ children, variant, size, fullWidth, sx, title = 'Preview' }: FilePreviewTableProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Box width={fullWidth ? '100%' : 'auto'} sx={{ ...sx }}>
            <Button fullWidth={fullWidth} variant={variant} size={size} onClick={() => setIsOpen(true)}>
                {title}
            </Button>
            <FilePreviewBackdrop open={isOpen} onClose={() => setIsOpen(false)}>
                {/*<FilePreviewCarousel>{children}</FilePreviewCarousel>*/}
                {children}
            </FilePreviewBackdrop>
        </Box>
    );
}

interface FileItemProps extends IFileItem {}

export function FileItem({ file }: FileItemProps) {
    return <Previewer file={file} />;
}
