import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import type { ApiRequest } from './types';

import { ToFilterString } from '@services/api/util';

import { getAxiosInstance } from './interceptor';

export abstract class BaseService {
    protected axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = getAxiosInstance();
    }

    protected async request<TRequest = any, TResponse = any>(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', url: string, request: ApiRequest<TRequest> = {} as ApiRequest<TRequest>, config: AxiosRequestConfig = {}): Promise<AxiosResponse<TResponse>> {
        const { data, filters, pagination, sorts, firstRequest } = request;

        const isBodyMethod = ['POST', 'PUT', 'PATCH'].includes(method);
        const searchParams = new URLSearchParams();

        // Pagination
        if (pagination?.page !== undefined) {
            searchParams.set('page', pagination.page.toString());
        }
        if (pagination?.limit !== undefined) {
            searchParams.set('per-page', pagination.limit.toString());
        }

        // Sorts
        if (Array.isArray(sorts) && sorts.length > 0) {
            searchParams.set('sort', sorts.join(';'));
        }

        // Filters
        if (Array.isArray(filters) && filters.length > 0) {
            const filterBase64 = ToFilterString(filters);
            searchParams.set('filters', filterBase64);
        }

        // First request
        if (firstRequest !== undefined) {
            searchParams.set('firstRequest', firstRequest);
        }

        // Extra: Add raw data fields to query (for GET/DELETE only)
        if (!isBodyMethod && data && typeof data === 'object') {
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        value.forEach((v) => searchParams.append(key, String(v)));
                    } else {
                        searchParams.set(key, String(value));
                    }
                }
            });
        }

        const fullUrl = `${url}?${searchParams.toString()}`;

        return this.axiosInstance.request<TResponse>({
            method,
            url: fullUrl,
            ...(isBodyMethod ? { data: data ?? {} } : {}),
            ...config,
        });
    }

    protected async post<TReq = any, TRes = any>(url: string, request: ApiRequest<TReq>, config?: AxiosRequestConfig): Promise<AxiosResponse<TRes>> {
        return this.request<TReq, TRes>('POST', url, request, config);
    }

    protected async get<TReq = any, TRes = any>(url: string, request: ApiRequest<TReq>, config?: AxiosRequestConfig): Promise<AxiosResponse<TRes>> {
        return this.request<TReq, TRes>('GET', url, request, config);
    }

    protected async put<TReq = any, TRes = any>(url: string, request: ApiRequest<TReq>, config?: AxiosRequestConfig): Promise<AxiosResponse<TRes>> {
        return this.request<TReq, TRes>('PUT', url, request, config);
    }

    protected async patch<TReq = any, TRes = any>(url: string, request: ApiRequest<TReq>, config?: AxiosRequestConfig): Promise<AxiosResponse<TRes>> {
        return this.request<TReq, TRes>('PATCH', url, request, config);
    }

    protected async delete<TReq = any, TRes = any>(url: string, request: ApiRequest<TReq>, config?: AxiosRequestConfig): Promise<AxiosResponse<TRes>> {
        return this.request<TReq, TRes>('DELETE', url, request, config);
    }
}
