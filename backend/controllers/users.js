const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// @desc Get all users
// @route GET /users
// @access Private/Admin

exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get single user
// @route GET /users/:id
// @access Private/Admin

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc Create new user
// @route POST /users
// @access Private/Admin

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc Update user
// @route PUT /users/:id
// @access Private/Admin

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc Delete user
// @route DELETE /users/:id
// @access Private/Admin

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    return next(
      new ErrorResponse(`User with the id of ${userId} not found`, 404)
    );
  }

  await Booking.deleteMany({ user: userId });
  await Review.deleteMany({ user: userId });

  res.status(200).json({
    success: true,
    data: { id: userId },
  });
});
