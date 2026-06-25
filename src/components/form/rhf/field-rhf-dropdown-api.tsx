import type { ReactNode } from 'react';
import type { Path } from 'react-hook-form';
import type { FieldDropdownApiProps } from '@components/form/basic/field-dropdown';

import { getError, getValue } from '@components/form/rhf/field-rhf';

import { FieldBasic } from '../basic/field-basic';

type RHFDropdownApiProps<T> = Omit<FieldDropdownApiProps, 'value' | 'setValue' | 'error'> & {
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

export const FieldRHFDropdownApi = <T,>({ form, name, label, helperText, service, filterKey, customFilterKey, multiple = false, required = false, readOnly = false, filterCondition, onBlur, autoLoad = false, autoSelectFirst = false, showErrorAsTooltip = true, ...other }: RHFDropdownApiProps<T>) => {
    const fieldError = getError(form.errors, name as string);
    const displayHelperText = fieldError ? <>{fieldError.message ?? fieldError}</> : helperText;

    return (
        <FieldBasic.FieldDropdownApi
            service={service}
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
            onBlur={onBlur}
            filterCondition={filterCondition}
            autoLoad={autoLoad}
            autoSelectFirst={autoSelectFirst}
            showErrorAsTooltip={showErrorAsTooltip}
            {...other}
        />
    );
};
