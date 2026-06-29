import { styled, useTheme, keyframes } from '@mui/material/styles';
import { Box, Chip, Stack, alpha, Container, Typography } from '@mui/material';

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type Project = {
    id: number;
    title: string;
    category: string;
    description: string;
    tech: string[];
    liveUrl: string;
    repoUrl: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
    {
        id: 1,
        title: 'Dynamic Pricing — PT Pertamina Lubricants',
        category: 'Web App',
        description:
            'Dynamic pricing management system for PT Pertamina Lubricants (PTPL) to handle special pricing proposals for corporate clients and distributors. Features multi-level approval workflows (submit → approve → release), automated price calculation covering HLP, transport cost, marketing cost, and profit margin, customer hierarchy management, real-time SignalR notifications, and export to Excel/PDF. Built for two separate role modules: Production (HQ admin) and CAM (Customer Account Manager). Deployed on Google Cloud with Kubernetes.',
        tech: ['React 18', 'TypeScript', 'Vite', 'Material UI', 'Redux Toolkit', 'Formik', 'Axios', 'SignalR', 'Google Cloud', 'Kubernetes'],
        liveUrl: '#',
        repoUrl: '#',
    },
    {
        id: 2,
        title: 'SIAP — Factory Production Management',
        category: 'Web App',
        description: 'End-to-end factory production management system for PT Pertamina Lubricants covering the full lubricant manufacturing workflow: Purchase Order → Raw Material Reception (QR scan, tanker, ISO tank) → Blending → Filling → Inventory → Delivery. Includes inventory tracking, storage tank management, downtime reporting, BOM, and comprehensive master data. Secured with JWT + MFA authentication and role-based access control.',
        tech: ['React 19', 'TypeScript', 'Vite', 'Material UI', 'JWT + MFA', 'React Hook Form', 'Zod', 'FullCalendar', 'DnD Kit', 'i18n'],
        liveUrl: '#',
        repoUrl: '#',
    },
    {
        id: 3,
        title: 'Hajj & Umrah Travel PWA',
        category: 'PWA',
        description: 'Progressive Web App for Hajj and Umrah travel services with three layers: a public landing page, a pilgrim-facing app, and an admin panel. Pilgrim features include a savings account system for installment payments, deposit/withdrawal with admin approval, referral and commission tracking, and package booking with detailed itineraries. Admin panel manages packages, pricing, availability, bookings, and financial reports. Multi-role with separate route guards.',
        tech: ['React 18', 'TypeScript', 'Vite', 'Redux Toolkit', 'Tailwind CSS', 'NextUI', 'Formik', 'Yup', 'Leaflet', 'React Router v6'],
        liveUrl: '#',
        repoUrl: '#',
    },
];

// ─── Styled ───────────────────────────────────────────────────────────────────

const AnimatedBox = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
    opacity: 0,
    animation: `${fadeUp} 0.6s ease forwards`,
    animationDelay: `${delay}ms`,
}));

// ─── Sub-components ───────────────────────────────────────────────────────────

const TechBadge = ({ label }: { label: string }) => {
    const theme = useTheme();
    return (
        <Box
            component="span"
            sx={{
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: 11,
                fontWeight: 600,
                background: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
        >
            {label}
        </Box>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PortfolioPreview = () => {
    const theme = useTheme();
    const accent = theme.palette.primary.main;

    return (
        <Box
            component="section"
            id="projects"
            sx={{
                py: { xs: 8, md: 12 },
                bgcolor: 'background.default',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative blob */}
            <Box
                aria-hidden
                sx={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-5%',
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(accent, 0.08)} 0%, transparent 70%)`,
                    pointerEvents: 'none',
                }}
            />

            <Container maxWidth="lg">
                {/* Header */}
                <AnimatedBox delay={0} sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 3, fontSize: 12 }}>
                        What I&#39;ve built
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '2rem', md: '2.8rem' },
                            letterSpacing: '-0.02em',
                            color: 'text.primary',
                            mt: 1,
                        }}
                    >
                        Selected Projects
                    </Typography>
                </AnimatedBox>

                {/* Scrollable list container */}
                <AnimatedBox delay={100}>
                    <Box
                        sx={{
                            maxHeight: 480,
                            overflowY: 'auto',
                            pr: 1,
                            // Custom scrollbar
                            '&::-webkit-scrollbar': { width: 6 },
                            '&::-webkit-scrollbar-track': {
                                background: alpha(accent, 0.05),
                                borderRadius: 3,
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: alpha(accent, 0.25),
                                borderRadius: 3,
                                '&:hover': { background: alpha(accent, 0.45) },
                            },
                        }}
                    >
                        <Stack spacing={2}>
                            {PROJECTS.map((project, index) => (
                                <Box
                                    key={project.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 3,
                                        p: 3,
                                        borderRadius: 3,
                                        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                                        background: theme.palette.background.paper,
                                        transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
                                        '&:hover': {
                                            borderColor: alpha(accent, 0.4),
                                            boxShadow: `0 4px 24px ${alpha(accent, 0.1)}`,
                                        },
                                    }}
                                >
                                    {/* Index number */}
                                    <Box
                                        sx={{
                                            minWidth: 36,
                                            height: 36,
                                            borderRadius: '50%',
                                            background: alpha(accent, 0.1),
                                            border: `1px solid ${alpha(accent, 0.2)}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Typography fontSize={12} fontWeight={700} color="primary.main">
                                            {String(index + 1).padStart(2, '0')}
                                        </Typography>
                                    </Box>

                                    {/* Content */}
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} mb={0.75}>
                                            <Stack direction="row" alignItems="center" gap={1.5}>
                                                <Typography fontWeight={700} fontSize={15} color="text.primary">
                                                    {project.title}
                                                </Typography>
                                                <Chip
                                                    label={project.category}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: alpha(accent, 0.1),
                                                        color: 'primary.main',
                                                        fontWeight: 700,
                                                        fontSize: 10,
                                                        height: 20,
                                                        border: `1px solid ${alpha(accent, 0.2)}`,
                                                    }}
                                                />
                                            </Stack>

                                            {/* Actions */}
                                            <Stack direction="row" gap={1}>
                                                {/*<Button*/}
                                                {/*    variant="outlined"*/}
                                                {/*    size="small"*/}
                                                {/*    href={project.repoUrl}*/}
                                                {/*    target="_blank"*/}
                                                {/*    rel="noreferrer"*/}
                                                {/*    sx={{*/}
                                                {/*        fontSize: 11,*/}
                                                {/*        fontWeight: 600,*/}
                                                {/*        textTransform: 'none',*/}
                                                {/*        borderRadius: 1.5,*/}
                                                {/*        py: 0.4,*/}
                                                {/*        px: 1.5,*/}
                                                {/*        borderColor: alpha(accent, 0.3),*/}
                                                {/*        color: 'text.secondary',*/}
                                                {/*        '&:hover': {*/}
                                                {/*            borderColor: 'primary.main',*/}
                                                {/*            color: 'primary.main',*/}
                                                {/*            bgcolor: alpha(accent, 0.06),*/}
                                                {/*        },*/}
                                                {/*    }}*/}
                                                {/*>*/}
                                                {/*    Code*/}
                                                {/*</Button>*/}
                                                {/*<Button*/}
                                                {/*    variant="contained"*/}
                                                {/*    size="small"*/}
                                                {/*    href={project.liveUrl}*/}
                                                {/*    target="_blank"*/}
                                                {/*    rel="noreferrer"*/}
                                                {/*    sx={{*/}
                                                {/*        fontSize: 11,*/}
                                                {/*        fontWeight: 700,*/}
                                                {/*        textTransform: 'none',*/}
                                                {/*        borderRadius: 1.5,*/}
                                                {/*        py: 0.4,*/}
                                                {/*        px: 1.5,*/}
                                                {/*    }}*/}
                                                {/*>*/}
                                                {/*    Live*/}
                                                {/*</Button>*/}
                                            </Stack>
                                        </Stack>

                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65, mb: 1.5, fontSize: 13 }}>
                                            {project.description}
                                        </Typography>

                                        <Stack direction="row" flexWrap="wrap" gap={0.75}>
                                            {project.tech.map((t) => (
                                                <TechBadge key={t} label={t} />
                                            ))}
                                        </Stack>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </AnimatedBox>
            </Container>
        </Box>
    );
};

export default PortfolioPreview;
