const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const mongoose = require("mongoose");

// Get bookings for a user
router.get("/bookings/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate("providerId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching customer bookings" });
  }
});

// Get detailed bookings for a user
router.get("/user/:userId", async (req, res) => {
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
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ error: "Failed to fetch user bookings" });
  }
});

// Create new booking
router.post("/", async (req, res) => {
  try {
    const { providerId, userId, date } = req.body;

    // Check for valid IDs
    if (!mongoose.Types.ObjectId.isValid(providerId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid provider or user ID" });
    }

    // Prevent providers from booking their own service
    if (providerId === userId) {
      return res.status(400).json({ error: "You cannot book your own service." });
    }

    const booking = new Booking({
      providerId: new mongoose.Types.ObjectId(providerId),
      userId: new mongoose.Types.ObjectId(userId),
      date,
      status: "pending",
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// Get bookings for a provider (with user details)
router.get("/:providerId", async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.params.providerId })
      .populate("userId", "fullName email phone address")
      .exec();
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Accept a booking
router.put("/:id/accept", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "accepted" },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    console.error("Booking accept error:", err);
    res.status(500).json({ error: "Failed to accept booking" });
  }
});

// Delete a booking
router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Booking delete error:", err);
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

module.exports = router;
