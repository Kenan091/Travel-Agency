const express = require('express');
const {
  getFeedbacks,
  addFeedback,
  deleteFeedback,
} = require('../controllers/feedbacks');

const Feedback = require('../models/Feedback');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(advancedResults(Feedback), getFeedbacks)
  .post(addFeedback);
router.route('/:id').delete(protect, authorize('admin'), deleteFeedback);

module.exports = router;
