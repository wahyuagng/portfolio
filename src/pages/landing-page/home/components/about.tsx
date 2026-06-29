import { styled, useTheme, keyframes } from '@mui/material/styles';
import { Box, Stack, alpha, Container, Typography } from '@mui/material';

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const AnimatedBox = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
    opacity: 0,
    animation: `${fadeUp} 0.6s ease forwards`,
    animationDelay: `${delay}ms`,
}));

const About = () => {
    const theme = useTheme();
    const accent = theme.palette.primary.main;

    return (
        <Box
            component="section"
            id="about"
            sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: { xs: 6, md: 10 },
                        alignItems: 'center',
                    }}
                >
                    {/* Left */}
                    <AnimatedBox delay={0}>
                        <Typography
                            variant="overline"
                            sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 3, fontSize: 12 }}
                        >
                            About Me
                        </Typography>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '2rem', md: '2.6rem' },
                                letterSpacing: '-0.02em',
                                color: 'text.primary',
                                mt: 1,
                                mb: 3,
                            }}
                        >
                            Turning ideas into{' '}
                            <Box component="span" sx={{ color: accent }}>
                                real products
                            </Box>
                        </Typography>
                        <Stack spacing={2}>
                            <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
                                I&#39;m a Frontend Developer based in Malang, Indonesia with 5+ years of experience
                                building web applications for startups and businesses across various industries.
                            </Typography>
                            <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
                                I specialize in React and TypeScript, creating fast, accessible, and
                                maintainable interfaces. I care about clean code as much as I care about
                                the end-user experience.
                            </Typography>
                            <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
                                When I&#39;m not coding, I&#39;m exploring networking and infrastructure — which
                                gives me a broader perspective on how applications behave in the real world.
                            </Typography>
                        </Stack>
                    </AnimatedBox>

                    {/* Right — quick facts */}
                    <AnimatedBox delay={150}>
                        <Stack spacing={2.5}>
                            {[
                                { label: 'Based in', value: 'Malang, Indonesia' },
                                { label: 'Specialization', value: 'Frontend Development' },
                                { label: 'Experience', value: '5+ Years' },
                                { label: 'Availability', value: 'Open for freelance & projects' },
                                { label: 'Languages', value: 'Indonesian, English' },
                            ].map((fact) => (
                                <Box
                                    key={fact.label}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        pb: 2,
                                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                        {fact.label}
                                    </Typography>
                                    <Typography variant="body2" color="text.primary" fontWeight={600}>
                                        {fact.value}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </AnimatedBox>
                </Box>
            </Container>
        </Box>
    );
};

export default About;
