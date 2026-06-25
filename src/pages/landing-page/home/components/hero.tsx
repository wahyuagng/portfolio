import { styled, useTheme, keyframes } from '@mui/material/styles';
import { Box, Chip, Stack, alpha, Button, Container, Typography } from '@mui/material';

// ─── Animations ──────────────────────────────────────────────────────────────

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const floatY = keyframes`
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
`;

// ─── Styled components ────────────────────────────────────────────────────────

const AnimatedBox = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
    opacity: 0,
    animation: `${fadeUp} 0.65s ease forwards`,
    animationDelay: `${delay}ms`,
}));

const FloatingCard = styled(Box)(({ theme }) => ({
    animation: `${floatY} 4s ease-in-out infinite`,
    background: theme.palette.background.paper,
    backdropFilter: 'blur(12px)',
    borderRadius: 14,
    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
    padding: '14px 18px',
    boxShadow: theme.shadows[4],
}));

// Accent color — mengikuti primary palette dari theme
const useAccent = () => {
    const theme = useTheme();
    return theme.palette.primary.main;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SkillBadge = ({ label }: { label: string }) => {
    const theme = useTheme();
    return (
        <Box
            component="span"
            sx={{
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: 12,
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

const StatCard = ({ value, label, delay, floatDelay = '0s' }: { value: string; label: string; delay: number; floatDelay?: string }) => {
    const theme = useTheme();
    return (
        <AnimatedBox delay={delay}>
            <FloatingCard sx={{ animationDelay: floatDelay, minWidth: 110 }}>
                <Typography variant="h6" fontWeight={700} lineHeight={1} sx={{ color: theme.palette.primary.main }}>
                    {value}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    {label}
                </Typography>
            </FloatingCard>
        </AnimatedBox>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Hero = () => {
    const theme = useTheme();
    const accent = theme.palette.primary.main;
    const isDark = theme.palette.mode === 'dark';

    const skills = ['React', 'TypeScript', 'Node.js', 'MUI', 'Next.js'];

    return (
        <Box
            component="section"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                // Menggunakan background.default dari theme — otomatis dark/light
                bgcolor: 'background.default',
            }}
        >
            {/* Decorative blobs — memakai warna primary dari theme */}
            <Box
                aria-hidden
                sx={{
                    position: 'absolute',
                    top: '-15%',
                    right: '-8%',
                    width: 560,
                    height: 560,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(accent, isDark ? 0.15 : 0.1)} 0%, transparent 70%)`,
                    pointerEvents: 'none',
                }}
            />
            <Box
                aria-hidden
                sx={{
                    position: 'absolute',
                    bottom: '-8%',
                    left: '-6%',
                    width: 380,
                    height: 380,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, isDark ? 0.12 : 0.08)} 0%, transparent 70%)`,
                    pointerEvents: 'none',
                }}
            />

            <Container maxWidth="lg" sx={{ py: { xs: 10, md: 4 } }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '55% 1fr' },
                        gap: { xs: 6, md: 6 },
                        alignItems: 'center',
                    }}
                >
                    {/* ── Left: Copy ── */}
                    <Stack spacing={3.5}>
                        {/* Status badge */}
                        <AnimatedBox delay={0}>
                            <Chip
                                label="✦ Available for work"
                                size="small"
                                sx={{
                                    background: alpha(accent, 0.1),
                                    color: accent,
                                    border: `1px solid ${alpha(accent, 0.25)}`,
                                    fontWeight: 600,
                                    fontSize: 12,
                                    letterSpacing: 0.3,
                                    width: 'fit-content',
                                }}
                            />
                        </AnimatedBox>

                        {/* Headline */}
                        <AnimatedBox delay={100}>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: { xs: '2.4rem', sm: '3rem', md: '3.6rem' },
                                    fontWeight: 800,
                                    lineHeight: 1.1,
                                    letterSpacing: '-0.03em',
                                    color: 'text.primary',
                                }}
                            >
                                Hi, I&#39;m{' '}
                                <Box
                                    component="span"
                                    sx={{
                                        color: accent,
                                        // Tidak pakai gradient agar lebih clean & adaptif theme
                                    }}
                                >
                                    Wahyu Agung
                                </Box>
                                <br />
                                Frontend Developer.
                            </Typography>
                        </AnimatedBox>

                        {/* Tagline */}
                        <AnimatedBox delay={200}>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.secondary',
                                    lineHeight: 1.75,
                                    maxWidth: 460,
                                    fontSize: { xs: '1rem', md: '1.05rem' },
                                }}
                            >
                                I craft clean, accessible, and performant web experiences — from pixel-perfect UIs to robust full-stack applications.
                            </Typography>
                        </AnimatedBox>

                        {/* Skill badges */}
                        <AnimatedBox delay={280}>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {skills.map((s) => (
                                    <SkillBadge key={s} label={s} />
                                ))}
                            </Stack>
                        </AnimatedBox>

                        {/* CTA buttons */}
                        <AnimatedBox delay={360}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    href="#projects"
                                    sx={{
                                        fontWeight: 700,
                                        px: 3.5,
                                        py: 1.4,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        // Pakai warna primary dari theme secara langsung
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        boxShadow: `0 4px 18px ${alpha(accent, 0.35)}`,
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                            boxShadow: `0 6px 24px ${alpha(accent, 0.45)}`,
                                        },
                                    }}
                                >
                                    View my work
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    href="#contact"
                                    sx={{
                                        fontWeight: 600,
                                        px: 3.5,
                                        py: 1.4,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        borderColor: 'divider',
                                        color: 'text.primary',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            bgcolor: alpha(accent, 0.06),
                                        },
                                    }}
                                >
                                    Contact me →
                                </Button>
                            </Stack>
                        </AnimatedBox>

                        {/* Social / quick info */}
                        <AnimatedBox delay={440}>
                            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                Based in Malang, Indonesia · Open to remote & hybrid roles
                            </Typography>
                        </AnimatedBox>
                    </Stack>

                    {/* ── Right: Floating stats ── */}
                    <Box
                        sx={{
                            position: 'relative',
                            display: { xs: 'none', md: 'flex' },
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 440,
                        }}
                    >
                        {/* Center card */}
                        <AnimatedBox
                            delay={180}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 2,
                            }}
                        >
                            <FloatingCard
                                sx={{
                                    width: 200,
                                    textAlign: 'center',
                                    animationDelay: '0s',
                                    p: 3,
                                }}
                            >
                                {/* Avatar placeholder — ganti dengan <img> atau Avatar MUI */}
                                <Box
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: '50%',
                                        bgcolor: alpha(accent, 0.12),
                                        border: `2px solid ${alpha(accent, 0.3)}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 1.5,
                                        fontSize: 28,
                                    }}
                                >
                                    👋
                                </Box>
                                <Typography fontWeight={700} fontSize={14} color="text.primary">
                                    Wahyu Agung
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Frontend Developer
                                </Typography>
                            </FloatingCard>
                        </AnimatedBox>

                        {/* Stat cards */}
                        <Box sx={{ position: 'absolute', top: '6%', left: '0%' }}>
                            <StatCard value="5+ yrs" label="Experience" delay={380} floatDelay="0.4s" />
                        </Box>
                        <Box sx={{ position: 'absolute', top: '12%', right: '0%' }}>
                            <StatCard value="10+" label="Projects" delay={500} floatDelay="0.8s" />
                        </Box>
                        {/*<Box sx={{ position: 'absolute', bottom: '14%', left: '2%' }}>*/}
                        {/*    <StatCard value="10+" label="Happy clients" delay={620} floatDelay="1.2s" />*/}
                        {/*</Box>*/}
                        {/*<Box sx={{ position: 'absolute', bottom: '6%', right: '2%' }}>*/}
                        {/*    <StatCard value="100%" label="Passion" delay={740} floatDelay="1.6s" />*/}
                        {/*</Box>*/}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Hero;
