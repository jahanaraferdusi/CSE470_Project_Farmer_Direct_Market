import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminSellerApproval from "./pages/AdminSellerApproval";
import SellerAddProduct from "./pages/SellerAddProduct";
import SellerStock from "./pages/SellerStock";
import SellerWishlistStats from "./pages/SellerWishlistStats"; 
import SellerSpoilageAlerts from "./pages/SellerSpoilageAlerts";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist"; // (if customer wishlist exists)

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin/sellers"
          element={
            <PrivateRoute role="admin">
              <AdminSellerApproval />
            </PrivateRoute>
          }
        />

        <Route
          path="/seller/add-product"
          element={
            <PrivateRoute role="seller">
              <SellerAddProduct />
            </PrivateRoute>
          }
        />

        <Route
          path="/seller/stock"
          element={
            <PrivateRoute role="seller">
              <SellerStock />
            </PrivateRoute>
          }
        />


        <Route
          path="/seller-wishlist"
          element={
            <PrivateRoute role="seller">
              <SellerWishlistStats />
            </PrivateRoute>
          }
        />


        <Route
          path="/wishlist"
          element={
            <PrivateRoute role="customer">
              <Wishlist />
            </PrivateRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <PrivateRoute role="customer">
              <Cart />
            </PrivateRoute>
          }
        />

        <Route
          path="/seller/spoilage-alerts"
          element={
            <PrivateRoute role="seller">
              <SellerSpoilageAlerts />
            </PrivateRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <PrivateRoute role="customer">
              <Checkout />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
