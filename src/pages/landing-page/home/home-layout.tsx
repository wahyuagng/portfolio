import Hero from '@pages/landing-page/home/components/hero';
import Academy from '@pages/landing-page/home/components/academy';
import Contact from '@pages/landing-page/home/components/contact';
import TechStack from '@pages/landing-page/home/components/tech-stack';

import { Box } from '@mui/material';

import { CONFIG } from '../../../global-config';

const HomeLayout = () => (
        <>
            <title>{`${CONFIG.appName} - Home`}</title>
            <Box>
                <Hero />
                <Academy/>
                <TechStack/>
                <Contact/>
            </Box>
        </>
    )

export default HomeLayout;
