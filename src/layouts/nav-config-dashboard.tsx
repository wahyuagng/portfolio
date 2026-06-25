import type { NavSectionProps } from 'src/components/nav-section';

import {
    USER_VIEW,
    SHIFT_VIEW,
    REPORT_VIEW,
    DISPLAY_VIEW,
    FILLING_VIEW,
    LOCATOR_VIEW,
    VARIANT_VIEW,
    BLENDING_VIEW,
    SUPPLIER_VIEW,
    MATERIAL_VIEW,
    LOCATION_VIEW,
    DOWNTIME_VIEW,
    EQUIPMENT_VIEW,
    TRANSPORTER_VIEW,
    PURCHASE_ORDER_VIEW,
    RECEIVING_PIPE_VIEW,
    PLANT_TRANSFER_VIEW,
    PLANT_CAPACITY_VIEW,
    FILLING_DISPLAY_VIEW,
    RECEIVING_TANKER_VIEW,
    LOCATOR_TRANSFER_VIEW,
    BILL_OF_MATERIAL_VIEW,
    RECEIVING_ISO_TANK_VIEW,
    EQUIPMENT_CAPACITY_VIEW,
    INVENTORY_SUPPLIER_VIEW,
    PLANT_TRANSFER_CONFIG_VIEW,
    INVENTORY_STORAGE_TANK_VIEW,
    RECEIVING_ADDITIVE_IN_DRUM_VIEW,
    RECEIVING_MATERIAL_WAREHOUSE_VIEW,
} from '@components/grid/guard/constants';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;
const ICONS = {
    job: icon('ic-job'),
    dot: icon('ic-dot'),
    blog: icon('ic-blog'),
    chat: icon('ic-chat'),
    mail: icon('ic-mail'),
    user: icon('ic-user'),
    file: icon('ic-file'),
    lock: icon('ic-lock'),
    tour: icon('ic-tour'),
    order: icon('ic-order'),
    label: icon('ic-label'),
    blank: icon('ic-blank'),
    kanban: icon('ic-kanban'),
    folder: icon('ic-folder'),
    course: icon('ic-course'),
    params: icon('ic-params'),
    banking: icon('ic-banking'),
    booking: icon('ic-booking'),
    invoice: icon('ic-invoice'),
    product: icon('ic-product'),
    calendar: icon('ic-calendar'),
    disabled: icon('ic-disabled'),
    external: icon('ic-external'),
    subpaths: icon('ic-subpaths'),
    menuItem: icon('ic-menu-item'),
    ecommerce: icon('ic-ecommerce'),
    analytics: icon('ic-analytics'),
    dashboard: icon('ic-dashboard'),
    wine: icon('ic--baseline-wine-bar'),
    book: icon('ic--baseline-menu-book'),
    grid: icon('ic--baseline-grid-view'),
    chart: icon('ic--baseline-bar-chart'),
    balance: icon('ic--baseline-balance'),
    monitor: icon('ic--baseline-monitor'),
    settings: icon('ic--baseline-settings'),
    account: icon('ic--round-account-tree'),
    inventory: icon('ic--baseline-inventory'),
    density: icon('ic--baseline-density-small'),
};

// ----------------------------------------------------------------------

/**
 * Input nav data is an array of navigation section items used to define the structure and content of a navigation bar.
 * Each section contains a subheader and an array of items, which can include nested children items.
 *
 * Each item can have the following properties:
 * - `title`: The title of the navigation item.
 * - `path`: The URL path the item links to.
 * - `icon`: An optional icon component to display alongside the title.
 * - `info`: Optional additional information to display, such as a label.
 * - `allowedRoles`: An optional array of roles that are allowed to see the item.
 * - `caption`: An optional caption to display below the title.
 * - `children`: An optional array of nested navigation items.
 * - `disabled`: An optional boolean to disable the item.
 * - `deepMatch`: An optional boolean to indicate if the item should match subpaths.
 */
export const navData: NavSectionProps['data'] = [
    { items: [{ title: 'Display', path: paths.display, icon: ICONS.monitor, allowedRoles: [DISPLAY_VIEW] }] },
    { items: [{ title: 'PO', path: paths.pre_order, icon: ICONS.folder, allowedRoles: [PURCHASE_ORDER_VIEW] }] },
    {
        items: [
            {
                title: 'Penerimaan',
                path: paths.reception.root,
                icon: ICONS.chart,
                children: [
                    { title: 'Scan QR', path: paths.reception.scan_qr, icon: ICONS.dot, allowedRoles: [RECEIVING_MATERIAL_WAREHOUSE_VIEW] },
                    { title: 'Material WareHouse', path: paths.reception.material_warehouse, icon: ICONS.dot, allowedRoles: [RECEIVING_MATERIAL_WAREHOUSE_VIEW] },
                    { title: 'Tanker', path: paths.reception.tanker, icon: ICONS.dot, allowedRoles: [RECEIVING_TANKER_VIEW] },
                    { title: 'Iso Tank', path: paths.reception.iso_tank, icon: ICONS.dot, allowedRoles: [RECEIVING_ISO_TANK_VIEW] },
                    { title: 'Pipa', path: paths.reception.pipa, icon: ICONS.dot, allowedRoles: [RECEIVING_PIPE_VIEW] },
                    { title: 'Additive In Drum', path: paths.reception.additive_in_drum, icon: ICONS.dot, allowedRoles: [RECEIVING_ADDITIVE_IN_DRUM_VIEW] },
                ],
            },
        ],
    },
    {
        items: [
            {
                title: 'Blending',
                path: paths.blending.root,
                icon: ICONS.balance,
                children: [
                    { title: 'Blending', path: paths.blending.root, icon: ICONS.dot, allowedRoles: [BLENDING_VIEW] },
                    { title: 'Oven Drum', path: paths.blending.oven_drum, icon: ICONS.dot, allowedRoles: [BLENDING_VIEW] },
                ],
            },
        ],
    },
    // { items: [{ title: 'Blending', path: paths.blending, icon: ICONS.balance, allowedRoles: [BLENDING_VIEW] }] },
    { items: [{ title: 'Filling', path: paths.filling, icon: ICONS.balance, allowedRoles: [FILLING_VIEW] }] },
    {
        items: [
            {
                title: 'Inventory Stock',
                path: paths.inventory_stock.root,
                icon: ICONS.inventory,
                children: [
                    { title: 'Storage Tank & MWH', path: paths.inventory_stock.inventory, icon: ICONS.dot, allowedRoles: [INVENTORY_STORAGE_TANK_VIEW] },
                    { title: 'Vendor Inventory', path: paths.inventory_stock.vendor_inventory, icon: ICONS.dot, allowedRoles: [INVENTORY_SUPPLIER_VIEW] },
                    { title: 'History Inventory', path: paths.inventory_stock.history_inventory, icon: ICONS.dot, allowedRoles: [INVENTORY_SUPPLIER_VIEW] },
                ],
            },
        ],
    },
    // { items: [{ title: 'BON', path: paths.bon, icon: ICONS.book, allowedRoles: [LOCATOR_TRANSFER_VIEW] }] },
    {
        items: [
            {
                title: 'BON',
                path: paths.bon,
                icon: ICONS.chart,
                allowedRoles: [LOCATOR_TRANSFER_VIEW],
                children: [
                    { title: 'Scan QR', path: paths.bon_scan, icon: ICONS.dot },
                    { title: 'BON', path: paths.bon, icon: ICONS.dot },
                ],
            },
        ],
    },
    { items: [{ title: 'BAU', path: paths.bau, icon: ICONS.account, allowedRoles: [PLANT_TRANSFER_VIEW] }] },
    {
        items: [
            {
                title: 'Report',
                path: paths.report.root,
                icon: ICONS.chart,
                allowedRoles: [REPORT_VIEW],
                children: [
                    { title: 'Plant Transfer Material', path: paths.report.plan_transfer_material, icon: ICONS.dot },
                    { title: 'Locator Transfer Material', path: paths.report.locator_transfer_material, icon: ICONS.dot },
                    { title: 'Filling Downtime', path: paths.report.filling_downtime, icon: ICONS.dot },
                    { title: 'Blend Downtime', path: paths.report.blend_downtime, icon: ICONS.dot },
                ],
            },
        ],
    },
    {
        items: [
            {
                title: 'Master',
                path: paths.master.root,
                icon: ICONS.settings,
                children: [
                    { title: 'Supplier', path: paths.master.supplier, icon: ICONS.dot, allowedRoles: [SUPPLIER_VIEW] },
                    { title: 'Material', path: paths.master.material, icon: ICONS.dot, allowedRoles: [MATERIAL_VIEW] },
                    { title: 'Lokasi', path: paths.master.location, icon: ICONS.dot, allowedRoles: [LOCATION_VIEW] },
                    { title: 'Lokator', path: paths.master.locator, icon: ICONS.dot, allowedRoles: [LOCATOR_VIEW] },
                    { title: 'Filling Display', path: paths.master.filling_display, icon: ICONS.dot, allowedRoles: [FILLING_DISPLAY_VIEW] },
                    { title: 'BOM', path: paths.master.bom, icon: ICONS.dot, allowedRoles: [BILL_OF_MATERIAL_VIEW] },
                    { title: 'Equipment', path: paths.master.equipment, icon: ICONS.dot, allowedRoles: [EQUIPMENT_VIEW] },
                    { title: 'Kategori Downtime', path: paths.master.category_downtime, icon: ICONS.dot, allowedRoles: [DOWNTIME_VIEW] },
                    { title: 'Kapasitas Mesin', path: paths.master.engine_capacity, icon: ICONS.dot, allowedRoles: [EQUIPMENT_CAPACITY_VIEW] },
                    { title: 'Kapasitas In Oven Drum', path: paths.master.capacity_in_oven_drum, icon: ICONS.dot, allowedRoles: [PLANT_CAPACITY_VIEW] },
                    { title: 'Ukuran Kemasan', path: paths.master.packaging_size, icon: ICONS.dot, allowedRoles: [VARIANT_VIEW] },
                    { title: 'User', path: paths.master.user, icon: ICONS.dot, allowedRoles: [USER_VIEW] },
                    { title: 'Transportir', path: paths.master.transporter, icon: ICONS.dot, allowedRoles: [TRANSPORTER_VIEW] },
                    { title: 'Shift', path: paths.master.shift, icon: ICONS.dot, allowedRoles: [SHIFT_VIEW] },
                    { title: 'Plant Transfer Config', path: paths.master.plantTransferConfig, icon: ICONS.dot, allowedRoles: [PLANT_TRANSFER_CONFIG_VIEW] },
                ],
            },
        ],
    },
];
