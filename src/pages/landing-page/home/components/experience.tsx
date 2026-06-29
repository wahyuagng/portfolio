import { styled, useTheme, keyframes } from '@mui/material/styles';
import { Box, Stack, Chip, alpha, Container, Typography } from '@mui/material';

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const AnimatedBox = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
    opacity: 0,
    animation: `${fadeUp} 0.6s ease forwards`,
    animationDelay: `${delay}ms`,
}));

const experiences = [
    {
        role: 'Frontend Developer',
        company: 'PT Mypro Solusindo Informatika',
        period: '2020 – Present',
        type: 'Full-time',
        description:
            'Developing and maintaining enterprise-scale web applications for large clients including PT Pertamina Lubricants. Projects span dynamic pricing systems, factory production management, and travel booking platforms. Responsible for frontend architecture, multi-level approval workflows, real-time integrations via SignalR, and deployment on Google Cloud with Kubernetes.',
        tech: ['React', 'TypeScript', 'Vite', 'Material UI', 'Redux Toolkit', 'SignalR', 'Google Cloud'],
    },
    {
        role: 'Developer',
        company: 'PT. Assist Software Indonesia Pratama',
        period: '2019 – 2020',
        type: 'Full-time',
        description:
            'Contributed to software development projects as a junior developer, building web-based applications and supporting the full development lifecycle from requirements gathering to delivery.',
        tech: ['HTML', 'CSS', 'JavaScript', 'REST API'],
    },
];

const Experience = () => {
    const theme = useTheme();
    const accent = theme.palette.primary.main;

    return (
        <Box
            component="section"
            id="experience"
            sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}
        >
            <Container maxWidth="lg">
                <AnimatedBox delay={0} sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant="overline"
                        sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 3, fontSize: 12 }}
                    >
                        Work History
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
                        Experience
                    </Typography>
                </AnimatedBox>

                <Box sx={{ maxWidth: 760, mx: 'auto', position: 'relative' }}>
                    {/* Vertical line */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: { xs: 16, sm: 20 },
                            top: 8,
                            bottom: 8,
                            width: 2,
                            bgcolor: alpha(accent, 0.15),
                            borderRadius: 1,
                        }}
                    />

                    <Stack spacing={4}>
                        {experiences.map((exp, index) => (
                            <AnimatedBox key={exp.company} delay={100 + index * 120}>
                                <Box sx={{ display: 'flex', gap: { xs: 3, sm: 4 } }}>
                                    {/* Dot */}
                                    <Box sx={{ flexShrink: 0, position: 'relative', mt: 0.5 }}>
                                        <Box
                                            sx={{
                                                width: { xs: 32, sm: 40 },
                                                height: { xs: 32, sm: 40 },
                                                borderRadius: '50%',
                                                bgcolor: alpha(accent, 0.12),
                                                border: `2px solid ${alpha(accent, 0.3)}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                zIndex: 1,
                                                position: 'relative',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    bgcolor: accent,
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    {/* Content */}
                                    <Box
                                        sx={{
                                            flex: 1,
                                            p: 3,
                                            borderRadius: 3,
                                            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                                            bgcolor: 'background.paper',
                                            transition: 'border-color 0.2s',
                                            '&:hover': { borderColor: alpha(accent, 0.35) },
                                        }}
                                    >
                                        <Stack
                                            direction={{ xs: 'column', sm: 'row' }}
                                            justifyContent="space-between"
                                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                                            gap={1}
                                            mb={1}
                                        >
                                            <Box>
                                                <Typography fontWeight={700} fontSize={15} color="text.primary">
                                                    {exp.role}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" fontSize={13}>
                                                    {exp.company}
                                                </Typography>
                                            </Box>
                                            <Stack direction="row" gap={1} alignItems="center" flexShrink={0}>
                                                <Chip
                                                    label={exp.type}
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
                                                <Typography variant="caption" color="text.disabled" fontWeight={500}>
                                                    {exp.period}
                                                </Typography>
                                            </Stack>
                                        </Stack>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            lineHeight={1.7}
                                            mb={1.5}
                                            fontSize={13}
                                        >
                                            {exp.description}
                                        </Typography>

                                        <Stack direction="row" flexWrap="wrap" gap={0.75}>
                                            {exp.tech.map((t) => (
                                                <Box
                                                    key={t}
                                                    component="span"
                                                    sx={{
                                                        display: 'inline-block',
                                                        px: 1.5,
                                                        py: 0.4,
                                                        borderRadius: 1,
                                                        fontSize: 11,
                                                        fontWeight: 600,
                                                        background: alpha(accent, 0.1),
                                                        color: 'primary.main',
                                                        border: `1px solid ${alpha(accent, 0.2)}`,
                                                    }}
                                                >
                                                    {t}
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Box>
                                </Box>
                            </AnimatedBox>
                        ))}
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};

export default Experience;
