import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const MOCK_USERS = {
  admin: {
    id: 'usr_001',
    name: 'Sarah Jenkins',
    email: 'admin@payflow.hr',
    role: 'admin',
    roleLabel: 'System Administrator',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    department: 'Executive',
    designation: 'VP of HR Operations'
  },
  manager: {
    id: 'usr_002',
    name: 'Marcus Vance',
    email: 'marcus.vance@payflow.hr',
    role: 'manager',
    roleLabel: 'HR Operations Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    department: 'Engineering',
    designation: 'Engineering Lead Manager'
  },
  employee: {
    id: 'usr_003',
    name: 'Elena Rostova',
    email: 'elena.r@payflow.hr',
    role: 'employee',
    roleLabel: 'Senior Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer'
  }
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentRole, setCurrentRole] = useState('admin');
  const [currentRoute, setCurrentRoute] = useState('landing'); // Default route is Landing Page!
  const [theme, setTheme] = useState('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState(null);

  // Check initial Supabase auth state if backend connected
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession) {
        setSession(currentSession);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const currentUser = MOCK_USERS[currentRole] || MOCK_USERS.admin;

  const login = async (email, password, preferredRole = 'admin') => {
    try {
      // Attempt Supabase login if configured
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error && !email.includes('payflow.hr')) {
        return { error };
      }
      setCurrentRole(preferredRole);
      setIsAuthenticated(true);
      setCurrentRoute('dashboard');
      return { success: true };
    } catch (err) {
      // Fallback for demo persona login
      setCurrentRole(preferredRole);
      setIsAuthenticated(true);
      setCurrentRoute('dashboard');
      return { success: true };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out completed locally.');
    }
    setIsAuthenticated(false);
    setCurrentRoute('landing');
  };

  const forgotPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      return { data, error };
    } catch (err) {
      return { success: true };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      return { data, error };
    } catch (err) {
      return { success: true };
    }
  };

  const switchRole = (role) => {
    if (MOCK_USERS[role]) {
      setCurrentRole(role);
      setCurrentRoute('dashboard');
    }
  };

  const navigateTo = (routeId) => {
    setCurrentRoute(routeId);
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        currentRole,
        currentRoute,
        theme,
        isSidebarOpen,
        mobileMenuOpen,
        session,
        setMobileMenuOpen,
        login,
        logout,
        forgotPassword,
        updatePassword,
        switchRole,
        navigateTo,
        toggleTheme,
        toggleSidebar
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
