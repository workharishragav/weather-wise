import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import WeatherCard from '../components/WeatherCard';
import { getWeatherByCity } from '../services/weatherService';

export default function WeatherDetails() {
  const { city } = useParams();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getWeatherByCity(city);
      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError(err.message || 'Unable to fetch weather for that city.');
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return (
    <div className="flex flex-col gap-space-lg w-full max-w-2xl mx-auto">
      <Link
        to="/search"
        className="inline-flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant hover:text-on-surface w-fit"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to search
      </Link>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-space-sm py-space-xl text-center">
          <span className="material-symbols-outlined text-primary text-[36px] animate-spin">progress_activity</span>
          <p className="font-body-md text-body-md text-on-surface-variant">Fetching weather for {city}…</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col gap-space-md">
          <div className="px-space-md py-space-sm rounded-xl bg-error-container/80 text-on-error-container font-label-md text-label-md">
            {error}
          </div>
          <button
            onClick={fetchWeather}
            className="w-fit flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-surface-container-high/80 hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && weather && <WeatherCard weather={weather} variant="detailed" />}
    </div>
  );
}
