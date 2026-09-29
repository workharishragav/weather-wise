const express = require('express');
const { getInsights } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Path matches the reference document's literal Postman example
// (POST /api/ai/weather-recommendation), not the earlier /insights name.
router.post('/weather-recommendation', protect, getInsights);

module.exports = router;
