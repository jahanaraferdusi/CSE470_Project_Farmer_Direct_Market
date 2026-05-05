import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminSellerApproval from "./pages/AdminSellerApproval";
import SellerAddProduct from "./pages/SellerAddProduct";

import SellerOrders from "./pages/SellerOrders";
import SellerProducts from "./pages/SellerProduct";

import SellerStock from "./pages/SellerStock";
import SellerWishlistStats from "./pages/SellerWishlistStats"; 
import SellerSpoilageAlerts from "./pages/SellerSpoilageAlerts";

import SellerPolls from "./pages/SellerPolls";
import SellerReturnedProducts from "./pages/SellerReturnedProducts";
import OrderStatus from "./pages/OrderStatus";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import CustomerActivityTabs from "./pages/CustomerActivityTabs";
import GiftCard from "./pages/GiftCard";
import CustomerPolls from "./pages/CustomerPolls";
import Compare from "./pages/compare";
import SellerHarvestCalendar from "./pages/SellerHarvestCalendar";
import HarvestCalendar from "./pages/HarvestCalendar";
import Chat from "./pages/Chat";
import ProductReview from "./pages/ProductReview";
import DeliverySlots from "./pages/DeliverySlots";
import Reffer from "./pages/Reffer";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist"; // (if customer wishlist exists)
import HarvestCalendar from "./pages/HarvestCalendar";
import SellerHarvestCalendar from "./pages/SellerHarvestCalendar";
import ProductReview from "./pages/ProductReview";
import SellerProductReviews from "./pages/SellerProductReviews";
import Chat from "./pages/Chat";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public Harvest Calendar route.
            Admin, seller, customer, and outsider can all see this page. */}
        <Route path="/harvest-calendar" element={<HarvestCalendar />} />

        <Route
          path="/seller/harvest-calendar"
          element={
            <PrivateRoute role="seller">
              <SellerHarvestCalendar />
            </PrivateRoute>
          }
        />

        <Route
          path="/reffer"
          element={
            <PrivateRoute allowedRoles={["admin", "seller", "customer"]}>
              <Reffer />
            </PrivateRoute>
          }
        />
        <Route path="/profile" element={<Navigate to="/reffer" replace />} />

        {/* Admin Routes */}

        <Route
          path="/admin/sellers"
          element={
            <PrivateRoute role="admin">
              <AdminSellerApproval />
            </PrivateRoute>
          }
        />
        <Route path="/compare" element={<Compare />} />
        <Route path="/track-order" element={<OrderStatus />} />
        <Route
          path="/admin/delivery-slots"
          element={
            <PrivateRoute role="admin">
              <DeliverySlots role="admin" />
            </PrivateRoute>
          }
        />

        {/* Seller Routes */}
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
          path="/seller-wishlist"
          element={
            <PrivateRoute role="seller">
              <SellerWishlistStats />
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
          path="/wishlist"
          element={
            <PrivateRoute role="customer">
              <Wishlist />
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
          path="/seller/orders"
          element={
            <PrivateRoute role="seller">
              <SellerOrders />
            </PrivateRoute>
          }
        />

        <Route
          path="/seller/returned-products"
          element={
            <PrivateRoute role="seller">
              <SellerReturnedProducts />
            </PrivateRoute>
          }
        />

        {/* Customer Routes */}
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
        <Route path="/harvest-calendar" element={<HarvestCalendar />} />
        <Route
           path="/seller/harvest-calendar"
               element={
            <PrivateRoute role="seller">
                <SellerHarvestCalendar />
            </PrivateRoute>
                        }
        />
        <Route
           path="/reviews/:productId"
           element={
             <PrivateRoute role="customer">
               <ProductReview />
             </PrivateRoute>
                    } />
        <Route
            path="/seller/reviews"
            element={
              <PrivateRoute role="seller">
                <SellerProductReviews />
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


        <Route
          path="/gift-card"
          element={
            <PrivateRoute role="customer">
              <GiftCard />
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

<Route path="/products/:productId/reviews" element={<ProductReview />} />

        <Route
          path="/polls"
          element={
            <PrivateRoute role="customer">
              <CustomerPolls />
            </PrivateRoute>
          }
        />

        {/* Chat Route */}
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
