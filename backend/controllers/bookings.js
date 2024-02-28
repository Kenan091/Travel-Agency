const asyncHandler = require('../middleware/async');
const Booking = require('../models/Booking');
const Destination = require('../models/Destination');
const Review = require('../models/Review');
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
    select: 'name briefDescription imageURL price',
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
// @route POST /bookings/:destinationId
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

  const reservationsWithinRange = await Booking.find({
    destination: destination._id,
    departureDate: { $lt: req.body.returnDate },
    returnDate: { $gt: req.body.departureDate },
  });

  if (reservationsWithinRange.length >= 50) {
    return res.status(400).json({
      message: 'Reservation limit for this destination has been reached',
    });
  }

  const reservation = new Booking({
    destination: destination._id,
    departureDate: req.body.departureDate,
    returnDate: req.body.returnDate,
    numberOfTravelers: req.body.numberOfTravelers,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
  });

  await reservation.save();

  // Update destination's reservations
  destination.reservations.push(reservation._id);
  await destination.save();

  res.status(201).json({ success: true, data: reservation });
});

exports.checkDestinationBooking = asyncHandler(async (req, res, next) => {
  req.body.destination = req.params.destinationId;

  const destination = await Destination.findById(req.params.destinationId);

  if (!destination) {
    return next(
      new ErrorResponse(
        `Destination with the id of ${req.params.destinationId} not found`
      ),
      404
    );
  }

  const reservationsWithinRange = await Booking.find({
    destination: destination._id,
    departureDate: req.body.departureDate,
    returnDate: req.body.returnDate,
  });

  let totalSeatsTaken = 0;

  reservationsWithinRange.forEach(reservation => {
    totalSeatsTaken += reservation.numberOfTravelers;
  });

  const availableSeats = 50 - totalSeatsTaken;

  if (totalSeatsTaken >= 50) {
    return res.status(200).json({
      message: 'Reservation limit for this destination has been reached',
    });
  } else {
    let message;
    if (availableSeats > 1) {
      message = `You have ${availableSeats} seats left`;
    } else if (availableSeats === 1) {
      message = 'You have only one seat left';
    } else {
      message = 'No seats available';
    }

    return res.status(200).json({ message });
  }
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

  const destination = await Destination.findById(booking.destination._id);

  if (!destination) {
    return next(
      new ErrorResponse(
        `Destination with the id of ${booking.destination._id} not found`,
        404
      )
    );
  }

  // Delete associated review
  await Review.deleteOne({ booking: req.params.id });

  // Remove booking from destination reservations
  destination.reservations = destination.reservations.filter(
    reservationId => reservationId.toString() !== booking._id.toString()
  );

  // Update average rating
  const reviews = await Review.find({ destination: destination._id });
  const totalReviews = reviews.length;
  const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  destination.averageRating =
    totalReviews > 0 ? totalRating / totalReviews : undefined;

  await destination.save();

  // Delete booking
  await Booking.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: { id: booking._id } });
});
