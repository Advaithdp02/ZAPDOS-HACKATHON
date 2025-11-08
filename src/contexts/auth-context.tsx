
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
    const checkUserSession = async () => {
      if (loading) return;

      if (!user) {
        if (pathname !== '/' && pathname !== '/register') {
          router.push('/');
        }
        return;
      }
      
      // If user object exists, verify it's still valid against the database
      try {
        const profile = await api.getStudentProfile(user.id);
        // A special case for the profile-less HOD and TPO roles
        const isNonStudentRole = user.role === 'hod' || user.role === 'tpo';
        
        if (!profile && !isNonStudentRole) {
          // Profile doesn't exist, and it's a student. This is an invalid session.
          console.error("Session invalid: User profile not found. Logging out.");
          logout();
        }
      } catch (e) {
        console.error("Error validating user session, logging out.", e);
        logout();
      }
    };
    checkUserSession();
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

  // Don't render children until loading is complete and user is verified or redirected.
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
