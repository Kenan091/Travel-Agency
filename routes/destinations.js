const express = require('express');
const {
  getDestinations,
  getDestination,
  addDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destinations');

const Destination = require('../models/Destination');
const advancedResults = require('../middleware/advancedResults');

const bookingRouter = require('./bookings');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use('/:destinationId/bookings', bookingRouter);

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
