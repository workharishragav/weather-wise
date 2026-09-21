import api from './api';

// POST /api/auth/register -> { success, data: { _id, name, email, role, token } }
// Flat shape (matches the reference document's literal Postman example) --
// _id/name/email/role/token are direct siblings, not nested under `user`.
export const registerUser = async ({ name, email, password }) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data.data;
};

// POST /api/auth/login -> { success, data: { _id, name, email, role, token } }
export const loginUser = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data;
};
