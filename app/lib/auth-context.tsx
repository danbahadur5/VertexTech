import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { authClient } from './auth-client';

interface AuthContextType {
  user: User | null;
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

  useEffect(() => {
    // hydrate from server session -> /api/users/me
    const load = async () => {
      try {
        const res = await fetch('/api/users/me', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const appUser = data.user as User;
        setUser(appUser);
        localStorage.setItem('vertextech_user', JSON.stringify(appUser));
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  const login = async (email: string, password: string) => {
    await (authClient as any).signIn.email({ email, password });
    const res = await fetch('/api/users/me', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load profile');
    const data = await res.json();
    const appUser = data.user as User;
    setUser(appUser);
    localStorage.setItem('vertextech_user', JSON.stringify(appUser));
    return appUser;
  };

  const register = async (name: string, email: string, password: string) => {
    await (authClient as any).signUp.email({ email, password, name });
    // After sign-up, email verification may be required depending on config.
    const res = await fetch('/api/users/me', { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    const appUser = data.user as User;
    setUser(appUser);
    localStorage.setItem('vertextech_user', JSON.stringify(appUser));
  };

  const signInWithGoogle = async () => {
    await (authClient as any).signIn.social({
      provider: 'google',
      callbackURL: window.location.origin + '/dashboard/client',
    });
  };

  const signInWithGithub = async () => {
    await (authClient as any).signIn.social({
      provider: 'github',
      callbackURL: window.location.origin + '/dashboard/client',
    });
  };

  const logout = () => {
    authClient.signOut();
    setUser(null);
    try { localStorage.removeItem('vertextech_user'); } catch {}
  };

  const hasRole = (roles: UserRole[]) => (user ? roles.includes(user.role) : false);

  return (
    <AuthContext.Provider value={{ user, login, register, signInWithGoogle, signInWithGithub, logout, isAuthenticated: !!user, hasRole }}>
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
