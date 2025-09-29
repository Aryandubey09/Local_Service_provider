import React, { useState, useEffect } from 'react';
import "../app.css";
import CategoriesSection from './CategoriesSection';
import HeroSection from '../components/HeroSection';
import CustmoerReviews from '../components/CustmoerReviews';
import SignInModel from '../components/SignInModel';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [coins, setCoins] = useState(0);
  const [coinTrigger, setCoinTrigger] = useState(false);

  const userId = localStorage.getItem("userId");

  const increment = () => setCoins(coins + 5);
  const decrement = () => setCoins(coins - 5);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
      setCoinTrigger(prev => !prev);
    }
  }, []);

  useEffect(() => {
    const fetchCoins = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`https://local-service-provider-5.onrender.com/api/bookings/user/${userId}/coins`);
        setCoins(res.data.coins);
      } catch (err) {
        console.error("Error fetching coins:", err);
      }
    };
    fetchCoins();
  }, [coinTrigger, userId]);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userId", userData._id);
    setCoinTrigger(prev => !prev);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    setDropdownOpen(false);
  };

  const handleBook = async () => {
    try {
      const response = await axios.post(
        `https://local-service-provider-5.onrender.com/api/bookings`,
        { userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );
      if (response.status === 200) {
        setCoins(prevCoins => prevCoins + 5); // ✅ increase by 5
        setCoinTrigger(prev => !prev);
      }
    } catch (error) {
      console.error("Error booking:", error);
    }
  };

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <div className="font-sans min-h-screen relative" onClick={closeDropdown}>
      {!isLoggedIn && (
        <button
          className="fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 z-50"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          Sign In
        </button>
      )}

      {user && (
        <div className="fixed top-4 right-24 bg-yellow-300 px-3 py-1 rounded-full shadow z-50 font-semibold text-sm">
          🪙 Coins: {coins}
        </div>
      )}

      {user && (
        <div className="fixed top-4 right-4 z-50" onClick={(e) => e.stopPropagation()}>
          <div
            onClick={toggleDropdown}
            className="w-10 h-10 bg-white border-2 border-black text-black font-bold flex items-center justify-center rounded-full cursor-pointer"
          >
            {user.email?.[0]?.toUpperCase()}
          </div>

          {dropdownOpen && (
            <div className="flex flex-col absolute top-12 right-0 bg-white border border-gray-300 shadow-lg rounded-md text-sm w-40 z-50">
              <Link
                to="/my-profile"
                className="px-4 py-2 hover:bg-gray-100 border-b"
                onClick={closeDropdown}
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-gray-100 text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {user && (
        <Link
          to="/user-bookings"
          className="fixed top-4 left-4 bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 z-40 text-sm md:text-base"
        >
          Your Bookings
        </Link>
      )}

      <SignInModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogin={handleLogin}
      />

      <HeroSection />
      <CategoriesSection coins={coins} increment={increment} />

      <section className="py-16 bg-gray-400 text-center">
        <h2 className="text-2xl font-bold mb-8">How It Works</h2>
        <div className="flex justify-center gap-10 flex-wrap">
          {[
            { step: '1', title: 'Search', desc: 'Find professionals in your area' },
            { step: '2', title: 'Book', desc: 'Choose a provider and schedule' },
            { step: '3', title: 'Get Service', desc: 'Get the job done, hassle-free' }
          ].map((item, i) => (
            <div key={i} className="text-center w-48">
              <div className="text-4xl font-bold text-blue-500 mb-2">{item.step}</div>
              <div className="font-semibold mb-1">{item.title}</div>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <CustmoerReviews />

      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-2xl font-bold mb-8">Why Choose Us</h2>
        <div className="flex justify-center gap-10 flex-wrap">
          {[
            { title: 'Verified Professionals', icon: '🛡️' },
            { title: 'Customer Ratings', icon: '⭐' },
            { title: 'Fast and Easy Booking', icon: '⏱️' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md w-64">
              <div className="text-4xl mb-2">{item.icon}</div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.title} and more</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-green-700 text-black py-6 text-center">
        <div className="flex justify-center gap-8 flex-wrap">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">Terms</a>
        </div>
        <div className="mt-4 flex justify-center gap-4">
          <i className="fab fa-facebook text-black"></i>
          <i className="fab fa-twitter"></i>
          <i className="fab fa-instagram"></i>
        </div>
      </footer>
    </div>
  );
};

export default Home;
