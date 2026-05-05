import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminSellerApproval from "./pages/AdminSellerApproval";

import SellerAddProduct from "./pages/SellerAddProduct";
import SellerProducts from "./pages/SellerProduct";
import SellerStock from "./pages/SellerStock";
import SellerWishlistStats from "./pages/SellerWishlistStats";
import SellerSpoilageAlerts from "./pages/SellerSpoilageAlerts";
import SellerPolls from "./pages/SellerPolls";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import CustomerActivityTabs from "./pages/CustomerActivityTabs";
import GiftCard from "./pages/GiftCard";
import CustomerPolls from "./pages/CustomerPolls";
import Wallet from "./pages/Wallet";
import Compare from "./pages/compare";

import HarvestCalendar from "./pages/HarvestCalendar";
import Chat from "./pages/Chat";
import ProductReview from "./pages/ProductReview";
import ProductDetails from "./pages/ProductDetails";
import DeliverySlots from "./pages/DeliverySlots";
import OrderStatus from "./pages/OrderStatus";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/harvest-calendar" element={<HarvestCalendar />} />
        <Route path="/products/:productId/reviews" element={<ProductReview />} />

        <Route
          path="/products/:productId"
          element={
            <PrivateRoute role="customer">
              <ProductDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/seller-approval"
          element={
            <PrivateRoute role="admin">
              <AdminSellerApproval />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/delivery-slots"
          element={
            <PrivateRoute role="admin">
              <DeliverySlots role="admin" />
            </PrivateRoute>
          }
        />

        <Route
          path="/seller/products"
          element={
            <PrivateRoute role="seller">
              <SellerProducts />
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
          path="/seller/spoilage-alerts"
          element={
            <PrivateRoute role="seller">
              <SellerSpoilageAlerts />
            </PrivateRoute>
          }
        />

        <Route
          path="/seller/wishlist-stats"
          element={
            <PrivateRoute role="seller">
              <SellerWishlistStats />
            </PrivateRoute>
          }
        />

        <Route
          path="/seller/harvest-calendar"
          element={
            <PrivateRoute role="seller">
              <HarvestCalendar />
            </PrivateRoute>
          }
        />

        <Route
          path="/seller/reviews"
          element={
            <PrivateRoute role="seller">
              <ProductReview />
            </PrivateRoute>
          }
        />

        <Route
          path="/seller/delivery-slots"
          element={
            <PrivateRoute role="seller">
              <DeliverySlots role="seller" />
            </PrivateRoute>
          }
        />

        <Route
          path="/seller/polls"
          element={
            <PrivateRoute role="seller">
              <SellerPolls />
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
          path="/checkout"
          element={
            <PrivateRoute role="customer">
              <Checkout />
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
          path="/gift-card"
          element={
            <PrivateRoute role="customer">
              <GiftCard />
            </PrivateRoute>
          }
        />

        <Route
          path="/wallet"
          element={
            <PrivateRoute role="customer">
              <Wallet />
            </PrivateRoute>
          }
        />

        <Route
          path="/compare"
          element={
            <PrivateRoute role="customer">
              <Compare />
            </PrivateRoute>
          }
        />

        <Route
          path="/track-order"
          element={
            <PrivateRoute role="customer">
              <OrderStatus />
            </PrivateRoute>
          }
        />

        <Route
          path="/customer/activity"
          element={
            <PrivateRoute role="customer">
              <CustomerActivityTabs />
            </PrivateRoute>
          }
        />

        <Route
          path="/polls"
          element={
            <PrivateRoute role="customer">
              <CustomerPolls />
            </PrivateRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <PrivateRoute allowedRoles={["customer", "seller"]}>
              <Chat />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;