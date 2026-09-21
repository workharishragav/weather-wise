import { useCallback, useState } from 'react';
import { getWeatherByCity } from '../services/weatherService';

// Shared search state/logic for any screen that looks up weather by city
// name (Dashboard's quick search, the dedicated City Search page). Keeping
// this in one hook avoids duplicating the fetch/loading/error handling in
// both places.
export function useWeatherSearch() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = useCallback(async (rawCity) => {
    const trimmed = rawCity.trim();
    if (!trimmed) {
      setError('Please enter a city name');
      setWeather(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await getWeatherByCity(trimmed);
      setWeather(data);
      setCity(trimmed);
    } catch (err) {
      setWeather(null);
      setError(err.message || 'Unable to fetch weather for that city.');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setWeather(null);
    setError('');
  }, []);

  return { city, weather, loading, error, search, reset };
}
