import { useCallback, useEffect, useState } from 'react';
import FavoriteLocationCard from '../components/FavoriteLocationCard';
import FormField from '../components/FormField';
import { addFavoriteLocation, deleteFavoriteLocation, getFavoriteLocations } from '../services/locationService';

export default function Favorites() {
  const [locations, setLocations] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState('');

  const [form, setForm] = useState({ city: '', country: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [removingId, setRemovingId] = useState(null);
  const [removeError, setRemoveError] = useState('');

  const fetchLocations = useCallback(async () => {
    setListLoading(true);
    setListError('');
    try {
      const data = await getFavoriteLocations();
      setLocations(data);
    } catch (err) {
      setListError(err.message || 'Unable to load your favorites.');
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errors = {};
    if (!form.city.trim()) errors.city = 'City is required';
    if (!form.country.trim()) errors.country = 'Country is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const created = await addFavoriteLocation({ city: form.city.trim(), country: form.country.trim() });
      setLocations((prev) => [created, ...prev]);
      setForm({ city: '', country: '' });
    } catch (err) {
      // Backend returns 409 "This city is already in your favorites" for
      // duplicates -- api.js normalizes that into err.message.
      setFormError(err.message || 'Unable to add that favorite. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    setRemoveError('');
    setRemovingId(id);
    try {
      await deleteFavoriteLocation(id);
      setLocations((prev) => prev.filter((loc) => loc._id !== id));
    } catch (err) {
      setRemoveError(err.message || 'Unable to remove that favorite. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-space-xl w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-space-xs">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Favorites</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Save cities you check often and glance at their current conditions.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-space-md p-space-lg rounded-xl bg-surface-container-low/80 backdrop-blur-xl"
      >
        <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">Add a favorite</h2>
        <div className="grid sm:grid-cols-2 gap-space-md">
          <FormField
            id="city"
            label="City"
            icon="location_city"
            value={form.city}
            onChange={handleChange}
            error={fieldErrors.city}
            placeholder="e.g. Chennai"
          />
          <FormField
            id="country"
            label="Country"
            icon="public"
            value={form.country}
            onChange={handleChange}
            error={fieldErrors.country}
            placeholder="e.g. India"
          />
        </div>

        {formError && (
          <div className="px-space-md py-space-sm rounded-xl bg-error-container/80 text-on-error-container font-label-md text-label-md">
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-fit flex items-center justify-center gap-space-xs py-space-sm px-space-lg rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg font-bold shadow-[0_4px_20px_rgba(56,189,248,0.35)] hover:bg-primary transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
        >
          {submitting ? (
            <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-[18px]">add</span>
          )}
          {submitting ? 'Adding…' : 'Add to favorites'}
        </button>
      </form>

      {removeError && (
        <div className="px-space-md py-space-sm rounded-xl bg-error-container/80 text-on-error-container font-label-md text-label-md">
          {removeError}
        </div>
      )}

      {listLoading && (
        <div className="flex flex-col items-center justify-center gap-space-sm py-space-xl text-center">
          <span className="material-symbols-outlined text-primary text-[36px] animate-spin">progress_activity</span>
          <p className="font-body-md text-body-md text-on-surface-variant">Loading your favorites…</p>
        </div>
      )}

      {!listLoading && listError && (
        <div className="flex flex-col gap-space-md">
          <div className="px-space-md py-space-sm rounded-xl bg-error-container/80 text-on-error-container font-label-md text-label-md">
            {listError}
          </div>
          <button
            onClick={fetchLocations}
            className="w-fit flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-surface-container-high/80 hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Try again
          </button>
        </div>
      )}

      {!listLoading && !listError && locations.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-space-sm py-space-xl text-center">
          <span className="material-symbols-outlined text-on-surface-variant text-[48px]">favorite_border</span>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
            You haven't added any favorites yet. Add a city above to see it here.
          </p>
        </div>
      )}

      {!listLoading && !listError && locations.length > 0 && (
        <div className="flex flex-col gap-space-sm">
          {locations.map((location) => (
            <FavoriteLocationCard
              key={location._id}
              location={location}
              onRemove={handleRemove}
              removing={removingId === location._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
