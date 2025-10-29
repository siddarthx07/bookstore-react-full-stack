import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import apiClient from '../apiClient';

export type AuthUser = {
  accountId: number;
  fullName: string;
  email: string;
  guest: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (fullName: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  guestLogin: () => Promise<AuthUser>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const { data } = await apiClient.get('/auth/status');
      if (data?.authenticated && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await apiClient.post<AuthUser>('/auth/login', { email, password });
      setUser(data);
      return data;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    try {
      const { data } = await apiClient.post<AuthUser>('/auth/register', { fullName, email, password });
      setUser(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      setUser(null);
    }
  };

  const guestLogin = async () => {
    const { data } = await apiClient.post<AuthUser>('/auth/guest');
    setUser(data);
    return data;
  };

  const value: AuthContextValue = {
    user,
    loading,
    login,
    register,
    logout,
    refresh: fetchStatus,
    guestLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
