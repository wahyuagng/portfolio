import { useState, useEffect } from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import { useTheme, styled, alpha } from '@mui/material/styles';
import { Box, Stack, Button, Container, IconButton, Drawer, List, ListItemButton, ListItemText } from '@mui/material';

const NAV_ITEMS = [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Tech Stack', href: '#tech-stack' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
];

const NavRoot = styled(Box)<{ scrolled: number }>(({ theme, scrolled }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.appBar,
    transition: 'background 0.3s, box-shadow 0.3s',
    background: scrolled
        ? alpha(theme.palette.background.default, 0.85)
        : 'transparent',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    boxShadow: scrolled ? `0 1px 0 ${alpha(theme.palette.divider, 0.6)}` : 'none',
}));

const Navbar = () => {
    const theme = useTheme();
    const accent = theme.palette.primary.main;
    const [scrolled, setScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNav = (href: string) => {
        setDrawerOpen(false);
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <NavRoot scrolled={scrolled ? 1 : 0}>
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            height: 64,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        {/* Logo */}
                        <Box
                            component="span"
                            sx={{
                                fontWeight: 800,
                                fontSize: 18,
                                color: 'text.primary',
                                letterSpacing: '-0.02em',
                                cursor: 'pointer',
                            }}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            Wahyu<Box component="span" sx={{ color: accent }}>.</Box>
                        </Box>

                        {/* Desktop nav */}
                        <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
                            {NAV_ITEMS.map((item) => (
                                <Button
                                    key={item.label}
                                    onClick={() => handleNav(item.href)}
                                    sx={{
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                        fontSize: 14,
                                        textTransform: 'none',
                                        borderRadius: 1.5,
                                        px: 1.5,
                                        '&:hover': { color: 'text.primary', bgcolor: alpha(accent, 0.06) },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleNav('#contact')}
                                sx={{
                                    ml: 1,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    borderRadius: 1.5,
                                    px: 2,
                                }}
                            >
                                Hire Me
                            </Button>
                        </Stack>

                        {/* Mobile menu button */}
                        <IconButton
                            sx={{ display: { xs: 'flex', md: 'none' } }}
                            onClick={() => setDrawerOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Container>
            </NavRoot>

            {/* Mobile drawer */}
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 240, pt: 2 }}>
                    <List>
                        {NAV_ITEMS.map((item) => (
                            <ListItemButton key={item.label} onClick={() => handleNav(item.href)}>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{ fontWeight: 500, fontSize: 15 }}
                                />
                            </ListItemButton>
                        ))}
                        <Box sx={{ px: 2, pt: 1 }}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => handleNav('#contact')}
                                sx={{ fontWeight: 700, textTransform: 'none', borderRadius: 1.5 }}
                            >
                                Hire Me
                            </Button>
                        </Box>
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Navbar;
