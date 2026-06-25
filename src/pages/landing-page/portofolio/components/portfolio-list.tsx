import { useState } from 'react';

import { styled, useTheme, keyframes } from '@mui/material/styles';
import {
    Box,
    Chip,
    Card,
    Stack,
    alpha,
    Button,
    Container,
    CardMedia,
    Typography,
    CardContent,
} from '@mui/material';

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
    image: string;
    liveUrl: string;
    repoUrl: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
    {
        id: 1,
        title: 'E-Commerce Platform',
        category: 'Web App',
        description:
            'Platform belanja online lengkap dengan fitur keranjang belanja, pembayaran, dan manajemen produk. Dibangun menggunakan React dan Node.js.',
        tech: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
        liveUrl: '#',
        repoUrl: '#',
    },
    {
        id: 2,
        title: 'Dashboard Analytics',
        category: 'Dashboard',
        description:
            'Dashboard visualisasi data real-time untuk monitoring bisnis, menampilkan grafik interaktif, laporan penjualan, dan insight performa.',
        tech: ['Vue.js', 'Chart.js', 'Express', 'PostgreSQL'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
        liveUrl: '#',
        repoUrl: '#',
    },
    {
        id: 3,
        title: 'Mobile Banking App',
        category: 'Mobile',
        description:
            'Aplikasi perbankan mobile dengan fitur transfer, cek saldo, riwayat transaksi, dan notifikasi real-time. Desain UI modern dan intuitif.',
        tech: ['React Native', 'Firebase', 'Redux', 'TypeScript'],
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80',
        liveUrl: '#',
        repoUrl: '#',
    },
];

const CATEGORIES = ['Semua', 'Web App', 'Dashboard', 'Mobile'];

// ─── Styled ───────────────────────────────────────────────────────────────────

const AnimatedBox = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
    opacity: 0,
    animation: `${fadeUp} 0.6s ease forwards`,
    animationDelay: `${delay}ms`,
}));

const ProjectCard = styled(Card)(({ theme }) => ({
    background: theme.palette.background.paper,
    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
    borderRadius: 14,
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
    },
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

const PortfolioList = () => {
    const theme = useTheme();
    const accent = theme.palette.primary.main;
    const [activeCategory, setActiveCategory] = useState('Semua');

    const filtered =
        activeCategory === 'Semua'
            ? PROJECTS
            : PROJECTS.filter((p) => p.category === activeCategory);

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
                    <Typography
                        variant="overline"
                        sx={{
                            color: 'primary.main',
                            fontWeight: 600,
                            letterSpacing: 3,
                            fontSize: 12,
                        }}
                    >
                        Apa yang sudah saya buat
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
                        Portfolio Saya
                    </Typography>
                </AnimatedBox>

                {/* Filter */}
                <AnimatedBox delay={100}>
                    <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={1.5} mb={6}>
                        {CATEGORIES.map((cat) => (
                            <Chip
                                key={cat}
                                label={cat}
                                onClick={() => setActiveCategory(cat)}
                                variant={activeCategory === cat ? 'filled' : 'outlined'}
                                sx={{
                                    fontWeight: 600,
                                    fontSize: 13,
                                    cursor: 'pointer',
                                    ...(activeCategory === cat
                                        ? {
                                              bgcolor: 'primary.main',
                                              color: 'primary.contrastText',
                                          }
                                        : {
                                              borderColor: alpha(accent, 0.3),
                                              color: 'text.secondary',
                                              '&:hover': {
                                                  borderColor: 'primary.main',
                                                  color: 'primary.main',
                                                  bgcolor: alpha(accent, 0.06),
                                              },
                                          }),
                                }}
                            />
                        ))}
                    </Stack>
                </AnimatedBox>

                {/* Grid */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                        },
                        gap: 3,
                    }}
                >
                    {filtered.map((project, index) => (
                        <AnimatedBox key={project.id} delay={index * 100}>
                            <ProjectCard elevation={0}>
                                {/* Image with overlay */}
                                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                    <CardMedia
                                        component="img"
                                        height={220}
                                        image={project.image}
                                        alt={project.title}
                                        sx={{ transition: 'transform 0.4s ease' }}
                                    />
                                    <Chip
                                        label={project.category}
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 12,
                                            left: 12,
                                            bgcolor: 'primary.main',
                                            color: 'primary.contrastText',
                                            fontWeight: 700,
                                            fontSize: 10,
                                            letterSpacing: 1,
                                        }}
                                    />
                                    {/* Hover overlay */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            bgcolor: alpha('#000', 0.7),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1.5,
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease',
                                            '.MuiCard-root:hover &': { opacity: 1 },
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            size="small"
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            sx={{ fontWeight: 700, textTransform: 'none', borderRadius: 1.5 }}
                                        >
                                            Live Demo
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            href={project.repoUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            sx={{
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                borderRadius: 1.5,
                                                borderColor: '#fff',
                                                color: '#fff',
                                                '&:hover': { borderColor: '#fff', bgcolor: alpha('#fff', 0.1) },
                                            }}
                                        >
                                            Source Code
                                        </Button>
                                    </Box>
                                </Box>

                                <CardContent sx={{ p: 3 }}>
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        color="text.primary"
                                        gutterBottom
                                    >
                                        {project.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ lineHeight: 1.7, mb: 2.5 }}
                                    >
                                        {project.description}
                                    </Typography>
                                    <Stack direction="row" flexWrap="wrap" gap={0.75}>
                                        {project.tech.map((t) => (
                                            <TechBadge key={t} label={t} />
                                        ))}
                                    </Stack>
                                </CardContent>
                            </ProjectCard>
                        </AnimatedBox>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default PortfolioList;
