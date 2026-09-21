const express = require('express');
const { getWeather } = require('../controllers/weatherController');

const router = express.Router();

// Public: weather users can consume current metrics without an account
// (locked decision e).
router.get('/:city', getWeather);

module.exports = router;
