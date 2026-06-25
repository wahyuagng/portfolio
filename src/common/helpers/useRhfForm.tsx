import type * as Yup from 'yup';
import type { BaseSyntheticEvent } from 'react';
import type { Path, FieldValues, DeepPartial, DefaultValues, UseFormTrigger, UseFormRegister, UseFormSetError, UseFormClearErrors } from 'react-hook-form';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export type FormHelperReturn<T extends FieldValues> = {
    values: T;
    errors: Partial<Record<keyof T, any>>;
    handleSubmit: (e?: BaseSyntheticEvent) => void;
    setFieldValue: (name: Path<T>, value: any) => void;
    setValues: (dto: DeepPartial<T>) => void;
    reset: () => void;
    register: UseFormRegister<T>;
    setError: UseFormSetError<T>;
    clearErrors: UseFormClearErrors<T>;
    isSubmitting: boolean;
    trigger: UseFormTrigger<T>;
};

/**
 * Hook helper untuk RHF + Yup
 * @param options.validationSchema Yup schema
 * @param options.initialValues defaultValues (opsional)
 * @param options.onSubmit callback submit
 */
export function useRhfForm<T extends FieldValues>(options: { validationSchema: Yup.ObjectSchema<any>; initialValues?: DefaultValues<T>; onSubmit: (values: T, helpers: { resetForm: () => void; setError: UseFormSetError<T> }) => void }): FormHelperReturn<T> {
    type SchemaValues = Yup.InferType<typeof options.validationSchema>;

    type _Check = T extends SchemaValues ? (SchemaValues extends T ? true : never) : never;
    void (null as unknown as _Check);

    const {
        handleSubmit,
        register,
        setValue,
        setError,
        clearErrors,
        reset,
        trigger,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<SchemaValues>({
        defaultValues: options.initialValues ?? (options.validationSchema.getDefault() as DefaultValues<SchemaValues>),
        resolver: yupResolver(options.validationSchema),
        // mode: 'onChange',
        // reValidateMode: 'onChange',
    });

    const wrappedHandleSubmit = handleSubmit((values) =>
        options.onSubmit(values as T, {
            resetForm: reset,
            setError,
        })
    );

    return {
        values: watch() as T,
        errors: errors as Partial<Record<keyof T, any>>,
        handleSubmit: wrappedHandleSubmit,
        setFieldValue: (name, value) =>
            setValue(name as Path<SchemaValues>, value, {
                shouldValidate: true,
                // shouldTouch: true,
                // shouldDirty: true,
            }),
        setValues: (dto: DeepPartial<T>) => {
            reset(dto as any, {
                keepErrors: true,
                keepDirty: true,
                keepTouched: true,
            });
        },
        reset,
        register: register as UseFormRegister<T>,
        setError: setError as UseFormSetError<T>,
        clearErrors: clearErrors as UseFormClearErrors<T>,
        isSubmitting,
        trigger: trigger as UseFormTrigger<T>,
    };
}
