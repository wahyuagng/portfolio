import { Route } from 'react-router-dom';
import { Outlet, Routes } from 'react-router';
import HomeLayout from '@pages/landing-page/home/home-layout';

import { NotFoundView } from '../../../sections/error';

const Home = () => (
    <Routes>
        <Route element={<Outlet />} />
        <Route index element={<HomeLayout />} />
        <Route path="*" element={<NotFoundView />} />
    </Routes>
);

export default Home;
