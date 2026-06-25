import { styled, keyframes, useTheme } from '@mui/material/styles';
import { Box, Stack, Container, Typography, alpha, Tooltip } from '@mui/material';

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const AnimatedBox = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
    opacity: 0,
    animation: `${fadeUp} 0.6s ease forwards`,
    animationDelay: `${delay}ms`,
}));

const techCategories = [
    {
        category: 'Frontend',
        items: [
            { name: 'React.js', icon: '⚛️', level: 'Expert' },
            { name: 'TypeScript', icon: '🔷', level: 'Advanced' },
            { name: 'JavaScript', icon: '🟨', level: 'Expert' },
            { name: 'HTML & CSS', icon: '🌐', level: 'Expert' },
            { name: 'Material UI', icon: '🎨', level: 'Advanced' },
            { name: 'Next.js', icon: '▲', level: 'Intermediate' },
            { name: 'Tailwind CSS', icon: '💨', level: 'Intermediate' },
        ],
    },
    {
        category: 'Tools & Others',
        items: [
            { name: 'Git & GitHub', icon: '🐙', level: 'Advanced' },
            { name: 'Vite', icon: '⚡', level: 'Advanced' },
            { name: 'REST API', icon: '🔗', level: 'Advanced' },
            { name: 'Figma', icon: '🖌️', level: 'Intermediate' },
        ],
    },
    {
        category: 'Networking',
        items: [
            { name: 'Mikrotik', icon: '🔴', level: 'Intermediate' },
            { name: 'Routing & Switching', icon: '🔀', level: 'Intermediate' },
            { name: 'Network Config', icon: '⚙️', level: 'Intermediate' },
        ],
    },
];

const levelColor: Record<string, string> = {
    Expert: '#22c55e',
    Advanced: '#3b82f6',
    Intermediate: '#f59e0b',
};

const TechStack = () => {
    const theme = useTheme();
    const accent = theme.palette.primary.main;

    return (
        <Box
            component="section"
            id="tech-stack"
            sx={{
                py: { xs: 8, md: 12 },
                bgcolor: 'background.paper',
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
                        Skills
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
                        Tech Stack
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1.5, maxWidth: 480, mx: 'auto' }}
                    >
                        Teknologi dan tools yang saya gunakan sehari-hari dalam pengembangan web dan jaringan.
                    </Typography>
                </AnimatedBox>

                {/* Categories */}
                <Stack spacing={5}>
                    {techCategories.map((cat, catIdx) => (
                        <AnimatedBox key={cat.category} delay={100 + catIdx * 120}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{ mb: 2.5, color: 'text.secondary', letterSpacing: 0.5 }}
                            >
                                {cat.category}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 2,
                                }}
                            >
                                {cat.items.map((tech) => (
                                    <Tooltip
                                        key={tech.name}
                                        title={tech.level}
                                        placement="top"
                                        arrow
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.2,
                                                px: 2,
                                                py: 1.2,
                                                borderRadius: 2,
                                                border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                                                bgcolor: 'background.default',
                                                cursor: 'default',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    borderColor: alpha(accent, 0.5),
                                                    bgcolor: alpha(accent, 0.05),
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: theme.shadows[3],
                                                },
                                            }}
                                        >
                                            <Typography fontSize={18} lineHeight={1}>
                                                {tech.icon}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                color="text.primary"
                                            >
                                                {tech.name}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: '50%',
                                                    bgcolor: levelColor[tech.level] ?? accent,
                                                    ml: 0.5,
                                                }}
                                            />
                                        </Box>
                                    </Tooltip>
                                ))}
                            </Box>
                        </AnimatedBox>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
};

export default TechStack;
