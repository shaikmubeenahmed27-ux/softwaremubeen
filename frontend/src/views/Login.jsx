import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sun, Moon } from 'lucide-react';

export const LoginView = () => {
  const { login, navigateTo, theme, toggleTheme } = useAuth();
  const isDark = theme === 'dark';

  const [selectedRole, setSelectedRole] = useState('admin');
  const [email, setEmail] = useState('admin@payflow.hr');
  const [password, setPassword] = useState('••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');

    try {
      const res = await login(email, password, selectedRole);
      if (res && res.error) {
        setAuthError(res.error.message || 'Invalid credentials.');
      }
    } catch (err) {
      setAuthError('Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleQuickSelect = (role, defaultEmail) => {
    setSelectedRole(role);
    setEmail(defaultEmail);
    setAuthError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark
          ? 'radial-gradient(circle at top right, #1e3a8a 0%, #0f172a 60%, #020617 100%)'
          : 'radial-gradient(circle at top right, #dbeafe 0%, #f8fafc 60%, #e2e8f0 100%)',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        color: isDark ? '#ffffff' : '#0f172a',
        transition: 'background 0.3s ease, color 0.3s ease'
      }}
    >
      {/* Background ambient glow circles */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.12)', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '450px', height: '450px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.1)', filter: 'blur(100px)', pointerEvents: 'none' }} />

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          padding: '0.6rem',
          borderRadius: '50%',
          border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
          background: isDark ? '#1e293b' : '#ffffff',
          color: isDark ? '#ffffff' : '#0f172a',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        {isDark ? <Sun size={20} style={{ color: '#f59e0b' }} /> : <Moon size={20} style={{ color: '#6366f1' }} />}
      </button>

      <div
        className="glass"
        style={{
          width: '100%',
          maxWidth: '460px',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
          background: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.95)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(226, 232, 240, 0.9)',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              marginBottom: '1rem',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
            }}
          >
            <Zap size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.02em' }}>
            PayFlow<span style={{ color: '#3b82f6' }}>HR</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '0.25rem' }}>
            Employee Payroll Management System
          </p>
        </div>

        {/* Quick Role Selector for testing */}
        <div style={{ marginBottom: '1.5rem', background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#f1f5f9', padding: '0.75rem', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} style={{ color: '#3b82f6' }} /> Select Demo Persona
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleRoleQuickSelect('admin', 'admin@payflow.hr')}
              style={{
                padding: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selectedRole === 'admin' ? '#3b82f6' : isDark ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1',
                background: selectedRole === 'admin' ? '#2563eb' : isDark ? 'transparent' : '#ffffff',
                color: selectedRole === 'admin' ? '#ffffff' : isDark ? '#94a3b8' : '#475569',
                cursor: 'pointer'
              }}
            >
              Admin
            </button>

            <button
              type="button"
              onClick={() => handleRoleQuickSelect('manager', 'marcus.vance@payflow.hr')}
              style={{
                padding: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selectedRole === 'manager' ? '#3b82f6' : isDark ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1',
                background: selectedRole === 'manager' ? '#2563eb' : isDark ? 'transparent' : '#ffffff',
                color: selectedRole === 'manager' ? '#ffffff' : isDark ? '#94a3b8' : '#475569',
                cursor: 'pointer'
              }}
            >
              Manager
            </button>

            <button
              type="button"
              onClick={() => handleRoleQuickSelect('employee', 'elena.r@payflow.hr')}
              style={{
                padding: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selectedRole === 'employee' ? '#3b82f6' : isDark ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1',
                background: selectedRole === 'employee' ? '#2563eb' : isDark ? 'transparent' : '#ffffff',
                color: selectedRole === 'employee' ? '#ffffff' : isDark ? '#94a3b8' : '#475569',
                cursor: 'pointer'
              }}
            >
              Employee
            </button>
          </div>
        </div>

        {authError && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} /> {authError}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: isDark ? '#94a3b8' : '#475569', marginBottom: '0.35rem' }}>
              Work Email Address
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', color: isDark ? '#64748b' : '#94a3b8' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.875rem 0.65rem 2.4rem',
                  borderRadius: '10px',
                  background: isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #cbd5e1',
                  color: isDark ? '#ffffff' : '#0f172a',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: isDark ? '#94a3b8' : '#475569' }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => navigateTo('forgot-password')}
                style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', color: isDark ? '#64748b' : '#94a3b8' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.875rem 0.65rem 2.4rem',
                  borderRadius: '10px',
                  background: isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #cbd5e1',
                  color: isDark ? '#ffffff' : '#0f172a',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', fontWeight: 700, fontSize: '0.95rem' }}
          >
            {isSubmitting ? 'Authenticating...' : `Sign In as ${selectedRole.toUpperCase()}`}
            {!isSubmitting && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.75rem', color: isDark ? '#64748b' : '#94a3b8' }}>
          Secure Enterprise Payroll Portal &bull; SSL 256-bit Encryption
        </div>
      </div>
    </div>
  );
};
