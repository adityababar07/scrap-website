import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import './App.css'
import MainLayout from "./MainLayout";
import Home from './Home'
import Buy from './Buy'
import Sell from './Sell'
import ProtectedRoute from './ProtectedRoute'
import NotFound from './404'
import Login from './login'
import Signup from './Signup'
import AuthRedirect from './AuthRedirect'
import Profile from './Profile'

import Cart from './Cart'
import ProductDetails from './ProductDetails'
import { CartProvider } from './CartContext'

function App() {
  const [count, setCount] = useState(0)

  return (
    <CartProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<AuthRedirect><Home /></AuthRedirect>} />
            <Route path="/buy" element={<ProtectedRoute><Buy /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
            <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
