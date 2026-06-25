import type React from 'react';

import { useState, useCallback } from 'react';

type TableProps = {
    dense: boolean;
    selected: any[];
    onSelectRow: (key: string) => void;
    onSelectAllRows: (checked: boolean, newSelecteds: any[]) => void;
    onChangeDense: (event: React.ChangeEvent<HTMLInputElement>) => void;
    resetSelected: () => void; // Add this new function
};

type UseTableProps = {
    defaultDense?: boolean;
    defaultSelected?: any[];
};

export function useTable(props?: UseTableProps): TableProps {
    const [dense, setDense] = useState(!!props?.defaultDense);
    const [selected, setSelected] = useState<any[]>(props?.defaultSelected || []);

    const onChangeDense = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    }, []);

    const onSelectRow = useCallback(
        (inputValue: string) => {
            const newSelected = selected.includes(inputValue)
                ? selected.filter((value) => value !== inputValue)
                : [...selected, inputValue];

            setSelected(newSelected);
        },
        [selected]
    );

    const onSelectAllRows = useCallback((checked: boolean, inputValue: string[]) => {
        if (checked) {
            setSelected(inputValue);
            return;
        }
        setSelected([]);
    }, []);

    const resetSelected = useCallback(() => {
        console.log('reset selected');
        setSelected([]);
        console.log('selected after reset: ', selected);
    }, []);

    return {
        dense,
        selected,
        //
        onChangeDense,
        onSelectRow,
        onSelectAllRows,
        resetSelected,
    };
}
