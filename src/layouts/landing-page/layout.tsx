import type { Breakpoint } from '@mui/material/styles';
import type { MainSectionProps, HeaderSectionProps, LayoutSectionProps } from '../core';
import type { NavItemProps, NavSectionProps, NavItemDataProps } from 'src/components/nav-section';

import { merge } from 'es-toolkit';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { iconButtonClasses } from '@mui/material/IconButton';

import { Logo } from 'src/components/logo';
import { SETTING_VISIBLE, useSettingsContext } from 'src/components/settings';

import { useAuthContext } from 'src/auth/hooks';

import { NavMobile } from './nav-mobile';
import { VerticalDivider } from './content';
import { NavVertical } from './nav-vertical';
import { NavHorizontal } from './nav-horizontal';
import { useAccountMenu } from '../nav-config-account';
import { MenuButton } from '../components/menu-button';
import { AccountDrawer } from '../components/account-drawer';
import { SettingsButton } from '../components/settings-button';
import { navData as dashboardNavData } from '../nav-config-dashboard';
import { dashboardLayoutVars, dashboardNavColorVars } from './css-vars';
import { NotificationsButton } from '../components/notifications-button';
import { MainSection, layoutClasses, HeaderSection, LayoutSection } from '../core';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type LandingPageLayoutProps = LayoutBaseProps & {
    layoutQuery?: Breakpoint;
    slotProps?: {
        header?: HeaderSectionProps;
        nav?: {
            data?: NavSectionProps['data'];
        };
        main?: MainSectionProps;
    };
};

export function LandingPageLayout({ sx, cssVars, children, slotProps, layoutQuery = 'lg' }: LandingPageLayoutProps) {
    const theme = useTheme();

    const { profile } = useAuthContext();
    const settings = useSettingsContext();
    const navVars = dashboardNavColorVars(theme, settings.state.navColor, settings.state.navLayout);

    const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

    const navData = slotProps?.nav?.data ?? dashboardNavData;
    const isNavMini = settings.state.navLayout === 'mini';
    const isNavHorizontal = settings.state.navLayout === 'horizontal';
    const isNavVertical = isNavMini || settings.state.navLayout === 'vertical';

    const accountData = useAccountMenu();

    const shouldHideItem = (allowedRoles: NavItemProps['allowedRoles']): boolean => {
        if (!allowedRoles || (Array.isArray(allowedRoles) && allowedRoles.length === 0)) {
            return false;
        }
        const userPermissions = profile?.Permissions || [];
        const allowedPermissions = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        const hasPermission = userPermissions.some((permission: string) => allowedPermissions.includes(permission));

        return !hasPermission;
    };

    const filterNavByPermission = (data: NavSectionProps['data']): NavSectionProps['data'] =>
        data
            .map((section) => {
                const filteredItems = section.items
                    .map((item) => {
                        if (shouldHideItem(item.allowedRoles)) return null;

                        let childItems = item.children;
                        if (Array.isArray(childItems)) {
                            childItems = childItems.filter((child) => !shouldHideItem(child.allowedRoles));

                            if (childItems.length === 0) return null;
                        }

                        return {
                            ...item,
                            children: childItems,
                        } as NavItemDataProps;
                    })
                    .filter((x): x is NavItemDataProps => x !== null); // type predicate SIMPLE & VALID

                if (filteredItems.length === 0) return null;

                return {
                    ...section,
                    items: filteredItems,
                };
            })
            .filter((x): x is { subheader?: string; items: NavItemDataProps[] } => x !== null);

    const filteredNav = filterNavByPermission(navData);

    const renderHeader = () => {
        const headerSlotProps: HeaderSectionProps['slotProps'] = {
            container: {
                maxWidth: false,
                sx: {
                    ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
                    ...(isNavHorizontal && {
                        bgcolor: 'var(--layout-nav-bg)',
                        height: { [layoutQuery]: 'var(--layout-nav-horizontal-height)' },
                        [`& .${iconButtonClasses.root}`]: { color: 'var(--layout-nav-text-secondary-color)' },
                    }),
                },
            },
        };

        const headerSlots: HeaderSectionProps['slots'] = {
            topArea: (
                <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                    This is an info Alert.
                </Alert>
            ),
            bottomArea: isNavHorizontal ? (
                <NavHorizontal
                    // data={navData}
                    data={filteredNav}
                    layoutQuery={layoutQuery}
                    cssVars={navVars.section}
                    checkPermissions={shouldHideItem}
                />
            ) : null,
            leftArea: (
                <>
                    {/** @slot Nav mobile */}
                    <MenuButton onClick={onOpen} sx={{ mr: 1, ml: -1, [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }} />
                    <NavMobile
                        // data={navData}
                        data={filteredNav}
                        open={open}
                        onClose={onClose}
                        cssVars={navVars.section}
                        checkPermissions={shouldHideItem}
                    />

                    {/** @slot Logo */}
                    {isNavHorizontal && (
                        <Logo
                            sx={{
                                display: 'none',
                                [theme.breakpoints.up(layoutQuery)]: { display: 'inline-flex' },
                            }}
                        />
                    )}

                    {/** @slot Divider */}
                    {isNavHorizontal && <VerticalDivider sx={{ [theme.breakpoints.up(layoutQuery)]: { display: 'flex' } }} />}

                    {/** @slot Workspace popover */}
                    {/*<WorkspacesPopover data={_workspaces} sx={{ ...(isNavHorizontal && { color: 'var(--layout-nav-text-primary-color)' }) }} />*/}
                </>
            ),
            rightArea: (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.75 } }}>
                    {/** @slot Searchbar */}
                    {/*<Searchbar data={navData} />*/}
                    <NotificationsButton />
                    {/** @slot Language popover */}
                    {/*<LanguagePopover data={localesConfig.options} />*/}

                    {/** @slot Notifications popover */}
                    {/*<NotificationsDrawer data={_notifications} />*/}

                    {/** @slot Contacts popover */}
                    {/*<ContactsPopover data={_contacts} />*/}

                    {/** @slot Settings button */}
                    {SETTING_VISIBLE && <SettingsButton />}

                    {/** @slot Account drawer */}
                    <AccountDrawer data={accountData} />
                </Box>
            ),
        };

        return <HeaderSection layoutQuery={layoutQuery} disableElevation={isNavVertical} {...slotProps?.header} slots={{ ...headerSlots, ...slotProps?.header?.slots }} slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})} sx={slotProps?.header?.sx} />;
    };

    const renderSidebar = () => (
        <NavVertical
            // data={navData}
            data={filteredNav}
            isNavMini={isNavMini}
            layoutQuery={layoutQuery}
            cssVars={navVars.section}
            checkPermissions={shouldHideItem}
            onToggleNav={() => settings.setField('navLayout', settings.state.navLayout === 'vertical' ? 'mini' : 'vertical')}
        />
    );

    const renderFooter = () => null;

    const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

    // if (!users?.permissions.length) return null;
    return (
        <LayoutSection
            /** **************************************
             * @Header
             *************************************** */
            headerSection={renderHeader()}
            /** **************************************
             * @Sidebar
             *************************************** */
            // sidebarSection={isNavHorizontal ? null : renderSidebar()}
            sidebarSection={!profile?.Permissions?.length || isNavHorizontal ? null : renderSidebar()}
            /** **************************************
             * @Footer
             *************************************** */
            footerSection={renderFooter()}
            /** **************************************
             * @Styles
             *************************************** */
            cssVars={{ ...dashboardLayoutVars(theme), ...navVars.layout, ...cssVars }}
            sx={[
                {
                    [`& .${layoutClasses.sidebarContainer}`]: {
                        [theme.breakpoints.up(layoutQuery)]: {
                            pl: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
                            transition: theme.transitions.create(['padding-left'], {
                                easing: 'var(--layout-transition-easing)',
                                duration: 'var(--layout-transition-duration)',
                            }),
                        },
                    },
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            {renderMain()}
        </LayoutSection>
    );
}
