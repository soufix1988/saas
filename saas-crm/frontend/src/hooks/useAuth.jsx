import { useState, useEffect, createContext, useContext } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [appConfig, setAppConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('saas_token');
    if (token) {
      api.get('/api/auth/me')
        .then(({ user, appConfig }) => {
          setUser(user);
          setAppConfig(appConfig);
        })
        .catch(() => localStorage.removeItem('saas_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(identifier, password) {
    const { token, user, appConfig } = await api.post('/api/auth/login', { identifier, password });
    localStorage.setItem('saas_token', token);
    setUser(user);
    setAppConfig(appConfig);
    return user;
  }

  async function logout() {
    await api.post('/api/auth/logout', {}).catch(() => {});
    localStorage.removeItem('saas_token');
    setUser(null);
    setAppConfig(null);
  }

  return (
    <AuthContext.Provider value={{ user, appConfig, setAppConfig, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
