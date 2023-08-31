const asyncHandler = require("../middleware/async");
const Booking = require("../models/Booking");
const Destination = require("../models/Destination");
const ErrorResponse = require("../utils/errorResponse");
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
    path: "destination",
    select: "name description imageURL price availability",
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

  const isAvailable = await checkAvailability(
    destination,
    req.body.arrivalDate,
    req.body.departureDate
  );

  if (!isAvailable) {
    return res
      .status(400)
      .json({ message: "Destination is not available for selected dates" });
  }

  const booking = new Booking({
    arrivalDate: req.body.arrivalDate,
    departureDate: req.body.departureDate,
    numberOfTravelers: req.body.numberOfTravelers,
    destination: req.body.destination,
    user: req.body.user,
  });

  await booking.save();

  await updateDestinationAvailability(
    req.body.destination,
    req.body.arrivalDate,
    req.body.departureDate
  );

  // const booking = await Booking.create(req.body);

  res.status(201).json({ success: true, data: booking });
});
// @desc Check if destination is available for selected dates
// @route POST /bookings/check/:destinationId
// @access Private
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

  const isAvailable = await checkAvailability(
    destination,
    req.body.arrivalDate,
    req.body.departureDate
  );

  if (!isAvailable) {
    return res
      .status(400)
      .json({ message: "Destination is not available for selected dates" });
  }

  res.status(200).json({
    success: true,
    message: "Destination is available for selected dates",
  });
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

  if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
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

  if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with the id of ${req.user.id} is not authorized to delete booking with the id of ${booking._id}`
      )
    );
  }

  await booking.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

// Function to check destination availability
async function checkAvailability(destination, arrivalDate, departureDate) {
  const bookedDates = await Booking.find({
    destination: destination._id,
    arrivalDate: { $lt: departureDate },
    departureDate: { $gt: arrivalDate },
  });

  return bookedDates.length === 0;
}

// Function to update destination availability
async function updateDestinationAvailability(
  destination,
  arrivalDate,
  departureDate
) {
  await Destination.findByIdAndUpdate(destination._id, {
    $addToSet: {
      unavailableDates: { $gte: arrivalDate, $lte: departureDate },
    },
  });
}
