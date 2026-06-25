import { Icon } from '@iconify/react';
import { useRef, useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Box, Stack, Button, Tooltip, TextField, Typography, IconButton } from '@mui/material';

type MultipleTextFieldArrayProps = {
    name: string;
    label?: string;
    minRows: number;
};

export const FieldMultipleInput = ({ name, label = 'Field', minRows = 1 }: MultipleTextFieldArrayProps) => {
    const {
        control,
        register,
        trigger,
        formState: { errors },
    } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name });

    const didInitialize = useRef(false);

    const getFieldError = (index: number) => {
        const path = name.split('.');
        const fieldErrors = (errors as any)[path[0]]?.[path[1]]?.[index]?.value;
        return fieldErrors?.message || '';
    };

    function getArrayErrorMessage(error: any, names: string) {
        const segments = names.split('.');
        let obj = error;
        for (const key of segments) {
            obj = obj?.[key];
        }
        return typeof obj?.message === 'string' ? obj.message : '';
    }

    const handleRemove = async (index: number) => {
        remove(index);
        await trigger(name);
    };

    const handleAppend = async () => {
        append({ value: '' });
        await trigger(name);
    };

    useEffect(() => {
        if (!didInitialize.current && fields.length < minRows) {
            for (let i = fields.length; i < minRows; i++) {
                append({ value: '' }); // sesuaikan struktur data
            }
            didInitialize.current = true;
        }
    }, [append, fields.length, minRows]);

    return (
        <Stack spacing={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{label}</Typography>
                <Button
                    variant="contained"
                    color="info"
                    startIcon={<Icon icon="mdi:plus" width={20} height={20} />}
                    onClick={handleAppend}
                >
                    Add
                </Button>
            </Box>

            {fields.map((field, index) => (
                <Box key={field.id} display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" gap={2}>
                        <TextField
                            fullWidth
                            label={`${label} ${index + 1}`}
                            {...register(`${name}.${index}.value`)}
                            error={!!getFieldError(index)}
                        />

                        <Tooltip title="Delete">
                            <IconButton
                                color="error"
                                onClick={() => handleRemove(index)}
                                disabled={fields.length === 1}
                                size="small"
                            >
                                <Icon icon="mdi:delete" width={30} height={30} />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {getFieldError(index) && (
                        <Typography color="error" variant="caption" ml={1}>
                            {getFieldError(index)}
                        </Typography>
                    )}
                </Box>
            ))}

            {/* Error Array */}
            {getArrayErrorMessage(errors, name) && (
                <Typography color="error" variant="body2">
                    {getArrayErrorMessage(errors, name)}
                </Typography>
            )}
        </Stack>
    );
};
