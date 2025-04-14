import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import FirstScreen from "./pages/FirstScreen";
import HomePage from "./pages/HomePage";
import TheatersPage from "./pages/TheatersPage";
import Profile from "./pages/user/Profile";
import SignUp from "./pages/user/SignUp";
import SignIn from "./pages/user/SignIn";

import MovieDetail from "./components/movie/MovieDetail";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstScreen />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/theaters" element={<TheatersPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/movie/:film_name" element={<MovieDetail />} />
        {/* <Route path="/sign-in" element={<SignIn />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
