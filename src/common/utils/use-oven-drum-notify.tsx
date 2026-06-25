import dayjs from 'dayjs';
import { toast } from 'sonner';
import React, { useRef, useEffect } from 'react';

import { Box, Typography } from '@mui/material';

export const playShipHorn = () => {
    const ctx = new AudioContext();

    const playHorn = (startTime: number, duration: number) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const gainLfo = ctx.createGain();

        osc3.type = 'sine';
        osc3.frequency.value = 5;
        gainLfo.gain.value = 8;
        osc3.connect(gainLfo);
        gainLfo.connect(osc1.frequency);

        osc1.type = 'sawtooth';
        osc1.frequency.value = 120;
        osc2.type = 'sawtooth';
        osc2.frequency.value = 240;

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.6, startTime + 0.3);
        gainNode.gain.setValueAtTime(0.6, startTime + duration - 0.3);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

        osc1.start(startTime);
        osc2.start(startTime);
        osc3.start(startTime);
        osc1.stop(startTime + duration);
        osc2.stop(startTime + duration);
        osc3.stop(startTime + duration);
    };

    const cycle = 4;
    const totalCycles = Math.floor(10 / cycle);
    for (let i = 0; i < totalCycles; i++) {
        const base = i * cycle;
        playHorn(ctx.currentTime + base, 2.5);
    }
};

export const useNotifyEndRows = (rows: any[], plantLabel: string) => {
    const notifiedIds = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!rows?.length) {
            return undefined;
        }

        const interval = setInterval(() => {
            const now = dayjs();

            rows.forEach((row) => {
                if (!row?.End || row?.Status !== 'New') return;
                if (notifiedIds.current.has(row.Id)) return;

                const end = dayjs(row.End);
                const diffSeconds = Math.abs(now.diff(end, 'second'));

                if (diffSeconds <= 30) {
                    notifiedIds.current.add(row.Id);

                    playShipHorn();

                    toast.info(
                        <Box>
                            <Typography variant="subtitle2">⏰ Waktu Selesai! - {plantLabel}</Typography>
                            <Typography variant="body2">Material: {row.Material?.Name}</Typography>
                            <Typography variant="body2">Chamber: {row.Chamber}</Typography>
                            <Typography variant="body2">End: {dayjs(row.End).format('HH:mm, DD MMM YYYY')}</Typography>
                            <Typography variant="body2">
                                Quantity: {row.Quantity} {row.Material?.UnitLabel}
                            </Typography>
                        </Box>,
                        { duration: 10000, position: 'top-right' }
                    );
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [rows]);
};
