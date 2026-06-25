import SortComponent from '@components/grid/components/sort';
import TableComponent from '@components/grid/table-component';
import FilterComponent from '@components/grid/components/filter';
import ExportComponent from '@components/grid/components/export';
import ImportComponent from '@components/grid/components/import';
import RefreshComponent from '@components/grid/components/refresh';
import { TabComponent } from '@components/grid/table-tab-component';
import TableColumnComponent from '@components/grid/table-column-component';
import TableCollapseComponent from '@components/grid/table-collapse-component';
import { CustomColumnsButton } from '@components/grid/custom-toolbar-component';
import ColumnVisibilityComponent from '@components/grid/components/column-visibility';

import LayoutComponent from './layout-component';
import { SearchComponent } from './search-component';
import PaginationComponent from './components/pagination';
import { ToolbarComponent, ToolbarLeftComponent, ToolbarRightComponent } from './toolbar-component';

export const Grid = {
    Layout: LayoutComponent,
    Toolbar: ToolbarComponent,
    ToolbarLeftComponent,
    ToolbarRightComponent,
    ToolbarColumn: CustomColumnsButton,
    Filter: FilterComponent,
    Sort: SortComponent,
    Search: SearchComponent,
    Export: ExportComponent,
    ExportData: ExportComponent,
    Import: ImportComponent,
    Pagination: PaginationComponent,
    Table: TableComponent,
    TableCollapse: TableCollapseComponent,
    Column: TableColumnComponent,
    Refresh: RefreshComponent,
    ColumnVisibility: ColumnVisibilityComponent,
    Tab: TabComponent,
};
