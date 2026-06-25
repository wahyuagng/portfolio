import type { Profile } from '@auth/types';

export const plantEnum = [
    { Value: 'LP01', Label: 'Production Unit Jakarta' },
    { Value: 'LP02', Label: 'Production Unit Cilacap' },
    { Value: 'LP03', Label: 'Production Unit Gresik' },
];

export const plantShortEnum = [
    { Value: 'LP01', Label: 'PUJ' },
    { Value: 'LP02', Label: 'PUC' },
    { Value: 'LP03', Label: 'PUG' },
];

export const getPlantShortByCode = (code: string): string => plantShortEnum.find((p) => p.Value === code)?.Label || '';

export const getPlantByProfile = (profile?: Profile | null) => {
    if (!profile) {
        return plantEnum;
    }

    if (!profile.MustHavePlants) {
        return plantEnum;
    }

    return plantEnum.filter((p) => profile.Plants.includes(p.Value));
};

export const getDefaultPlantByProfile = (profile?: Profile | null) => {
    const plants = getPlantByProfile(profile);

    if (!profile || !profile.MustHavePlants) {
        return null;
    }

    if (plants.length === 1) {
        return plants[0];
    }

    return null;
};

export const getDefaultUserPlantByProfile = (profile?: Profile | null) => {
    const plants = getPlantByProfile(profile);

    if (!profile || !profile.MustHavePlants) {
        return plants;
    }

    if (plants.length === 1) {
        return plants[0];
    }

    return null;
};

export const isPlantSelectableByProfile = (profile?: Profile | null) => {
    if (!profile || !profile.MustHavePlants) {
        return true;
    }

    const plants = getPlantByProfile(profile);

    if (plants.length === 1) {
        return false;
    }

    return true;
};
