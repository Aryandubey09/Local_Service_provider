import React from 'react';
import './app.css';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importing Pages and Components
import Home from './pages/Home';
import Category from './components/Category';
import UserBookings from './components/UserBookings';
import MyProfile from './pages/MyProfile';
import ProviderDashboard from './pages/ProviderDashboard';

function App() {
  return (
    <>
      {/* Toast Notifications Container */}
      <ToastContainer />

      {/* Routes for different pages */}
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
