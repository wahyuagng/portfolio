import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuthContext } from '@auth/hooks';
import { varBounce } from '@components/animate';

import Box from '@mui/material/Box';
import { Divider } from '@mui/material';
import Typography from '@mui/material/Typography';

export function CheckRoleView() {
    const { profile } = useAuthContext();
    const [message, setMessage] = useState<any>('');

    useEffect(() => {
        if (!profile?.Role) {
            setMessage('Please contact admin to set the role');
        } else {
            setMessage('Please contact admin to set the role');
        }
    }, []);
    return (
        <>
            <Box sx={{ textAlign: 'center' }}>
                <Box
                    component="img"
                    src="/logo/original/logo-qi.png"
                    alt="logo"
                    sx={{
                        width: '150px',
                        height: 'auto',
                        mx: 'auto',
                        mb: 10,
                    }}
                />
            </Box>
            <m.div variants={varBounce('in')}>
                <Typography variant="h5" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                    {message}
                </Typography>
                <Divider />
            </m.div>
            <Box />
        </>
    );
}
