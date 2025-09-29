import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import { FaComments } from "react-icons/fa";
import ChatPopup from "../pages/ChatPopup"; // make sure this path is correct

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [bookedProviders, setBookedProviders] = useState(new Set());
  const [searchState, setSearchState] = useState("");
  const [chatOpenFor, setChatOpenFor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data } = await axios.get(
          `https://local-service-provider-5.onrender.com/api/providers/${categoryName.toLowerCase()}`
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

  const storedUser = JSON.parse(localStorage.getItem("user"));

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
     toast.error("Please select date.");
      return;
    }
    if (!storedUser?._id) {
      toast.error("Please log in first .");
      return;
    }
    try {
      await axios.post("https://local-service-provider-5.onrender.com/api/bookings", {
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

  const isProvider = storedUser?.role === "provider"; // Check if the logged-in user is a provider

  return (
    <div className="p-4 min-h-screen bg-gradient-to-tr from-indigo-600 via-green-500 to-pink-500">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-black hover:text-blue-700 flex items-center"
      >
        <FaArrowLeft size={24} /> <span className="ml-2">Back</span>
      </button>
      <h2 className="text-4xl font-extrabold text-center text-red-300 mb-8 drop-shadow-md">
        {categoryName?.charAt(0).toUpperCase() + categoryName?.slice(1)} Professionals
      </h2>
      <div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-2">
        <input
          type="text"
          placeholder="Enter state name"
          value={searchState}
          onChange={(e) => setSearchState(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-full sm:w-64 focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
        <button
          onClick={resetSearch}
          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-200 text-lg">Loading providers...</p>
      ) : filteredProviders.length === 0 ? (
        <p className="text-center text-gray-200 text-lg">No professionals found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProviders.map((pro) => (
            <div
              key={pro._id}
              className={`p-4 rounded-2xl shadow-xl transition-transform transform hover:scale-105
                bg-gradient-to-br ${
                  pro._id.length % 2 === 0
                    ? "from-[#a1c4fd] to-[#c2e9fb]" // blue watercolor
                    : "from-[#fbc2eb] to-[#a6c1ee]" // pink watercolor
                }`}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">{pro.fullName}</h3>
              <p className="text-sm text-gray-800">📧 {pro.email}</p>
              <p className="text-sm text-gray-800">📍 {pro.address}</p>
              <p className="text-sm text-gray-800">📞 {pro.phone}</p>

              {!bookedProviders.has(pro._id) && selectedProviderId === pro._id && (
                <div className="mb-3 mt-2">
                  <div className="flex items-center border rounded-md px-3 py-2 bg-white shadow-sm">
                    <span className="mr-2 text-gray-500">📅</span>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      placeholderText="Select date"
                      className="outline-none w-full text-gray-800"
                    />
                  </div>
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {bookedProviders.has(pro._id) ? (
                  <button
                    className="bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed"
                    disabled
                  >
                    Booked
                  </button>
                ) : !isProvider && selectedProviderId === pro._id ? (
                  <button
                    onClick={() => handleBooking(pro._id)}
                    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                  >
                    Confirm Booking
                  </button>
                ) : !isProvider && (
                  <button
                    onClick={() => setSelectedProviderId(pro._id)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  >
                    Book
                  </button>
                )}

                <button
                  onClick={() => {
                    if (!storedUser?._id) {
                      toast.error("Please log in first to start chat.");
                      return;
                    }
                    setChatOpenFor(pro._id);
                  }}
                  className="bg-yellow-400 text-white p-2 rounded-full hover:bg-yellow-500 transition"
                >
                  <FaComments />
                </button>
              </div>

              {chatOpenFor === pro._id && (
                <ChatPopup
                  isOpen={chatOpenFor === pro._id}
                  onClose={() => setChatOpenFor(null)}
                  userId={storedUser._id}
                  providerId={pro._id}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
