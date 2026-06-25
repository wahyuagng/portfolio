export type InspectionItem = {
    details: {
        otp: string;
        name: string;
        description: string;
        subDescription: string;
        members: string[];
        teamMembers: {
            name: string;
            email: string;
            phone: string;
            address: string;
            position: string;
            role: string;
        }[];
    };
    properties: {
        code: string;
        sku: string;
        quantity: number;
        colors: string[];
        sizes: string[];
        tags: string[];
        gender: string[];
        category: string;
        newLabel: {
            content: string;
            enabled: boolean;
        };
        saleLabel: {
            content: string;
            enabled: boolean;
        };
    };
    pricing: {
        price: number;
        taxes: number;
        priceSale: number;
    };
};
