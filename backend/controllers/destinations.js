const asyncHandler = require('../middleware/async');
const Destination = require('../models/Destination');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');

// @desc Get all destinations
// @route GET /destinations
// @access Public

exports.getDestinations = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get single destination
// @route GET /destinations/:id
// @access Public

exports.getDestination = asyncHandler(async (req, res, next) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    return next(
      new ErrorResponse(
        `Destination with the id of ${req.params.id} not found`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: destination });
});

// @desc Add new destination
// @route POST /destinations
// @access Private

exports.addDestination = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const destination = await Destination.create(req.body);

  res.status(201).json({ success: true, data: destination });
});

// @desc Update destination
// @route PUT /destinations/:id
// @access Private

exports.updateDestination = asyncHandler(async (req, res, next) => {
  let destination = await Destination.findById(req.params.id);

  if (!destination) {
    return next(
      new ErrorResponse(
        `Destination with the id of ${req.params.id} not found`,
        404
      )
    );
  }

  destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: destination });
});

// @desc Delete destination
// @route DELETE /destinations/:id
// @access Private

exports.deleteDestination = asyncHandler(async (req, res, next) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    return next(
      new ErrorResponse(
        `Destination with the id of ${req.params.id} not found`,
        404
      )
    );
  }

  await destination.deleteOne();
  await Booking.deleteMany({ destination: req.params.id });
  await Review.deleteMany({ destination: req.params.id });

  res.status(200).json({ success: true, data: {} });
});
