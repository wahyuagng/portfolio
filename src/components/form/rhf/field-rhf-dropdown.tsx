import type { ReactNode } from 'react';
import type { Path } from 'react-hook-form';
import type { FieldDropdownProps } from '@components/form/basic/field-dropdown';

import React from 'react';
import { FieldBasic } from '@components/form/basic/field-basic';
import { getError, getValue } from '@components/form/rhf/field-rhf';

type RHFDropdownProps<T> = Omit<FieldDropdownProps, 'value' | 'setValue' | 'error'> & {
    form: {
        values: T;
        errors: Partial<Record<keyof T, any>>;
        setFieldValue: (name: Path<T>, value: any) => void;
    };
    name: Path<T>;
    label?: ReactNode;
    helperText?: ReactNode;
    showErrorAsTooltip?: boolean;
};

export const FieldRHFDropdown = <T,>({ form, name, label, helperText, options, filterKey, customFilterKey, multiple = false, required = false, readOnly = false, onInputChange, onBlur, autoSelectFirst = false, showErrorAsTooltip = true, ...other }: RHFDropdownProps<T>) => {
    const fieldError = getError(form.errors, name as string);
    const displayHelperText = fieldError ? <>{fieldError.message ?? fieldError}</> : helperText;

    return (
        <FieldBasic.FieldDropdown
            options={options}
            filterKey={filterKey}
            customFilterKey={customFilterKey}
            value={getValue(form.values, name as string) ?? (multiple ? [] : null)}
            setValue={(value) => form.setFieldValue(name, value)}
            label={label}
            multiple={multiple}
            error={!!fieldError}
            helperText={displayHelperText || helperText}
            required={required}
            readOnly={readOnly}
            onInputChange={onInputChange}
            onBlur={onBlur}
            autoSelectFirst={autoSelectFirst}
            showErrorAsTooltip={showErrorAsTooltip}
            {...other}
        />
    );
};
