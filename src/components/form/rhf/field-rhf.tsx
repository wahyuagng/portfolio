import { FieldRhfText } from '@components/form/rhf/field-rhf-text';
import { FieldRhfNumber } from '@components/form/rhf/field-number';
import { FieldRHFFileUpload } from '@components/form/rhf/field-upload';
import { FieldRhfTextEditor } from '@components/form/rhf/field-editor';
import { FieldRHFDropdown } from '@components/form/rhf/field-rhf-dropdown';
import { FieldRhfCheckboxGroup } from '@components/form/rhf/field-checkbox';
import { FieldRhfRadioGroup } from '@components/form/rhf/field-radio-button';
import { FieldRHFDropdownApi } from '@components/form/rhf/field-rhf-dropdown-api';
import { FieldRhfToggleBoolean } from '@components/form/rhf/field-toggle-boolean';
import { FieldRHFDate, FieldRHFTime, FieldRHFDateTime } from '@components/form/rhf/field-rfh-date';

export const FieldRHF = {
    Text: FieldRhfText,
    Number: FieldRhfNumber,
    Dropdown: FieldRHFDropdown,
    DropdownApi: FieldRHFDropdownApi,
    Date: FieldRHFDate,
    Time: FieldRHFTime,
    DateTime: FieldRHFDateTime,
    Upload: FieldRHFFileUpload,
    Checkbox: FieldRhfCheckboxGroup,
    RadioButton: FieldRhfRadioGroup,
    Boolean: FieldRhfToggleBoolean,
    Editor: FieldRhfTextEditor,
};

export function getValue<T>(obj: T, path: string): any {
    return path.split('.').reduce<any>((acc, key) => {
        if (acc == null) return undefined;
        return acc[key];
    }, obj as any);
}

export function getError(obj: any, path: string): any {
    return path.split('.').reduce<any>((acc, key) => {
        if (acc == null) return undefined;
        return acc[key];
    }, obj);
}

export function getArrayErrorMessage(error: any): string | undefined {
    if (!error) return undefined;

    if (typeof error.message === 'string') {
        return error.message;
    }

    if (typeof error === 'object') {
        const firstKey = Object.keys(error)[0];
        const firstRow = error[firstKey];

        if (firstRow?.MaterialId?.message) return firstRow.MaterialId.message;
        if (firstRow?.Quantity?.message) return firstRow.Quantity.message;
    }

    return undefined;
}
