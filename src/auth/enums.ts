export enum AuthMethodEnum {
    JWT = 'jwt',
    OIDC = 'Idaman',
    AMPLIFY = 'amplify',
    SUPABASE = 'supabase',
    AUTH0 = 'auth0',
}
export const AuthMethodLabels = {
    [AuthMethodEnum.JWT]: 'JSON Web Token',
    [AuthMethodEnum.OIDC]: 'Open ID Connect',
    [AuthMethodEnum.AMPLIFY]: 'Amplify',
    [AuthMethodEnum.SUPABASE]: 'Supabase',
    [AuthMethodEnum.AUTH0]: 'Auth0',
};
