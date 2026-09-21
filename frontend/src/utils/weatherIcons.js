// Maps the `condition` string returned by the backend (which passes through
// OpenWeatherMap's `weather[0].main` value, e.g. "Clear", "Clouds", "Rain")
// to a Material Symbols Outlined icon name. The backend also returns
// "Unknown" when OpenWeatherMap's payload doesn't include a condition, and
// fallback mode always returns "Clear" -- both are covered below.
const CONDITION_ICONS = {
  Clear: 'sunny',
  Clouds: 'cloud',
  Rain: 'rainy',
  Drizzle: 'rainy',
  Thunderstorm: 'thunderstorm',
  Snow: 'weather_snowy',
  Mist: 'foggy',
  Fog: 'foggy',
  Haze: 'foggy',
  Smoke: 'foggy',
  Dust: 'foggy',
  Sand: 'foggy',
  Ash: 'foggy',
  Squall: 'air',
  Tornado: 'tornado'
};

const DEFAULT_ICON = 'partly_cloudy_day';

export function getWeatherIcon(condition) {
  if (!condition) return DEFAULT_ICON;
  return CONDITION_ICONS[condition] || DEFAULT_ICON;
}
