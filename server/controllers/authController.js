const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key_here"; // Use .env in production

exports.signup = async (req, res) => {
  const { fullName, phone, address, email, password, role, category } = req.body;


  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Ensure category is provided if role is provider
    if (role === "provider" && !category) {
      return res.status(400).json({ message: "Category is required for providers" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const userData = {
      fullName,
      phone,
      address,
      email,
      password: hashedPassword,
      role,
      category: role === "provider" ? category : undefined // ✅ Store category only for providers
    };

    // Save user to database
    const user = await User.create(userData);

    res.status(201).json({
      message: "Signup successful",
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        category: user.category || null // ✅ Include category if provider
      }
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Signup error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Optional: Generate JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id, // ✅ Make sure this is included
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
    
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};