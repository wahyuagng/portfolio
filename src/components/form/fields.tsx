import { Upload } from '@components/uploadNew';
import { RHFSelect } from '@components/hook-form';
import { FieldOtp } from '@components/form/field-otp';
import { FieldText } from '@components/form/field-text';
import { FieldTime } from '@components/form/field-time';
import { FieldEditor } from '@components/form/field-editor';
import { FieldSlider } from '@components/form/field-slider';
import { FieldRating } from '@components/form/field-rating';
import { FieldToggle } from '@components/form/field-toggle';
import { FormProvider } from '@components/form/form-provider';
import { FieldCurrency } from '@components/form/field-currency';
import { FieldDateTime } from '@components/form/field-date-time';
import { FileUpload } from '@components/file-upload/file-upload';
// import { FieldDropdownApi } from '@components/form/field-dropdown';
import YearPicker, { FieldDate } from '@components/form/field-date';
import { FieldSwitchGroup } from '@components/form/field-switch-group';
import { FieldPhoneNumber } from '@components/form/field-phone-number';
import { FieldSelectAsync } from '@components/form/field-select-async';
import { FieldCheckboxGroup } from '@components/form/field-checkbox-group';
import { FieldDropdownAsync } from '@components/form/field-dropdown-async';
import { FieldMultipleInput } from '@components/form/field-multiple-input';
import { FieldColorPickerSpectrum } from '@components/form/field-colorpicker';
import { FieldUploadAttachment } from '@components/form/field-upload-attachment';
import { FieldRadioButtonGroup } from '@components/form/field-radio-button-group';
import { FieldThreeStateSwitch } from '@components/form/field-three-state-switch';
import { FieldMultipleInputGrid } from '@components/form/field-multiple-input-grid';

export const Field = {
    FormProvider,
    Text: FieldText,
    Currency: FieldCurrency,
    // DropdownAPI: FieldDropdownApi,
    Dropdown: FieldDropdownAsync,
    SelectAsync: FieldSelectAsync,
    Select: RHFSelect,
    Upload: FileUpload,
    UploadNew: Upload,
    UploadAttachment: FieldUploadAttachment,
    Date: FieldDate,
    Year: YearPicker,
    ColorPicker: FieldColorPickerSpectrum,
    DateTime: FieldDateTime,
    Time: FieldTime,
    OTP: FieldOtp,
    PhoneNumber: FieldPhoneNumber,
    Editor: FieldEditor,
    SwitchGroup: FieldSwitchGroup,
    ThreeStateSwitch: FieldThreeStateSwitch,
    RadioGroup: FieldRadioButtonGroup,
    CheckboxGroup: FieldCheckboxGroup,
    Slider: FieldSlider,
    ToggleButton: FieldToggle,
    Rating: FieldRating,
    MultipleInput: FieldMultipleInput,
    MultipleInputGrid: FieldMultipleInputGrid,
};
