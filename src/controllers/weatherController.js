const { getWeatherByCity } = require('../services/weatherService');

/**
 * GET /api/weather/:city
 * Public endpoint (per locked decision e) — no authentication required.
 */
const getWeather = async (req, res, next) => {
  try {
    const { city } = req.params;

    if (!city || !city.trim()) {
      res.status(400);
      throw new Error('Please provide a city name');
    }

    const weather = await getWeatherByCity(city.trim());

    res.status(200).json({ success: true, data: weather });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

module.exports = { getWeather };
