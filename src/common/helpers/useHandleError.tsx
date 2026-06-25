import type { Path, FieldValues, UseFormSetError } from 'react-hook-form';

type ValidationErrors = {
    [field: string]: string[];
};

interface ErrorResponse {
    Errors?: {
        Validation?: ValidationErrors;
    };
    Message?: string;
}

const handleResponseError = (data: ErrorResponse): string => {
    if (data?.Errors?.Validation && Object.keys(data.Errors.Validation).length > 0) {
        const messages = Object.entries(data.Errors.Validation).map(([field, errors]) => {
            const joinedErrors = Array.isArray(errors) ? errors.join(', ') : String(errors);
            return `${field}: ${joinedErrors}`;
        });

        return messages.join('\n');
    }

    return data?.Message ?? 'Unknown error occurred';
};

const handleError = (data: any) => {
    if (data?.response?.status === 401) {
        sessionStorage.clear();
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
    }
};

const handleResponseErrorToast = (data: ErrorResponse, toastFn: (msg: string) => void) => {
    if (data?.Errors?.Validation && Object.keys(data.Errors.Validation).length > 0) {
        Object.entries(data.Errors.Validation).forEach(([field, errors]) => {
            const messages = Array.isArray(errors) ? errors : [String(errors)];
            messages.forEach((msg) => {
                toastFn(`field ${field} = ${msg}`);
            });
        });
    } else if (data?.Message) {
        toastFn(data.Message);
    } else {
        toastFn('Terjadi kesalahan.');
    }
};

type ApiErrorResponse = {
    Errors?: {
        Validation?: Record<string, string[]>;
    };
};

export function handleResponseErrorRfh<T extends FieldValues>(
    errorResponse: ApiErrorResponse,
    setError: UseFormSetError<T>
) {
    const validationErrors = errorResponse?.Errors?.Validation;
    if (!validationErrors) return;

    Object.entries(validationErrors).forEach(([field, messages]) => {
        const message = Array.isArray(messages) ? messages.join(', ') : String(messages);
        setError(field as Path<T>, { type: 'server', message });
    });
}

export { handleError, handleResponseError, handleResponseErrorToast };
