import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [bookedProviders, setBookedProviders] = useState(new Set());
  const [searchState, setSearchState] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data } = await axios.get(
  `http://localhost:5000/api/providers/${categoryName.toLowerCase()}`
);

        setProviders(data);
        setFilteredProviders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching providers:", error);
        setLoading(false);
      }
    };

    fetchProviders();
  }, [categoryName]);

  const handleSearch = () => {
    const filtered = providers.filter((pro) =>
      pro.address?.toLowerCase().startsWith(searchState.toLowerCase())
    );
    setFilteredProviders(filtered);
  };

  const resetSearch = () => {
    setSearchState("");
    setFilteredProviders(providers);
  };

  const handleBooking = async (providerId) => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?._id) {
      alert("Please log in first.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/bookings", {
        providerId,
        userId: storedUser._id,
        date: selectedDate,
      });

      setBookedProviders((prev) => new Set(prev).add(providerId));
      toast.success("Booking successful!");
      setSelectedProviderId(null);
      setSelectedDate(null);
    } catch (error) {
      console.error("Error booking provider:", error);
      alert("Booking failed.");
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gradient-to-tr from-pink-200 via-purple-200 to-yellow-100">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500 hover:text-blue-700 flex items-center"
      >
        <FaArrowLeft size={24} /> <span className="ml-2">Back</span>
      </button>

      <h2 className="text-4xl font-extrabold text-center text-purple-700 drop-shadow mb-8">
        {categoryName?.charAt(0).toUpperCase() + categoryName?.slice(1)} Professionals
      </h2>

      {/* Search Input */}
      <div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-2">
        <input
          type="text"
          placeholder="Enter state name"
          value={searchState}
          onChange={(e) => setSearchState(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64"
        />
        <button
          onClick={handleSearch}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Search
        </button>
        <button
          onClick={resetSearch}
          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 text-lg">Loading providers...</p>
      ) : filteredProviders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No professionals found for this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProviders.map((pro) => (
            <div
              key={pro._id}
              className="bg-white rounded-lg shadow-md p-4 transform hover:scale-105 transition duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{pro.fullName}</h3>
              <p className="text-sm text-black-600 mb-1">📧 {pro.email}</p>
              <p className="text-sm text-black-600 mb-1">📍{pro.address}</p>
              <p className="text-sm text-gray-600 mb-1">📞 {pro.phone}</p>

              {!bookedProviders.has(pro._id) && selectedProviderId === pro._id && (
                <div className="mb-3 relative">
                  <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
                    <span className="mr-2 text-gray-500">📅</span>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      placeholderText="Select date"
                      className="outline-none w-full"
                    />
                  </div>
                </div>
              )}

              {/* Button Logic */}
              {bookedProviders.has(pro._id) ? (
                <button className="bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed" disabled>
                  Booked
                </button>
              ) : selectedProviderId === pro._id ? (
                <button
                  onClick={() => handleBooking(pro._id)}
                  className="bg-green-500 text-white py-2 px-4 rounded-md"
                >
                  Confirm Booking
                </button>
              ) : (
                <button
                  onClick={() => setSelectedProviderId(pro._id)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  Book
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;