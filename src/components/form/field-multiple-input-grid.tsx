import type { ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';

import { Icon } from '@iconify/react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import {
    Box,
    Stack,
    Table,
    Paper,
    Button,
    Tooltip,
    TableRow,
    TextField,
    TableHead,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
} from '@mui/material';

export type FieldConfig = {
    name: string;
    label: string;
    type?: 'text' | 'email' | 'number' | 'tel' | 'custom';
    multiline?: boolean;
    rows?: number;
    required?: boolean;
    placeholder?: string;
    width?: string | number;
    renderCustom?: (fieldName: string, index: number, hasError: boolean, errorMessage: string) => ReactNode;
};

type FieldMultipleInputGridProps = {
    name: string;
    label?: string;
    fields: FieldConfig[];
    defaultValues?: Record<string, any>;
    minRows?: number;
    maxRows?: number;
};

export const FieldMultipleInputGrid = ({
    name,
    label = 'Items',
    fields,
    defaultValues = {},
    minRows = 1,
    maxRows = 50,
}: FieldMultipleInputGridProps) => {
    const {
        control,
        register,
        trigger,
        formState: { errors },
    } = useFormContext();

    const {
        fields: fieldArray,
        append,
        remove,
    } = useFieldArray({
        control,
        name,
    });

    const generateDefaultRow = () => {
        const row: Record<string, any> = {};
        fields.forEach((field) => {
            row[field.name] = defaultValues[field.name] || '';
        });
        return row;
    };

    const getFieldError = (fieldName: string, index: number): string => {
        const path = `${name}.${index}.${fieldName}`;
        const pathSegments = path.split('.');
        let error: any = errors;

        for (const segment of pathSegments) {
            if (error && typeof error === 'object') {
                error = error[segment];
            } else {
                error = undefined;
                break;
            }
        }

        return (error as FieldError)?.message || '';
    };

    const getArrayErrorMessage = (error: any, fieldName: string) => {
        const segments = fieldName.split('.');
        let obj = error;
        for (const key of segments) {
            obj = obj?.[key];
        }
        return typeof obj?.message === 'string' ? obj.message : '';
    };

    const handleRemove = async (index: number) => {
        if (fieldArray.length > minRows) {
            remove(index);
            await trigger(name);
        }
    };

    const handleAppend = async () => {
        if (fieldArray.length < maxRows) {
            append(generateDefaultRow());
            await trigger(name);
        }
    };

    const renderField = (field: FieldConfig, index: number) => {
        const fieldName = `${name}.${index}.${field.name}`;
        const hasError = !!getFieldError(field.name, index);
        const errorMessage = getFieldError(field.name, index);

        if (field.type === 'custom' && field.renderCustom) {
            return field.renderCustom(fieldName, index, hasError, errorMessage);
        }

        return (
            <TextField
                {...register(fieldName)}
                size="small"
                fullWidth
                type={field.type || 'text'}
                placeholder={field.placeholder}
                multiline={field.multiline}
                rows={field.rows}
                error={hasError}
                helperText={hasError ? errorMessage : ''}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        minHeight: field.multiline ? 'auto' : 40,
                    },
                }}
            />
        );
    };

    return (
        <Stack spacing={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{label}</Typography>
                <Button
                    variant="contained"
                    color="info"
                    startIcon={<Icon icon="mdi:plus" width={20} height={20} />}
                    onClick={handleAppend}
                    disabled={fieldArray.length >= maxRows}
                >
                    Add
                </Button>
            </Box>

            {fieldArray.length > 0 && (
                <TableContainer component={Paper} variant="outlined">
                    <Table>
                        <TableHead>
                            <TableRow>
                                {fields.map((field) => (
                                    <TableCell key={field.name} sx={{ fontWeight: 600 }}>
                                        {field.label}
                                        {field.required && <span style={{ color: 'red' }}> *</span>}
                                    </TableCell>
                                ))}
                                <TableCell sx={{ width: 80, fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fieldArray.map((item, index) => (
                                <TableRow key={item.id}>
                                    {fields.map((field) => (
                                        <TableCell key={field.name} sx={{ minWidth: field.width || 150 }}>
                                            {renderField(field, index)}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleRemove(index)}
                                                disabled={fieldArray.length <= minRows}
                                                size="small"
                                            >
                                                <Icon icon="mdi:delete" width={20} height={20} />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {getArrayErrorMessage(errors, name) && (
                <Typography color="error" variant="body2">
                    {getArrayErrorMessage(errors, name)}
                </Typography>
            )}

            <Typography variant="caption" color="text.secondary">
                {fieldArray.length} of {maxRows} items
                {minRows > 1 && ` (minimum ${minRows} required)`}
            </Typography>
        </Stack>
    );
};
