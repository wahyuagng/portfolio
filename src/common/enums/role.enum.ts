export enum RoleEnum {
    SUPER_ADMIN = 'SuperAdmin',
    USER = 'User',
}

export const RoleLabels: Record<RoleEnum, string> = {
    [RoleEnum.SUPER_ADMIN]: 'Super Admin',
    [RoleEnum.USER]: 'User',
};
