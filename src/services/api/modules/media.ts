import type { AxiosResponse } from 'axios';
import type { Filter, Pagination, ApiResponse } from '@services/api/types';

import { BaseService } from '@services/api/client';
import { getAxiosInstance } from '@services/api/interceptor';

export interface MediaRequestDto {
    Folder: string;
    Files: File[];
}

export interface MediaResponse {
    Id: string;
    Type: string;
    Name: string;
    OriginalName: string;
    Extension: string;
    MimeType: string;
    FileName: string;
    OriginalFileName: string;
    Size: number;
    SizeFormatted: string;
    FileUrl: string;
    SignedUrl: string;
    Status: string;
    CreatedAt: string;
    CreatedAtFormatted: string;
    UpdatedAt: string | null;
    UpdatedAtFormatted: string | null;
    Thumbnails: any[];
}

export interface MediaResponse {}

export class MediaService extends BaseService {
    axiosInstance = getAxiosInstance();

    async upload(data: FormData): Promise<AxiosResponse<ApiResponse<any[]>>> {
        return this.axiosInstance.post('/media/upload', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    async detail(id: string): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get(`/media/${id}`, {});
    }

    async list(filters?: Filter[], pagination?: Pagination): Promise<AxiosResponse<ApiResponse<MediaResponse[]>>> {
        return this.get('/media', { filters, pagination });
    }
}
