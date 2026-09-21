const axios = require('axios');

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Deterministic, clearly-labeled fallback weather data.
 * Used only when OPENWEATHER_API_KEY is not configured, per the reference
 * document's Description section: "a resilient fallback mode ensuring API
 * functionality even without external API keys."
 *
 * Field names (windSpeed, isMock) match the reference document's literal
 * Postman example response for this endpoint. feelsLike and message are
 * additive fields beyond that example, not a contradiction of it.
 */
const buildFallbackWeather = (city) => ({
  city,
  temperature: 25,
  humidity: 50,
  windSpeed: 10,
  condition: 'Clear',
  feelsLike: 25,
  isMock: true,
  message: 'OPENWEATHER_API_KEY is not configured — showing simulated fallback data.'
});

/**
 * Fetches current weather for a city from OpenWeatherMap.
 * Falls back to simulated data if no API key is configured.
 * Throws an Error with a .statusCode for the controller to relay.
 */
const getWeatherByCity = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return buildFallbackWeather(city);
  }

  try {
    const response = await axios.get(OPENWEATHER_BASE_URL, {
      params: { q: city, appid: apiKey, units: 'metric' },
      timeout: 8000
    });

    const data = response.data;

    return {
      city: data.name || city,
      temperature: data.main?.temp,
      humidity: data.main?.humidity,
      windSpeed: data.wind?.speed,
      condition: data.weather?.[0]?.main || 'Unknown',
      feelsLike: data.main?.feels_like,
      isMock: false
    };
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        const notFoundError = new Error(`City "${city}" was not found`);
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      if (error.response.status === 401) {
        const authError = new Error('OpenWeatherMap rejected the configured API key');
        authError.statusCode = 502;
        throw authError;
      }
      const upstreamError = new Error('OpenWeatherMap request failed');
      upstreamError.statusCode = 502;
      throw upstreamError;
    }
    // Network-level failure: timeout, DNS failure, no connectivity, etc.
    const networkError = new Error('Unable to reach the weather service');
    networkError.statusCode = 503;
    throw networkError;
  }
};

module.exports = { getWeatherByCity };
