import type * as Yup from 'yup';

import * as React from 'react';
import { CloseIcon } from 'yet-another-react-lightbox';
import { useRef, useState, useEffect, forwardRef, useCallback, useImperativeHandle } from 'react';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import useMediaQuery from '@mui/material/useMediaQuery';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Box, Card, Table, Paper, Stack, Button, Dialog, Divider, Tooltip, TableRow, TableHead, TableCell, TableBody, IconButton, Typography, DialogTitle, DialogContent, DialogActions, TableContainer } from '@mui/material';

interface ExtraAction<RowDto> {
    icon: React.ReactNode;
    tooltip?: string;
    onClick: (row: RowDto, index: number) => void;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default' | 'inherit';
    show?: (row: RowDto, index: number) => boolean;
}

interface FieldConfig<RowDto> {
    attribute: keyof RowDto | string;
    label: string;
    field: (value: any, onChange?: (value: any) => void, error?: string, row?: any, indexRow?: number, setMultipleValues?: (partial: Partial<RowDto>) => void) => React.ReactNode;
    width?: number | string;
    isField?: boolean;
    unique?: boolean;
    displayFormat?: (value: any, row?: any) => React.ReactNode;
    displayFields?: Array<{
        attribute: string;
        label: string;
        width?: number | string;
        format?: (value: any) => string;
    }>;
}

interface RowValidation<RowDto> {
    index: number;
    isValid: boolean;
    errors: Partial<Record<keyof RowDto, string>> & { _custom?: string };
}

type RowErrors<RowDto> = Partial<Record<keyof RowDto, string>> & {
    _custom?: string;
};

function customError<RowDto>(msg: string): RowErrors<RowDto> {
    return { _custom: msg } as RowErrors<RowDto>;
}

interface MultipleInputProps<RowDto extends Record<string, any>> {
    value: RowDto[];
    onChange: (data: RowDto[]) => void;
    schema: Yup.ObjectSchema<any>;
    fields: FieldConfig<RowDto>[];
    allowAdd?: boolean;
    allowAction?: boolean;
    allowUpdate?: boolean;
    allowDelete?: boolean;
    isUpdateMode?: boolean;
    editMode?: 'default' | 'modal' | 'open';
    modalTitle?: string;
    onBeforeAdd?: (rows: RowDto[], newRow: RowDto) => boolean | void | undefined;
    onAfterAdd?: (rows: RowDto[]) => void;
    onBeforeUpdate?: (rows: RowDto[], oldRow: RowDto, newRow: RowDto, index: number) => boolean | void | undefined;
    onAfterUpdate?: (rows: RowDto[]) => void;
    onBeforeDelete?: (rows: RowDto[], row: RowDto) => boolean | void | undefined;
    onAfterDelete?: (rows: RowDto[]) => void;
    onCustomValidate?: (rows: RowDto[], currentRow: RowDto, index: number) => string | null | undefined;
    onValidationChange?: (isValid: boolean, rowValidations: RowValidation<RowDto>[]) => void;
    addButtonLabel?: string;
    extraActions?: ExtraAction<RowDto>[];
    onModalSubmit?: (
        row: Partial<RowDto>,
        mode: 'create' | 'edit',
        index: number | null,
        callbacks: {
            onSuccess: (updatedRow?: Partial<RowDto>) => void;
            onError: (errors: Partial<Record<keyof RowDto, string>> & { _custom?: string }) => void;
            setSubmitting: (loading: boolean) => void;
        }
    ) => void;
    allowActionPerRow?: (row: RowDto, index: number) => boolean;
}

export interface MultipleInputRef {
    validate: () => Promise<{ isValid: boolean; errors: string[] }>;
}

const MultipleInputInner = <RowDto extends Record<string, any>>(
    { value, onChange, schema, fields, allowAdd = true, allowAction = true, allowUpdate = true, allowDelete = true, isUpdateMode = false, editMode = 'default', modalTitle = '', onBeforeAdd, onAfterAdd, onBeforeUpdate, onAfterUpdate, onBeforeDelete, onAfterDelete, onCustomValidate, onValidationChange, addButtonLabel = 'Add', extraActions, onModalSubmit, allowActionPerRow }: MultipleInputProps<RowDto>,
    ref: React.Ref<MultipleInputRef>
) => {
    const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
    const [rowErrors, setRowErrors] = useState<Record<number, RowErrors<RowDto>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Partial<RowDto>>({});
    const [editErrors, setEditErrors] = useState<RowErrors<RowDto>>({});

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [modalEditIndex, setModalEditIndex] = useState<number | null>(null);
    const [dataSnapshot, setDataSnapshot] = useState<RowDto[] | null>(null);

    const [openModeErrors, setOpenModeErrors] = useState<Record<number, RowErrors<RowDto>>>({});

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const rows: RowDto[] = value ?? [];
    const rowsRef = useRef<RowDto[]>(rows);
    rowsRef.current = rows;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        if (rows.length === 0 && !isUpdateMode && editMode === 'default') {
            const defaultRow = schema.getDefault() as RowDto;
            onChange([defaultRow]);
            setActiveRowIndex(0);
        }
    }, [rows.length, isUpdateMode, editMode]);

    useEffect(
        () => () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        },
        []
    );

    useEffect(() => {
        if (editMode === 'open' && rows.length > 0 && onValidationChange) {
            triggerValidationChange(rows);

            rows.forEach((row, index) => {
                validateRowForDisplay(index, row, rows);
            });
        }
    }, []);

    const validateUniqueFields = useCallback(
        (dataToValidate: Partial<RowDto>, currentIndex: number | null = null, dataArray: RowDto[] = rowsRef.current): RowErrors<RowDto> => {
            const errors: Record<string, string> = {};

            fields.forEach((fieldConfig) => {
                if (fieldConfig.unique && fieldConfig.isField !== false) {
                    const fieldName = fieldConfig.attribute as string;
                    const fieldValue = dataToValidate[fieldName as keyof RowDto];

                    if (fieldValue !== null && fieldValue !== undefined && fieldValue !== '') {
                        const isDuplicate = dataArray.some((row, index) => {
                            if (currentIndex !== null && index === currentIndex) return false;
                            const rowValue = row[fieldName as keyof RowDto];
                            if (typeof fieldValue === 'object' && fieldValue !== null) {
                                return typeof rowValue === 'object' && rowValue !== null ? fieldValue.Id === rowValue.Id : false;
                            }
                            return rowValue === fieldValue;
                        });

                        if (isDuplicate) {
                            errors[fieldName] = `${fieldConfig.label} sudah ada, tidak boleh duplikat`;
                        }
                    }
                }
            });

            return errors as RowErrors<RowDto>;
        },
        [fields]
    );

    const triggerValidationChange = useCallback(
        (currentRows: RowDto[]) => {
            if (!onValidationChange) return;

            if (debounceRef.current) clearTimeout(debounceRef.current);

            debounceRef.current = setTimeout(async () => {
                const rowValidations: RowValidation<RowDto>[] = [];
                let allValid = true;

                for (let i = 0; i < currentRows.length; i++) {
                    const row = currentRows[i];
                    const errors: RowErrors<RowDto> = {};
                    let isRowValid = true;

                    try {
                        await schema.validate(row, { abortEarly: false });
                    } catch (err: any) {
                        isRowValid = false;
                        if (err.inner) {
                            err.inner.forEach((e: any) => {
                                if (e.path) errors[e.path as keyof RowDto] = e.message;
                            });
                        }
                    }

                    const uniqueErrors = validateUniqueFields(row, i, currentRows);
                    if (Object.keys(uniqueErrors).length > 0) {
                        isRowValid = false;
                        Object.assign(errors, uniqueErrors);
                    }

                    if (onCustomValidate) {
                        const msg = onCustomValidate(currentRows, row, i);
                        if (msg) {
                            isRowValid = false;
                            errors._custom = msg;
                        }
                    }

                    if (!isRowValid) allValid = false;
                    rowValidations.push({ index: i, isValid: isRowValid, errors });
                }

                onValidationChange(allValid, rowValidations);
            }, 300);
        },
        [onValidationChange, schema, validateUniqueFields, onCustomValidate]
    );

    const validateRowForDisplay = useCallback(
        async (index: number, row: RowDto, allRows: RowDto[]) => {
            const errors: RowErrors<RowDto> = {};

            try {
                await schema.validate(row, { abortEarly: false });
            } catch (err: any) {
                if (err.inner) {
                    err.inner.forEach((e: any) => {
                        if (e.path) errors[e.path as keyof RowDto] = e.message;
                    });
                }
            }

            const uniqueErrors = validateUniqueFields(row, index, allRows);
            Object.assign(errors, uniqueErrors);

            if (onCustomValidate) {
                const msg = onCustomValidate(allRows, row, index);
                if (msg) errors._custom = msg;
            }

            setOpenModeErrors((prev) => {
                const hasErrors = Object.keys(errors).length > 0;

                if (!hasErrors) {
                    if (!prev[index]) return prev;
                    const next = { ...prev };
                    delete next[index];
                    return next;
                }

                const prevErr = prev[index];
                if (prevErr && JSON.stringify(prevErr) === JSON.stringify(errors)) return prev;

                return { ...prev, [index]: errors };
            });
        },
        [schema, validateUniqueFields, onCustomValidate]
    );

    useImperativeHandle(ref, () => ({
        validate: async () => {
            const errors: string[] = [];
            const dataToValidate = rowsRef.current;

            for (let i = 0; i < dataToValidate.length; i++) {
                const row = dataToValidate[i];

                try {
                    await schema.validate(row, { abortEarly: false });
                } catch (err: any) {
                    if (err.inner) {
                        err.inner.forEach((e: any) => {
                            errors.push(`Row ${i + 1} - ${e.message}`);
                        });
                    }
                }

                const uniqueErrors = validateUniqueFields(row, i, dataToValidate);
                Object.values(uniqueErrors).forEach((e) => {
                    if (e) errors.push(`Row ${i + 1} - ${e}`);
                });

                if (onCustomValidate) {
                    const msg = onCustomValidate(dataToValidate, row, i);
                    if (msg) errors.push(`Row ${i + 1} - ${msg}`);
                }
            }

            return { isValid: errors.length === 0, errors };
        },
    }));

    const setEditMultipleValues = useCallback((partial: Partial<RowDto>) => {
        setEditValues((prev) => ({ ...prev, ...partial }));
        setEditErrors((prev) => {
            const next = { ...prev };
            Object.keys(partial).forEach((key) => {
                delete next[key];
            });
            return next;
        });
    }, []);

    const makeSetMultipleValues = useCallback(
        (index: number, mode: 'modal' | 'open' | 'default') => (partial: Partial<RowDto>) => {
            if (mode === 'modal') {
                setEditMultipleValues(partial);
            } else if (mode === 'open') {
                const updatedRows = [...rowsRef.current];
                updatedRows[index] = { ...rowsRef.current[index], ...partial };
                onChange(updatedRows);

                setOpenModeErrors((prev) => {
                    const hasAnyError = prev[index] && Object.keys(partial).some((key) => prev[index][key]);
                    if (!hasAnyError) return prev;

                    const next = { ...prev };
                    const rowErr = { ...next[index] };
                    Object.keys(partial).forEach((key) => {
                        delete rowErr[key];
                    });
                    if (Object.keys(rowErr).length === 0) delete next[index];
                    else next[index] = rowErr;
                    return next;
                });

                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(async () => {
                    const currentRows = [...rowsRef.current];
                    currentRows[index] = { ...rowsRef.current[index], ...partial };
                    await validateRowForDisplay(index, currentRows[index], currentRows);
                    if (onValidationChange) triggerValidationChange(currentRows);
                }, 400);
            } else {
                const updatedRows = [...rowsRef.current];
                updatedRows[index] = { ...rowsRef.current[index], ...partial };
                onChange(updatedRows);
            }
        },
        [onChange, setEditMultipleValues, validateRowForDisplay, triggerValidationChange, onValidationChange]
    );

    // const updateOpenModeRowValue = useCallback(
    //     (index: number, fieldName: keyof RowDto, newValue: any) => {
    //         const currentValue = rowsRef.current[index]?.[fieldName as string];
    //         if (currentValue === newValue) return;
    //         const isEmptyValue = newValue === 0 || newValue === null || newValue === undefined || newValue === '';
    //         const hasRealCurrentValue = currentValue !== 0 && currentValue !== null && currentValue !== undefined && currentValue !== '';
    //         if (isEmptyValue && hasRealCurrentValue) {
    //             return;
    //         }
    //         const updatedRows = [...rowsRef.current];
    //         updatedRows[index] = { ...updatedRows[index], [fieldName]: newValue };
    //         onChange(updatedRows);
    //
    //         setOpenModeErrors((prev) => {
    //             if (!prev[index]?.[fieldName as string]) return prev;
    //             const next = { ...prev };
    //             const rowErr = { ...next[index] };
    //             delete rowErr[fieldName as string];
    //             if (Object.keys(rowErr).length === 0) delete next[index];
    //             else next[index] = rowErr;
    //             return next;
    //         });
    //
    //         if (debounceRef.current) clearTimeout(debounceRef.current);
    //         debounceRef.current = setTimeout(async () => {
    //             await validateRowForDisplay(index, updatedRows[index], updatedRows);
    //             if (onValidationChange) triggerValidationChange(updatedRows);
    //         }, 400);
    //     },
    //     [onChange, validateRowForDisplay, triggerValidationChange, onValidationChange]
    // );

    const updateOpenModeRowValue = useCallback(
        (index: number, fieldName: keyof RowDto, newValue: any) => {
            const currentValue = rowsRef.current[index]?.[fieldName as string];
            if (currentValue === newValue) return;

            const updatedRows = [...rowsRef.current];
            updatedRows[index] = { ...updatedRows[index], [fieldName]: newValue };
            onChange(updatedRows);

            setOpenModeErrors((prev) => {
                if (!prev[index]?.[fieldName as string]) return prev;
                const next = { ...prev };
                const rowErr = { ...next[index] };
                delete rowErr[fieldName as string];
                if (Object.keys(rowErr).length === 0) delete next[index];
                else next[index] = rowErr;
                return next;
            });

            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(async () => {
                await validateRowForDisplay(index, updatedRows[index], updatedRows);
                if (onValidationChange) triggerValidationChange(updatedRows);
            }, 400);
        },
        [onChange, validateRowForDisplay, triggerValidationChange, onValidationChange]
    );

    const handleAddRowOpen = useCallback(() => {
        const newRow = schema.getDefault() as RowDto;
        const updatedRows = [...rowsRef.current, newRow];
        onChange(updatedRows);
        if (onValidationChange) triggerValidationChange(updatedRows);
    }, [schema, onChange, triggerValidationChange, onValidationChange]);

    const handleDeleteOpen = useCallback(
        (row: RowDto, index: number) => {
            if (onBeforeDelete) {
                const result = onBeforeDelete(rowsRef.current, row);
                if (result === false) return;
            }

            const updatedRows = rowsRef.current.filter((_, i) => i !== index);
            onChange(updatedRows);

            setOpenModeErrors((prev) => {
                const next: Record<number, RowErrors<RowDto>> = {};
                Object.entries(prev).forEach(([key, val]) => {
                    const k = Number(key);
                    if (k < index) next[k] = val as RowErrors<RowDto>;
                    else if (k > index) next[k - 1] = val as RowErrors<RowDto>;
                });
                return next;
            });

            if (onAfterDelete) onAfterDelete(updatedRows);
            if (onValidationChange) triggerValidationChange(updatedRows);
        },
        [onBeforeDelete, onChange, onAfterDelete, triggerValidationChange, onValidationChange]
    );

    const updateRowValue = useCallback(
        async (index: number, fieldName: keyof RowDto, newValue: any) => {
            const updatedRows = [...rowsRef.current];
            updatedRows[index] = { ...updatedRows[index], [fieldName]: newValue };
            onChange(updatedRows);

            setRowErrors((prev) => {
                const next = { ...prev };
                if (next[index]) {
                    delete next[index][fieldName as string];
                    if (Object.keys(next[index]).length === 0) delete next[index];
                }
                return next;
            });

            try {
                await schema.validate(updatedRows[index], { abortEarly: false });

                const uniqueErrors = validateUniqueFields(updatedRows[index], index, updatedRows);
                if (Object.keys(uniqueErrors).length > 0) {
                    setRowErrors((prev) => ({ ...prev, [index]: { ...prev[index], ...uniqueErrors } }));
                }

                if (onCustomValidate) {
                    const msg = onCustomValidate(updatedRows, updatedRows[index], index);
                    if (msg) {
                        setRowErrors((prev) => ({ ...prev, [index]: { ...prev[index], _custom: msg } }));
                    }
                }
            } catch (err: any) {
                if (err.inner) {
                    const errors: RowErrors<RowDto> = {};
                    err.inner.forEach((e: any) => {
                        if (e.path) errors[e.path as keyof RowDto] = e.message;
                    });
                    setRowErrors((prev) => ({ ...prev, [index]: { ...prev[index], ...errors } }));
                }
            }
        },
        [onChange, schema, validateUniqueFields, onCustomValidate]
    );

    const handleReset = useCallback(
        (index: number) => {
            const updatedRows = [...rowsRef.current];
            updatedRows[index] = schema.getDefault() as RowDto;
            onChange(updatedRows);
            setRowErrors((prev) => {
                const next = { ...prev };
                delete next[index];
                return next;
            });
        },
        [schema, onChange]
    );

    const handleAddRowDefault = useCallback(async () => {
        const currentRows = rowsRef.current;

        if (activeRowIndex !== null) {
            try {
                await schema.validate(currentRows[activeRowIndex], { abortEarly: false });

                const uniqueErrors = validateUniqueFields(currentRows[activeRowIndex], activeRowIndex, currentRows);
                if (Object.keys(uniqueErrors).length > 0) {
                    setRowErrors((prev) => ({ ...prev, [activeRowIndex]: uniqueErrors }));
                    return;
                }

                if (onCustomValidate) {
                    const msg = onCustomValidate(currentRows, currentRows[activeRowIndex], activeRowIndex);
                    if (msg) {
                        setRowErrors((prev) => ({ ...prev, [activeRowIndex]: customError<RowDto>(msg) }));
                        return;
                    }
                }

                if (onBeforeAdd) {
                    const result = onBeforeAdd(currentRows, currentRows[activeRowIndex]);
                    if (result === false) return;
                }
            } catch (err: any) {
                if (err.inner) {
                    const errors: RowErrors<RowDto> = {};
                    err.inner.forEach((e: any) => {
                        if (e.path) errors[e.path as keyof RowDto] = e.message;
                    });
                    setRowErrors((prev) => ({ ...prev, [activeRowIndex]: errors }));
                }
                return;
            }
        }

        const newRow = schema.getDefault() as RowDto;
        const updatedRows = [...currentRows, newRow];
        onChange(updatedRows);
        setActiveRowIndex(updatedRows.length - 1);
        if (onAfterAdd) onAfterAdd(updatedRows);
    }, [activeRowIndex, schema, validateUniqueFields, onCustomValidate, onBeforeAdd, onAfterAdd, onChange]);

    const handleStartEditDefault = useCallback((index: number) => {
        setActiveRowIndex(null);
        setEditingIndex(index);
        setEditValues({ ...rowsRef.current[index] });
        setEditErrors({});
    }, []);

    const handleCancelEditDefault = useCallback(() => {
        setEditingIndex(null);
        setEditValues({});
        setEditErrors({});
    }, []);

    const handleSaveEditDefault = useCallback(
        async (index: number) => {
            setIsSubmitting(true);
            try {
                const validatedRow = (await schema.validate(editValues, { abortEarly: false })) as RowDto;
                const currentRows = rowsRef.current;

                const uniqueErrors = validateUniqueFields(validatedRow, index, currentRows);
                if (Object.keys(uniqueErrors).length > 0) {
                    setEditErrors(uniqueErrors);
                    return;
                }

                if (onCustomValidate) {
                    const msg = onCustomValidate(currentRows, validatedRow, index);
                    if (msg) {
                        setEditErrors(customError<RowDto>(msg));
                        return;
                    }
                }

                setEditErrors({});

                if (onBeforeUpdate) {
                    const result = onBeforeUpdate(currentRows, currentRows[index], validatedRow, index);
                    if (result === false) return;
                }

                const updatedRows = [...currentRows];
                updatedRows[index] = validatedRow;
                onChange(updatedRows);
                setEditingIndex(null);
                setEditValues({});
                if (onAfterUpdate) onAfterUpdate(updatedRows);
            } catch (err: any) {
                if (err.inner) {
                    const errors: RowErrors<RowDto> = {};
                    err.inner.forEach((e: any) => {
                        if (e.path) errors[e.path as keyof RowDto] = e.message;
                    });
                    setEditErrors(errors);
                }
            } finally {
                setIsSubmitting(false);
            }
        },
        [editValues, schema, validateUniqueFields, onCustomValidate, onBeforeUpdate, onAfterUpdate, onChange]
    );

    const handleDeleteDefault = useCallback(
        (row: RowDto, index: number) => {
            const currentRows = rowsRef.current;

            if (onBeforeDelete) {
                const result = onBeforeDelete(currentRows, row);
                if (result === false) return;
            }

            const filtered = currentRows.filter((_, i) => i !== index);

            if (filtered.length === 0) {
                const defaultRow = schema.getDefault() as RowDto;
                onChange([defaultRow]);
                setActiveRowIndex(0);
            } else {
                onChange(filtered);
                if (activeRowIndex === index) setActiveRowIndex(null);
                else if (activeRowIndex !== null && activeRowIndex > index) setActiveRowIndex(activeRowIndex - 1);
            }

            setRowErrors((prev) => {
                const next = { ...prev };
                delete next[index];
                return next;
            });

            if (onAfterDelete) onAfterDelete(filtered);

            if (editingIndex === index) {
                setEditingIndex(null);
                setEditValues({});
            }
        },
        [onBeforeDelete, schema, onChange, activeRowIndex, onAfterDelete, editingIndex]
    );

    const handleAddRowModal = useCallback(() => {
        setModalMode('create');
        setModalEditIndex(null);
        setEditValues(schema.getDefault() as RowDto);
        setEditErrors({});
        setDataSnapshot([...rowsRef.current]);
        setModalOpen(true);
    }, [schema]);

    const handleStartEditModal = useCallback((index: number) => {
        setModalMode('edit');
        setModalEditIndex(index);
        setEditValues({ ...rowsRef.current[index] });
        setEditErrors({});
        setDataSnapshot([...rowsRef.current]);
        setModalOpen(true);
    }, []);

    const handleCancelModal = useCallback(() => {
        if (dataSnapshot !== null) {
            onChange(dataSnapshot);
            setDataSnapshot(null);
        }
        setModalOpen(false);
        setEditValues({});
        setEditErrors({});
        setModalEditIndex(null);
    }, [dataSnapshot, onChange]);

    const handleSubmitModal = useCallback(async () => {
        setIsSubmitting(true);
        try {
            const validatedRow = (await schema.validate(editValues, { abortEarly: false })) as RowDto;
            const currentRows = rowsRef.current;

            const uniqueErrors = validateUniqueFields(validatedRow, modalEditIndex, currentRows);
            if (Object.keys(uniqueErrors).length > 0) {
                setEditErrors(uniqueErrors);
                return;
            }

            if (onCustomValidate) {
                const msg = onCustomValidate(currentRows, validatedRow, modalEditIndex ?? currentRows.length);
                if (msg) {
                    setEditErrors(customError<RowDto>(msg));
                    return;
                }
            }

            setEditErrors({});

            if (onModalSubmit) {
                onModalSubmit(validatedRow, modalMode, modalEditIndex, {
                    onSuccess: (updatedRow) => {
                        const finalRow = updatedRow ? { ...validatedRow, ...updatedRow } : validatedRow;

                        if (modalMode === 'create') {
                            const updatedRows = [...currentRows, finalRow as RowDto];
                            onChange(updatedRows);
                            if (onAfterAdd) onAfterAdd(updatedRows);
                        } else if (modalEditIndex !== null) {
                            const updatedRows = [...currentRows];
                            updatedRows[modalEditIndex] = finalRow as RowDto;
                            onChange(updatedRows);
                            if (onAfterUpdate) onAfterUpdate(updatedRows);
                        }

                        setDataSnapshot(null);
                        setModalOpen(false);
                        setEditValues({});
                        setModalEditIndex(null);
                        setIsSubmitting(false);
                    },
                    onError: (errors) => {
                        setEditErrors(errors);
                        setIsSubmitting(false);
                    },
                    setSubmitting: (loading) => {
                        setIsSubmitting(loading);
                    },
                });
                return;
            }

            if (modalMode === 'create') {
                if (onBeforeAdd) {
                    const result = onBeforeAdd(currentRows, validatedRow);
                    if (result === false) return;
                }
                const updatedRows = [...currentRows, validatedRow];
                onChange(updatedRows);
                if (onAfterAdd) onAfterAdd(updatedRows);
            } else {
                if (modalEditIndex !== null) {
                    if (onBeforeUpdate) {
                        const result = onBeforeUpdate(currentRows, currentRows[modalEditIndex], validatedRow, modalEditIndex);
                        if (result === false) return;
                    }
                    const updatedRows = [...currentRows];
                    updatedRows[modalEditIndex] = validatedRow;
                    onChange(updatedRows);
                    if (onAfterUpdate) onAfterUpdate(updatedRows);
                }
            }

            setDataSnapshot(null);
            setModalOpen(false);
            setEditValues({});
            setModalEditIndex(null);
        } catch (err: any) {
            if (err.inner) {
                const errors: RowErrors<RowDto> = {};
                err.inner.forEach((e: any) => {
                    if (e.path) errors[e.path as keyof RowDto] = e.message;
                });
                setEditErrors(errors);
            }
        } finally {
            if (!onModalSubmit) setIsSubmitting(false);
        }
    }, [editValues, schema, validateUniqueFields, modalEditIndex, modalMode, onCustomValidate, onBeforeAdd, onAfterAdd, onBeforeUpdate, onAfterUpdate, onChange, onModalSubmit]);

    const setEditValue = useCallback((fieldName: keyof RowDto, valueEdit: any) => {
        setEditValues((prev) => ({ ...prev, [fieldName]: valueEdit }));
        setEditErrors((prev) => {
            if (!prev[fieldName as string]) return prev;
            const next = { ...prev };
            delete next[fieldName as string];
            return next;
        });
    }, []);

    const formatDisplayValue = (v: any): string => {
        if (v === null || v === undefined) return '-';
        if (typeof v === 'object') return v.Name || v.Code || v.label || '-';
        return String(v);
    };

    const formatDisplayValueOrTable = (valueDisplay: any, fieldConfig: FieldConfig<RowDto>): React.ReactNode => {
        if (valueDisplay === null || valueDisplay === undefined) return '-';

        if (fieldConfig.displayFormat) return fieldConfig.displayFormat(valueDisplay, fieldConfig);

        if (Array.isArray(valueDisplay) && fieldConfig.displayFields) {
            if (valueDisplay.length === 0) {
                return <Box sx={{ p: 1, color: 'text.secondary', fontSize: 14 }}>No data</Box>;
            }
            return (
                <TableContainer sx={{ maxHeight: 300 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {fieldConfig.displayFields.map((df, i) => (
                                    <TableCell key={i} sx={{ width: df.width }}>
                                        {df.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {valueDisplay.map((item: any, idx: number) => (
                                <TableRow key={idx}>
                                    {fieldConfig.displayFields!.map((df, i) => (
                                        <TableCell key={i}>{df.format ? df.format(item[df.attribute]) : formatDisplayValue(item[df.attribute])}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        }

        if (typeof valueDisplay === 'object') {
            return valueDisplay.Name || valueDisplay.Code || valueDisplay.label || JSON.stringify(valueDisplay);
        }

        return String(valueDisplay);
    };

    const isRowActive = (index: number) => index === activeRowIndex && editingIndex === null;

    const handleAddRow = editMode === 'modal' ? handleAddRowModal : editMode === 'open' ? handleAddRowOpen : handleAddRowDefault;

    const renderMobileCard = (row: RowDto, index: number) => {
        const isEditing = editingIndex === index;
        const isActive = isRowActive(index);
        const isOpenMode = editMode === 'open';
        const isActionAllowed = allowActionPerRow ? allowActionPerRow(row, index) : true;

        return (
            <Card
                key={`mobile-row-${index}`}
                sx={{
                    my: 2,
                    mx: 1,
                    p: 2,
                    boxShadow: 2,
                    borderRadius: 2,
                    border: isEditing || isOpenMode ? 2 : 1,
                    borderColor: isEditing || isOpenMode ? 'primary.main' : isActive ? 'action.hover' : 'divider',
                    backgroundColor: isEditing || isOpenMode ? 'action.selected' : isActive ? 'action.hover' : 'inherit',
                    transition: 'all 0.2s',
                    '&:hover': { boxShadow: 4, borderColor: 'primary.light' },
                }}
            >
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 2, display: 'block' }}>
                    Row #{index + 1}
                </Typography>

                <Stack spacing={2}>
                    {fields.map((fieldConfig, idx) => {
                        const isFieldEditable = fieldConfig.isField !== false;
                        const errorDefault = isActive ? rowErrors[index]?.[fieldConfig.attribute as string] : undefined;
                        const errorOpen = isOpenMode ? openModeErrors[index]?.[fieldConfig.attribute as string] : undefined;

                        return (
                            <Box key={String(fieldConfig.attribute) + idx}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {fieldConfig.label}
                                </Typography>

                                {isFieldEditable ? (
                                    isOpenMode ? (
                                        fieldConfig.field(row[fieldConfig.attribute as keyof RowDto] ?? '', (v: any) => updateOpenModeRowValue(index, fieldConfig.attribute as keyof RowDto, v), errorOpen, row, index, makeSetMultipleValues(index, 'open'))
                                    ) : editMode === 'default' ? (
                                        isEditing ? (
                                            fieldConfig.field(editValues[fieldConfig.attribute as keyof RowDto] ?? '', (v: any) => setEditValue(fieldConfig.attribute as keyof RowDto, v), editErrors[fieldConfig.attribute as string], editValues, index, setEditMultipleValues)
                                        ) : isActive ? (
                                            fieldConfig.field(row[fieldConfig.attribute as keyof RowDto] ?? '', (v: any) => updateRowValue(index, fieldConfig.attribute as keyof RowDto, v), errorDefault, row, index, makeSetMultipleValues(index, 'default'))
                                        ) : (
                                            <Box sx={{ p: 1, bgcolor: 'background.neutral', borderRadius: 1 }}>{formatDisplayValueOrTable(row[fieldConfig.attribute as keyof RowDto], fieldConfig)}</Box>
                                        )
                                    ) : (
                                        <Box sx={{ p: 1, bgcolor: 'background.neutral', borderRadius: 1 }}>{formatDisplayValueOrTable(row[fieldConfig.attribute as keyof RowDto], fieldConfig)}</Box>
                                    )
                                ) : (
                                    <Box sx={{ p: 1, bgcolor: 'background.neutral', borderRadius: 1 }}>{fieldConfig.field(row, undefined, undefined, row, index)}</Box>
                                )}
                            </Box>
                        );
                    })}
                </Stack>

                {((allowActionPerRow && allowAction) || (extraActions && extraActions.length > 0)) && <Divider sx={{ my: 2 }} />}

                {((allowActionPerRow && allowAction) || (extraActions && extraActions.length > 0)) && (
                    <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                        {extraActions?.map((action, actionIdx) => {
                            const shouldShow = action.show ? action.show(row, index) : true;
                            if (!shouldShow) return null;
                            return (
                                <Tooltip key={actionIdx} title={action.tooltip ?? ''}>
                                    <IconButton onClick={() => action.onClick(row, index)} color={action.color ?? 'default'} size="small">
                                        {action.icon}
                                    </IconButton>
                                </Tooltip>
                            );
                        })}

                        {allowAction && (
                            <>
                                {isOpenMode ? (
                                    allowDelete && (
                                        <IconButton onClick={() => handleDeleteOpen(row, index)} color="error" size="small">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    )
                                ) : editMode === 'default' ? (
                                    isEditing ? (
                                        <>
                                            <Button onClick={() => handleSaveEditDefault(index)} disabled={isSubmitting} variant="contained" color="success" size="small" startIcon={<SaveIcon />}>
                                                Save
                                            </Button>
                                            <Button onClick={handleCancelEditDefault} disabled={isSubmitting} variant="outlined" color="inherit" size="small" startIcon={<CancelIcon />}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : isActive ? (
                                        <>
                                            <IconButton onClick={() => handleReset(index)} color="warning" size="small">
                                                <RestartAltIcon fontSize="small" />
                                            </IconButton>
                                            {allowDelete && rows.length > 1 && (
                                                <IconButton onClick={() => handleDeleteDefault(row, index)} color="error" size="small">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {allowUpdate && (
                                                <IconButton onClick={() => handleStartEditDefault(index)} color="primary" size="small">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                            {allowDelete && rows.length > 1 && (
                                                <IconButton onClick={() => handleDeleteDefault(row, index)} color="error" size="small">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </>
                                    )
                                ) : (
                                    <>
                                        {allowUpdate && (
                                            <IconButton onClick={() => handleStartEditModal(index)} color="primary" size="small">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                        {allowDelete && (
                                            <IconButton onClick={() => handleDeleteDefault(row, index)} color="error" size="small">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </Stack>
                )}
            </Card>
        );
    };

    const renderDesktopTable = () => (
        <TableContainer
            component={Paper}
            sx={{
                overflow: 'auto',
                '& ::-webkit-scrollbar': { height: 8, width: 8 },
                '& ::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
                '& ::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: 2 },
                boxShadow: 3,
                borderRadius: 1,
            }}
        >
            <Table sx={{ tableLayout: 'auto' }}>
                <TableHead>
                    <TableRow>
                        {fields.map((fieldConfig, idx) => (
                            <TableCell key={String(fieldConfig.attribute) + idx} sx={{ width: fieldConfig.width || 'auto', minWidth: fieldConfig.width || 150 }}>
                                {fieldConfig.label}
                            </TableCell>
                        ))}
                        {(allowAction || (extraActions && extraActions.length > 0)) && (
                            <TableCell width={100} align="center">
                                Action
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((row: RowDto, index: number) => {
                        const isEditing = editingIndex === index;
                        const isActive = isRowActive(index);
                        const isOpenMode = editMode === 'open';
                        const isActionAllowed = allowActionPerRow ? allowActionPerRow(row, index) : true;

                        return (
                            <TableRow
                                key={index}
                                sx={{
                                    backgroundColor: isEditing || isOpenMode ? 'action.selected' : isActive ? 'action.hover' : 'inherit',
                                }}
                            >
                                {fields.map((fieldConfig, idx) => {
                                    const isFieldEditable = fieldConfig.isField !== false;
                                    const errorDefault = isActive ? rowErrors[index]?.[fieldConfig.attribute as string] : undefined;
                                    const errorOpen = isOpenMode ? openModeErrors[index]?.[fieldConfig.attribute as string] : undefined;

                                    return (
                                        <TableCell
                                            key={String(fieldConfig.attribute) + idx}
                                            sx={{
                                                py: (isEditing || isActive || isOpenMode) && editMode !== 'modal' ? 1 : 2,
                                                width: fieldConfig.width || 'auto',
                                                minWidth: fieldConfig.width || 150,
                                            }}
                                        >
                                            {isFieldEditable
                                                ? isOpenMode
                                                    ? fieldConfig.field(row[fieldConfig.attribute as keyof RowDto] ?? '', (v: any) => updateOpenModeRowValue(index, fieldConfig.attribute as keyof RowDto, v), errorOpen, row, index, makeSetMultipleValues(index, 'open'))
                                                    : editMode === 'default'
                                                      ? isEditing
                                                          ? fieldConfig.field(editValues[fieldConfig.attribute as keyof RowDto] ?? '', (v: any) => setEditValue(fieldConfig.attribute as keyof RowDto, v), editErrors[fieldConfig.attribute as string], editValues, index, setEditMultipleValues)
                                                          : isActive
                                                            ? fieldConfig.field(row[fieldConfig.attribute as keyof RowDto] ?? '', (v: any) => updateRowValue(index, fieldConfig.attribute as keyof RowDto, v), errorDefault, row, index, makeSetMultipleValues(index, 'default'))
                                                            : formatDisplayValueOrTable(row[fieldConfig.attribute as keyof RowDto], fieldConfig)
                                                      : formatDisplayValueOrTable(row[fieldConfig.attribute as keyof RowDto], fieldConfig)
                                                : fieldConfig.field(row, undefined, undefined, row, index)}
                                        </TableCell>
                                    );
                                })}

                                {((isActionAllowed && allowAction) || (extraActions && extraActions.length > 0)) && (
                                    <TableCell align="center" sx={{ py: 1 }}>
                                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                                            {extraActions?.map((action, actionIdx) => {
                                                const shouldShow = action.show ? action.show(row, index) : true;
                                                if (!shouldShow) return null;
                                                return (
                                                    <Tooltip key={actionIdx} title={action.tooltip ?? ''}>
                                                        <IconButton onClick={() => action.onClick(row, index)} color={action.color ?? 'default'} size="small">
                                                            {action.icon}
                                                        </IconButton>
                                                    </Tooltip>
                                                );
                                            })}

                                            {allowAction && (
                                                <>
                                                    {isOpenMode ? (
                                                        allowDelete && (
                                                            <IconButton onClick={() => handleDeleteOpen(row, index)} color="error" size="small">
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        )
                                                    ) : editMode === 'default' ? (
                                                        isEditing ? (
                                                            <>
                                                                <IconButton onClick={() => handleSaveEditDefault(index)} disabled={isSubmitting} color="success" size="small">
                                                                    <SaveIcon fontSize="small" />
                                                                </IconButton>
                                                                <IconButton onClick={handleCancelEditDefault} disabled={isSubmitting} color="default" size="small">
                                                                    <CancelIcon fontSize="small" />
                                                                </IconButton>
                                                            </>
                                                        ) : isActive ? (
                                                            <>
                                                                <IconButton onClick={() => handleReset(index)} color="warning" size="small">
                                                                    <RestartAltIcon fontSize="small" />
                                                                </IconButton>
                                                                {allowDelete && rows.length > 1 && (
                                                                    <IconButton onClick={() => handleDeleteDefault(row, index)} color="error" size="small">
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {allowUpdate && (
                                                                    <IconButton onClick={() => handleStartEditDefault(index)} color="primary" size="small">
                                                                        <EditIcon fontSize="small" />
                                                                    </IconButton>
                                                                )}
                                                                {allowDelete && rows.length > 1 && (
                                                                    <IconButton onClick={() => handleDeleteDefault(row, index)} color="error" size="small">
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                )}
                                                            </>
                                                        )
                                                    ) : (
                                                        <>
                                                            {allowUpdate && (
                                                                <IconButton onClick={() => handleStartEditModal(index)} color="primary" size="small">
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            )}
                                                            {allowDelete && (
                                                                <IconButton onClick={() => handleDeleteDefault(row, index)} color="error" size="small">
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </Box>
                                    </TableCell>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Box sx={{ position: 'relative', my: 2 }}>
            {allowAdd && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddRow} disabled={isSubmitting || (editMode === 'default' && editingIndex !== null)}>
                        {addButtonLabel}
                    </Button>
                </Box>
            )}

            {isMobile ? <Box sx={{ py: 1 }}>{rows.map((row, index) => renderMobileCard(row, index))}</Box> : renderDesktopTable()}

            {editMode === 'modal' && (
                <Dialog open={modalOpen} fullWidth maxWidth="lg" fullScreen={isMobile}>
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6">
                            {modalMode === 'create' ? 'Create' : 'Update'} {modalTitle}
                        </Typography>
                        <IconButton onClick={handleCancelModal} size="small">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers>
                        <Stack spacing={3} sx={{ py: 2 }}>
                            {fields.map((fieldConfig, idx) => (
                                <Box key={String(fieldConfig.attribute) + idx}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                        {fieldConfig.label}
                                    </Typography>
                                    {fieldConfig.field(editValues[fieldConfig.attribute as keyof RowDto] ?? '', (v: any) => setEditValue(fieldConfig.attribute as keyof RowDto, v), editErrors[fieldConfig.attribute as string], editValues, modalEditIndex ?? undefined, setEditMultipleValues)}
                                </Box>
                            ))}

                            {editErrors._custom && (
                                <Box sx={{ p: 2, bgcolor: 'error.lighter', borderRadius: 1 }}>
                                    <Typography color="error" variant="body2">
                                        {editErrors._custom}
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, py: 2 }}>
                        <Button onClick={handleCancelModal} disabled={isSubmitting} color="error" startIcon={<CancelIcon />}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitModal} variant="contained" disabled={isSubmitting} color="success" startIcon={<SaveIcon />}>
                            {isSubmitting ? 'Saving...' : 'Submit'}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export const MultipleInput = forwardRef(MultipleInputInner) as <RowDto extends Record<string, any>>(props: MultipleInputProps<RowDto> & { ref?: React.Ref<MultipleInputRef> }) => React.ReactElement;
