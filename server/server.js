const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
require('dotenv').config();
const providerRoutes = require("./routes/providerRoutes"); 
const bookingRoutes = require("./routes/bookings");



const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

// Create the HTTP server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Set to your frontend URL
    methods: ['GET', 'POST']
  }
});

// Socket.IO logic for handling messages
io.on('connection', (socket) => {
  console.log("A user connected");

  // Join room on connection
  socket.on('join', (roomId) => {
    socket.join(roomId);
    console.log(`Joined room: ${roomId}`);
  });

  // Send message event
  socket.on('sendMessage', (data) => {
    console.log("Message received:", data);
    // Emit message to the room
    io.to(data.roomId).emit('receiveMessage', data);
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log("A user disconnected");
  });
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/bookings", bookingRoutes);



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { io, server };
