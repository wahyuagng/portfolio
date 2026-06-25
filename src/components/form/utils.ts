import type { Dayjs } from 'dayjs';
import type { OnlineFile } from '@components/file-upload/types';

import dayjs from 'dayjs';

export function getFileId(file?: File | OnlineFile): string | File {
    if (!file) return '';
    if (file instanceof File) return file;
    return file.Id;
}

export function getFileIds(files?: (File | OnlineFile)[]): (string | File)[] {
    if (!Array.isArray(files)) return [];
    return files.map((file) => getFileId(file)).filter(Boolean);
}

export function getObjectId<T extends { Id?: string }>(obj?: T): string {
    if (!obj || !obj.Id) return '';
    return obj.Id;
}

export function getObjectIds<T extends { Id?: string }>(objs?: T[]): string[] {
    if (!Array.isArray(objs)) return [];
    return objs.map((obj) => getObjectId(obj)).filter(Boolean);
}

type DateInput = Dayjs | Date | string | number | null | undefined;

export function normalizeDateValue(value: DateInput): Dayjs | null {
    if (dayjs.isDayjs(value)) return value;

    const parsed = value ? dayjs(value) : null;
    return parsed?.isValid() ? parsed : null;
}
