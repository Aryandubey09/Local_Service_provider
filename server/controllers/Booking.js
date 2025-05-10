const mongoose = require("mongoose");
const Booking = require('../models/Booking');
const User = require('../models/User');

// Book a provider
const bookProvider = async (req, res) => {
  try {
    const { providerId, userId, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(providerId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid provider or user ID" });
    }

    if (providerId === userId) {
      return res.status(400).json({ error: "You cannot book your own service." });
    }

    const booking = new Booking({
      providerId,
      userId,
      date,
      status: 'pending'
    });

    await booking.save();
    await User.findByIdAndUpdate(userId, { $inc: { coins: 1 } });

    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

// Cancel a booking by ID and deduct coins
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await User.findByIdAndUpdate(booking.userId, { $inc: { coins: -1 } });

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};

// Get all bookings made by a user
const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const bookings = await Booking.find({ userId })
      .populate("providerId", "fullName email phone")
      .exec();

    res.json(bookings);
  } catch (err) {
    console.error("Fetch user bookings error:", err);
    res.status(500).json({ error: "Failed to fetch user bookings" });
  }
};

// Get user's coin balance
const getUserCoins = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId).select("coins");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ coins: user.coins });
  } catch (err) {
    console.error("Fetch user coins error:", err);
    res.status(500).json({ error: "Failed to fetch user coins" });
  }
};


// Get all bookings received by a provider
const getProviderBookings = async (req, res) => {
  try {
    const providerId = req.params.providerId;

    if (!mongoose.Types.ObjectId.isValid(providerId)) {
      return res.status(400).json({ error: "Invalid provider ID" });
    }

    const bookings = await Booking.find({ providerId })
      .populate("userId", "fullName email phone address")
      .exec();

    res.json(bookings);
  } catch (err) {
    console.error("Fetch provider bookings error:", err);
    res.status(500).json({ error: "Failed to fetch provider bookings" });
  }
};

// Accept a booking
const acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "accepted" },
      { new: true }
    );

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.json(booking);
  } catch (err) {
    console.error("Accept booking error:", err);
    res.status(500).json({ error: "Failed to accept booking" });
  }
};

module.exports = {
  bookProvider,
  cancelBooking,
  getUserCoins,
  getUserBookings,
  getProviderBookings,
  acceptBooking
};
