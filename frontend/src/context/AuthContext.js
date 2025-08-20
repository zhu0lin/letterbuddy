'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // TODO: Check for existing auth token/session
    // For now, just set loading to false
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // TODO: Implement actual login logic
      console.log('Logging in with:', credentials);
      const userData = { id: 1, name: credentials.email.split('@')[0], email: credentials.email };
      setUser(userData);
      
      // Redirect to dashboard after successful login
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    // TODO: Clear tokens, etc.
    router.push('/');
  };

  const register = async (userData) => {
    try {
      // TODO: Implement actual registration logic
      console.log('Registering user:', userData);
      const newUser = { id: 1, name: userData.name, email: userData.email };
      setUser(newUser);
      
      // Redirect to dashboard after successful registration
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
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
