import type { Filter } from '@services/api/types';

export function ToFilterString(filters: Filter[]): string {
    const filterObject: Record<string, [Filter['operator'], string | string[] | number | number[]]> = {};

    for (const filter of filters) {
        let processedValue: any = filter.value;

        if (typeof filter.value === 'object' && filter.value !== null && !Array.isArray(filter.value)) {
            const objectValue = filter.value as any;

            if ('Value' in objectValue) {
                processedValue = objectValue.Value;
            } else if ('Id' in objectValue) {
                processedValue = objectValue.Id;
            }
        }

        filterObject[filter.attribute] = [filter.operator, processedValue];
    }

    const jsonString = JSON.stringify(filterObject);
    return btoa(jsonString);
}

export function AsFilterObject(encoded: string): Filter[] {
    const decoded = decodeURIComponent(atob(encoded));
    const obj = JSON.parse(decoded) as Record<string, [Filter['operator'], string | string[] | number | number[]]>;

    return Object.entries(obj).map(([attribute, [operator, value]]) => ({
        attribute,
        operator,
        value,
    }));
}
