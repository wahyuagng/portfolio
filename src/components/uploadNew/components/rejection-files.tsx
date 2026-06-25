import type { FileRejection } from 'react-dropzone';
import type { PaperProps } from '@mui/material/Paper';

import { varAlpha } from 'minimal-shared/utils';
import { fData } from '@common/utils/format-number';
import { fileData } from '@components/file-thumbnail/utils';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { uploadClasses } from '../classes';

// ----------------------------------------------------------------------

type RejectionFilesProps = PaperProps & {
    files: readonly FileRejection[];
};

export function RejectionFiles({ files, sx, className, ...other }: RejectionFilesProps) {
    if (!files.length) {
        return null;
    }

    return (
        <Paper
            variant="outlined"
            className={uploadClasses.uploadRejectionFiles.concat(className ? ` ${className}` : '')}
            sx={{
                py: 1,
                px: 2,
                mt: 3,
                textAlign: 'left',
                borderStyle: 'dashed',
                borderColor: 'error.main',
                bgcolor: (theme) => varAlpha(theme.vars.palette.error.mainChannel, 0.08),
                ...sx,
            }}
            {...other}
        >
            {files.map(({ file, errors }) => {
                const { path, size } = fileData(file);

                return (
                    <Box key={path} sx={{ my: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                            {path} - {size ? fData(size) : ''}
                        </Typography>

                        {errors.map((error) => (
                            <Box key={error.code} component="span" sx={{ typography: 'caption' }}>
                                - {error.message}
                            </Box>
                        ))}
                    </Box>
                );
            })}
        </Paper>
    );
}
