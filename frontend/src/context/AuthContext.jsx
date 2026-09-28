import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

const ROLE_LABELS = {
  admin: 'System Administrator',
  manager: 'Department / Team Manager',
  employee: 'Employee / Staff Member'
};

const DEFAULT_DEPARTMENTS = {
  admin: 'Executive',
  manager: 'Engineering & Tech',
  employee: 'Engineering & Tech'
};

const DEFAULT_DESIGNATIONS = {
  admin: 'System Administrator',
  manager: 'Engineering Manager',
  employee: 'Senior Software Engineer'
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState('admin');
  const [currentRoute, setCurrentRoute] = useState('landing');
  const [theme, setTheme] = useState('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Derive human-readable name from email
  const getNameFromEmail = (emailStr) => {
    if (!emailStr) return 'User';
    const username = emailStr.split('@')[0];
    return username
      .replace(/[._-]/g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || 'User';
  };

  // Restore Supabase auth session on mount
  useEffect(() => {
    // 1. Restore persisted user session from localStorage immediately (avoids flash of login)
    const savedSession = localStorage.getItem('payflow_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed?.user) {
          setCurrentUser(parsed.user);
          setCurrentRole(parsed.user.role || 'admin');
          setIsAuthenticated(true);
          setCurrentRoute(parsed.route || 'dashboard');
        }
        if (parsed?.theme) {
          setTheme(parsed.theme);
          document.documentElement.setAttribute('data-theme', parsed.theme);
        }
      } catch {
        localStorage.removeItem('payflow_session');
      }
    }

    // 2. Validate with Supabase (source of truth)
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        const authUser = currentSession.user;
        const meta = authUser.user_metadata || {};
        const role = meta.role || 'admin';
        const name = meta.full_name || getNameFromEmail(authUser.email);

        const userObj = {
          id: authUser.id,
          dbId: authUser.id,
          name: name,
          email: authUser.email,
          role: role,
          roleLabel: ROLE_LABELS[role] || role,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
          department: meta.department || DEFAULT_DEPARTMENTS[role] || 'General',
          designation: meta.designation || DEFAULT_DESIGNATIONS[role] || 'Team Member'
        };

        setCurrentRole(role);
        setCurrentUser(userObj);
        setIsAuthenticated(true);

        // Restore saved route (stay on dashboard if already there)
        const savedRoute = (() => {
          try { return JSON.parse(localStorage.getItem('payflow_session') || '{}').route; } catch { return null; }
        })();
        if (savedRoute && savedRoute !== 'landing' && savedRoute !== 'login') {
          setCurrentRoute(savedRoute);
        } else {
          setCurrentRoute('dashboard');
        }
      } else if (!savedSession) {
        // No Supabase session and no local cache → show landing
        setCurrentRoute('landing');
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if (!currentSession) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setCurrentRoute('landing');
        localStorage.removeItem('payflow_session');
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Direct Role-Based Sign In with Department
  const login = async (email, password, selectedRole = 'admin', customDepartment = '') => {
    const userEmail = email.trim() || `${selectedRole}@gmail.com`;
    const displayName = getNameFromEmail(userEmail);
    const assignedDept = customDepartment || DEFAULT_DEPARTMENTS[selectedRole] || 'Engineering & Tech';
    const assignedTitle = selectedRole === 'manager'
      ? `${assignedDept} Lead Manager`
      : selectedRole === 'admin'
      ? 'System Administrator'
      : 'Senior Software Engineer';

    try {
      // Step 1: Authenticate with Supabase (validates email + password)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: password
      });

      if (authError || !authData?.user) {
        throw new Error('Incorrect email or password.');
      }

      const authUser = authData.user;

      // Step 2: Check the role in profiles table
      const { data: dbProfile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      // Determine actual role (from profile if it exists, else from auth metadata)
      const actualRole = dbProfile?.role || authUser.user_metadata?.role || selectedRole;

      if (dbProfile && dbProfile.role !== selectedRole) {
        // Sign out since we signed them in but role doesn't match
        await supabase.auth.signOut();
        const ROLE_LABELS_LOCAL = { admin: 'Admin', manager: 'Manager', employee: 'Employee' };
        throw new Error(
          `Registered as ${ROLE_LABELS_LOCAL[dbProfile.role] || dbProfile.role}. Please switch role.`
        );
      }

      // Build user object
      const name = dbProfile?.full_name || authUser.user_metadata?.full_name || displayName;
      const userObj = {
        id: authUser.id,
        dbId: authUser.id,
        name,
        email: authUser.email || userEmail,
        role: actualRole,
        roleLabel: ROLE_LABELS[actualRole] || actualRole,
        avatar: dbProfile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
        department: assignedDept,
        designation: assignedTitle
      };

      // Record sign-in action in audit logs
      try {
        await supabase.from('audit_logs').insert({
          user_id: authUser.id,
          action: `User signed in as ${actualRole.toUpperCase()} (${assignedDept})`,
          security_level: 'INFO'
        });
      } catch (auditErr) {
        console.warn('Audit log write warning:', auditErr);
      }

      setCurrentRole(actualRole);
      setCurrentUser(userObj);
      setIsAuthenticated(true);
      setCurrentRoute('dashboard');

      localStorage.setItem('payflow_session', JSON.stringify({
        user: userObj,
        route: 'dashboard',
        theme
      }));

      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  // Direct Sign Up / Registration for a new email person
  const signup = async (email, password, fullName = '', selectedRole = 'employee', customDepartment = '') => {
    const userEmail = email.trim();
    if (!userEmail) throw new Error('Email address is required.');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters long.');

    const name = fullName.trim() || getNameFromEmail(userEmail);
    const assignedDept = customDepartment || DEFAULT_DEPARTMENTS[selectedRole] || 'Engineering & Tech';
    const assignedTitle = selectedRole === 'manager'
      ? `${assignedDept} Lead Manager`
      : selectedRole === 'admin'
      ? 'System Administrator'
      : 'Senior Software Engineer';

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userEmail,
        password: password,
        options: {
          data: {
            full_name: name,
            role: selectedRole,
            department: assignedDept,
            designation: assignedTitle
          }
        }
      });

      if (authError) {
        throw authError;
      }

      const authUser = authData?.user;
      if (!authUser) {
        throw new Error('Registration failed. Please try again.');
      }

      // If Supabase logs in directly (email confirmation off)
      if (authData.session) {
        const userObj = {
          id: authUser.id,
          dbId: authUser.id,
          name,
          email: authUser.email || userEmail,
          role: selectedRole,
          roleLabel: ROLE_LABELS[selectedRole] || selectedRole,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
          department: assignedDept,
          designation: assignedTitle
        };

        // Try to insert an employee row if role is employee or manager
        try {
          const empCode = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
          const names = name.split(' ');
          const fName = names[0] || 'Staff';
          const lName = names.slice(1).join(' ') || '';

          // Look up department ID
          const { data: deptRow } = await supabase
            .from('departments')
            .select('id')
            .ilike('name', `%${assignedDept.split('&')[0].trim()}%`)
            .maybeSingle();

          await supabase.from('employees').insert({
            employee_code: empCode,
            profile_id: authUser.id,
            first_name: fName,
            last_name: lName,
            email: userEmail,
            department_id: deptRow?.id || null,
            status: 'active',
            employment_type: 'Full-time'
          });
        } catch (empErr) {
          console.warn('Could not auto-create employee row:', empErr);
        }

        // Record audit log
        try {
          await supabase.from('audit_logs').insert({
            user_id: authUser.id,
            action: `New user signed up as ${selectedRole.toUpperCase()} (${userEmail})`,
            security_level: 'INFO'
          });
        } catch {}

        setCurrentRole(selectedRole);
        setCurrentUser(userObj);
        setIsAuthenticated(true);
        setCurrentRoute('dashboard');

        localStorage.setItem('payflow_session', JSON.stringify({
          user: userObj,
          route: 'dashboard',
          theme
        }));

        return { success: true, autoSignedIn: true, user: userObj };
      }

      return { success: true, autoSignedIn: false, email: userEmail };
    } catch (err) {
      throw err;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out completed:', err);
    }
    setSession(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentRoute('landing');
    localStorage.removeItem('payflow_session');
  };

  const switchRole = (role, stayOnRoute = true) => {
    if (ROLE_LABELS[role]) {
      setCurrentRole(role);
      let updatedUser = null;
      if (currentUser) {
        updatedUser = {
          ...currentUser,
          role,
          roleLabel: ROLE_LABELS[role],
          department: DEFAULT_DEPARTMENTS[role],
          designation: DEFAULT_DESIGNATIONS[role]
        };
        setCurrentUser(updatedUser);
      }
      try {
        const saved = JSON.parse(localStorage.getItem('payflow_session') || '{}');
        localStorage.setItem('payflow_session', JSON.stringify({
          ...saved,
          user: updatedUser || saved.user,
          route: stayOnRoute ? currentRoute : 'dashboard'
        }));
      } catch {}

      if (!stayOnRoute) {
        setCurrentRoute('dashboard');
      }
    }
  };

  const forgotPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      return { data, error };
    } catch (err) {
      return { error: { message: err.message } };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      return { data, error };
    } catch (err) {
      return { error: { message: err.message } };
    }
  };

  const navigateTo = (routeId) => {
    setCurrentRoute(routeId);
    setMobileMenuOpen(false);
    // Update persisted route so refresh restores correct page
    try {
      const saved = JSON.parse(localStorage.getItem('payflow_session') || '{}');
      localStorage.setItem('payflow_session', JSON.stringify({ ...saved, route: routeId }));
    } catch {}
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    // Persist theme preference
    try {
      const saved = JSON.parse(localStorage.getItem('payflow_session') || '{}');
      localStorage.setItem('payflow_session', JSON.stringify({ ...saved, theme: newTheme }));
    } catch {}
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser: currentUser || {
          id: '',
          name: 'User',
          email: '',
          role: 'admin',
          roleLabel: 'System Administrator',
          avatar: 'https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff',
          department: 'Executive',
          designation: 'Administrator'
        },
        currentRole,
        currentRoute,
        theme,
        isSidebarOpen,
        mobileMenuOpen,
        session,
        loading,
        setMobileMenuOpen,
        login,
        signup,
        logout,
        switchRole,
        forgotPassword,
        updatePassword,
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
