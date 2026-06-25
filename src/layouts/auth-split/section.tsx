import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';

import Box from '@mui/material/Box';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export type AuthSplitSectionProps = BoxProps & {
    title?: string;
    method?: string;
    imgUrl?: string;
    subtitle?: string;
    layoutQuery?: Breakpoint;
    methods?: {
        path: string;
        icon: string;
        label: string;
    }[];
};

export function AuthSplitSection({ sx, method, methods, layoutQuery = 'lg', imgUrl = `${CONFIG.assetsDir}/assets/background/background-login-SIAP.png`, ...other }: AuthSplitSectionProps) {
    const logo = `${CONFIG.assetsDir}/logo/logo-curved.png`;

    return (
        <Box
            sx={[
                (theme) => ({
                    position: 'relative', // 🔑 KEY PART
                    height: '100vh',
                    width: '100%',
                    backgroundImage: `url(${imgUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    maxWidth: '65%',
                    overflow: 'auto',
                    pt: 'var(--layout-header-desktop-height)',
                    display: 'none',
                    [theme.breakpoints.up(layoutQuery)]: {
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    },
                }),
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
        >
            <Box
                component="img"
                src={logo}
                alt="logo"
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 256,
                    height: 'auto',
                    zIndex: 1,
                    // clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0%, 0 50%)',
                }}
            />

            {/*{!!methods?.length && method && (*/}
            {/*  <Box component="ul" sx={{ gap: 2, display: 'flex' }}>*/}
            {/*    {methods.map((option) => {*/}
            {/*      const selected = method === option.label.toLowerCase();*/}

            {/*      return (*/}
            {/*        <Box*/}
            {/*          key={option.label}*/}
            {/*          component="li"*/}
            {/*          sx={{*/}
            {/*            ...(!selected && {*/}
            {/*              cursor: 'not-allowed',*/}
            {/*              filter: 'grayscale(1)',*/}
            {/*            }),*/}
            {/*          }}*/}
            {/*        >*/}
            {/*          <Tooltip title={option.label} placement="top">*/}
            {/*            <Link component={RouterLink} href={option.path} sx={{ ...(!selected && { pointerEvents: 'none' }) }}>*/}
            {/*              <Box component="img" alt={option.label} src={option.icon} sx={{ width: 32, height: 32 }} />*/}
            {/*            </Link>*/}
            {/*          </Tooltip>*/}
            {/*        </Box>*/}
            {/*      );*/}
            {/*    })}*/}
            {/*  </Box>*/}
            {/*)}*/}
        </Box>
    );
}
