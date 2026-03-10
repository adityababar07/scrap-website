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

import CategoryPage from './CategoryPage'
import Checkout from './Checkout'

import Cart from './Cart'
import ProductDetails from './ProductDetails'
import { CartProvider } from './CartContext'
import { ProductProvider } from './ProductContext'

// Admin Components
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminProducts from './admin/AdminProducts'
import AdminUsers from './admin/AdminUsers'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ProductProvider>
      <CartProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            {/* User Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<AuthRedirect><Home /></AuthRedirect>} />
              <Route path="/buy" element={<ProtectedRoute><Buy /></ProtectedRoute>} />
              <Route path="/category/:categoryId" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
              <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
              <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ProductProvider>
  )
}

export default App
