import { useState } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
    </Routes>
  )
}

export default App
