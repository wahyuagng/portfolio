import { _id } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const ROOTS = {
    AUTH: '/auth',
    MASTER: '/master',
    DEVELOPMENT: '/development',
    INSPECTOR: '/inspector',
    EXAMPLE: '/example',
    //
    PROFILE: '/profile',
    DISPLAY: '/display',
    PRE_ORDER: '/purchase_order',
    RECEPTION: '/reception',
    BLENDING: '/blending',
    OVEN_DRUM: '/oven-drum',
    FILLING: '/filling',
    INVENTORY_STOCK: '/inventory-stock',
    BON: '/bon',
    BAU: '/bau',
    REPORT: '/report',
    NOTIFICATION: '/notification',
};

// ----------------------------------------------------------------------

export const paths = {
    faqs: '/faqs',
    home: '/',
    portofolio: '/portofolio',
    // AUTH
    auth: {
        amplify: {
            signIn: `${ROOTS.AUTH}/amplify/sign-in`,
            verify: `${ROOTS.AUTH}/amplify/verify`,
            signUp: `${ROOTS.AUTH}/amplify/sign-up`,
            updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
            resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
        },
        jwt: {
            verify_login: `${ROOTS.AUTH}/jwt/verify_login`,
            recovery_login: `${ROOTS.AUTH}/jwt/recovery_login`,
            signIn: `${ROOTS.AUTH}/jwt/sign-in`,
            signUp: `${ROOTS.AUTH}/jwt/sign-up`,
            forgot_password: `${ROOTS.AUTH}/jwt/forgot_password`,
            verify_password_reset: `${ROOTS.AUTH}/jwt/verify_password_reset`,
            reset_password: `${ROOTS.AUTH}/jwt/reset_password`,
        },
        oidc: {
            signIn: `${ROOTS.AUTH}/oidc/sign-in`,
        },
        auth0: { signIn: `${ROOTS.AUTH}/auth0/sign-in` },
        supabase: {
            signIn: `${ROOTS.AUTH}/supabase/sign-in`,
            verify: `${ROOTS.AUTH}/supabase/verify`,
            signUp: `${ROOTS.AUTH}/supabase/sign-up`,
            updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
            resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
        },
    },
    // --------------------------------------------------------------------------------------------------------------
    example: {
        root: `${ROOTS.EXAMPLE}`,
        list: `${ROOTS.EXAMPLE}/list`,
        add: `${ROOTS.EXAMPLE}/add`,
        form: `${ROOTS.EXAMPLE}/form`,
        demo: {
            details: `${ROOTS.EXAMPLE}/${MOCK_ID}`,
            edit: `${ROOTS.EXAMPLE}/${MOCK_ID}/edit`,
        },
    },
    // --------------------------------------------------------------------------------------------------------------
    profile: {
        root: `${ROOTS.PROFILE}`,
        change_password: `${ROOTS.PROFILE}/change_password`,
        mfa_activate: `${ROOTS.PROFILE}/mfa_activate`,
        mfa_deactivate: `${ROOTS.PROFILE}/mfa_deactivate`,
    },
    notification: `${ROOTS.NOTIFICATION}`,
    display: `${ROOTS.DISPLAY}`,
    pre_order: `${ROOTS.PRE_ORDER}`,
    reception: {
        root: `${ROOTS.RECEPTION}`,
        scan_qr: `${ROOTS.RECEPTION}/scan-qr`,
        material_warehouse: `${ROOTS.RECEPTION}/material-warehouse`,
        additive_in_drum: `${ROOTS.RECEPTION}/additive-in-drum`,
        tanker: `${ROOTS.RECEPTION}/tanker`,
        iso_tank: `${ROOTS.RECEPTION}/iso-tank`,
        pipa: `${ROOTS.RECEPTION}/pipa`,
    },
    blending: {
        root: `${ROOTS.BLENDING}`,
        oven_drum: `${ROOTS.OVEN_DRUM}`,
    },
    // blending: `${ROOTS.BLENDING}`,
    filling: `${ROOTS.FILLING}`,
    // filling: {
    //     root: `${ROOTS.FILLING}`,
    //     display: `${ROOTS.FILLING}/display`,
    // },
    inventory_stock: {
        root: `${ROOTS.INVENTORY_STOCK}`,
        storage_tank: `${ROOTS.INVENTORY_STOCK}/storage-tank`,
        storage_mwh: `${ROOTS.INVENTORY_STOCK}/storage-mwh`,
        inventory: `${ROOTS.INVENTORY_STOCK}/inventory`,
        vendor_inventory: `${ROOTS.INVENTORY_STOCK}/vendor_inventory`,
        history_inventory: `${ROOTS.INVENTORY_STOCK}/history_inventory`,
    },
    bon: `${ROOTS.BON}`,
    bon_scan: `${ROOTS.BON}-scan`,
    bau: `${ROOTS.BAU}`,
    // report: `${ROOTS.REPORT}`,
    report: {
        root: `${ROOTS.REPORT}`,
        plan_transfer_material: `${ROOTS.REPORT}/plant-transfer-material`,
        locator_transfer_material: `${ROOTS.REPORT}/locator-transfer-material`,
        filling_downtime: `${ROOTS.REPORT}/filling-downtime`,
        blend_downtime: `${ROOTS.REPORT}/blend-downtime`,
    },
    master: {
        root: `${ROOTS.MASTER}`,
        supplier: `${ROOTS.MASTER}/supplier`,
        material: `${ROOTS.MASTER}/material`,
        location: `${ROOTS.MASTER}/location`,
        locator: `${ROOTS.MASTER}/locator`,
        filling_display: `${ROOTS.MASTER}/filling-display`,
        bom: `${ROOTS.MASTER}/bom`,
        equipment: `${ROOTS.MASTER}/equipment`,
        category_downtime: `${ROOTS.MASTER}/category-downtime`,
        engine_capacity: `${ROOTS.MASTER}/engine-capacity`,
        capacity_in_oven_drum: `${ROOTS.MASTER}/capacity-in-oven-drum`,
        packaging_size: `${ROOTS.MASTER}/packaging-size`,
        user: `${ROOTS.MASTER}/user`,
        blending_tank: `${ROOTS.MASTER}/blending-tank`,
        transporter: `${ROOTS.MASTER}/transporter`,
        pu_downtime_tolerance: `${ROOTS.MASTER}/pu-downtime-tolerance`,
        configuration: `${ROOTS.MASTER}/configuration`,
        material_type: `${ROOTS.MASTER}/material-type`,
        shift: `${ROOTS.MASTER}/shift`,
        plantTransferConfig: `${ROOTS.MASTER}/plant-transfer-config`,
    },
};
