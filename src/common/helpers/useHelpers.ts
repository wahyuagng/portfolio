// const handleFilter = (obj: any) => {
//   const filter: { [key: string]: any } = {};
//   for (const key in obj) {
//     if (Object.prototype.hasOwnProperty.call(obj, key)) {
//       filter[key] = ['LIKE', obj[key]];
//     }
//   }
//   return btoa(JSON.stringify(filter));
// };

import { useRef } from 'react';

const isValueLabelObject = (obj: any): obj is { value: string; label: string } => typeof obj === 'object' && obj !== null && 'value' in obj && 'label' in obj && typeof obj.value === 'string' && typeof obj.label === 'string';

function getPrecisionFull(num: number): number {
    if (!isFinite(num)) return 0;
    const str = num.toExponential().split('e');
    const decimalPart = str[0].split('.')[1] || '';
    const exponent = parseInt(str[1], 10);
    return Math.max(0, decimalPart.length - exponent);
}

const isDateString = (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));

const roundUp = (number: number, precision: number) => {
    const factor = Math.pow(10, precision);
    return Math.ceil(number * factor) / factor;
};

const handleFilter = (obj: any) => {
    const filter: Record<string, any> = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];

            if (typeof value === 'object' && value !== null && 'Id' in value) {
                filter[key] = ['=', value.Id];
            } else if (isValueLabelObject(value) && value.value.trim() !== '') {
                filter[key] = ['LIKE', value.value];
            } else if (Array.isArray(value) && value.length > 0) {
                if (value.length === 2 && typeof value[0] === 'string' && ['!=', '>=', '<=', '=', '>', '<', 'BETWEEN', 'IN', 'NOT IN'].includes(value[0])) {
                    filter[key] = value;
                } else if (value.length === 1 || value.length === 0) {
                    filter[key] = null;
                } else {
                    filter[key] = ['LIKE', value];
                }
            } else if (typeof value === 'number') {
                const stringValue = String(value);
                if (stringValue.includes('.')) {
                    const step = getPrecisionFull(value);
                    filter[key] = ['BETWEEN', [value, roundUp(value, step - 1)]];
                } else {
                    filter[key] = ['=', value];
                }
            } else if (typeof value === 'string' && value.trim() !== '') {
                if (isDateString(value)) {
                    filter[key] = ['=', value];
                } else {
                    filter[key] = ['LIKE', value];
                }
            } else if (typeof value === 'boolean') {
                filter[key] = ['LIKE', value];
            }
        }
    }
    return filter;
};

const useDebouncedService = () => {
    const typingTimeout = useRef<number | null>(null);

    return (callback: (...args: any[]) => void, delay: number) =>
        (...args: any[]) => {
            if (typingTimeout.current) {
                clearTimeout(typingTimeout.current);
            }

            typingTimeout.current = window.setTimeout(() => {
                callback(...args);
            }, delay);
        };
};

const convertExistingMediaToFile = async (item: any): Promise<File> => {
    const response = await fetch(item.Media?.SignedUrl);
    const blob = await response.blob();
    const file = new File([blob], item.Media?.OriginalFileName, { type: blob.type });

    Object.defineProperty(file, '_existingMediaId', {
        value: item.Media?.Id,
        writable: false,
    });

    return file;
};

export { handleFilter, useDebouncedService, convertExistingMediaToFile };
