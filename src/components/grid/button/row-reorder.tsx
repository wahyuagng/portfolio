import { Iconify } from '@components/iconify';

import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

interface RowReorderButtonProps {
    isFirst: boolean;
    isLast: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
}

const RowReorderButton = ({ isFirst, isLast, onMoveUp, onMoveDown }: RowReorderButtonProps) => (
    <Stack direction="column">
        <IconButton size="small" disabled={isFirst} onClick={onMoveUp}>
            <Iconify icon="eva:arrow-ios-upward-fill" />
        </IconButton>

        <IconButton size="small" disabled={isLast} onClick={onMoveDown}>
            <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>
    </Stack>
);

export { RowReorderButton };
