import { Link } from 'react-router-dom';
import SearchCityForm from '../components/SearchCityForm';
import WeatherCard from '../components/WeatherCard';
import { useAuth } from '../context/AuthContext';
import { useWeatherSearch } from '../hooks/useWeatherSearch';

const SHORTCUTS = [
  {
    to: '/search',
    icon: 'travel_explore',
    title: 'Search cities',
    description: 'Look up live conditions anywhere.'
  },
  {
    to: '/favorites',
    icon: 'favorite',
    title: 'Favorites',
    description: 'Jump back to your saved locations.'
  },
  {
    to: '/ai-insights',
    icon: 'auto_awesome',
    title: 'AI Insights',
    description: 'Get an AI summary and recommendation.'
  }
];

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { city, weather, loading, error, search } = useWeatherSearch();

  return (
    <div className="flex flex-col gap-space-xl w-full">
      <div className="flex flex-col gap-space-xs">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
          {isAuthenticated ? `Welcome back, ${user?.name || 'there'}` : 'Welcome to AI WeatherWise'}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Search any city for live conditions and an AI-generated recommendation.
        </p>
      </div>

      <div className="max-w-2xl w-full">
        <SearchCityForm onSearch={search} loading={loading} placeholder="Search a city, e.g. Mumbai…" />
      </div>

      {error && (
        <div className="max-w-2xl px-space-md py-space-sm rounded-xl bg-error-container/80 text-on-error-container font-label-md text-label-md">
          {error}
        </div>
      )}

      {weather && (
        <div className="max-w-2xl w-full">
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
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-space-md">
        {SHORTCUTS.map((shortcut) => (
          <Link
            key={shortcut.to}
            to={shortcut.to}
            className="flex flex-col gap-space-sm p-space-lg rounded-xl bg-surface-container-low/80 hover:bg-surface-container-low transition-colors backdrop-blur-xl"
          >
            <span className="material-symbols-outlined text-primary text-[28px]">{shortcut.icon}</span>
            <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">{shortcut.title}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{shortcut.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
