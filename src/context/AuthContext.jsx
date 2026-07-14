import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const logout = useCallback((expired = false) => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    if (expired) setSessionExpired(true);
  }, []);

  useEffect(() => {
    // Validate the stored access token against the real /auth/me endpoint
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await apiClient.get('/auth/me');
        setUser(res.data);
      } catch (error) {
        // Token invalid or expired — will be handled by the axios interceptor
        console.warn('Stored token invalid, clearing session.');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await apiClient.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    setSessionExpired(false);
    setUser({ loggedIn: true });
  };

  const register = async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, sessionExpired, setSessionExpired }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
