import type { Meta, Pagination as PaginationType } from '@services/api/types';

import { useState } from 'react';
import { TablePaginationCustom } from '@components/table';
import { useTable } from '@components/grid/table-provider';

import { Box, Typography } from '@mui/material';

interface PaginationComponentProps {
    meta?: Meta;
    setPagination: (data: PaginationType) => void;
    isLoading: boolean;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ meta, setPagination, isLoading }) => {
    const table = useTable();

    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    const currentPage = Math.max(
        0,
        Math.min((meta?.Page?.Current || 1) - 1, Math.ceil((meta?.Record?.Total || 0) / rowsPerPage) - 1)
    );

    const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPagination({ page: newPage + 1, limit: rowsPerPage });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPagination({ page: 1, limit: newRowsPerPage });
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                <Typography ml={2}>Loading...</Typography>
            </Box>
        );
    }

    if (!meta?.Record?.Total) {
        return null;
    }

    return (
        <TablePaginationCustom
            dense={table.dense}
            count={meta.Record.Total}
            page={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    );
};

export default PaginationComponent;
