import "./App.css";
import "./admin/global.css";

import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

import FirstScreen from "./pages/FirstScreen";
import HomePage from "./pages/HomePage";
import TheatersPage from "./pages/TheatersPage";
import NewsPage from "./pages/NewsPage";
import NewsDetail from "./pages/NewsDetail";
import Profile from "./pages/user/Profile";
import SignUp from "./pages/user/SignUp";
import SignIn from "./pages/user/SignIn";
import NewsByRegion from "./pages/NewsByRegion";
import MovieDetail from "./components/movie/MovieDetail";
import BuyTicket from "./components/ticket/BuyTicket";
import MoviesFilterPage from "./pages/MoviesFilterPage";
import BookingTicket from "./components/ticket/BookingTicketMain";
import TheatersAndMovies from "./pages/TheatersAndMovies";
import SearchPage from "./pages/SearchPage";
import ActorFilms from "./components/movie/ActorFilms";

import { DashboardLayout } from "./admin/layouts/dashboard";
import DashboardPage from "./admin/pages/dashboard";
import MoviePage from "./admin/pages/movie";
import UserPage from "./admin/pages/user";
import CinemaPage from "./admin/pages/cinema";
import ShowtimePage from "./admin/pages/showtime";
import RoomPage from "./admin/pages/room";
import OrderPage from "./admin/pages/order";
import NewsAdminPage from "./admin/pages/news";
import { HelmetProvider } from "react-helmet-async";
import AdminRoute from "./admin/AdminRoute";

const EditUserPage = lazy(() => import("./admin/pages/edit-user"));
const CreateMoviePage = lazy(() => import("./admin/pages/create-movie"));
const CreateRoomPage = lazy(() => import("./admin/pages/create-room"));
const EditMoviePage = lazy(() => import("./admin/pages/edit-movie"));
const CreateCinemaPage = lazy(() => import("./admin/pages/create-cinema"));
const EditCinemaPage = lazy(() => import("./admin/pages/edit-cinema"));
const CreateShowtimePage = lazy(() => import("./admin/pages/create-showtime"));
const EditShowtimePage = lazy(() => import("./admin/pages/edit-showtime"));
const Page404 = lazy(() => import("./admin/pages/page-not-found"));
const OrderDetailsPage = lazy(() => import("./admin/pages/order-details"));

const renderFallback = (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    flex="1 1 auto"
  >
    <LinearProgress sx={{ width: 1, maxWidth: 320 }} />
  </Box>
);

function AdminLayout() {
  return (
    <DashboardLayout>
      <Suspense fallback={renderFallback}>
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="user/:id" element={<EditUserPage />} />
          <Route path="movie" element={<MoviePage />} />
          <Route path="movie/create" element={<CreateMoviePage />} />
          <Route path="movie/:id" element={<EditMoviePage />} />
          <Route path="cinema" element={<CinemaPage />} />
          <Route path="cinema/create" element={<CreateCinemaPage />} />
          <Route path="cinema/:id" element={<EditCinemaPage />} />
          <Route path="showtime" element={<ShowtimePage />} />
          <Route path="showtime/create" element={<CreateShowtimePage />} />
          <Route path="showtime/:id" element={<EditShowtimePage />} />
          <Route path="room" element={<RoomPage />} />
          <Route path="room/create" element={<CreateRoomPage />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="order/:id" element={<OrderDetailsPage />} />
          <Route path="news" element={<NewsAdminPage />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <CssVarsProvider>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Main App Routes */}
            <Route path="/" element={<FirstScreen />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/theaters" element={<TheatersPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:new_header" element={<NewsDetail />} />
            <Route path="/news/region/:region" element={<NewsByRegion />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/theater-movie" element={<TheatersAndMovies />} />
            <Route path="/actor/:actor_name" element={<ActorFilms />} />
            <Route path="/movie/:film_name" element={<MovieDetail />} />
            <Route path="/search/:film_name" element={<SearchPage />} />
            <Route path="/movie/buyTicket/:film_name" element={<BuyTicket />} />
            <Route
              path="/movie/bookTicket/:film_name"
              element={<BookingTicket />}
            />
            <Route path="/movie/filter" element={<MoviesFilterPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Router>
      </CssVarsProvider>
    </HelmetProvider>
  );
}
