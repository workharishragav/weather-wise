import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('weatherwise_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error handling: every backend error response has the shape
// { success: false, message: "..." } (src/middleware/errorMiddleware.js).
// Surface that message consistently so calling code doesn't need to know
// about axios's error.response.data shape.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    const status = error.response?.status;
    return Promise.reject({ message, status, original: error });
  }
);

export default api;
