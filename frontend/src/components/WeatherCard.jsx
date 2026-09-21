import { getWeatherIcon } from '../utils/weatherIcons';

// Renders whatever the backend actually returned. Every value is displayed
// defensively (`formatNumber`) because the backend's live path passes
// OpenWeatherMap fields through with optional chaining -- they can be
// undefined even on a 200 response.
const formatNumber = (value, unit = '') => {
  if (value === undefined || value === null || Number.isNaN(value)) return '—';
  return `${Math.round(value)}${unit}`;
};

function StatTile({ icon, label, value }) {
  return (
    <div className="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl bg-surface-container-high/60">
      <span className="material-symbols-outlined text-primary text-[22px]">{icon}</span>
      <div className="flex flex-col">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{label}</span>
        <span className="font-label-lg text-label-lg text-on-surface font-semibold">{value}</span>
      </div>
    </div>
  );
}

function FallbackBanner({ message }) {
  return (
    <div className="flex items-center gap-space-sm px-space-md py-space-sm rounded-xl bg-tertiary-container/20 text-tertiary">
      <span className="material-symbols-outlined text-[18px]">warning</span>
      <span className="font-label-md text-label-md">
        {message || 'Showing simulated fallback data -- live weather is temporarily unavailable.'}
      </span>
    </div>
  );
}

export default function WeatherCard({ weather, variant = 'compact', footer }) {
  if (!weather) return null;

  const icon = getWeatherIcon(weather.condition);
  const isDetailed = variant === 'detailed';

  return (
    <div
      className={[
        'flex flex-col gap-space-lg rounded-xl bg-surface-container-low/80 backdrop-blur-xl shadow-xl relative overflow-hidden',
        isDetailed ? 'p-space-xl' : 'p-space-lg'
      ].join(' ')}
    >
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary-container/15 blur-[90px] pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-space-lg">
        {weather.isMock && <FallbackBanner message={weather.message} />}

        <div className="flex items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
              {weather.condition || 'Unknown'}
            </span>
            <h2
              className={
                isDetailed
                  ? 'font-headline-lg text-headline-lg font-bold text-on-surface'
                  : 'font-headline-sm text-headline-sm font-semibold text-on-surface'
              }
            >
              {weather.city}
            </h2>
          </div>
          <span className={`material-symbols-outlined text-primary ${isDetailed ? 'text-[64px]' : 'text-[40px]'}`}>
            {icon}
          </span>
        </div>

        <div className="flex items-end gap-space-sm">
          <span className={isDetailed ? 'font-headline-lg text-[72px] leading-none font-bold text-on-surface' : 'font-headline-lg text-headline-lg font-bold text-on-surface'}>
            {formatNumber(weather.temperature, '°')}
          </span>
          <span className="font-body-md text-body-md text-on-surface-variant pb-space-xs">
            Feels like {formatNumber(weather.feelsLike, '°')}
          </span>
        </div>

        <div className={`grid ${isDetailed ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-3'} gap-space-sm`}>
          <StatTile icon="humidity_percentage" label="Humidity" value={formatNumber(weather.humidity, '%')} />
          <StatTile icon="air" label="Wind" value={formatNumber(weather.windSpeed, ' m/s')} />
          <StatTile icon={icon} label="Condition" value={weather.condition || 'Unknown'} />
        </div>

        {footer && <div className="pt-space-xs">{footer}</div>}
      </div>
    </div>
  );
}
