import PortfolioList from '@pages/landing-page/portofolio/components/portfolio-list';

import { Box } from '@mui/material';

import { CONFIG } from '../../../global-config';

const PortofolioLayout = () => (
    <>
        <title>{`${CONFIG.appName} - Portfolio`}</title>
        <Box>
            <PortfolioList />
        </Box>
    </>
);

export default PortofolioLayout;
