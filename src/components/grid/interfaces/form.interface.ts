import type * as Yup from 'yup';
import type { IField } from '@components/grid/interfaces/field.interface';
import type { FormScenarioEnum } from '../enums/form-scenario.enum';

export interface IForm {
    form: IFormModel;
    scenario: FormScenarioEnum;
    initialValues: object;
    onSubmit: object;
}

export interface IFormModel {
    fields: IField[];
    scenarios: IFormScenario[];
    rules: Yup.ObjectSchema<{ [p: string]: any }, Yup.AnyObject, { [p: string]: any }, ''>;
    formik: any;
}

export interface IFormScenario {
    key: FormScenarioEnum;
    fields: string[];
}
