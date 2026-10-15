import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rental_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('rental_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('rental_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          setUser(res.data);
          localStorage.setItem('rental_user', JSON.stringify(res.data));
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token: jwtToken, ...userData } = res.data;
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('rental_token', jwtToken);
    localStorage.setItem('rental_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (formData) => {
    const res = await authApi.register(formData);
    const { token: jwtToken, ...userData } = res.data;
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('rental_token', jwtToken);
    localStorage.setItem('rental_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('rental_token');
    localStorage.removeItem('rental_user');
  };

  const updateUser = (updated) => {
    setUser((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem('rental_user', JSON.stringify(next));
      return next;
    });
  };

  const isTenant = user?.role === 'ROLE_TENANT';
  const isOwner = user?.role === 'ROLE_OWNER';
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!token,
        isTenant,
        isOwner,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
