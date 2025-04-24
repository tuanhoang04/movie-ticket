// import './global.css';

// import { lazy, Suspense } from 'react';
// import { Outlet, Navigate, createBrowserRouter, RouterProvider, BrowserRouter, Routes, Route } from 'react-router-dom';

// import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';

// import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
// import Box from '@mui/material/Box';

// import { varAlpha } from './theme/styles';
// import theme from './theme/theme'

// import { DashboardLayout } from './layouts/dashboard';

// import HomePage from './pages/home';
// import MoviePage from './pages/movie';
// import UserPage from './pages/user';
// import CinemaPage from './pages/cinema';
// import ShowtimePage from './pages/showtime';
// import RoomPage from './pages/room';
// import OrderPage from './pages/order';
// import NewsPage from './pages/news';
// import DashboardPage from './pages/dashboard';

// const EditUserPage = lazy(() => import('./pages/edit-user'));
// const CreateMoviePage = lazy(() => import('./pages/create-movie'));
// const EditMoviePage = lazy(() => import('./pages/edit-movie'));
// const CreateCinemaPage = lazy(() => import('./pages/create-cinema'));
// const EditCinemaPage = lazy(() => import('./pages/edit-cinema'));
// const CreateShowtimePage = lazy(() => import('./pages/create-showtime'));
// const EditShowtimePage = lazy(() => import('./pages/edit-showtime'));

// const Page404 = lazy(() => import('./pages/page-not-found'));
// const OrderDetailsPage = lazy(() => import('./pages/order-details'));

// const renderFallback = (
//     <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
//         <LinearProgress
//             sx={{
//                 width: 1,
//                 maxWidth: 320,
//                 bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
//                 // [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
//             }}
//         />
//     </Box>
// );

// function Layout() {
//     return (
//         <DashboardLayout>
//             <Suspense fallback={renderFallback}>
//                 <Outlet />
//                 {/* <HomePage /> */}
//             </Suspense>
//         </DashboardLayout>
//     );
// }


// export default function App() {
//     return (
//         <CssVarsProvider theme={theme}>
//             <CssBaseline />
//             {/* <RouterProvider router={router} /> */}
//             <BrowserRouter>
//                 <Routes>
//                     <Route path="admin" element={<Layout />}>
//                         <Route index element={<HomePage />} />
//                         <Route path="user" element={<UserPage />} />
//                         <Route path="user/:id" element={<EditUserPage />} />
//                         <Route path="movie" element={<MoviePage />} />
//                         <Route path="movie/create" element={<CreateMoviePage />} />
//                         <Route path="movie/:id" element={<EditMoviePage />} />
//                         <Route path="cinema" element={<CinemaPage />} />
//                         <Route path="cinema/create" element={<CreateCinemaPage />} />
//                         <Route path="cinema/:id" element={<EditCinemaPage />} />
//                         <Route path="showtime" element={<ShowtimePage />} />
//                         <Route path="showtime/create" element={<CreateShowtimePage />} />
//                         <Route path="showtime/:id" element={<EditShowtimePage />} />
//                         <Route path="room" element={<RoomPage />} />
//                         <Route path="order" element={<OrderPage />} />
//                         <Route path="order/:id" element={<OrderDetailsPage />} />
//                         <Route path="news" element={<NewsPage />} />
//                         <Route path="dashboard" element={<DashboardPage />} />
//                     </Route>
//                     <Route path='*' element={<Page404 />} />
//                 </Routes>
//             </BrowserRouter>
//         </CssVarsProvider>
//     );
// }