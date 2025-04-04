import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


import FirstScreen from './pages/FirstScreen'
import HomePage from './pages/HomePage'
import Profile from './pages/user/Profile'
function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<FirstScreen />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
  )
}

export default App
