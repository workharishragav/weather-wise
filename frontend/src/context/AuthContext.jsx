import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

const TOKEN_KEY = 'weatherwise_token';
const USER_KEY = 'weatherwise_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const persist = useCallback((nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  }, []);

  // authService resolves the backend's flat { _id, name, email, role, token }
  // shape -- pull token out, keep the rest as the user object.
  const login = useCallback(
    async (credentials) => {
      const { token: newToken, ...loggedInUser } = await loginUser(credentials);
      persist(loggedInUser, newToken);
      return loggedInUser;
    },
    [persist]
  );

  const register = useCallback(
    async (details) => {
      const { token: newToken, ...newUser } = await registerUser(details);
      persist(newUser, newToken);
      return newUser;
    },
    [persist]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout
    }),
    [user, token, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
