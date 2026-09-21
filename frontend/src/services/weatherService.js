import api from './api';

// GET /api/weather/:city -> { success, data: { city, temperature, humidity, windSpeed, condition, feelsLike, isMock, message? } }
// Public endpoint -- no auth header required, but api.js attaches one
// harmlessly if the user happens to be logged in.
export const getWeatherByCity = async (city) => {
  const { data } = await api.get(`/weather/${encodeURIComponent(city)}`);
  return data.data;
};
