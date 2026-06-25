import type { FC } from 'react';
import type { TextFieldProps } from '@mui/material';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export type FieldNpwpProps = TextFieldProps & {
    label: string;
    value: string;
    setValue: (value: string) => void;
    npwpType: number | null; // 15 atau 16
};

export const FieldNpwp: FC<FieldNpwpProps> = ({ label, value, setValue, npwpType, ...other }) => {
    const handleFormatNpwp = (input: string): string => {
        const onlyDigits = input.replace(/\D/g, '');

        if (npwpType === 15) {
            const part1 = onlyDigits.slice(0, 2);
            const part2 = onlyDigits.slice(2, 5);
            const part3 = onlyDigits.slice(5, 8);
            const part4 = onlyDigits.slice(8, 9);
            const part5 = onlyDigits.slice(9, 12);
            const part6 = onlyDigits.slice(12, 15);

            let result = part1;
            if (part2) result += '.' + part2;
            if (part3) result += '-' + part3;
            if (part4) result += '.' + part4;
            if (part5) result += '-' + part5;
            if (part6) result += '.' + part6;

            return result;
        }

        if (npwpType === 16) {
            const part1 = onlyDigits.slice(0, 4);
            const part2 = onlyDigits.slice(4, 8);
            const part3 = onlyDigits.slice(8, 12);
            const part4 = onlyDigits.slice(12, 16);

            let result = part1;
            if (part2) result += ' ' + part2;
            if (part3) result += ' ' + part3;
            if (part4) result += ' ' + part4;

            return result;
        }

        return onlyDigits;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const onlyDigits = raw.replace(/\D/g, '');

        const maxDigits = npwpType === 15 ? 15 : npwpType === 16 ? 16 : 0;
        const trimmedDigits = onlyDigits.slice(0, maxDigits);

        setValue(trimmedDigits);
    };

    const maxLength = npwpType === 15 ? 23 : npwpType === 16 ? 19 : 0;

    return (
        <Box>
            <TextField
                label={label}
                value={handleFormatNpwp(value || '')}
                onChange={handleChange}
                fullWidth
                placeholder={npwpType === 16 ? '9999 9999 9999 9999' : '99.999-999.9-999.999'}
                inputProps={{
                    inputMode: 'numeric',
                    maxLength,
                }}
                autoComplete="off"
                {...other}
            />
        </Box>
    );
};
