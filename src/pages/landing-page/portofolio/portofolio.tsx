import { Route } from 'react-router-dom';
import { Outlet, Routes } from 'react-router';
import PortofolioLayout from '@pages/landing-page/portofolio/portofolio-layout';

import { NotFoundView } from '../../../sections/error';

const Portofolio = () => (
    <Routes>
        <Route element={<Outlet />} />
        <Route index element={<PortofolioLayout />} />
        <Route path="*" element={<NotFoundView />} />
    </Routes>
);

export default Portofolio;
