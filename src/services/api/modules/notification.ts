import type { AxiosResponse } from 'axios';
import type { Filter, Pagination, ApiResponse } from '@services/api/types';

import { BaseService } from '@services/api/client';
import { getAxiosInstance } from '@services/api/interceptor';

export class NotificationService extends BaseService {
    axiosInstance = getAxiosInstance();

    async list(filters?: Filter[], sorts?: string[], pagination?: Pagination): Promise<AxiosResponse<ApiResponse<any[]>>> {
        return this.get('/notification', { filters, sorts, pagination });
    }
}
