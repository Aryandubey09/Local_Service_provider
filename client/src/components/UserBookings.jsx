import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [providerId, setProviderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === "provider") {
      setProviderId(storedUser._id);
    } else {
      navigate("/provider-dashboard");
    }
  }, []);

  useEffect(() => {
    if (!providerId) return;

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/${providerId}`);
        setBookings(response.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [providerId]);

  const handleAcceptBooking = async (bookingId) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/accept`);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "accepted" } : b
        )
      );
    } catch (err) {
      console.error("Error accepting booking:", err);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 text-sm">
      <div className="flex items-center mb-4">
        <button
          onClick={handleBack}
          className="text-xl text-yellow-400 mr-3"
        >
          <AiOutlineArrowLeft />
        </button>
        <h3 className="text-xl font-semibold text-yellow-500">Your Bookings</h3>
      </div>

      {bookings.length === 0 ? (
        <p className="text-base text-gray-400">No bookings yet</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="mb-4 p-4 bg-gray-800 rounded-lg shadow-md"
          >
            <h4 className="text-lg text-yellow-400">
              Booking by: {booking.userId.fullName}
            </h4>
            <p>Email: {booking.userId.email}</p>
            <p>Phone: {booking.userId.phone}</p>
            <p>Address: {booking.userId.address}</p>
            <p>Date: {new Date(booking.date).toLocaleString()}</p>
            <p>Status: {booking.status}</p>
            <div className="flex space-x-3 mt-3">
              {booking.status !== "accepted" && (
                <button
                  onClick={() => handleAcceptBooking(booking._id)}
                  className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                >
                  Accept
                </button>
              )}
              <button
                onClick={() => handleDeleteBooking(booking._id)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserBookings;
