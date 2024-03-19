const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  departureDate: {
    type: Date,
    required: [true, 'Please add departure date'],
  },
  returnDate: {
    type: Date,
    required: [true, 'Please add return date'],
  },
  numberOfTravelers: {
    type: Number,
    required: [true, 'Please add a number of people'],
  },
  totalPrice: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  destination: {
    type: mongoose.Schema.ObjectId,
    ref: 'Destination',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Booking', BookingSchema);
