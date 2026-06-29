import { styled, useTheme, keyframes } from '@mui/material/styles';
import { Box, Stack, alpha, Button, Container, Typography } from '@mui/material';

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const AnimatedBox = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
    opacity: 0,
    animation: `${fadeUp} 0.6s ease forwards`,
    animationDelay: `${delay}ms`,
}));

const CtaBanner = () => {
    const theme = useTheme();
    const accent = theme.palette.primary.main;
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box
            component="section"
            sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}
        >
            <Container maxWidth="md">
                <AnimatedBox delay={0}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            p: { xs: 5, md: 8 },
                            borderRadius: 4,
                            border: `1px solid ${alpha(accent, 0.2)}`,
                            background: `radial-gradient(ellipse at 50% 0%, ${alpha(accent, isDark ? 0.12 : 0.07)} 0%, transparent 70%)`,
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <Typography
                            variant="overline"
                            sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 3, fontSize: 12 }}
                        >
                            Let&#39;s Collaborate
                        </Typography>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '1.9rem', md: '2.8rem' },
                                letterSpacing: '-0.02em',
                                color: 'text.primary',
                                mt: 1,
                                mb: 2,
                            }}
                        >
                            Have a project in mind?
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ maxWidth: 480, mx: 'auto', lineHeight: 1.8, mb: 4 }}
                        >
                            I&#39;m available for freelance projects and long-term collaborations.
                            Let&#39;s talk about what we can build together.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                size="large"
                                href="https://wa.me/6281310826931"
                                target="_blank"
                                rel="noreferrer"
                                sx={{ fontWeight: 700, textTransform: 'none', borderRadius: 2, px: 4 }}
                            >
                                Chat on WhatsApp
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                href="mailto:wahyuagungpriambudi@gmail.com"
                                sx={{
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    px: 4,
                                    borderColor: alpha(accent, 0.4),
                                    '&:hover': { borderColor: accent },
                                }}
                            >
                                Send an Email
                            </Button>
                        </Stack>
                    </Box>
                </AnimatedBox>
            </Container>
        </Box>
    );
};

export default CtaBanner;
