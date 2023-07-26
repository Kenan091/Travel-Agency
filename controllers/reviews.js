// @desc Get all reviews
// @route GET /reviews
// @access Public

exports.getReviews = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all reviews' });
};

// @desc Get single review
// @route GET /reviews/:id
// @access Public

exports.getReview = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Show review ${req.params.id}` });
};

// @desc Add new review
// @route POST /reviews
// @access Private

exports.createReview = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create new review' });
};

// @desc Update review
// @route PUT /reviews/:id
// @access Private

exports.updateReview = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update review ${req.params.id}` });
};
// @desc Delete review
// @route DELETE /reviews/:id
// @access Private

exports.deleteReview = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete review ${req.params.id}` });
};
