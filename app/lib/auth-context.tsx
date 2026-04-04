'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { authClient } from './auth-client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // hydrate from server session -> /api/users/me
    const load = async () => {
      try {
        const res = await fetch('/api/users/me', { cache: 'no-store' });
        if (!res.ok) {
          setIsLoading(false);
          return;
        }
        const json = await res.json();
        // Since we use apiResponse utility, the data is under json.data
        const appUser = (json.data?.user || json.user) as User;
        if (appUser) {
          setUser(appUser);
          localStorage.setItem('Darbartech_user', JSON.stringify(appUser));
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data: session, error } = await (authClient as any).signIn.email({ 
        email, 
        password 
      });

      if (error) {
        throw new Error(error.message || 'Invalid email or password');
      }

      const res = await fetch('/api/users/me', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load profile');
      
      const json = await res.json();
      const appUser = (json.data?.user || json.user) as User;

      if (appUser.status === 'inactive') {
        await authClient.signOut();
        throw new Error('Your account is inactive. Please contact support.');
      }

      setUser(appUser);
      localStorage.setItem('Darbartech_user', JSON.stringify(appUser));
      return appUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await (authClient as any).signUp.email({ 
        email, 
        password, 
        name 
      });

      if (error) {
        throw new Error(error.message || 'Failed to create account');
      }

      const res = await fetch('/api/users/me', { cache: 'no-store' });
      if (!res.ok) return;
      
      const json = await res.json();
      const appUser = (json.data?.user || json.user) as User;
      if (appUser) {
        setUser(appUser);
        localStorage.setItem('Darbartech_user', JSON.stringify(appUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    await (authClient as any).signIn.social({
      provider: 'google',
      callbackURL: window.location.origin + '/dashboard',
    });
  };

  const signInWithGithub = async () => {
    await (authClient as any).signIn.social({
      provider: 'github',
      callbackURL: window.location.origin + '/dashboard',
    });
  };

  const logout = () => {
    authClient.signOut();
    setUser(null);
    try { localStorage.removeItem('Darbartech_user'); } catch {}
  };

  const hasRole = (roles: UserRole[]) => (user ? roles.includes(user.role) : false);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, signInWithGoogle, signInWithGithub, logout, isAuthenticated: !!user, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
