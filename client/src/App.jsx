import React from 'react'
import "./app.css"
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Category from "./components/Category";




import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProviderDashboard from './pages/ProviderDashboard';
import UserBookings from './components/UserBookings';
import MyProfile from './pages/MyProfile';

function App() {
  return (
    <>
      <ToastContainer /> {/* ✅ Correct place */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-bookings" element={<UserBookings />} />
        <Route path="/category/:categoryName" element={<Category />} />
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/my-profile" element={<MyProfile />} />

      </Routes>
    </>
  );
}

export default App;
