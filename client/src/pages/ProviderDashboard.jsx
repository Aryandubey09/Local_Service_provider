import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";

const ProviderDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === "customer") {
      setUser(storedUser);
    } else {
      navigate("/user-bookings"); // Redirect if user is not a customer
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/user/${user._id}`);
        setBookings(response.data);
      } catch (err) {
        console.error("Error fetching customer bookings:", err);
      }
    };

    fetchBookings();
  }, [user]);

  // Function to cancel a booking
 const cancelBooking = async (bookingId) => {
  try {
    await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
    // Remove the canceled booking from the state
    setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
  } catch (err) {
    console.error("Error canceling booking:", err);
  }
};


  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 text-sm">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate("/")}
          className="text-xl text-yellow-400 mr-3"
        >
          <AiOutlineArrowLeft />
        </button>
        <h3 className="text-xl font-semibold text-yellow-500">Your Bookings</h3>
      </div>

      {bookings.length === 0 ? (
        <p className="text-base text-gray-400">No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="mb-4 p-4 bg-gray-800 rounded-lg shadow-md"
          >
            <h4 className="text-lg text-yellow-400">
              Provider: {booking.providerId?.fullName || "N/A"}
            </h4>
            <p>Email: {booking.providerId?.email}</p>
            <p>Phone: {booking.providerId?.phone}</p>

            <p>Date: {new Date(booking.date).toLocaleString()}</p>
            <p>Status: {booking.status}</p>
            <div className="flex space-x-3 mt-3">
              {/* Cancel Booking Button */}
              <button
                onClick={() => cancelBooking(booking._id)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ))
      )}

      {/* Displaying user's coin count */}
      <div className="mt-4 text-yellow-400">
        <p>Your Coin Balance: {user?.coins}</p>
      </div>
    </div>
  );
};

export default ProviderDashboard;
