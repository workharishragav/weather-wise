import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWeatherByCity } from '../services/weatherService';
import { getWeatherIcon } from '../utils/weatherIcons';

const formatNumber = (value, unit = '') => {
  if (value === undefined || value === null || Number.isNaN(value)) return '—';
  return `${Math.round(value)}${unit}`;
};

// One row in the Favorites list: city/country + a live weather preview
// (fetched independently per card, so one city failing to load doesn't
// block the rest of the list) + view/remove actions.
export default function FavoriteLocationCard({ location, onRemove, removing }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getWeatherByCity(location.city);
      setWeather(data);
    } catch (err) {
      setError(err.message || 'Unable to load weather.');
    } finally {
      setLoading(false);
    }
  }, [location.city]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return (
    <div className="flex items-center justify-between gap-space-md p-space-lg rounded-xl bg-surface-container-low/80 backdrop-blur-xl">
      <div className="flex items-center gap-space-md min-w-0">
        <span className="material-symbols-outlined text-primary text-[32px] flex-shrink-0">
          {weather ? getWeatherIcon(weather.condition) : 'location_city'}
        </span>

        <div className="flex flex-col min-w-0">
          <span className="font-headline-sm text-headline-sm font-semibold text-on-surface truncate">
            {location.city}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{location.country}</span>

          {loading && (
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-space-xs">Loading weather…</span>
          )}
          {!loading && error && (
            <span className="font-label-sm text-label-sm text-error mt-space-xs">{error}</span>
          )}
          {!loading && !error && weather && (
            <span className="font-label-md text-label-md text-on-surface-variant mt-space-xs">
              {formatNumber(weather.temperature, '°')} · {weather.condition || 'Unknown'}
              {weather.isMock && ' · simulated'}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-space-xs flex-shrink-0">
        <Link
          to={`/weather/${encodeURIComponent(location.city)}`}
          className="p-space-sm rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label={`View details for ${location.city}`}
        >
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </Link>
        <button
          onClick={() => onRemove(location._id)}
          disabled={removing}
          className="p-space-sm rounded-full hover:bg-error-container/40 text-on-surface-variant hover:text-error transition-colors disabled:opacity-50 disabled:pointer-events-none"
          aria-label={`Remove ${location.city} from favorites`}
        >
          <span className={`material-symbols-outlined text-[20px] ${removing ? 'animate-spin' : ''}`}>
            {removing ? 'progress_activity' : 'delete'}
          </span>
        </button>
      </div>
    </div>
  );
}
