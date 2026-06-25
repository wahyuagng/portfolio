import { FieldTextEditor } from '@components/form/basic/field-editor';
import { FieldCheckboxGroup } from '@components/form/basic/field-checkbox';
import { FieldRadioGroup } from '@components/form/basic/field-radio-button';

import { FieldOtp } from './field-otp';
import { FieldText } from './field-text';
import { FieldNumber } from './field-number';
import { FieldUpload } from './field-upload';
import { FieldCountrySelect } from './field-select-country';
import { FieldToggleBoolean } from './field-toggle-boolean';
import { FieldDate, FieldTime, FieldDateTime } from './field-date';
import { FieldDropdown, FieldDropdownApi } from './field-dropdown';

export const FieldBasic = {
    FieldText,
    FieldNumber,
    FieldOTP: FieldOtp,
    FieldCountrySelect,
    FieldDropdown,
    FieldDropdownApi,
    FieldBoolean: FieldToggleBoolean,
    FieldDate,
    FieldDateTime,
    FieldTime,
    FieldCheckBox: FieldCheckboxGroup,
    FieldEditor: FieldTextEditor,
    FieldRadioButton: FieldRadioGroup,
    FieldUpload,
};
