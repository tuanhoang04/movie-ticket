import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import FirstScreen from "./pages/FirstScreen";
import HomePage from "./pages/HomePage";
import TheatersPage from "./pages/TheatersPage";
import NewsPage from "./pages/NewsPage";
import NewsDetail from "./pages/NewsDetail";
import Profile from "./pages/user/Profile";
import SignUp from "./pages/user/SignUp";
import SignIn from "./pages/user/SignIn";

import MovieDetail from "./components/movie/MovieDetail";
import BuyTicket from "./components/ticket/BuyTicket";
import MoviesFilterPage from "./pages/MoviesFilterPage";
import BookingTicket from "./components/ticket/BookingTicketMain";
import TheatersAndMovies from "./pages/TheatersAndMovies";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstScreen />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/theaters" element={<TheatersPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:new_header" element={<NewsDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/theater-movie" element={<TheatersAndMovies />}/>
        <Route path="/movie/:film_name" element={<MovieDetail />} />
        <Route path="/movie/buyTicket/:film_name" element={<BuyTicket />} />
        <Route path="/movie/bookTicket/:film_name" element={<BookingTicket />} />
        <Route path="/movie/filter" element={<MoviesFilterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
