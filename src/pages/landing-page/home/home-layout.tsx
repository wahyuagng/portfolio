import Hero from '@pages/landing-page/home/components/hero';
import About from '@pages/landing-page/home/components/about';
import Navbar from '@pages/landing-page/home/components/navbar';
import Contact from '@pages/landing-page/home/components/contact';
import TechStack from '@pages/landing-page/home/components/tech-stack';
import Experience from '@pages/landing-page/home/components/experience';
import PortfolioPreview from '@pages/landing-page/home/components/portfolio-preview';

import { Box } from '@mui/material';

const HomeLayout = () => (
    <>
        <title>Home</title>
        <Box>
            <Navbar />
            <Hero />
            <About />
            <Experience />
            <TechStack />
            <PortfolioPreview />
            <Contact />
        </Box>
    </>
);

export default HomeLayout;
