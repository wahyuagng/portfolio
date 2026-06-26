import { styled, useTheme, keyframes } from '@mui/material/styles';
import { Box, Link, alpha, Container, Typography } from '@mui/material';

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const AnimatedBox = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
    opacity: 0,
    animation: `${fadeUp} 0.6s ease forwards`,
    animationDelay: `${delay}ms`,
}));

const contactItems = [
    {
        label: 'WhatsApp',
        value: '+62 813-1082-6931',
        href: 'https://wa.me/6281310826931',
        icon: '💬',
        description: 'Chat directly via WhatsApp',
    },
    {
        label: 'Email',
        value: 'wahyuagungpriambudi@gmail.com',
        href: 'mailto:wahyuagungpriambudi@gmail.com',
        icon: '✉️',
        description: 'Send an email anytime',
    },
    // {
    //     label: 'GitHub',
    //     value: 'github.com/wahyuagung',
    //     href: 'https://github.com/wahyuagung',
    //     icon: '🐙',
    //     description: 'Lihat proyek dan kontribusi saya',
    // },
];

const Contact = () => {
    const theme = useTheme();
    const accent = theme.palette.primary.main;

    return (
        <Box
            component="section"
            id="contact"
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
                        Contact
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
                        Get In Touch
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1.5, maxWidth: 440, mx: 'auto' }}
                    >
                        Interested in working together or have a project in mind? Feel free to reach out.
                    </Typography>
                </AnimatedBox>

                {/* Contact cards */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                        gap: 3,
                        maxWidth: 520,
                        mx: 'auto',
                    }}
                >
                    {contactItems.map((item, idx) => (
                        <AnimatedBox key={item.label} delay={100 + idx * 120}>
                            <Link
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="none"
                                sx={{ display: 'block' }}
                            >
                                <Box
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                                        bgcolor: 'background.paper',
                                        textAlign: 'center',
                                        transition: 'all 0.25s',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            borderColor: alpha(accent, 0.5),
                                            bgcolor: alpha(accent, 0.04),
                                            transform: 'translateY(-4px)',
                                            boxShadow: `0 8px 24px ${alpha(accent, 0.15)}`,
                                        },
                                    }}
                                >
                                    <Typography fontSize={36} mb={1.5} lineHeight={1}>
                                        {item.icon}
                                    </Typography>
                                    <Typography
                                        fontWeight={700}
                                        fontSize={15}
                                        color="text.primary"
                                        mb={0.5}
                                    >
                                        {item.label}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: accent,
                                            fontWeight: 600,
                                            fontSize: 13,
                                            mb: 1,
                                            wordBreak: 'break-all',
                                        }}
                                    >
                                        {item.value}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {item.description}
                                    </Typography>
                                </Box>
                            </Link>
                        </AnimatedBox>
                    ))}
                </Box>

                {/* Footer note */}
                <AnimatedBox delay={500} sx={{ textAlign: 'center', mt: 6 }}>
                    <Typography variant="caption" color="text.disabled">
                        © {new Date().getFullYear()} Wahyu Agung
                    </Typography>
                </AnimatedBox>
            </Container>
        </Box>
    );
};

export default Contact;
