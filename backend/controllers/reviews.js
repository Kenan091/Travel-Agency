const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const Destination = require('../models/Destination');
const Review = require('../models/Review');

// @desc Get all reviews
// @route GET /reviews
// @route GET /destinations/:destinationId/reviews
// @access Public

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.destinationId) {
    const reviews = await Review.find({
      destination: req.params.destinationId,
    });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc Get single review
// @route GET /reviews/:id
// @access Public

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'destination',
    select: 'name description imageURL price availability',
  });

  if (!review) {
    return next(
      new ErrorResponse(`Review with the id of ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc Add new review
// @route POST /destinations/:destinationId/reviews
// @access Private

exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.destination = req.params.destinationId;
  req.body.user = req.user.id;

  const destination = await Destination.findById(req.params.destinationId);

  if (!destination) {
    return next(
      new ErrorResponse(
        `Destination with the id of ${req.params.destinationId} not found`
      ),
      404
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc Update review
// @route PUT /reviews/:id
// @access Private

exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review with the id of ${req.params.id} not found`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with the id of ${req.user.id} is not authorized to change review with the id of ${review._id}`,
        401
      )
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});
// @desc Delete review
// @route DELETE /reviews/:id
// @access Private

exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review with the id of ${req.params.id} not found`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with the id of ${req.user.id} is not authorized to delete review with the id of ${review._id}`,
        401
      )
    );
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
