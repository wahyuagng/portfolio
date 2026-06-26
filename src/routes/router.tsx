import { paths } from '@routes/paths';
import { lazy, Suspense } from 'react';
import { GuestGuard } from '@auth/guard';
import { usePathname } from '@routes/hooks';
import { Outlet, Navigate } from 'react-router';
import { Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '@components/loading-screen';

//Landing-Page
const HomePage = lazy(() => import('@pages/landing-page/home/home'));

export function Router() {
    return (
        <Routes>
            <Route element={<GuestGuard />}>
                <Route>
                    <Route path={paths.home} element={<HomePage />} />
                </Route>
            </Route>
        </Routes>
    );
}

export function SuspenseOutlet() {
    const pathname = usePathname();

    return (
        <Suspense key={pathname} fallback={<LoadingScreen />}>
            <Outlet />
        </Suspense>
    );
}

