export enum FormScenarioEnum {
    DEFAULT = 'default',
    CREATE = 'create',
    UPDATE = 'update',
    VIEW = 'view',
    DELETE = 'delete',
}

export const FormScenarioEnumLabel = {
    [FormScenarioEnum.DEFAULT]: 'Default',
    [FormScenarioEnum.CREATE]: 'Create',
    [FormScenarioEnum.UPDATE]: 'Update',
    [FormScenarioEnum.VIEW]: 'Detail',
    [FormScenarioEnum.DELETE]: 'Delete',
};

export const ScenarioLabel = (scenario: FormScenarioEnum): string => FormScenarioEnumLabel[scenario] || 'Default';
