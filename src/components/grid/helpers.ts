import type { Pagination } from '@services/api/types';
import type { Dispatch, ReactNode, ReactElement, SetStateAction } from 'react';
import type { FilterParamsProps } from '@components/grid/interfaces/grid.interface';

import { toast } from 'sonner';
import { useRef, isValidElement } from 'react';
import { MediaService } from '@services/api/modules/media';

const formatDate = (valueDate: any, format: string) => {
    const date = valueDate ? new Date(valueDate) : new Date();

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const shortYear = String(year).slice(-2);

    const hours24 = String(date.getHours()).padStart(2, '0');
    const hours12 = String(date.getHours() % 12 || 12).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return format
        .replace('dd', day)
        .replace('DD', dayNames[date.getDay()])
        .replace('mm', month) // Month as number
        .replace('MM', monthNames[date.getMonth()])
        .replace('yy', shortYear)
        .replace('YYYY', String(year))
        .replace('HH', hours24) // 24-hour format
        .replace('hh', hours12) // 12-hour format
        .replace('MM', monthNames[date.getMonth()])
        .replace('ii', minutes) // Minutes
        .replace('ss', seconds) // Seconds
        .replace('tt', ampm);
};

const formatDecimal = (value: number) => value.toLocaleString('id-ID', { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 2 });

const formatPercentage = (decimalNumber: any) => {
    const value = decimalNumber;
    if (typeof value === 'number') {
        return formatDecimal(value / 100);
    }
    return null;
};

const formatCurrency = (
    value: number,
    options?: {
        minimumFractionDigits?: number;
        maximumFractionDigits?: number;
        useCeil?: boolean;
    }
) => {
    const { minimumFractionDigits = 0, maximumFractionDigits = 2, useCeil = true } = options || {};
    const valueData = useCeil ? Math.ceil(value) : value;
    return valueData?.toLocaleString('id-ID', {
        style: 'decimal',
        minimumFractionDigits,
        maximumFractionDigits,
    });
};

const isValueLabelObject = (obj: any): obj is { value: string; label: string } => typeof obj === 'object' && obj !== null && 'value' in obj && 'label' in obj && typeof obj.value === 'string' && typeof obj.label === 'string';

const handleFilter = (obj: any) => {
    const filter: Record<string, any> = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const operator = obj[key].operator;
            const value = obj[key].value;

            if (isValueLabelObject(value) && value.value.trim() !== '') {
                filter[key] = [operator, value.value];
            } else if (Array.isArray(value) && value.length > 0) {
                if (value.every((item) => item && typeof item === 'object' && ('value' in item || 'label' in item))) {
                    const values = value.map((item) => item.value);
                    filter[key] = [operator, values];
                } else {
                    filter[key] = [operator, value];
                }
            } else if (typeof value === 'string' && value.trim() !== '') {
                filter[key] = [operator, value];
            } else if (typeof value === 'boolean') {
                filter[key] = [operator, value];
            } else if (typeof value === 'number') {
                filter[key] = [operator, value];
            }
        }
    }

    return filter;
};

const handleParams = (setParams: Dispatch<SetStateAction<FilterParamsProps | undefined>>, filter?: any | undefined, sort?: any | undefined, page?: Pagination | undefined) => {
    const params: FilterParamsProps = {};
    const processedFilter = handleFilter(filter);
    if (filter && Object.keys(processedFilter).length > 0) {
        params.filters = btoa(JSON.stringify(processedFilter));
    }

    if (sort) params.sort = sort;
    if (page?.page) params.page = page.page;
    if (page?.limit) params.limit = page.limit;

    if (Object.keys(params).length === 0) {
        setParams(undefined);
    } else {
        setParams(params);
    }
};

const useDebouncedService = () => {
    const typingTimeout = useRef<number | null>(null);

    const debounce =
        (callback: (...args: any[]) => void, delay: number) =>
        (...args: any[]) => {
            if (typingTimeout.current) {
                clearTimeout(typingTimeout.current);
            }

            typingTimeout.current = window.setTimeout(() => {
                callback(...args);
            }, delay);
        };

    return debounce;
};

const getDataTextOption = (data: string) => ({
    value: data,
    label: data,
});

const getDataOption = <T extends Record<string, any>>(data: T, valueKey: keyof T, labelFn: (item: T) => string) => ({
    value: data[valueKey],
    label: labelFn(data),
});

const getDataOptions = <T extends Record<string, any>>(dataArray: T[], valueKey: keyof T, labelFn: (item: T) => string) =>
    dataArray.map((item) => ({
        value: item[valueKey],
        label: labelFn(item),
    }));

const getElementName = (element: ReactNode) => {
    if (!isValidElement(element)) return undefined;

    const type = element.type;
    if (typeof type === 'function') return type.name;
    if (typeof type === 'string') return type;
    return undefined;
};

const isPermittedByPermissionGuard = (element: ReactNode, permissions?: string[]) => {
    if (!permissions) return null;

    if (isValidElement(element)) {
        const el = element as ReactElement<any>;
        const elementName = getElementName(el);

        if (elementName === 'PermissionBasedGuard') {
            const alloweds = el.props.alloweds as string[];

            if (alloweds?.length) {
                const isAllowed = permissions.some((permission) => alloweds.includes(permission));

                if (!isAllowed) return false;
            }
        }
    }

    return true;
};

const handleUploadMedia = async (fileData: any) => {
    const mediaService = new MediaService();

    try {
        if (typeof fileData === 'string') {
            console.log('MediaId is string, returning as is:', fileData);
            return { Id: fileData };
        }

        if (fileData?.Id) {
            const response = await mediaService.detail(fileData.Id);
            return response.data.Data;
        }

        if (Array.isArray(fileData) && fileData.length > 0) {
            const formData = new FormData();
            fileData.forEach((file) => {
                formData.append('Files', file);
            });

            const response = await mediaService.upload(formData);
            return response.data.Data;
        }

        if (fileData && typeof fileData === 'object' && !fileData.Id && fileData instanceof File) {
            const formData = new FormData();
            formData.append('Files', fileData);

            const response = await mediaService.upload(formData);
            const uploadedData = response.data.Data;

            if (Array.isArray(uploadedData) && uploadedData.length === 1) {
                return uploadedData[0];
            }
            return uploadedData;
        }

        toast.error('Invalid fileData format');
        return null;
    } catch (error) {
        console.error('Error uploading media:', error);
        toast.error('Error uploading media');
        return null;
    }
};

export { formatDate, handleFilter, handleParams, formatDecimal, getDataOption, formatCurrency, getDataOptions, formatPercentage, getDataTextOption, handleUploadMedia, useDebouncedService, isPermittedByPermissionGuard };
