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
<<<<<<< HEAD

=======
import OrderStatus from "./pages/OrderStatus";
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import CustomerActivityTabs from "./pages/CustomerActivityTabs";
import GiftCard from "./pages/GiftCard";
import CustomerPolls from "./pages/CustomerPolls";
<<<<<<< HEAD
import Wallet from "./pages/Wallet";
import Compare from "./pages/compare";

import HarvestCalendar from "./pages/HarvestCalendar";
import Chat from "./pages/Chat";
import ProductReview from "./pages/ProductReview";
import ProductDetails from "./pages/ProductDetails";
import DeliverySlots from "./pages/DeliverySlots";
import OrderStatus from "./pages/OrderStatus";
=======
import Compare from "./pages/compare";
import HarvestCalendar from "./pages/HarvestCalendar";
import Chat from "./pages/Chat";
import ProductReview from "./pages/ProductReview";
import DeliverySlots from "./pages/DeliverySlots";
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
<<<<<<< HEAD
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

=======
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public Harvest Calendar route.
            Admin, seller, customer, and outsider can all see this page. */}
        <Route path="/harvest-calendar" element={<HarvestCalendar />} />

        {/* Admin Routes */}
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
        <Route
          path="/admin/seller-approval"
          element={
            <PrivateRoute role="admin">
              <AdminSellerApproval />
            </PrivateRoute>
          }
        />
<<<<<<< HEAD

=======
        <Route path="/compare" element={<Compare />} />
        <Route path="/track-order" element={<OrderStatus />} />
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
        <Route
          path="/admin/delivery-slots"
          element={
            <PrivateRoute role="admin">
              <DeliverySlots role="admin" />
            </PrivateRoute>
          }
        />

<<<<<<< HEAD
=======
        {/* Seller Routes */}
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
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
<<<<<<< HEAD
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
=======
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
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

<<<<<<< HEAD
=======
        {/* Customer Routes */}
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
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
<<<<<<< HEAD
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
=======
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
          path="/customer/activity"
          element={
            <PrivateRoute role="customer">
              <CustomerActivityTabs />
            </PrivateRoute>
          }
        />

<<<<<<< HEAD
=======
<Route path="/products/:productId/reviews" element={<ProductReview />} />

>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
        <Route
          path="/polls"
          element={
            <PrivateRoute role="customer">
              <CustomerPolls />
            </PrivateRoute>
          }
        />

<<<<<<< HEAD
=======
        {/* Chat Route */}
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
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