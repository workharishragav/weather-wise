const express = require('express');
const {
  addLocation,
  getLocations,
  updateLocation,
  deleteLocation
} = require('../controllers/locationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Every favorite-location route requires authentication.
router.use(protect);

router.route('/')
  .get(getLocations)
  .post(addLocation);

router.route('/:id')
  .put(updateLocation)
  .delete(deleteLocation);

module.exports = router;
