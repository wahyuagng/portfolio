import { styled , useTheme, keyframes } from '@mui/material/styles';
import { Box, Stack, alpha, Container, Typography } from '@mui/material';

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const AnimatedBox = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
    opacity: 0,
    animation: `${fadeUp} 0.6s ease forwards`,
    animationDelay: `${delay}ms`,
}));

const educationData = [
    {
        level: 'S1',
        institution: 'Universitas XYZ',
        major: 'Informatics Engineering',
        year: '2019 – 2023',
        description:
            'Studied computer science fundamentals, algorithms, software engineering, and web and mobile application development.',
    },
    {
        level: 'SMK',
        institution: 'SMK ABC',
        major: 'Software Engineering',
        year: '2016 – 2019',
        description:
            'Focused on programming fundamentals, web design, and desktop and web application development.',
    },
];

const Academy = () => {
    const theme = useTheme();
    const accent = theme.palette.primary.main;

    return (
        <Box
            component="section"
            id="academy"
            sx={{
                py: { xs: 8, md: 12 },
                bgcolor: 'background.default',
            }}
        >
            <Container maxWidth="lg">
                {/* Section header */}
                <AnimatedBox delay={0} sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography
                        variant="overline"
                        sx={{
                            color: accent,
                            fontWeight: 700,
                            letterSpacing: 2,
                            fontSize: 12,
                        }}
                    >
                        Education
                    </Typography>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            mt: 1,
                            fontSize: { xs: '1.9rem', md: '2.4rem' },
                            color: 'text.primary',
                        }}
                    >
                        Riwayat Pendidikan
                    </Typography>
                </AnimatedBox>

                {/* Timeline */}
                <Stack spacing={4} sx={{ maxWidth: 700, mx: 'auto' }}>
                    {educationData.map((edu, idx) => (
                        <AnimatedBox key={edu.level} delay={100 + idx * 150}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 3,
                                    p: { xs: 2.5, md: 3.5 },
                                    borderRadius: 3,
                                    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                                    bgcolor: 'background.paper',
                                    boxShadow: theme.shadows[2],
                                    transition: 'box-shadow 0.2s',
                                    '&:hover': {
                                        boxShadow: theme.shadows[6],
                                    },
                                }}
                            >
                                {/* Badge level */}
                                <Box
                                    sx={{
                                        minWidth: 52,
                                        height: 52,
                                        borderRadius: 2,
                                        bgcolor: alpha(accent, 0.1),
                                        border: `1px solid ${alpha(accent, 0.25)}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <Typography
                                        fontWeight={800}
                                        fontSize={13}
                                        sx={{ color: accent }}
                                    >
                                        {edu.level}
                                    </Typography>
                                </Box>

                                {/* Content */}
                                <Box>
                                    <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1} mb={0.5}>
                                        <Typography fontWeight={700} fontSize={16} color="text.primary">
                                            {edu.major}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                px: 1.2,
                                                py: 0.3,
                                                borderRadius: 1,
                                                bgcolor: alpha(accent, 0.08),
                                                color: accent,
                                                fontWeight: 600,
                                                fontSize: 11,
                                            }}
                                        >
                                            {edu.year}
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary" mb={1}>
                                        {edu.institution}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                                        {edu.description}
                                    </Typography>
                                </Box>
                            </Box>
                        </AnimatedBox>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
};

export default Academy;
