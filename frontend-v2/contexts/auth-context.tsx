"use client";

import { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@/lib/types';
import * as api from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password_sent: string) => Promise<User | null>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('campus-connect-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !user && pathname !== '/') {
      router.push('/');
    }
  }, [user, loading, pathname, router]);


  const login = async (email: string, password_sent: string): Promise<User | null> => {
    const loggedInUser = await api.login(email, password_sent);
    if (loggedInUser) {
      setUser(loggedInUser);
      sessionStorage.setItem('campus-connect-user', JSON.stringify(loggedInUser));
      return loggedInUser;
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('campus-connect-user');
    router.push('/');
  };

  const value = useMemo(() => ({
    user,
    login,
    logout,
    loading
  }), [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
