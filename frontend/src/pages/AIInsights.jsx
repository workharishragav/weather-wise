import { useState } from 'react';
import SearchCityForm from '../components/SearchCityForm';
import WeatherCard from '../components/WeatherCard';
import { useWeatherSearch } from '../hooks/useWeatherSearch';
import { getAiInsights } from '../services/aiService';

export default function AIInsights() {
  const { weather, loading, error, search } = useWeatherSearch();

  const [insight, setInsight] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // A fresh weather search invalidates whatever insight was generated for
  // the previous city -- clear it so the two never get shown out of sync.
  const handleSearch = async (value) => {
    setInsight(null);
    setAiError('');
    await search(value);
  };

  // Backend requires at least city, temperature and condition (aiController.js).
  // Condition always comes back populated, but temperature can in principle
  // be undefined if OpenWeatherMap's payload is missing `main.temp` -- guard
  // for that rather than letting the request 400.
  const canRequestInsight = weather && weather.temperature !== undefined && weather.temperature !== null;

  const handleGetInsight = async () => {
    setAiLoading(true);
    setAiError('');
    try {
      const data = await getAiInsights(weather);
      setInsight(data);
    } catch (err) {
      setAiError(err.message || 'Unable to generate AI insight right now.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-space-lg w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-space-xs">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">AI Insights</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Search a city to get an AI-generated summary and recommendation for current conditions.
        </p>
      </div>

      <SearchCityForm onSearch={handleSearch} loading={loading} size="lg" placeholder="e.g. Bengaluru, Paris…" />

      {error && (
        <div className="px-space-md py-space-sm rounded-xl bg-error-container/80 text-on-error-container font-label-md text-label-md">
          {error}
        </div>
      )}

      {weather && (
        <div className="flex flex-col gap-space-md">
          <WeatherCard weather={weather} variant="compact" />

          {!insight && (
            <button
              onClick={handleGetInsight}
              disabled={aiLoading || !canRequestInsight}
              className="w-fit flex items-center justify-center gap-space-xs py-space-sm px-space-lg rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg font-bold shadow-[0_4px_20px_rgba(56,189,248,0.35)] hover:bg-primary transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
            >
              <span className={`material-symbols-outlined text-[18px] ${aiLoading ? 'animate-spin' : ''}`}>
                {aiLoading ? 'progress_activity' : 'auto_awesome'}
              </span>
              {aiLoading ? 'Thinking…' : 'Get AI insight'}
            </button>
          )}

          {!canRequestInsight && (
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              This city's temperature reading is missing, so an AI insight can't be generated for it right now.
            </p>
          )}

          {aiError && (
            <div className="px-space-md py-space-sm rounded-xl bg-error-container/80 text-on-error-container font-label-md text-label-md">
              {aiError}
            </div>
          )}

          {insight && (
            <div className="flex flex-col gap-space-md p-space-lg rounded-xl bg-surface-container-low/80 backdrop-blur-xl">
              {insight.fallback && (
                <div className="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl bg-tertiary-container/20 text-tertiary">
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                  <span className="font-label-md text-label-md">
                    Showing a rule-based recommendation -- the AI service is temporarily unavailable.
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center gap-space-xs text-primary">
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  <span className="font-label-md text-label-md uppercase tracking-wider">Summary</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface">{insight.summary}</p>
              </div>

              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center gap-space-xs text-primary">
                  <span className="material-symbols-outlined text-[20px]">checkroom</span>
                  <span className="font-label-md text-label-md uppercase tracking-wider">Recommendation</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface">{insight.recommendation}</p>
              </div>

              <button
                onClick={handleGetInsight}
                disabled={aiLoading}
                className="w-fit flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-60"
              >
                <span className={`material-symbols-outlined text-[16px] ${aiLoading ? 'animate-spin' : ''}`}>
                  {aiLoading ? 'progress_activity' : 'refresh'}
                </span>
                Regenerate
              </button>
            </div>
          )}
        </div>
      )}

      {!weather && !error && !loading && (
        <div className="flex flex-col items-center justify-center gap-space-sm py-space-xl text-center">
          <span className="material-symbols-outlined text-on-surface-variant text-[48px]">auto_awesome</span>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
            Search a city above, then request an AI-generated summary and recommendation for it.
          </p>
        </div>
      )}
    </div>
  );
}
