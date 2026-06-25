import { toast } from 'sonner';
import { handleResponseError } from '@common/helpers';

import Box from '@mui/material/Box';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, DialogActions, DialogContent, CircularProgress } from '@mui/material';

export type ConfirmDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    service: any; // Changed to allow any method name
    methodName?: string; // New prop for dynamic method name
    data: any;
    label?: string; // Label can now be a nested path like "user.name"
    idField?: string; // Custom ID field, defaults to "Id"
    title?: string; // Custom dialog title
    message?: string; // Custom confirmation message
    onClose?: () => void;
    onSuccess?: () => void;
    loadingForm?: boolean;
    setLoadingForm?: (data: boolean) => void;
};

// ----------------------------------------------------------------------

export function ConfirmDeleteDialog({
    open,
    setOpen,
    service,
    methodName = 'delete', // Default to "delete" for backward compatibility
    data,
    label,
    idField = 'Id', // Default ID field
    title = 'Delete Confirmation',
    message = 'Are you sure you want to delete this data?',
    onSuccess,
    onClose,
    loadingForm,
    setLoadingForm,
    ...other
}: ConfirmDialogProps) {
    const getNestedValue = (obj: any, path?: string): string => {
        if (!path) return '';

        return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : ''), obj) || '';
    };

    const handleDelete = async () => {
        setLoadingForm?.(true);

        if (!service[methodName]) {
            toast.error(`Method "${methodName}" not found on the provided service`);
            setLoadingForm?.(false);
            return;
        }

        let payload: any;
        if (Array.isArray(data)) {
            payload = data.map((item) => item[idField]);
        } else {
            payload = data[idField];
        }

        await service[methodName](payload)
            .then((r: any) => {
                toast.success(r?.data.Message);
                onSuccess?.();
                setOpen(false);
            })
            .catch((e: any) => {
                toast.error(handleResponseError(e.response.data));
            })
            .finally(() => {
                setLoadingForm?.(false);
            });
    };

    return (
        <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
            <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

            <DialogContent sx={{ typography: 'body2' }}>
                {message}
                {label && !Array.isArray(data) && (
                    <Box component="div" mt={1}>
                        <b style={{ color: 'red' }}>{getNestedValue(data, label)}</b>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                {loadingForm !== undefined ? (
                    <LoadingButton
                        loading={loadingForm}
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        loadingIndicator={<CircularProgress size={16} sx={{ color: 'black' }} />}
                    >
                        Delete
                    </LoadingButton>
                ) : (
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                )}

                <Button variant="outlined" color="inherit" onClick={() => setOpen(false)}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}
