import { Editor } from '@components/editor';

import { Box, Typography } from '@mui/material';

type FieldTextEditorProps = {
    value: any;
    setValue: (value: any) => void;

    label?: string;
    placeholder?: string;
    fullWidth?: boolean;
    height?: number | string;
    helperText?: string;
};

export function FieldTextEditor({ value, setValue, label, placeholder = 'Write something awesome...', fullWidth = true, height = 200, helperText }: FieldTextEditorProps) {
    const val = value === 'string' ? value : '';

    const handleChange = (html: string) => {
        setValue(html);
    };

    return (
        <Box sx={{ width: fullWidth ? '100%' : 'auto', position: 'relative' }}>
            {label && (
                <Typography
                    variant="caption"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 12,
                        transform: 'translateY(-50%)',
                        px: 0.5,
                        fontSize: 12,
                        color: 'text.secondary',
                        zIndex: 1,
                        backgroundColor: 'background.paper',
                    }}
                >
                    {label}
                </Typography>
            )}

            <Box
                sx={{
                    border: 'rgba(0,0,0,0.2)',
                    borderRadius: 1,
                    p: 1.5,
                    backgroundColor: 'background.paper',
                    minHeight: height,
                    '& .ProseMirror': {
                        minHeight: typeof height === 'number' ? height - 40 : height,
                    },
                }}
            >
                <Editor value={val} onChange={handleChange} placeholder={placeholder} helperText={helperText} />
            </Box>
        </Box>
    );
}
