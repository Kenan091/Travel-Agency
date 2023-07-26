// @desc Get all users
// @route GET /users
// @access Public

exports.getUsers = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all users' });
};

// @desc Get single user
// @route GET /users/:id
// @access Public

exports.getUser = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Show user ${req.params.id}` });
};

// @desc Add new user
// @route POST /users
// @access Private

exports.createUser = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'New user created' });
};

// @desc Update user
// @route PUT /users/:id
// @access Private

exports.updateUser = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Update user ${req.params.id}` });
};
// @desc Delete user
// @route DELETE /users/:id
// @access Private

exports.deleteUser = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Delete user ${req.params.id}` });
};
