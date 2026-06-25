import type { FC } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import type { UseGridColumn } from '@components/grid/use-grid';

import { Icon } from '@iconify/react';
import { CSS } from '@dnd-kit/utilities';
import React, { useMemo, useState, useEffect } from 'react';
import { useSensor, DndContext, useSensors, closestCenter, PointerSensor } from '@dnd-kit/core';
import { arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { Menu, Stack, Paper, Button, Tooltip, useTheme, IconButton, Typography, useMediaQuery } from '@mui/material';

export interface SortComponentProps {
    columns: UseGridColumn[];
    sorts: string[];
    setSorts: (sort: string[]) => void;
}

const SortableRow: FC<{
    id: string;
    label: string;
    icon: string;
    onToggle: () => void;
}> = ({ id, label, icon, onToggle }) => {
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

                <Typography variant="body2">{label}</Typography>
            </Stack>

            <IconButton size="small" onClick={onToggle}>
                <Icon icon={icon} width={20} height={20} />
            </IconButton>
        </Paper>
    );
};

const SortComponent: FC<SortComponentProps> = ({ columns, sorts, setSorts }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const initialOrder = useMemo(() => columns.filter((c) => c.sortable && c.switchVisibility !== false).map((c) => c.attribute), [columns]);
    const [order, setOrder] = useState<string[]>(initialOrder);

    useEffect(() => setOrder(initialOrder), [initialOrder]);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const getSortState = (attribute: string): 'asc' | 'desc' | 'none' => {
        if (sorts.includes(attribute)) return 'asc';
        if (sorts.includes(`-${attribute}`)) return 'desc';
        return 'none';
    };

    const toggleSort = (attribute: string) => {
        const current = getSortState(attribute);
        const base = sorts.filter((s) => s !== attribute && s !== `-${attribute}`);

        if (current === 'none') base.push(attribute);
        else if (current === 'asc') base.push(`-${attribute}`);

        setSorts(base);
    };

    const resetSort = () => {
        setSorts([]);
        setOrder(initialOrder);
        handleMenuClose();
    };

    const getIcon = (state: 'asc' | 'desc' | 'none') => {
        switch (state) {
            case 'asc':
                return 'mdi:sort-reverse-variant';
            case 'desc':
                return 'mdi:sort-variant';
            default:
                return 'mdi:sort-variant-off';
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = order.indexOf(active.id as string);
        const newIndex = order.indexOf(over.id as string);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newOrder = arrayMove(order, oldIndex, newIndex);
            setOrder(newOrder);

            const sortMap = new Map<string, string>();
            sorts.forEach((s) => {
                if (s.startsWith('-')) sortMap.set(s.slice(1), s);
                else sortMap.set(s, s);
            });

            const reorderedSorts = newOrder.map((attr) => sortMap.get(attr)).filter(Boolean) as string[];

            setSorts(reorderedSorts);
        }
    };

    return (
        <>
            <Tooltip title="Sort">
                <Button color={sorts.length > 0 ? 'primary' : 'inherit'} size="small" onClick={handleMenuOpen} startIcon={<Icon icon="mdi:sort" width={20} height={20} />}>
                    {!isMobile ? 'Sort' : ''}
                </Button>
            </Tooltip>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { p: 1, minWidth: 280 } }}>
                <Stack spacing={1}>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={order} strategy={verticalListSortingStrategy}>
                            {order.map((attr) => {
                                const col = columns.find((c) => c.attribute === attr);
                                if (!col) return null;
                                const state = getSortState(attr);

                                return <SortableRow key={attr} id={attr} label={col.label} icon={getIcon(state)} onToggle={() => toggleSort(attr)} />;
                            })}
                        </SortableContext>
                    </DndContext>

                    <Button size="small" color="error" variant="contained" onClick={resetSort} fullWidth>
                        Reset
                    </Button>
                </Stack>
            </Menu>
        </>
    );
};

export default SortComponent;
