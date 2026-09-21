const { generateWeatherInsight } = require('../services/aiService');

/**
 * POST /api/ai/weather-recommendation
 * Authenticated — generates a natural-language summary and a personalized
 * activity/clothing recommendation for the given weather data.
 * Path matches the reference document's literal Postman example. Minimum
 * required body fields (city, temperature, condition) also match that
 * example; humidity/windSpeed/feelsLike are optional enrichments.
 */
const getInsights = async (req, res, next) => {
  try {
    const { city, temperature, humidity, windSpeed, condition, feelsLike } = req.body;

    if (!city || temperature === undefined || temperature === null || !condition) {
      res.status(400);
      throw new Error('Please provide at least city, temperature and condition');
    }

    const insight = await generateWeatherInsight({
      city, temperature, humidity, windSpeed, condition, feelsLike
    });

    res.status(200).json({
      success: true,
      summary: insight.summary,
      recommendation: insight.recommendation,
      fallback: insight.fallback
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

module.exports = { getInsights };
