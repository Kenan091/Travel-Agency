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
    }).populate('user destination booking');

    // return res.status(200).json(res.advancedResults);
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
    select: 'name briefDescription imageURL price',
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

// exports.addReview = asyncHandler(async (req, res, next) => {
//   req.body.destination = req.params.destinationId;
//   req.body.user = req.user.id;
//   req.body.booking = req.body.bookingId;

//   const destination = await Destination.findById(req.params.destinationId);

//   if (!destination) {
//     return next(
//       new ErrorResponse(
//         `Destination with the id of ${req.params.destinationId} not found`,
//         404
//       )
//     );
//   }

//   const review = await Review.create(req.body);

//   res.status(201).json({
//     success: true,
//     data: review,
//   });
// });
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.destination = req.params.destinationId;
  req.body.user = req.user.id;
  req.body.booking = req.body.bookingId;

  const destination = await Destination.findById(req.params.destinationId);

  if (!destination) {
    return next(
      new ErrorResponse(
        `Destination with the id of ${req.params.destinationId} not found`,
        404
      )
    );
  }

  const review = await Review.create(req.body);

  // Recalculate average rating
  const reviews = await Review.find({ destination: destination._id });
  const totalReviews = reviews.length;
  const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  destination.averageRating =
    totalReviews > 0 ? totalRating / totalReviews : undefined;

  await destination.save();

  res.status(201).json({
    success: true,
    data: {
      review,
      averageRating: destination.averageRating,
    },
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

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with the id of ${req.user.id} is not authorized to change review with the id of ${review._id}`,
        401
      )
    );
  }

  const { comment } = req.body;
  review.comment = comment;

  await review.save();

  review = await Review.findById(req.params.id).populate(
    'user destination booking'
  );

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

  const destination = await Destination.findById(review.destination._id);

  if (!destination) {
    return next(
      new ErrorResponse(`Destination associated with the review not found`, 404)
    );
  }

  // Delete review
  await Review.findOneAndDelete({ _id: review._id });

  // Recalculate average rating
  const reviews = await Review.find({ destination: destination._id });
  const totalReviews = reviews.length;
  const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  destination.averageRating =
    totalReviews > 0 ? totalRating / totalReviews : undefined;

  await destination.save();

  if (req.params.destinationId) {
    const reviews = await Review.find({
      destination: req.params.destinationId,
    });
  }

  res.status(200).json({
    success: true,
    data: {
      id: review._id,
      reviews: reviews,
      averageRating: destination.averageRating,
    },
  });
});
