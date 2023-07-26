// @desc Get all bookings
// @route GET /bookings
// @access Public

exports.getBookings = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all bookings' });
};

// @desc Get single booking
// @route GET /bookings/:id
// @access Public

exports.getBooking = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Show booking ${req.params.id}` });
};

// @desc Add new booking
// @route POST /bookings
// @access Private

exports.createBooking = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create new booking' });
};

// @desc Update booking
// @route PUT /bookings/:id
// @access Private

exports.updateBooking = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update booking ${req.params.id}` });
};
// @desc Delete booking
// @route DELETE /bookings/:id
// @access Private

exports.deleteBooking = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete booking ${req.params.id}` });
};
