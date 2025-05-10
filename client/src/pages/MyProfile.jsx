import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        role: '' // Keep role empty so user selects it manually
      });
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    alert("Profile updated!");
    navigate('/');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
  {/* Blurred Background Layer */}
  <div
    className="absolute inset-0 bg-cover bg-center blur-sm scale-110"
    style={{ backgroundImage: "url('/images/background.jpg')" }}
  ></div>
      
  <div className="relative z-10 bg-gray-800 bg-opacity-80 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
     <button
    onClick={() => navigate(-1)}
    className="mb-4 text-sm text-gray-300 hover:text-white flex items-center gap-1"
  >
    ← Back
  </button>
  
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">
          Edit Profile
        </h2>

        {/* Name */}
        <div className="mb-5">
          <label className="block font-medium text-gray-300 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            readOnly
            className="w-full bg-gray-600 border border-gray-600 text-gray-300 p-3 rounded-lg cursor-not-allowed opacity-80"
          />
        </div>

        {/* Phone */}
        <div className="mb-5">
          <label className="block font-medium text-gray-300 mb-2">Phone</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="Enter phone number"
          />
        </div>

        {/* Address */}
        <div className="mb-5">
          <label className="block font-medium text-gray-300 mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={user.address}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="Enter your address"
          />
        </div>

        {/* Role */}
        <div className="mb-6">
          <label className="block font-medium text-gray-300 mb-2">Role</label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
          >
            <option value="" className="bg-gray-700">Select Role</option>
            <option value="customer" className="bg-gray-700">Customer</option>
            <option value="provider" className="bg-gray-700">Provider</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 transform hover:scale-[1.01]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default MyProfile;