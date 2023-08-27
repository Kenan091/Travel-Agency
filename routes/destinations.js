const express = require('express');
const {
  getDestinations,
  getDestination,
  addDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destinations');

const Destination = require('../models/Destination');

const bookingRouter = require('./bookings');
const reviewRouter = require('./reviews');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use('/:destinationId/bookings', bookingRouter);
router.use('/:destinationId/reviews', reviewRouter);

router
  .route('/')
  .get(advancedResults(Destination), getDestinations)
  .post(protect, authorize('admin'), addDestination);
router
  .route('/:id')
  .get(getDestination)
  .put(protect, authorize('admin'), updateDestination)
  .delete(protect, authorize('admin'), deleteDestination);

module.exports = router;
