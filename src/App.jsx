import { useState } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage'
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Users from './pages/Users';
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ProtectedRoute from './ProtectedRoute';
import CustomerQueries from "./pages/CustomerQueries"
import { SidebarProvider } from "./context/SidebarContext";
import AddProduct from './pages/AddProduct';

function App() {

  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/queries" element={<ProtectedRoute><CustomerQueries /></ProtectedRoute>} />
        <Route path="/products-add" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
      </Routes>
    </SidebarProvider>
  )
}

export default App