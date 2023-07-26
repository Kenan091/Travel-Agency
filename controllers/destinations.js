// @desc Get all destinations
// @route GET /destinations
// @access Public

exports.getDestinations = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all destinations' });
};

// @desc Get single destination
// @route GET /destinations/:id
// @access Public

exports.getDestination = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show destination ${req.params.id}` });
};

// @desc Add new destination
// @route POST /destinations
// @access Private

exports.addDestination = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Add new destination' });
};

// @desc Update destination
// @route PUT /destinations/:id
// @access Private

exports.updateDestination = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update destination ${req.params.id}` });
};
// @desc Delete destination
// @route DELETE /destinations/:id
// @access Private

exports.deleteDestination = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete destination ${req.params.id}` });
};
