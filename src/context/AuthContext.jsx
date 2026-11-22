/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, getMeApi, changePasswordApi, logoutApi } from '../api/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('tenant_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem('tenant_user');
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('tenant_token') || '');
  const [subdomain, setSubdomain] = useState(() => localStorage.getItem('tenant_subdomain') || 'ahly');
  const [loading, setLoading] = useState(true);

  // Load current user profile on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('tenant_token');
      if (storedToken) {
        try {
          const res = await getMeApi();
          const admin = res.data?.data?.admin || res.data?.data;
          if (!admin) {
            throw new Error('Invalid authenticated session');
          }
          setUser(admin);
          localStorage.setItem('tenant_user', JSON.stringify(admin));
        } catch {
          localStorage.removeItem('tenant_token');
          localStorage.removeItem('tenant_user');
          setToken('');
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();

    const handleUnauthorized = () => {
      setToken('');
      setUser(null);
      setLoading(false);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password, clubSubdomain = subdomain) => {
    setLoading(true);
    localStorage.setItem('tenant_subdomain', clubSubdomain);
    setSubdomain(clubSubdomain);

    try {
      const res = await loginApi({ email, password });
      const data = res.data?.data;
      const authToken = data?.token;
      const admin = data?.admin;

      if (!authToken || !admin) {
        throw new Error('The server returned an invalid login response');
      }

      localStorage.setItem('tenant_token', authToken);
      localStorage.setItem('tenant_user', JSON.stringify(admin));
      setToken(authToken);
      setUser(admin);
      return { success: true, user: admin };
    } catch (error) {
      localStorage.removeItem('tenant_token');
      localStorage.removeItem('tenant_user');
      setToken('');
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('tenant_token');
      localStorage.removeItem('tenant_user');
      setToken('');
      setUser(null);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    const res = await changePasswordApi({
      current_password: currentPassword,
      new_password: newPassword,
    });
    return res.data;
  };

  const updateSubdomain = (newSubdomain) => {
    localStorage.setItem('tenant_subdomain', newSubdomain);
    setSubdomain(newSubdomain);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        subdomain,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        changePassword,
        updateSubdomain,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

