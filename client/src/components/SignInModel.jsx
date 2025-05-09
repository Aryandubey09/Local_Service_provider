import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react"; // 👈 import icons

const SignInModel = ({ isOpen, onClose, onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 state to toggle
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("customer");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });

        const { user, token } = res.data;

        toast.success("Login successful!");
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        onLogin(user);

        // Redirect both customers and providers to homepage
        navigate("/"); // Always go to homepage

        onClose(); // Close modal after login
      } else {
        await axios.post("http://localhost:5000/api/auth/signup", {
          fullName,
          phone,
          email,
          password,
          address: address || "N/A",
          role,
          category: role === "provider" ? category : null,
        });
        toast.success("Signup successful! Please log in.");
        setIsLoginMode(true);
      }
    } catch (err) {
      console.error("Login/Signup Error:", err);
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gradient-to-br from-sky-300 via-purple-400 to-pink-300 p-6 rounded-xl w-[90%] max-w-md relative shadow-2xl text-white">
        <button
          className="absolute top-2 right-2 text-white text-xl hover:text-red-200"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLoginMode ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Sign Up fields */}
          {!isLoginMode && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border px-3 py-2 rounded text-black bg-white"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                className="w-full border px-3 py-2 rounded text-black bg-white"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full border px-3 py-2 rounded text-black bg-white"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />

              <div className="flex gap-4 items-center">
                <label className="text-black">
                  <input
                    type="radio"
                    value="customer"
                    checked={role === "customer"}
                    onChange={(e) => setRole(e.target.value)}
                    className="mr-1"
                  />
                  As Customer
                </label>
                <label className="text-black">
                  <input
                    type="radio"
                    value="provider"
                    checked={role === "provider"}
                    onChange={(e) => setRole(e.target.value)}
                    className="mr-1"
                  />
                  As Provider
                </label>
              </div>

              {role === "provider" && (
                <select
                  className="w-full border px-3 py-2 rounded text-black bg-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Service Category
                  </option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Cleaner">Cleaner</option>
                  <option value="Electrician">Electrician</option>
                </select>
              )}
            </>
          )}

          {/* Common fields for both Login and SignUp */}
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded text-black bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password input with eye icon */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border px-3 py-2 rounded text-black bg-white pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-2 top-1/2 -translate-y-1/2 transition-colors ${
                password ? "text-black" : "text-gray-500"
              }`}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white font-semibold py-2 rounded hover:opacity-90 transition-all duration-300"
          >
            {isLoginMode ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-4">
          {isLoginMode ? (
            <p>
              Don’t have an account?{" "}
              <button
                className="text-blue-200 underline"
                onClick={() => setIsLoginMode(false)}
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                className="text-blue-200 underline"
                onClick={() => setIsLoginMode(true)}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInModel;
