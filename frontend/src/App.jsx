import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import CitySearch from './pages/CitySearch';
import WeatherDetails from './pages/WeatherDetails';
import Favorites from './pages/Favorites';
import AIInsights from './pages/AIInsights';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Public: matches the public GET /api/weather/:city endpoint */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/search" element={<CitySearch />} />
            <Route path="/weather/:city" element={<WeatherDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected: matches the JWT-protected backend routes */}
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-insights"
              element={
                <ProtectedRoute>
                  <AIInsights />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
