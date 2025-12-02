import React, { createContext, useContext, useEffect, useState } from 'react';
import { localDB } from '../services/localStorage';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, role: 'parent' | 'teacher') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localDB.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, role: 'parent' | 'teacher') => {
    try {
      const newUser = localDB.register(email, password, role);
      setUser(newUser);
    } catch (error: any) {
      throw new Error('Failed to sign up');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const loggedInUser = localDB.login(email, password);
      if (!loggedInUser) {
        throw new Error('Invalid credentials');
      }
      setUser(loggedInUser);
    } catch (error: any) {
      throw new Error('Failed to sign in');
    }
  };

  const signOut = async () => {
    try {
      localDB.logout();
      setUser(null);
    } catch (error: any) {
      throw new Error('Failed to sign out');
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
