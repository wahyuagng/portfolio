export enum FormScenarioEnum {
    DEFAULT = 'default',
    CREATE = 'create',
    UPDATE = 'update',
    VIEW = 'view',
    DELETE = 'delete',
    APPROVE = 'approve',
    REJECT = 'reject',
    COMPLETE = 'complete',
}

export const FormScenarioEnumLabel = {
    [FormScenarioEnum.DEFAULT]: 'Default',
    [FormScenarioEnum.CREATE]: 'Create',
    [FormScenarioEnum.UPDATE]: 'Update',
    [FormScenarioEnum.VIEW]: 'View',
    [FormScenarioEnum.DELETE]: 'Delete',
    [FormScenarioEnum.APPROVE]: 'Approve',
    [FormScenarioEnum.REJECT]: 'Reject',
    [FormScenarioEnum.COMPLETE]: 'Complete',
};

export const ScenarioLabel = (scenario: FormScenarioEnum): string => FormScenarioEnumLabel[scenario] || 'Default';
