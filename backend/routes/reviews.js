const express = require('express');
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviews');

const Review = require('../models/Review');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Review, [
      {
        path: 'destination',
        select: 'name briefDescription imageURL price',
      },
      { path: 'user', select: 'name email' },
    ]),
    getReviews
  )
  .post(protect, authorize('registeredUser', 'admin'), addReview);
router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('registeredUser', 'admin'), updateReview)
  .delete(protect, authorize('registeredUser', 'admin'), deleteReview);

module.exports = router;
