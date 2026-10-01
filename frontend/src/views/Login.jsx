import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, Building2, Sun, Moon, Eye, EyeOff, User, UserPlus, LogIn, CheckCircle2, AlertCircle } from 'lucide-react';

export const LoginView = () => {
  const { login, signup, navigateTo, theme, toggleTheme } = useAuth();
  const isDark = theme === 'dark';

  // Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState('signin');

  // Registration & Login Fields
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [selectedDept, setSelectedDept] = useState('Engineering & Tech');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');
    setSuccessMsg('');

    try {
      if (authMode === 'signup') {
        const res = await signup(email, password, fullName, selectedRole, selectedDept);
        if (res.autoSignedIn) {
          // Immediately navigated to dashboard by AuthContext
        } else {
          setSuccessMsg('Account created successfully! You can now sign in below.');
          setAuthMode('signin');
        }
      } else {
        await login(email, password);
      }
    } catch (err) {
      setLoginError(err.message || 'Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setLoginError(''); // Clear error when user switches role
  };

  const getRoleTitle = (role) => {
    if (role === 'admin') return 'ADMIN';
    if (role === 'manager') return `${selectedDept.split('&')[0].trim().toUpperCase()} MANAGER`;
    return 'EMPLOYEE';
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
      {/* Ambient background glow */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.12)', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '450px', height: '450px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.1)', filter: 'blur(100px)', pointerEvents: 'none' }} />

      {/* Theme Toggle */}
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

      {/* Back to Home button */}
      <button
        onClick={() => navigateTo('landing')}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
          background: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
          color: isDark ? '#94a3b8' : '#475569',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 600
        }}
      >
        &larr; Back to Landing Page
      </button>

      <div
        className="glass"
        style={{
          width: '100%',
          maxWidth: '460px',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
          background: isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.96)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(226, 232, 240, 0.9)',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              marginBottom: '0.75rem',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
            }}
          >
            <Zap size={26} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            PayFlow<span style={{ color: '#3b82f6' }}>HR</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '0.25rem' }}>
            Enterprise Employee Payroll & HR Management
          </p>
        </div>

        {/* AUTH MODE TOGGLE TABS */}
        <div
          style={{
            display: 'flex',
            background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#f1f5f9',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '1.25rem',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setLoginError('');
              setSuccessMsg('');
            }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: '9px',
              border: 'none',
              background: authMode === 'signin' ? (isDark ? '#3b82f6' : '#ffffff') : 'transparent',
              color: authMode === 'signin' ? '#ffffff' : (isDark ? '#94a3b8' : '#64748b'),
              boxShadow: authMode === 'signin' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <LogIn size={15} /> Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setLoginError('');
              setSuccessMsg('');
            }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: '9px',
              border: 'none',
              background: authMode === 'signup' ? (isDark ? '#3b82f6' : '#ffffff') : 'transparent',
              color: authMode === 'signup' ? '#ffffff' : (isDark ? '#94a3b8' : '#64748b'),
              boxShadow: authMode === 'signup' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <UserPlus size={15} /> Register / Sign Up
          </button>
        </div>

        {/* Success Message Banner */}
        {successMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: isDark ? '#6ee7b7' : '#047857',
              fontSize: '0.825rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Role & Department selector ONLY when registering a new account */}
        {authMode === 'signup' && (
          <>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '0.5rem' }}>
                <ShieldCheck size={14} style={{ color: '#3b82f6' }} />
                Select Role to Register As
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('admin')}
                  style={{
                    padding: '0.65rem 0.4rem',
                    borderRadius: '10px',
                    border: '1.5px solid',
                    borderColor: selectedRole === 'admin' ? '#8b5cf6' : (isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1'),
                    background: selectedRole === 'admin' ? (isDark ? 'rgba(139, 92, 246, 0.25)' : '#ede9fe') : (isDark ? 'rgba(15, 23, 42, 0.6)' : '#ffffff'),
                    color: selectedRole === 'admin' ? (isDark ? '#c4b5fd' : '#6d28d9') : (isDark ? '#94a3b8' : '#64748b'),
                    cursor: 'pointer',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedRole === 'admin' ? '0 4px 12px rgba(139, 92, 246, 0.2)' : 'none'
                  }}
                >
                  Admin
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('manager')}
                  style={{
                    padding: '0.65rem 0.4rem',
                    borderRadius: '10px',
                    border: '1.5px solid',
                    borderColor: selectedRole === 'manager' ? '#3b82f6' : (isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1'),
                    background: selectedRole === 'manager' ? (isDark ? 'rgba(59, 130, 246, 0.25)' : '#dbeafe') : (isDark ? 'rgba(15, 23, 42, 0.6)' : '#ffffff'),
                    color: selectedRole === 'manager' ? (isDark ? '#93c5fd' : '#1d4ed8') : (isDark ? '#94a3b8' : '#64748b'),
                    cursor: 'pointer',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedRole === 'manager' ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none'
                  }}
                >
                  Manager
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('employee')}  
                  style={{
                    padding: '0.65rem 0.4rem',
                    borderRadius: '10px',
                    border: '1.5px solid',
                    borderColor: selectedRole === 'employee' ? '#10b981' : (isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1'),
                    background: selectedRole === 'employee' ? (isDark ? 'rgba(16, 185, 129, 0.25)' : '#d1fae5') : (isDark ? 'rgba(15, 23, 42, 0.6)' : '#ffffff'),
                    color: selectedRole === 'employee' ? (isDark ? '#6ee7b7' : '#047857') : (isDark ? '#94a3b8' : '#64748b'),
                    cursor: 'pointer',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedRole === 'employee' ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none'
                  }}
                >
                  Employee
                </button>
              </div>
            </div>

            {(selectedRole === 'manager' || selectedRole === 'employee') && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', marginBottom: '0.35rem' }}>
                  <Building2 size={13} style={{ color: 'var(--primary-400)' }} />
                  {selectedRole === 'manager' ? 'Select Department Managed' : 'Assigned Department'}
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.875rem',
                    borderRadius: '10px',
                    background: isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #cbd5e1',
                    color: isDark ? '#ffffff' : '#0f172a',
                    fontSize: '0.85rem',
                    outline: 'none',
                    fontWeight: 600
                  }}
                >
                  <option value="Engineering & Tech">Engineering & Tech</option>
                  <option value="Human Resources">Human Resources (HR)</option>
                  <option value="Finance & Accounting">Finance & Accounting</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
            )}
          </>
        )}

        {/* 2. FORM */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Full Name field in Signup mode */}
          {authMode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: isDark ? '#94a3b8' : '#475569', marginBottom: '0.35rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', color: isDark ? '#64748b' : '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: isDark ? '#94a3b8' : '#475569', marginBottom: '0.35rem' }}>
              Email Address (Gmail / Personal / Work)
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', color: isDark ? '#64748b' : '#94a3b8' }} />
              <input
                type="email"
                placeholder="e.g. yourname@gmail.com"
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
                Password {authMode === 'signup' && <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>(min. 6 chars)</span>}
              </label>
              {authMode === 'signin' && (
                <button
                  type="button"
                  onClick={() => navigateTo('forgot-password')}
                  style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', color: isDark ? '#64748b' : '#94a3b8', zIndex: 1 }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={authMode === 'signup' ? 'Create a strong password' : 'Enter password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.65rem 2.75rem 0.65rem 2.4rem',
                  borderRadius: '10px',
                  background: isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #cbd5e1',
                  color: isDark ? '#ffffff' : '#0f172a',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  color: isDark ? '#64748b' : '#94a3b8',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#3b82f6'}
                onMouseLeave={e => e.currentTarget.style.color = isDark ? '#64748b' : '#94a3b8'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Error Message Banner */}
          {loginError && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: isDark ? '#fca5a5' : '#dc2626',
              fontSize: '0.825rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              marginTop: '-0.25rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{loginError}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.8rem',
              marginTop: '0.5rem',
              borderRadius: '12px',
              background: authMode === 'signup'
                ? (selectedRole === 'admin'
                    ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                    : selectedRole === 'manager'
                    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                    : 'linear-gradient(135deg, #10b981, #059669)')
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              border: 'none',
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              cursor: 'pointer'
            }}
          >
            {isSubmitting
              ? (authMode === 'signup' ? 'Creating Account...' : 'Signing In...')
              : (authMode === 'signup' ? `Register & Sign In as ${getRoleTitle(selectedRole)}` : 'Sign In')}
            {!isSubmitting && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Mode Switch Helper */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem' }}>
          {authMode === 'signin' ? (
            <span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              New person or need an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setLoginError('');
                  setSuccessMsg('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Register Here
              </button>
            </span>
          ) : (
            <span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              Already registered with an email?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setLoginError('');
                  setSuccessMsg('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Sign In
              </button>
            </span>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.75rem', color: isDark ? '#64748b' : '#94a3b8' }}>
          Direct Secure Authentication &bull; PayFlow HR
        </div>
      </div>
    </div>
  );
};
