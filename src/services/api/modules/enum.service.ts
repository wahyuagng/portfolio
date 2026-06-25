import type { AxiosResponse } from 'axios';
import type { ApiResponse } from '@services/api/types';

import { BaseService } from '@services/api/client';
import { getAxiosInstance } from '@services/api/interceptor';

export class EnumService extends BaseService {
    axiosInstance = getAxiosInstance();

    async UserRoles(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/user/roles', {});
    }

    async Plants(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/plants', {});
    }

    async Units(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/units', {});
    }

    async PlantCapacityPlants(): Promise<AxiosResponse<ApiResponse<any[]>>> {
        return this.get('/option/plant-capacity/plants', {});
    }

    async PlantCapacityTypes(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/plant-capacity/types', {});
    }

    async VariantUnits(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/variant/units', {});
    }

    async EquipmentTypes(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/equipment/types', {});
    }

    async EquipmentPlants(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/equipment/plants', {});
    }

    async EquipmentUnits(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/equipment/units', {});
    }

    async EquipmentProductClassifications(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/equipment/product-classifications', {});
    }

    async MaterialUnits(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/material/units', {});
    }

    async MaterialTypes(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/material/types', {});
    }

    async MaterialContainers(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/material/containers', {});
    }

    async LocationPlants(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/location/plants', {});
    }

    async LocationTypes(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/location/types', {});
    }

    async DowntimeStages(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/downtime/stages', {});
    }

    async HoldingTankPlants(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/holding-tank/plants', {});
    }

    async HoldingTankStages(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/holding-tank/stages', {});
    }

    async DowntimeThresholdPlants(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/downtime-threshold/plants', {});
    }

    async BillOfMaterialStatges(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/bill-of-material/stages', {});
    }

    async ConfigurationTypes(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/configuration/types', {});
    }

    async PurchaseOrderTypes(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/purchase-order/types', {});
    }

    async PurchaseOrderMaterialTypes(): Promise<AxiosResponse<ApiResponse<any>>> {
        return this.get('/option/purchase-order-material/types', {});
    }
}
