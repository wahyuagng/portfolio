// import type { UseGridColumn } from '@components/grid/use-grid';
//
// import { Icon } from '@iconify/react';
// import React, { useMemo, useState } from 'react';
//
// import { Menu, Button, Divider, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
//
// export interface ColumnVisibilityToggleProps {
//     columns: UseGridColumn[];
//     onToggle: (attribute: string, visible: boolean) => void;
// }
//
// const ColumnVisibilityComponent: React.FC<ColumnVisibilityToggleProps> = ({ columns, onToggle }) => {
//     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//
//     const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
//     const handleMenuClose = () => setAnchorEl(null);
//
//     const hasHidden = useMemo(() => columns.some((col) => col.switchVisibility !== false && !col.isVisible), [columns]);
//
//     const resetVisibility = () => {
//         columns.filter((col) => col.switchVisibility !== false).forEach((col) => onToggle(col.attribute, true));
//         handleMenuClose();
//     };
//
//     return (
//         <>
//             <Button
//                 color={hasHidden ? 'primary' : 'inherit'}
//                 size="small"
//                 onClick={handleMenuOpen}
//                 startIcon={<Icon icon="mdi:view-column" width={20} height={20} />}
//             >
//                 Columns
//             </Button>
//
//             <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleMenuClose}
//                 PaperProps={{ sx: { p: 1, minWidth: 200 } }}
//             >
//                 <FormGroup>
//                     {columns
//                         .filter((col) => col.switchVisibility !== false)
//                         .map((col) => (
//                             <FormControlLabel
//                                 key={col.attribute}
//                                 control={
//                                     <Checkbox
//                                         checked={col.isVisible ?? true}
//                                         onChange={(e) => onToggle(col.attribute, e.target.checked)}
//                                     />
//                                 }
//                                 label={col.label}
//                             />
//                         ))}
//                 </FormGroup>
//
//                 <Divider sx={{ my: 1 }} />
//                 <Button size="small" color="error" variant="contained" onClick={resetVisibility} fullWidth>
//                     Reset
//                 </Button>
//             </Menu>
//         </>
//     );
// };
//
// export default ColumnVisibilityComponent;

import type { UseGridColumn } from '@components/grid/use-grid';

import { Icon } from '@iconify/react';
import { CSS } from '@dnd-kit/utilities';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useSensor, useSensors, DndContext, closestCenter, PointerSensor } from '@dnd-kit/core';
import { arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { Menu, Paper, Stack, Button, Divider, Tooltip, Checkbox, useTheme, IconButton, Typography, useMediaQuery, FormControlLabel } from '@mui/material';

export interface ColumnVisibilityToggleProps {
    columns: UseGridColumn[];
    setColumns: (data: UseGridColumn[]) => void;
    // onToggle: (attribute: string, visible: boolean) => void;
    // onReorder?: (newOrder: string[]) => void;
}

const SortableColumnRow: React.FC<{
    id: string;
    label: string;
    checked: boolean;
    onChange: (val: boolean) => void;
}> = ({ id, label, checked, onChange }) => {
    const { setNodeRef, setActivatorNodeRef, attributes, listeners, transform, transition } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Paper ref={setNodeRef} style={style} sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={1} alignItems="center">
                <IconButton size="small" ref={setActivatorNodeRef} {...attributes} {...listeners} edge="start" sx={{ cursor: 'grab' }}>
                    <Icon icon="mdi:drag" width={18} height={18} />
                </IconButton>

                <FormControlLabel control={<Checkbox checked={checked} onChange={(e) => onChange(e.target.checked)} />} label={<Typography variant="body2">{label}</Typography>} />
            </Stack>
        </Paper>
    );
};

const ColumnVisibilityComponent: React.FC<ColumnVisibilityToggleProps> = ({ columns, setColumns }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const initialOrder = useMemo(() => columns.filter((c) => c.switchVisibility !== false).map((c) => c.attribute), [columns]);
    const [order, setOrder] = useState<string[]>(initialOrder);

    useEffect(() => setOrder(initialOrder), [initialOrder]);

    const onVisibilityChange = useCallback(
        (attribute: string, visible: boolean) => {
            const updated = columns.map((col) => (col.attribute === attribute ? { ...col, isVisible: visible } : col));
            setColumns(updated);
        },
        [columns, setColumns]
    );

    const onReorder = useCallback(
        (newOrder: string[]) => {
            const colMap = new Map(columns.map((c) => [c.attribute, c]));
            const reordered = newOrder.map((attr) => colMap.get(attr)!);
            setColumns(reordered);
        },
        [columns, setColumns]
    );

    const sensors = useSensors(useSensor(PointerSensor));

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const hasHidden = useMemo(() => columns.some((col) => col.switchVisibility !== false && col.isVisible === false), [columns]);

    const resetVisibility = () => {
        columns.filter((col) => col.switchVisibility !== false).forEach((col) => onVisibilityChange(col.attribute, true));
        handleMenuClose();
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = order.indexOf(active.id as string);
        const newIndex = order.indexOf(over.id as string);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newOrder = arrayMove(order, oldIndex, newIndex);
            setOrder(newOrder);
            onReorder?.(newOrder);
        }
    };

    return (
        <>
            <Tooltip title="Search">
                <Button color={hasHidden ? 'primary' : 'inherit'} size="small" onClick={handleMenuOpen} startIcon={<Icon icon="mdi:view-column" width={20} height={20} />}>
                    {!isMobile ? 'Columns' : ''}
                </Button>
            </Tooltip>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { p: 1, minWidth: 240 } }}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={order} strategy={verticalListSortingStrategy}>
                        <Stack spacing={1}>
                            {order.map((attr) => {
                                const col = columns.find((c) => c.attribute === attr);
                                if (!col) return null;

                                return <SortableColumnRow key={attr} id={attr} label={col.label} checked={col.isVisible ?? true} onChange={(visible) => onVisibilityChange(attr, visible)} />;
                            })}
                        </Stack>
                    </SortableContext>
                </DndContext>

                <Divider sx={{ my: 1 }} />
                <Button size="small" color="error" variant="contained" onClick={resetVisibility} fullWidth>
                    Reset
                </Button>
            </Menu>
        </>
    );
};

export default ColumnVisibilityComponent;
