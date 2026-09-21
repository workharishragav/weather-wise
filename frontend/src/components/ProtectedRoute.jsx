import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wraps a page element; redirects to /login (preserving the intended
// destination) if the user isn't authenticated.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
