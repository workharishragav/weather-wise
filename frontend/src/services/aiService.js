import api from './api';

// POST /api/ai/weather-recommendation -> { success, summary, recommendation, fallback }
// Requires the caller to already have current weather data on hand
// (city, temperature, humidity, windSpeed, condition, feelsLike) --
// this endpoint does not fetch weather itself, it only analyzes it.
export const getAiInsights = async (weather) => {
  const { data } = await api.post('/ai/weather-recommendation', weather);
  return data;
};
