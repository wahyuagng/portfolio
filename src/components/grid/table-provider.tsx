import React, { useState, useContext, useCallback, createContext } from 'react';

interface TableContextProps {
    dense: boolean;
    selected: string[];
    onSelectRow: (key: string) => void;
    onSelectAllRows: (checked: boolean, newSelecteds: string[]) => void;
    onChangeDense: (event: React.ChangeEvent<HTMLInputElement>) => void;
    resetSelected: () => void; // Add this new function
}

interface TableProviderProps {
    children: React.ReactNode;
    defaultDense?: boolean;
    defaultSelected?: string[];
}

const TableContext = createContext<TableContextProps | undefined>(undefined);

export const TableProvider: React.FC<TableProviderProps> = ({
    children,
    defaultDense = false,
    defaultSelected = [],
}) => {
    const [dense, setDense] = useState(defaultDense);
    const [selected, setSelected] = useState<string[]>(defaultSelected);

    const onChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

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
    }, []);

    return (
        <TableContext.Provider
            value={{
                dense,
                selected,
                onSelectRow,
                onSelectAllRows,
                onChangeDense,
                resetSelected,
            }}
        >
            {children}
        </TableContext.Provider>
    );
};

export const useTable = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('useTable must be used within a TableProvider');
    }
    return context;
};
