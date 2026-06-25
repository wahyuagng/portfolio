import { useRef, useState, useCallback } from 'react';

export const useQueue = () => {
    const [loading, setLoading] = useState(false);
    const queueRef = useRef<(() => Promise<void>)[]>([]);
    const isRunningRef = useRef(false);

    const runQueue = useCallback(async () => {
        if (isRunningRef.current) return;
        isRunningRef.current = true;
        setLoading(true);

        while (queueRef.current.length > 0) {
            const task = queueRef.current.shift();
            if (task) await task();
        }

        isRunningRef.current = false;
        setLoading(false);
    }, []);

    const enqueue = useCallback(
        (...tasks: (() => Promise<void>)[]) => {
            queueRef.current.push(...tasks);
            void runQueue();
        },
        [runQueue],
    );

    return { enqueue, loading };
};
