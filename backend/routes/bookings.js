const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  checkDestinationBooking,
} = require('../controllers/bookings');

const Booking = require('../models/Booking');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

router
  .route('/')
  .get(
    advancedResults(Booking, [
      {
        path: 'destination',
        select: 'name continents briefDescription imageURL price isPopular ',
      },
      { path: 'user', select: 'name email' },
    ]),
    getBookings
  )
  .post(protect, authorize('registeredUser', 'admin'), createBooking);

router
  .route('/:destinationId')
  .post(protect, authorize('registeredUser', 'admin'), createBooking);

router
  .route('/check/:destinationId')
  .post(protect, authorize('registeredUser'), checkDestinationBooking);

router
  .route('/:id')
  .get(getBooking)
  .put(protect, authorize('registeredUser', 'admin'), updateBooking)
  .delete(protect, authorize('registeredUser', 'admin'), deleteBooking);

module.exports = router;
