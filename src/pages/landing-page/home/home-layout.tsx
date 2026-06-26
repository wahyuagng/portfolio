import Hero from '@pages/landing-page/home/components/hero';
import Academy from '@pages/landing-page/home/components/academy';
import Contact from '@pages/landing-page/home/components/contact';
import TechStack from '@pages/landing-page/home/components/tech-stack';
import PortfolioPreview from '@pages/landing-page/home/components/portfolio-preview';

import { Box } from '@mui/material';

import { CONFIG } from '../../../global-config';

const HomeLayout = () => (
        <>
            <title>Home</title>
            <Box>
                <Hero />
                {/*<Academy/>*/}
                <TechStack/>
                <PortfolioPreview/>
                <Contact/>
            </Box>
        </>
    )

export default HomeLayout;
