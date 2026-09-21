import { useState } from 'react';

// Reusable city search input, shared by the Dashboard's quick search and
// the dedicated City Search page. `size="lg"` gives the larger, standalone
// treatment used on the Search page; the default is the compact hero style.
export default function SearchCityForm({ onSearch, loading, size = 'md', placeholder = 'Search for a city…' }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  const isLg = size === 'lg';

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-space-sm w-full" noValidate>
      <div
        className={[
          'flex items-center gap-space-sm flex-1 rounded-full bg-surface-container-high/60 border border-transparent',
          'focus-within:border-primary transition-colors',
          isLg ? 'px-space-lg py-space-md' : 'px-space-md py-space-sm'
        ].join(' ')}
      >
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">location_city</span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label="City name"
          className={[
            'w-full bg-transparent border-none outline-none text-on-surface placeholder:text-outline',
            isLg ? 'font-body-lg text-body-lg' : 'font-body-md text-body-md'
          ].join(' ')}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={[
          'flex items-center justify-center gap-space-xs rounded-full bg-primary-container text-on-primary-container',
          'font-label-lg text-label-lg font-bold shadow-[0_4px_20px_rgba(56,189,248,0.35)] hover:bg-primary',
          'transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none flex-shrink-0',
          isLg ? 'px-space-xl py-space-md' : 'px-space-lg py-space-sm'
        ].join(' ')}
      >
        {loading ? (
          <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
        ) : (
          <span className="material-symbols-outlined text-[18px]">search</span>
        )}
        <span className="hidden sm:inline">{loading ? 'Searching…' : 'Search'}</span>
      </button>
    </form>
  );
}
