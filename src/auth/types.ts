import type { AuthMethodEnum } from '@auth/enums';

export type UserType = Record<string, any> | null;

export type AuthState = {
    user: UserInfoType | null;
    profile: Profile | null;
    loading: boolean;
};

export type AuthContextValue = {
    user: UserInfoType | null;
    profile: Profile | null;
    profileError?: string | null;
    setProfile: (profile: Profile | null) => void;
    setProfileError?: (error: string | null) => void;
    updateProfile: (data: Partial<Profile>) => void;
    loading: boolean;
    authenticated: boolean;
    unauthenticated: boolean;
    checkUserSession?: () => Promise<void>;
    revokeUserSession?: () => Promise<void>;
};

export interface Profile {
    Id: string;
    Name: string;
    Email: string;
    PhoneNumber: string;
    Address: any;
    IsVerified: boolean;
    Role: string;
    MustHavePlants: boolean;
    MustHaveLocations: boolean;
    Plants: any[];
    Locations: any[];
    Permissions: string[];
    Supplier: any;
}

export type UserInfoType = {
    id?: string;
    displayName?: string;
    email?: string;
    photoURL?: string;
    phoneNumber?: string;
    country?: string;
    address?: string;
    state?: string;
    city?: string;
    zipCode?: string;
    about?: string;
    role?: string;
    roleLabel?: string;
    permissions: string[];
    accessToken?: string;
    isPublic?: boolean;
    isVerified?: boolean;
};

export type Client = {
    osType?: string; // e.g., "Windows", "iOS", "Android"
    osVersion?: string; // e.g., "11", "14.4", "10.15.7"
    browserId?: string; // Unique ID per browser instance
    browserName?: string; // e.g., "Chrome", "Safari"
    browserModel: string; // e.g., "Desktop", "iPhone", "Pixel"
    culture: string; // e.g., "en-US", "id-ID"
    timezone: string; // e.g., "Asia/Jakarta", "UTC"
};

export type Session = {
    method: AuthMethodEnum;
    token?: string | undefined;
};
