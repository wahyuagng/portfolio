import { paths } from '@routes/paths';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { NotificationService } from '@services/api/modules/notification';
import { subscribeToForegroundMessage } from '@common/firebase/firebase-messaging';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import { Tooltip } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type NotificationItem = {
    Id: string;
    Plant: string;
    PlantLabel: string;
    IconClass: string | null;
    Title: string;
    ContentShort: string;
    Module: string;
    RedirectPath: string;
    Status: string;
    StatusLabel: string;
    CreatedAt: string;
    CreatedAtFormatted: string;
    Creator: {
        Id: string;
        Role: string;
        RoleLabel: string;
        Name: string;
    };
};

// ----------------------------------------------------------------------

const SNAPSHOT_KEY = 'notification_snapshot_ids'; // ID notif saat terakhir fetch
const UNREAD_KEY = 'notification_unread_ids'; // ID notif yang belum dibaca

function getSnapshotIds(): Set<string> {
    try {
        const raw = localStorage.getItem(SNAPSHOT_KEY);
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
        return new Set();
    }
}

function saveSnapshotIds(ids: Set<string>) {
    try {
        localStorage.setItem(SNAPSHOT_KEY, JSON.stringify([...ids]));
    } catch {
        console.log('saveSnapshotIds gagal');
    }
}

function getUnreadIds(): Set<string> {
    try {
        const raw = localStorage.getItem(UNREAD_KEY);
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
        return new Set();
    }
}

function saveUnreadIds(ids: Set<string>) {
    try {
        localStorage.setItem(UNREAD_KEY, JSON.stringify([...ids]));
    } catch {
        console.log('saveUnreadIds gagal');
    }
}

// ----------------------------------------------------------------------

export function NotificationsButton() {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Badge langsung merah dari localStorage saat browser dibuka
    const [newIds, setNewIds] = useState<Set<string>>(getUnreadIds());

    const notificationService = new NotificationService();
    const navigate = useNavigate();

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await notificationService.list();
            const fetched: NotificationItem[] = res.data.Data ?? [];
            setData(fetched);

            const fetchedIds = new Set(fetched.map((n) => n.Id));

            // Ambil snapshot ID sebelumnya dari localStorage
            const prevSnapshot = getSnapshotIds();

            let unread: Set<string>;

            if (prevSnapshot.size === 0) {
                // Pertama kali buka app → tidak ada yang baru, semua dianggap sudah ada
                unread = new Set();
            } else {
                // Bandingkan: ID yang ada di fetch tapi tidak ada di snapshot = BARU
                unread = new Set([...fetchedIds].filter((id) => !prevSnapshot.has(id)));

                // Merge dengan unread sebelumnya yang belum dibaca
                const prevUnread = getUnreadIds();
                prevUnread.forEach((id) => unread.add(id));
            }

            // Simpan snapshot terbaru
            saveSnapshotIds(fetchedIds);

            // Simpan unread terbaru
            saveUnreadIds(unread);
            setNewIds(unread);
        } catch (err) {
            setError('Gagal memuat notifikasi');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch saat pertama mount
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Fetch saat browser dibuka kembali (dari minimize / pindah tab / buka dari taskbar)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchNotifications();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [fetchNotifications]);

    // Fetch saat ada foreground message dari Firebase
    useEffect(() => {
        const unsubscribe = subscribeToForegroundMessage(() => {
            fetchNotifications();
        });
        return () => unsubscribe();
    }, [fetchNotifications]);

    const handleOpen = () => {
        setOpen(true);
        // Tandai semua sudah dibaca
        setNewIds(new Set());
        saveUnreadIds(new Set());
    };

    const handleClickItem = (item: NotificationItem) => {
        setOpen(false);
        setTimeout(() => {
            navigate(item.RedirectPath);
        }, 150);
    };

    return (
        <>
            <IconButton onClick={handleOpen} color="default">
                <Badge variant="dot" color="error" invisible={newIds.size === 0}>
                    <Iconify icon="solar:bell-bing-bold" width={24} />
                </Badge>
            </IconButton>

            <Drawer
                open={open}
                onClose={() => setOpen(false)}
                anchor="right"
                slotProps={{
                    backdrop: { invisible: true },
                    paper: { sx: { width: 360 } },
                }}
            >
                <Box
                    sx={{
                        px: 2.5,
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        bgcolor: 'background.paper',
                    }}
                >
                    <Typography variant="h6">Notifications</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View All">
                            <IconButton color="inherit" onClick={() => navigate(paths.notification)} size="small">
                                <Iconify icon="solar:list-bold" width={18} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Refresh">
                            <IconButton color="inherit" onClick={fetchNotifications} size="small">
                                <Iconify icon="solar:restart-bold" width={18} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Close">
                            <IconButton color="inherit" onClick={() => setOpen(false)}>
                                <Iconify icon="mingcute:close-line" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <Divider />

                {loading ? (
                    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress size={28} />
                    </Box>
                ) : error ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'error.main' }}>
                            {error}
                        </Typography>
                    </Box>
                ) : data.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            No notifications
                        </Typography>
                    </Box>
                ) : (
                    <List disablePadding>
                        {data.map((item, index) => {
                            const isNew = newIds.has(item.Id);
                            return (
                                <Box key={item.Id}>
                                    <ListItem
                                        alignItems="flex-start"
                                        onClick={() => handleClickItem(item)}
                                        sx={{
                                            px: 2.5,
                                            py: 1.5,
                                            bgcolor: isNew ? 'action.hover' : 'transparent',
                                            '&:hover': { bgcolor: 'action.selected', cursor: 'pointer' },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                bgcolor: isNew ? 'error.main' : 'transparent',
                                                mt: 1,
                                                mr: 1.5,
                                                flexShrink: 0,
                                            }}
                                        />
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle2" sx={{ fontWeight: isNew ? 600 : 400 }}>
                                                    {item.Title}
                                                </Typography>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                                                        {item.ContentShort}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.5, display: 'block' }}>
                                                        {item.CreatedAtFormatted}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                                                        {item.PlantLabel}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < data.length - 1 && <Divider />}
                                </Box>
                            );
                        })}
                    </List>
                )}
            </Drawer>
        </>
    );
}
