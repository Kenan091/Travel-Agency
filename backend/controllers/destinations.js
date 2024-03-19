const asyncHandler = require('../middleware/async');
const Destination = require('../models/Destination');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');

exports.getDestinations = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

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

exports.addDestination = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const destination = await Destination.create(req.body);

  res.status(201).json({ success: true, data: destination });
});

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

  res.status(200).json({ success: true, data: { id: destination.id } });
});
