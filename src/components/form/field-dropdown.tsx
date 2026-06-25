import type { FC, ReactNode } from 'react';
import type { AxiosResponse } from 'axios';
import type { ApiResponse } from '@services/api/types';
import type { AutocompleteProps } from '@mui/material/Autocomplete';

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Field } from '../grid/form/field';

export type AutocompleteBaseProps = Omit<AutocompleteProps<any, boolean, boolean, boolean>, 'renderInput'>;

export type FormikDropdownProps = AutocompleteBaseProps & {
    name: string;
    label?: ReactNode;

    options: any[];
    filterKey?: string;
    customFilterKey?: (data: any) => string;

    helperText?: ReactNode;
    multiple?: boolean;

    onInputChange?: (value: string) => void;
    required?: boolean;
    readOnly?: boolean;
};

export interface FormikDropdownApiCustomProps {
    name: string;
    label?: ReactNode;

    service: { list: (params?: any) => Promise<AxiosResponse<ApiResponse<any>>> };
    filterKey: string;
    customFilterKey?: (data: any) => string;

    helperText?: ReactNode;
    multiple?: boolean;
    required?: boolean;
    readOnly?: boolean;
}

const FieldDropdown: FC<FormikDropdownProps> = ({ name, label, helperText, ...other }) => {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Field.FieldDropdown
                    value={field.value}
                    setValue={(value) => {
                        field.onChange(value);
                    }}
                    label={label}
                    error={!!error}
                    onBlur={() => field.onBlur()}
                    helperText={error?.message || helperText}
                    {...other}
                />
            )}
        />
    );
};

// const FieldDropdownApi: FC<FormikDropdownApiCustomProps> = ({ service, name, label, helperText, ...other }) => {
//   const { control } = useFormContext();
//
//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState: { error } }) => (
//         <Field.FieldDropdownApi
//           service={service}
//           value={field.value}
//           setValue={(value) => {
//             field.onChange(value);
//           }}
//           error={!!error}
//           onBlur={() => field.onBlur()}
//           helperText={error?.message || helperText}
//           label={label}
//           {...other}
//         />
//       )}
//     />
//   );
// };

export { FieldDropdown };
