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

// BookingSchema.pre('remove', async function (next) {
//   // Remove associated reviews when a booking is deleted
//   await mongoose.model('Review').deleteMany({ booking: this._id });
//   next();
// });
// BookingSchema.pre('remove', async function (next) {
//   try {
//     console.log(`Removing reviews associated with booking: ${this._id}`);
//     const result = await mongoose
//       .model('Review')
//       .deleteMany({ booking: this._id });
//     console.log(`${result.deletedCount} reviews deleted.`);
//     next();
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// });

module.exports = mongoose.model('Booking', BookingSchema);
