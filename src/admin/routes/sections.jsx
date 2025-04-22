import { lazy, Suspense } from 'react';
import { Outlet, Navigate, createBrowserRouter } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from '../theme/styles';
import { DashboardLayout } from '../layouts/dashboard';

// ----------------------------------------------------------------------
const HomePage = lazy(() => import('../pages/home'));
const Page404 = lazy(() => import('../pages/page-not-found'));
const UserPage = lazy(() => import('../pages/user'));
// ----------------------------------------------------------------------
const renderFallback = (
    <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
        <LinearProgress
            sx={{
                width: 1,
                maxWidth: 320,
                bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
                [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
            }}
        />
    </Box>
);

export function Router() {
    return createBrowserRouter([
        {
            path: '/admin',
            element: (
                <DashboardLayout>
                    <Suspense fallback={renderFallback}>
                        <Outlet />
                    </Suspense>
                </DashboardLayout>
            ),
            children: [
                { element: <HomePage />, index: true },
                { path: 'user', element: <UserPage /> }
            ],
        },
        {
            path: '/admin/404',
            element: <Page404 />
        },
        {
            path: '*',
            element: <Navigate to="/admin/404" replace />,
        },
    ]);
}
