import api from './api';

// GET /api/locations -> { success, count, data: [...] }
export const getFavoriteLocations = async () => {
  const { data } = await api.get('/locations');
  return data.data;
};

// POST /api/locations -> { success, data: location }
export const addFavoriteLocation = async ({ city, country }) => {
  const { data } = await api.post('/locations', { city, country });
  return data.data;
};

// PUT /api/locations/:id -> { success, data: location }
export const updateFavoriteLocation = async (id, updates) => {
  const { data } = await api.put(`/locations/${id}`, updates);
  return data.data;
};

// DELETE /api/locations/:id -> { success, data: {} }
export const deleteFavoriteLocation = async (id) => {
  await api.delete(`/locations/${id}`);
};
