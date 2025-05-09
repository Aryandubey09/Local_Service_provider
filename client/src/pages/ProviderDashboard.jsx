import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProviderDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === "customer") {
      setCustomerId(storedUser._id);
    } else {
      navigate("/user-bookings"); // redirect providers to their bookings
    }
  }, []);

  useEffect(() => {
    if (!customerId) return;

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/user/${customerId}`);
        setBookings(response.data);
      } catch (err) {
        console.error("Error fetching customer bookings:", err);
      }
    };

    fetchBookings();
  }, [customerId]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Your Bookings</h3>
        <button
          onClick={handleLogout}
          className="bg-gray-800 text-white py-1 px-3 rounded-md"
        >
          Logout
        </button>
      </div>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="mb-4 p-4 border rounded-md">
            <h4>Provider: {booking.providerId?.fullName || "N/A"}</h4>
            <p>Email: {booking.providerId?.email}</p>
            <p>Phone: {booking.providerId?.phone}</p>
            <p>Address: {booking.providerId?.address}</p>
            <p>Date: {new Date(booking.date).toLocaleString()}</p>
            <p>Status: {booking.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ProviderDashboard;
