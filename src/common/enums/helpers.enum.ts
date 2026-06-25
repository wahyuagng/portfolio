// helpers.enum.ts

import { EnumService } from '@services/api/modules/enum.service';

const enumService = new EnumService();

export const getMaterialUnitOptions = async (): Promise<any[]> => {
    try {
        const response = await enumService.MaterialUnits();
        return response.data.Data || [];
    } catch (error: any) {
        console.error('Error fetching option:', error);
        throw error;
    }
};

export const getMaterialTypeOptions = async (): Promise<any[]> => {
    try {
        const response = await enumService.MaterialTypes();
        return response.data.Data || [];
    } catch (error: any) {
        console.error('Error fetching option:', error);
        throw error;
    }
};

export const getMaterialContainerOptions = async (): Promise<any[]> => {
    try {
        const response = await enumService.MaterialContainers();
        return response.data.Data || [];
    } catch (error: any) {
        console.error('Error fetching option:', error);
        throw error;
    }
};

export const getLocationTypeOptions = async (): Promise<any[]> => {
    try {
        const response = await enumService.LocationTypes();
        return response.data.Data || [];
    } catch (error: any) {
        console.error('Error fetching option:', error);
        throw error;
    }
};

export const getEquipmentTypeOptions = async (): Promise<any[]> => {
    try {
        const response = await enumService.EquipmentTypes();
        return response.data.Data || [];
    } catch (error: any) {
        console.error('Error fetching option:', error);
        throw error;
    }
};

export const getEquipmentUnitOptions = async (): Promise<any[]> => {
    try {
        const response = await enumService.EquipmentUnits();
        return response.data.Data || [];
    } catch (error: any) {
        console.error('Error fetching option:', error);
        throw error;
    }
};

export const getEquipmentProductClassificationOptions = async (): Promise<any[]> => {
    try {
        const response = await enumService.EquipmentProductClassifications();
        return response.data.Data || [];
    } catch (error: any) {
        console.error('Error fetching option:', error);
        throw error;
    }
};

export const getDowntimeStageOptions = async (): Promise<any[]> => {
    try {
        const response = await enumService.DowntimeStages();
        return response.data.Data || [];
    } catch (error: any) {
        console.error('Error fetching option:', error);
        throw error;
    }
};

export const getVariantUnitOptions = async (): Promise<any[]> => {
    try {
        const response = await enumService.VariantUnits();
        return response.data.Data || [];
    } catch (error: any) {
        console.error('Error fetching option:', error);
        throw error;
    }
};

export const getBillOfMaterialStageOptions = async (): Promise<any[]> => {
    try {
        const response = await enumService.BillOfMaterialStatges();
        return response.data.Data || [];
    } catch (error: any) {
        console.error('Error fetching option:', error);
        throw error;
    }
};

export const getUserRoleOptions = async (): Promise<any[]> => {
    try {
        const response = await enumService.UserRoles();
        return response.data.Data || [];
    } catch (error: any) {
        console.error('Error fetching option:', error);
        throw error;
    }
};

export const getPurchaseOrderTypeOptions = async (): Promise<any[]> => {
    try {
        const response = await enumService.PurchaseOrderTypes();
        return response.data.Data || [];
    } catch (error: any) {
        console.error('Error fetching option:', error);
        throw error;
    }
};

export const getPurchaseOrderMaterialTypeOptions = async (): Promise<any[]> => {
    try {
        const response = await enumService.PurchaseOrderMaterialTypes();
        return response.data.Data || [];
    } catch (error: any) {
        console.error('Error fetching option:', error);
        throw error;
    }
};

export const getUnitsOptions = async (): Promise<any[]> => {
    try {
        const response = await enumService.Units();
        return response.data.Data || [];
    } catch (error: any) {
        console.error('Error fetching option:', error);
        throw error;
    }
};

export const getPlantOptions = async (): Promise<any[]> => {
    try {
        const response = await enumService.Plants();
        return response.data.Data || [];
    } catch (error: any) {
        console.error('Error fetching option:', error);
        throw error;
    }
};
