// import { lazy } from 'react';
// import { Navigate, type RouteObject } from 'react-router';
//
// import { authRoutes } from './auth';
// import { mainRoutes } from './main';
// import { authDemoRoutes } from './auth-demo';
// import { privateRoutes } from './privateRoutes';
// import { componentsRoutes } from './components';
//
// // ----------------------------------------------------------------------
//
// // const HomePage = lazy(() => import('src/pages/home'));
// const Page404 = lazy(() => import('src/pages/error/404'));
//
// export const routesSection: RouteObject[] = [
//   {
//     path: '/',
//     /**
//      * @skip homepage
//      * import { Navigate } from "react-router";
//      * import { CONFIG } from 'src/global-config';
//      *
//      * element: <Navigate to={CONFIG.auth.redirectPath} replace />,
//      * and remove the element below:
//      */
//     element: <Navigate to="/auth/jwt/sign-in" replace />,
//     //   (
//     //   <Suspense fallback={<SplashScreen />}>
//     //     <MainLayout>
//     //       <HomePage />
//     //     </MainLayout>
//     //   </Suspense>
//     // ),
//   },
//
//   // Auth
//   ...authRoutes,
//   ...authDemoRoutes,
//
//   // Private
//   ...privateRoutes,
//
//   // Main
//   ...mainRoutes,
//
//   // Components
//   ...componentsRoutes,
//
//   // No match
//   { path: '*', element: <Page404 /> },
// ];
