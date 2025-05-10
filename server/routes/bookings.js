const express = require('express');
const router = express.Router();
const {
  bookProvider,
  cancelBooking,
  getUserBookings,
  getProviderBookings,
  acceptBooking,
  getUserCoins
} = require('../controllers/Booking');

// Book a provider
router.post('/', bookProvider);

// Cancel a booking by booking ID
router.delete('/:bookingId', cancelBooking);

// Get bookings by user
router.get('/user/:userId', getUserBookings);

// Get user's coin balance
router.get('/user/:userId/coins', getUserCoins);


// Get bookings by provider
router.get('/provider/:providerId', getProviderBookings);

// Accept a booking
router.put('/:id/accept', acceptBooking);

module.exports = router;
