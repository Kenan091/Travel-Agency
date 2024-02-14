const asyncHandler = require('../middleware/async');
const Feedback = require('../models/Feedback');
const ErrorResponse = require('../utils/errorResponse');

// @desc Get all feedback
// @route GET /feedbacks
// @access Public

exports.getFeedbacks = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Add new feedback
// @route POST /feedbacks
// @access Public

exports.addFeedback = asyncHandler(async (req, res, next) => {
  // req.body.user = req.user.id;

  const feedback = await Feedback.create(req.body);

  res.status(201).json({ success: true, data: feedback });
});

// @desc Delete feedback
// @route DELETE /feedbacks/:id
// @access Private/Admin

exports.deleteFeedback = asyncHandler(async (req, res, next) => {
  await Feedback.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: { id: req.params.id },
  });
});
