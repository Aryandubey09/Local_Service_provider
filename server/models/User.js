const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, enum: ["customer", "provider"], default: "customer", required: true },
  category: {
    type: String,
    enum: ["Plumber", "Carpenter", "Cleaner", "Electrician"],
    required: function () { return this.role === "provider"; } 
  },
  coins: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
