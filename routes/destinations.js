const express = require('express');
const {
  getDestinations,
  getDestination,
  addDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destinations');

const router = express.Router();

router.route('/').get(getDestinations).post(addDestination);
router
  .route('/:id')
  .get(getDestination)
  .put(updateDestination)
  .delete(deleteDestination);

module.exports = router;
