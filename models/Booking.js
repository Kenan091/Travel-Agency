const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: [true, 'Please add a destination'],
  },
  departureDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },
  numberOfTravelers: {
    type: Number,
    required: [true, 'Please add number of people'],
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please add total price'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});
