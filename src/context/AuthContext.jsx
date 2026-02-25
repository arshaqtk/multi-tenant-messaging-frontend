import { createContext, useContext, useMemo, useState } from 'react';
import { loginUser, registerUser, TOKEN_KEY } from '../services/api';

const USER_KEY = 'chat_app_user';

const AuthContext = createContext(null);

function normalizeRole(role) {
  if (!role) return 'user';
  const value = String(role).toLowerCase();
  if (value === 'admin') return 'admin';
  if (value === 'member') return 'user';
  return value;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (_error) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function login(credentials) {
    setLoading(true);
    setError('');
    try {
      const data = await loginUser(credentials);
      const nextToken = data?.token || '';
      const nextUser = data?.user || null;

      setToken(nextToken);
      setUser(nextUser);
      localStorage.setItem(TOKEN_KEY, nextToken);
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      return { ok: true };
    } catch (loginError) {
      setError(loginError.message);
      return { ok: false, message: loginError.message };
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    setLoading(true);
    setError('');
    try {
      const data = await registerUser(payload);
      const nextToken = data?.token || '';
      const nextUser = data?.user || null;

      if (nextToken && nextUser) {
        setToken(nextToken);
        setUser(nextUser);
        localStorage.setItem(TOKEN_KEY, nextToken);
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      }

      return { ok: true };
    } catch (registerError) {
      setError(registerError.message);
      return { ok: false, message: registerError.message };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken('');
    setUser(null);
    setError('');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      role: normalizeRole(user?.role),
      isAuthenticated: Boolean(token),
      loading,
      error,
      setError,
      login,
      register,
      logout,
    }),
    [token, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
