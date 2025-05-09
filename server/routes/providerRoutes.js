// routes/providers.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/:category", async (req, res) => {
  try {
    const providers = await User.find({
      role: "provider",
      category: req.params.category.charAt(0).toUpperCase() + req.params.category.slice(1),
    }).select("fullName address phone email address");

    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch providers" });
  }
});

module.exports = router;
