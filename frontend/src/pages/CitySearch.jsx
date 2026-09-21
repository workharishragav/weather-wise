import { Link } from 'react-router-dom';
import SearchCityForm from '../components/SearchCityForm';
import WeatherCard from '../components/WeatherCard';
import { useWeatherSearch } from '../hooks/useWeatherSearch';

export default function CitySearch() {
  const { city, weather, loading, error, search } = useWeatherSearch();

  return (
    <div className="flex flex-col gap-space-lg w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-space-xs">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Search for a city</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Look up current conditions for any city covered by the weather service.
        </p>
      </div>

      <SearchCityForm onSearch={search} loading={loading} size="lg" placeholder="e.g. Chennai, Tokyo, Berlin…" />

      {error && (
        <div className="px-space-md py-space-sm rounded-xl bg-error-container/80 text-on-error-container font-label-md text-label-md">
          {error}
        </div>
      )}

      {weather && (
        <WeatherCard
          weather={weather}
          variant="compact"
          footer={
            <Link
              to={`/weather/${encodeURIComponent(city)}`}
              className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary font-semibold hover:underline"
            >
              View full details
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          }
        />
      )}

      {!weather && !error && !loading && (
        <div className="flex flex-col items-center justify-center gap-space-sm py-space-xl text-center">
          <span className="material-symbols-outlined text-on-surface-variant text-[48px]">travel_explore</span>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
            Enter a city name above to see live temperature, humidity, wind and conditions.
          </p>
        </div>
      )}
    </div>
  );
}
