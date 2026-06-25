export enum EnvironmentEnum {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production',
}

export const EnvironmentLabels: Record<EnvironmentEnum, string> = {
    [EnvironmentEnum.DEVELOPMENT]: 'Development Admin',
    [EnvironmentEnum.STAGING]: 'Staging',
    [EnvironmentEnum.PRODUCTION]: 'Production',
};
