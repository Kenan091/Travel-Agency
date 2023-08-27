const asyncHandler = require('../middleware/async');
const Booking = require('../models/Booking');
const Destination = require('../models/Destination');
const ErrorResponse = require('../utils/errorResponse');
// @desc Get all bookings
// @route GET /bookings
// @route GET /destinations/:destinationId/bookings
// @access Public

exports.getBookings = asyncHandler(async (req, res, next) => {
  if (req.params.destinationId) {
    const bookings = await Booking.find({
      destination: req.params.destinationId,
    });
    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc Get single booking
// @route GET /bookings/:id
// @access Public

exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate({
    path: 'destination',
    select: 'name description imageURL price availability',
  });

  if (!booking) {
    return next(
      new ErrorResponse(
        `Booking with the id of ${req.params.id} not found`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: booking });
});

// @desc Add new booking
// @route POST /bookings
// @access Private

exports.createBooking = asyncHandler(async (req, res, next) => {
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

  const booking = await Booking.create(req.body);

  res.status(201).json({ success: true, data: booking });
});

// @desc Update booking
// @route PUT /bookings/:id
// @access Private

exports.updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(
        `Booking with the id of ${req.params.id} not found`,
        404
      )
    );
  }

  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with the id of ${req.user.id} is not authorized to change booking with the id of ${booking._id}`
      )
    );
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: booking });
});
// @desc Delete booking
// @route DELETE /bookings/:id
// @access Private

exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(
        `Booking with the id of ${req.params.id} not found`,
        404
      )
    );
  }

  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with the id of ${req.user.id} is not authorized to delete booking with the id of ${booking._id}`
      )
    );
  }

  await booking.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
