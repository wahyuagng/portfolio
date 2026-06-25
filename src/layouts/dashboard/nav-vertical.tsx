import type { Breakpoint } from '@mui/material/styles';
import type { NavSectionProps } from 'src/components/nav-section';

import { useSettingsContext } from '@components/settings';
import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import { styled, useColorScheme } from '@mui/material/styles';

import { Scrollbar } from 'src/components/scrollbar';
import { NavSectionMini, NavSectionVertical } from 'src/components/nav-section';

import { layoutClasses } from '../core';
import { NavToggleButton } from '../components/nav-toggle-button';

// ----------------------------------------------------------------------

export type NavVerticalProps = React.ComponentProps<'div'> &
    NavSectionProps & {
        isNavMini: boolean;
        layoutQuery?: Breakpoint;
        onToggleNav: () => void;
        slots?: {
            topArea?: React.ReactNode;
            bottomArea?: React.ReactNode;
        };
    };

export function NavVertical({ sx, data, slots, cssVars, className, isNavMini, onToggleNav, checkPermissions, layoutQuery = 'md', ...other }: NavVerticalProps) {
    const { mode } = useColorScheme() || { mode: 'light' };
    const isDarkMode = mode === 'dark';

    const { state } = useSettingsContext();
    const isNavApparent = state.navColor === 'apparent';

    const renderNavVertical = () => (
        <>
            {slots?.topArea ?? (
                <Box
                    sx={{
                        pl: 3,
                        pt: 3,
                        pb: 3,
                        pr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: isNavApparent ? 'transparent' : 'var(--layout-nav-bg)',
                    }}
                >
                    <Box component="img" src={isDarkMode ? '/logo/logo-pertamina-lubricants.png' : '/logo/logo-pertamina-lubricants.png'} alt="Pertamina Logo" sx={{ width: 150, height: 'auto' }} />

                    {/*<Box component="img" src={isDarkMode ? '/logo/original/SiAP.png' : '/logo/original/SiAP.png'} alt="SiAP Logo" sx={{ width: 70, height: 'auto' }} />*/}
                </Box>
            )}

            <Scrollbar fillContent sx={{ pb: 5 }}>
                <NavSectionVertical data={data} cssVars={cssVars} checkPermissions={checkPermissions} sx={{ px: 2, flex: '1 1 auto' }} />
            </Scrollbar>
        </>

        // <>
        //     {slots?.topArea ?? (
        //         <Box
        //             sx={{
        //                 pl: 3.5,
        //                 pt: 2.5,
        //                 pb: 1,
        //                 backgroundColor: isNavApparent ? 'transparent' : 'var(--layout-nav-bg)',
        //             }}
        //         >
        //             <img
        //                 src={isNavApparent || isDarkMode ? '/logo/original/pertamina-logo.png' : '/logo/original/pertamina-logo.png'}
        //                 alt="Logo"
        //                 style={{
        //                     width: '200px',
        //                     height: 'auto',
        //                 }}
        //             />
        //         </Box>
        //     )}
        //
        //     <Scrollbar fillContent sx={{ pb: 5 }}>
        //         <NavSectionVertical data={data} cssVars={cssVars} checkPermissions={checkPermissions} sx={{ px: 2, flex: '1 1 auto' }} />
        //
        //         {/*{slots?.bottomArea ?? <NavUpgrade />}*/}
        //     </Scrollbar>
        // </>
    );

    const renderNavMini = () => (
        <>
            {slots?.topArea ?? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2.5 }}>
                    <img
                        src={isNavApparent || isDarkMode ? '/logo/original/logo-white.png' : '/logo/original/logo-pertamina.png'}
                        alt="Logo"
                        style={{
                            width: 50,
                        }}
                    />
                </Box>
            )}

            <NavSectionMini
                data={data}
                cssVars={cssVars}
                checkPermissions={checkPermissions}
                sx={[
                    (theme) => ({
                        ...theme.mixins.hideScrollY,
                        pb: 2,
                        px: 0.5,
                        flex: '1 1 auto',
                        overflowY: 'auto',
                    }),
                ]}
            />

            {slots?.bottomArea}
        </>
    );

    return (
        <NavRoot isNavMini={isNavMini} layoutQuery={layoutQuery} className={mergeClasses([layoutClasses.nav.root, layoutClasses.nav.vertical, className])} sx={sx} {...other}>
            <NavToggleButton
                isNavMini={isNavMini}
                onClick={onToggleNav}
                sx={[
                    (theme) => ({
                        display: 'none',
                        [theme.breakpoints.up(layoutQuery)]: { display: 'inline-flex' },
                    }),
                ]}
            />
            {isNavMini ? renderNavMini() : renderNavVertical()}
        </NavRoot>
    );
}

// ----------------------------------------------------------------------

const NavRoot = styled('div', {
    shouldForwardProp: (prop: string) => !['isNavMini', 'layoutQuery', 'sx'].includes(prop),
})<Pick<NavVerticalProps, 'isNavMini' | 'layoutQuery'>>(({ isNavMini, layoutQuery = 'md', theme }) => ({
    top: 0,
    left: 0,
    height: '100%',
    display: 'none',
    position: 'fixed',
    flexDirection: 'column',
    zIndex: 'var(--layout-nav-zIndex)',
    backgroundColor: 'var(--layout-nav-bg)',
    width: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
    borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
    transition: theme.transitions.create(['width'], {
        easing: 'var(--layout-transition-easing)',
        duration: 'var(--layout-transition-duration)',
    }),
    [theme.breakpoints.up(layoutQuery)]: { display: 'flex' },
}));
