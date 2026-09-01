import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Play,
  Users,
  Target,
  Shield,
  Headphones,
  ChevronDown,
  Building2,
  Clock,
  CalendarDays,
  CreditCard,
  FileText,
  BarChart3,
  Check,
  Zap,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  X,
  Sun,
  Moon
} from 'lucide-react';

export const LandingPageView = () => {
  const { navigateTo, login, theme, toggleTheme } = useAuth();
  const isDark = theme === 'dark';

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  // Login form state
  const [selectedRole, setSelectedRole] = useState('admin');
  const [email, setEmail] = useState('admin@payflow.hr');
  const [password, setPassword] = useState('••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleOpenLogin = (role = 'admin') => {
    setSelectedRole(role);
    if (role === 'admin') setEmail('admin@payflow.hr');
    else if (role === 'manager') setEmail('marcus.vance@payflow.hr');
    else setEmail('elena.r@payflow.hr');

    setAuthError('');
    setIsLoginModalOpen(true);
  };

  const handleRoleQuickSelect = (role, defaultEmail) => {
    setSelectedRole(role);
    setEmail(defaultEmail);
    setAuthError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');

    try {
      const res = await login(email, password, selectedRole);
      if (res && res.error) {
        setAuthError(res.error.message || 'Invalid credentials.');
      } else {
        setIsLoginModalOpen(false);
        navigateTo('dashboard');
      }
    } catch (err) {
      setAuthError('Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', position: 'relative', overflowX: 'hidden' }}>
      {/* Landing Page Content Wrapper (Blurs when isLoginModalOpen is true) */}
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: isDark ? '#0f172a' : '#f8fafc',
          color: isDark ? '#f8fafc' : '#0f172a',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          filter: isLoginModalOpen ? 'blur(10px) brightness(0.7)' : 'none',
          transition: 'filter 0.35s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease',
          pointerEvents: isLoginModalOpen ? 'none' : 'auto'
        }}
      >
        {/* Background Gradient Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '1000px',
            height: '600px',
            background: isDark
              ? 'radial-gradient(circle, rgba(30, 58, 138, 0.45) 0%, rgba(15, 23, 42, 0.25) 50%, rgba(15, 23, 42, 0) 80%)'
              : 'radial-gradient(circle, rgba(186, 230, 253, 0.45) 0%, rgba(224, 242, 254, 0.25) 50%, rgba(248, 250, 252, 0) 80%)',
            filter: 'blur(60px)',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />

        {/* Top Sticky Navigation Bar */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: isDark ? '1px solid rgba(51, 65, 85, 0.8)' : '1px solid rgba(226, 232, 240, 0.8)',
            padding: '0.875rem 2rem',
            transition: 'background-color 0.3s ease, border-color 0.3s ease'
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {/* Logo & Tagline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigateTo('landing')}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '1.4rem',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)'
                }}
              >
                P
              </div>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  PayFlow <span style={{ color: '#3b82f6' }}>HR</span>
                </div>
                <div style={{ fontSize: '0.675rem', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Employee Payroll Management System
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                fontSize: '0.925rem',
                fontWeight: 600,
                color: isDark ? '#cbd5e1' : '#334155'
              }}
              className="hidden-mobile"
            >
              <a href="#features" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Features</a>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setSolutionsOpen(!solutionsOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    font: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  Solutions <ChevronDown size={14} />
                </button>
                {solutionsOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 0.5rem)',
                      left: 0,
                      width: '220px',
                      background: isDark ? '#1e293b' : '#ffffff',
                      color: isDark ? '#ffffff' : '#0f172a',
                      borderRadius: '12px',
                      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                      padding: '0.5rem',
                      zIndex: 110
                    }}
                  >
                    <div style={{ padding: '0.6rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => setSolutionsOpen(false)}>For Enterprise & SaaS</div>
                    <div style={{ padding: '0.6rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => setSolutionsOpen(false)}>For Small & Medium Business</div>
                    <div style={{ padding: '0.6rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => setSolutionsOpen(false)}>For Remote & Global Teams</div>
                  </div>
                )}
              </div>
              <a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</a>
              <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
              <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
            </nav>

            {/* Action CTAs & Theme Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                style={{
                  padding: '0.55rem',
                  borderRadius: '10px',
                  border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                  background: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                {isDark ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} style={{ color: '#6366f1' }} />}
              </button>

              <button
                onClick={() => handleOpenLogin('admin')}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '10px',
                  border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                  background: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f172a',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Log In
              </button>

              <button
                onClick={() => handleOpenLogin('admin')}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  transition: 'transform 0.2s, background 0.2s'
                }}
              >
                Try Started <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Hero Container */}
        <section
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '3.5rem 2rem 2rem 2rem',
            position: 'relative',
            zIndex: 1
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1.15fr', gap: '3rem', alignItems: 'center' }}>
            {/* Hero Left Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Pill Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  background: isDark ? 'rgba(30, 58, 138, 0.6)' : 'rgba(219, 234, 254, 0.7)',
                  border: isDark ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(147, 197, 253, 0.8)',
                  color: isDark ? '#60a5fa' : '#1d4ed8',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  width: 'fit-content'
                }}
              >
                <ShieldCheck size={16} /> Smart HR. Secure Payroll. Simplified.
              </div>

              {/* Headline */}
              <h1
                style={{
                  fontSize: '3.6rem',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.035em',
                  color: isDark ? '#ffffff' : '#0f172a'
                }}
              >
                Manage Payroll with Complete{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                  }}
                >
                  Confidence.
                </span>
              </h1>

              {/* Subheadline Paragraph */}
              <p
                style={{
                  fontSize: '1.125rem',
                  color: isDark ? '#94a3b8' : '#475569',
                  lineHeight: 1.6,
                  maxWidth: '520px'
                }}
              >
                PayFlow HR streamlines employee management, attendance, leave, salary processing, and reporting — all in one place.
              </p>

              {/* Action CTAs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <button
                  onClick={() => handleOpenLogin('admin')}
                  style={{
                    padding: '0.85rem 1.75rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.45)',
                    transition: 'all 0.2s'
                  }}
                >
                  Explore Dashboard <ArrowUpRight size={18} />
                </button>

                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  style={{
                    padding: '0.85rem 1.75rem',
                    borderRadius: '12px',
                    border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                    background: isDark ? '#1e293b' : '#ffffff',
                    color: isDark ? '#ffffff' : '#0f172a',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: isDark ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                    <Play size={12} fill="#2563eb" />
                  </div>
                  Watch Demo
                </button>
              </div>

              {/* Trust Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: isDark ? '#cbd5e1' : '#334155' }}>
                  <CheckCircle2 size={18} style={{ color: '#3b82f6' }} /> Secure & Reliable
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: isDark ? '#cbd5e1' : '#334155' }}>
                  <CheckCircle2 size={18} style={{ color: '#3b82f6' }} /> Easy to Use
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: isDark ? '#cbd5e1' : '#334155' }}>
                  <CheckCircle2 size={18} style={{ color: '#3b82f6' }} /> Built for Teams
                </div>
              </div>
            </div>

            {/* Hero Right: 3D Laptop Perspective Showcase */}
            <div
              style={{
                position: 'relative',
                perspective: '1200px',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              {/* Laptop Screen Frame */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '680px',
                  borderRadius: '16px',
                  background: '#0f172a',
                  padding: '12px 12px 0 12px',
                  boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  transform: 'rotateY(-6deg) rotateX(4deg)',
                  transition: 'transform 0.4s ease'
                }}
              >
                {/* Top Laptop Webcam Bar */}
                <div style={{ height: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#334155' }}></div>
                </div>

                {/* Inside Laptop Display (PayFlow HR Admin Dashboard Preview) */}
                <div
                  style={{
                    background: '#090d16',
                    color: '#ffffff',
                    borderRadius: '10px 10px 0 0',
                    padding: '1rem',
                    fontSize: '0.75rem',
                    fontFamily: "'Inter', sans-serif",
                    overflow: 'hidden',
                    minHeight: '380px',
                    display: 'flex',
                    gap: '0.875rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Micro Sidebar */}
                  <div style={{ width: '130px', background: '#0f172a', borderRadius: '8px', padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, fontSize: '0.8rem', color: '#3b82f6', marginBottom: '0.5rem' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>P</div>
                      PayFlow HR
                    </div>

                    <div style={{ background: '#1e293b', color: '#3b82f6', padding: '0.35rem 0.5rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.7rem' }}>📊 Dashboard</div>
                    <div style={{ color: '#94a3b8', padding: '0.25rem 0.5rem', fontSize: '0.675rem' }}>👥 Employees</div>
                    <div style={{ color: '#94a3b8', padding: '0.25rem 0.5rem', fontSize: '0.675rem' }}>⏰ Attendance</div>
                    <div style={{ color: '#94a3b8', padding: '0.25rem 0.5rem', fontSize: '0.675rem' }}>📅 Leave</div>
                    <div style={{ color: '#94a3b8', padding: '0.25rem 0.5rem', fontSize: '0.675rem' }}>💳 Payroll</div>
                    <div style={{ color: '#94a3b8', padding: '0.25rem 0.5rem', fontSize: '0.675rem' }}>📈 Reports</div>
                    <div style={{ color: '#94a3b8', padding: '0.25rem 0.5rem', fontSize: '0.675rem' }}>📑 Payslips</div>
                    <div style={{ color: '#94a3b8', padding: '0.25rem 0.5rem', fontSize: '0.675rem' }}>⚙️ Settings</div>
                  </div>

                  {/* Micro Dashboard View Body */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Top Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                      <div style={{ background: '#1e293b', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#94a3b8', fontSize: '0.65rem' }}>🔍 Search anything...</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.65rem' }}>
                        <span style={{ color: '#3b82f6', fontWeight: 700 }}>Admin User</span>
                      </div>
                    </div>

                    {/* Welcome Message */}
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>Welcome back, Admin! 👋</div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Here's what's happening in your organization today.</div>
                    </div>

                    {/* 4 KPI Metric Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                      <div style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.55rem', color: '#94a3b8' }}>Total Employees</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#3b82f6' }}>245</div>
                        <div style={{ fontSize: '0.5rem', color: '#94a3b8' }}>All Employees</div>
                      </div>

                      <div style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.55rem', color: '#94a3b8' }}>Present Today</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>194</div>
                        <div style={{ fontSize: '0.5rem', color: '#10b981' }}>79.18% Present</div>
                      </div>

                      <div style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.55rem', color: '#94a3b8' }}>Employees on Leave</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f59e0b' }}>18</div>
                        <div style={{ fontSize: '0.5rem', color: '#f59e0b' }}>On Leave</div>
                      </div>

                      <div style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.55rem', color: '#94a3b8' }}>Current Month Payroll</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#a855f7' }}>₹ 28,45,600</div>
                        <div style={{ fontSize: '0.5rem', color: '#94a3b8' }}>May 2025 Cycle</div>
                      </div>
                    </div>

                    {/* Micro Visual Chart Mockups */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                      <div style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>Employees by Department</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '4px solid #3b82f6', borderTopColor: '#10b981', borderRightColor: '#a855f7' }}></div>
                          <div style={{ fontSize: '0.5rem', color: '#94a3b8' }}>IT 82 (33.4%)<br />HR 40 (16.3%)<br />Finance 38 (15.5%)</div>
                        </div>
                      </div>

                      <div style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>Monthly Payroll Trend</div>
                        <div style={{ height: '30px', background: 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.4))', borderRadius: '4px', position: 'relative' }}>
                          <div style={{ position: 'absolute', bottom: '4px', left: '10%', right: '10%', height: '2px', background: '#3b82f6' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Base Keyboard Deck */}
                <div
                  style={{
                    height: '14px',
                    background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
                    borderRadius: '0 0 16px 16px',
                    display: 'flex',
                    justify: 'center',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ width: '60px', height: '4px', background: '#334155', borderRadius: '2px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating 4-Metric Counter Card */}
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <div
            style={{
              marginTop: '4rem',
              background: isDark ? '#1e293b' : '#ffffff',
              borderRadius: '20px',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              boxShadow: isDark ? '0 20px 40px -15px rgba(0, 0, 0, 0.3)' : '0 20px 40px -15px rgba(0, 0, 0, 0.07)',
              padding: '1.75rem 2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem',
              alignItems: 'center',
              transition: 'background-color 0.3s ease, border-color 0.3s ease'
            }}
          >
            {/* Stat 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: isDark ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', lineHeight: 1.1 }}>500+</div>
                <div style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>Active Employees</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', lineHeight: 1.1 }}>98%</div>
                <div style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>Accuracy</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: isDark ? 'rgba(249, 115, 22, 0.2)' : '#fff7ed', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', lineHeight: 1.1 }}>100%</div>
                <div style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>Secure Data</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: isDark ? 'rgba(168, 85, 247, 0.2)' : '#f3e8ff', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Headphones size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', lineHeight: 1.1 }}>24/7</div>
                <div style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>Support</div>
              </div>
            </div>
          </div>

          {/* Footer Tagline under Stat Card */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
            <div style={{ fontSize: '0.925rem', fontWeight: 600, color: isDark ? '#94a3b8' : '#475569' }}>
              Trusted by HR teams to simplify payroll and empower employees.
            </div>
            <div style={{ width: '40px', height: '3px', background: '#3b82f6', margin: '0.65rem auto 0 auto', borderRadius: '2px' }}></div>
          </div>
        </section>

        {/* Feature Section Grid */}
        <section id="features" style={{ backgroundColor: isDark ? '#0b1120' : '#ffffff', padding: '5rem 2rem', marginTop: '4rem', borderTop: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', transition: 'background-color 0.3s ease' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{ color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>Everything You Need</div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.025em', marginTop: '0.25rem' }}>
                Powerful Modules for Modern HR & Payroll
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              {/* Feature 1 */}
              <div style={{ background: isDark ? '#1e293b' : '#f8fafc', padding: '2rem', borderRadius: '16px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: isDark ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Users size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem' }}>Employee Management</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>Complete 7-tab profile lifecycle directory with department tracking, documents, and soft-deactivation safety.</p>
              </div>

              {/* Feature 2 */}
              <div style={{ background: isDark ? '#1e293b' : '#f8fafc', padding: '2rem', borderRadius: '16px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Clock size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem' }}>Automated Attendance</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>Real-time timecard logs, automatic shift hours calculation, overtime rates, and interactive monthly calendar view.</p>
              </div>

              {/* Feature 3 */}
              <div style={{ background: isDark ? '#1e293b' : '#f8fafc', padding: '2rem', borderRadius: '16px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: isDark ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <CalendarDays size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem' }}>Leave Workflows</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>Casual, Sick, Earned, and Unpaid leave approvals with automated balance deductions and rejection reason tracking.</p>
              </div>

              {/* Feature 4 */}
              <div style={{ background: isDark ? '#1e293b' : '#f8fafc', padding: '2rem', borderRadius: '16px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: isDark ? 'rgba(168, 85, 247, 0.2)' : '#f3e8ff', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <CreditCard size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem' }}>Monthly Payroll Engine</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>8-step batch processing engine integrating attendance overtime and unpaid leave deductions with duplicate prevention.</p>
              </div>

              {/* Feature 5 */}
              <div style={{ background: isDark ? '#1e293b' : '#f8fafc', padding: '2rem', borderRadius: '16px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: isDark ? 'rgba(6, 182, 212, 0.2)' : '#ecfeff', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <FileText size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem' }}>A4 Printable Payslips</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>Itemized earnings vs deductions breakdown formatted for standard A4 paper printing and instant PDF downloads.</p>
              </div>

              {/* Feature 6 */}
              <div style={{ background: isDark ? '#1e293b' : '#f8fafc', padding: '2rem', borderRadius: '16px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: isDark ? 'rgba(225, 29, 72, 0.2)' : '#fff1f2', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <BarChart3 size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem' }}>Analytics & CSV Exports</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>6-category HR reporting hub with visual analytical charts and instant `.csv` spreadsheet file export generation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" style={{ padding: '5rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>Flexible Pricing</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.025em', marginTop: '0.25rem' }}>
              Transparent Plans for Every Organization
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {/* Plan 1 */}
            <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2.5rem 2rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a' }}>Starter</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', margin: '1rem 0' }}>\$29 <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 500 }}>/ mo</span></div>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Ideal for growing teams up to 25 employees.</p>
              <button onClick={() => handleOpenLogin('admin')} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: isDark ? '1px solid #475569' : '1px solid #cbd5e1', background: isDark ? '#334155' : '#ffffff', color: isDark ? '#ffffff' : '#0f172a', fontWeight: 700, cursor: 'pointer' }}>Get Started</button>
            </div>

            {/* Plan 2 Featured */}
            <div style={{ background: isDark ? '#0f172a' : '#0f172a', color: '#ffffff', padding: '2.5rem 2rem', borderRadius: '20px', border: '2px solid #2563eb', boxShadow: '0 20px 40px -10px rgba(37, 99, 235, 0.3)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: '#ffffff', padding: '0.25rem 0.875rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Most Popular</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Professional</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, margin: '1rem 0', color: '#ffffff' }}>\$89 <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 500 }}>/ mo</span></div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Full payroll & HR suite for up to 150 employees.</p>
              <button onClick={() => handleOpenLogin('admin')} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}>Start Free Trial</button>
            </div>

            {/* Plan 3 */}
            <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2.5rem 2rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a' }}>Enterprise</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', margin: '1rem 0' }}>\$249 <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 500 }}>/ mo</span></div>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Unlimited employees, custom RLS, and dedicated SLA.</p>
              <button onClick={() => handleOpenLogin('admin')} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: isDark ? '1px solid #475569' : '1px solid #cbd5e1', background: isDark ? '#334155' : '#ffffff', color: isDark ? '#ffffff' : '#0f172a', fontWeight: 700, cursor: 'pointer' }}>Contact Sales</button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '4rem 2rem 2rem 2rem', marginTop: '5rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #334155' }}>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff' }}>PayFlow <span style={{ color: '#3b82f6' }}>HR</span></div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>Employee Payroll Management System & SaaS Platform</div>
            </div>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', color: '#94a3b8' }}>
              <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
              <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
              <a href="#privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            </div>
          </div>
          <div style={{ maxWidth: '1280px', margin: '1.5rem auto 0 auto', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
            &copy; {new Date().getFullYear()} PayFlow HR Technologies Inc. All rights reserved. Built for modern HR teams.
          </div>
        </footer>
      </div>

      {/* LOGIN MODAL OVERLAY (Theme-dependent glass modal) */}
      {isLoginModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: isDark ? 'rgba(2, 6, 23, 0.8)' : 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.25s ease-out'
          }}
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '460px',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              boxShadow: isDark
                ? '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.12)'
                : '0 25px 60px -15px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.9)',
              position: 'relative',
              background: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: isDark ? '#ffffff' : '#0f172a',
              transition: 'background-color 0.3s ease, color 0.3s ease'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="btn-icon"
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                color: isDark ? '#94a3b8' : '#475569',
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
                borderRadius: '50%'
              }}
            >
              <X size={20} />
            </button>

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
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.02em' }}>
                PayFlow<span style={{ color: '#3b82f6' }}>HR</span>
              </h2>
              <p style={{ fontSize: '0.875rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '0.25rem' }}>
                Sign in to access your payroll portal
              </p>
            </div>

            {/* Quick Demo Persona Selector */}
            <div
              style={{
                marginBottom: '1.5rem',
                background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#f1f5f9',
                padding: '0.75rem',
                borderRadius: '12px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0'
              }}
            >
              <div style={{ fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={14} style={{ color: '#3b82f6' }} /> Select Demo Persona
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleRoleQuickSelect('admin', 'admin@payflow.hr')}
                  style={{
                    padding: '0.55rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: selectedRole === 'admin' ? '#3b82f6' : isDark ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1',
                    background: selectedRole === 'admin' ? '#2563eb' : isDark ? 'transparent' : '#ffffff',
                    color: selectedRole === 'admin' ? '#ffffff' : isDark ? '#94a3b8' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Admin
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleQuickSelect('manager', 'marcus.vance@payflow.hr')}
                  style={{
                    padding: '0.55rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: selectedRole === 'manager' ? '#3b82f6' : isDark ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1',
                    background: selectedRole === 'manager' ? '#2563eb' : isDark ? 'transparent' : '#ffffff',
                    color: selectedRole === 'manager' ? '#ffffff' : isDark ? '#94a3b8' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Manager
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleQuickSelect('employee', 'elena.r@payflow.hr')}
                  style={{
                    padding: '0.55rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: selectedRole === 'employee' ? '#3b82f6' : isDark ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1',
                    background: selectedRole === 'employee' ? '#2563eb' : isDark ? 'transparent' : '#ffffff',
                    color: selectedRole === 'employee' ? '#ffffff' : isDark ? '#94a3b8' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
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

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                    onClick={() => {
                      setIsLoginModalOpen(false);
                      navigateTo('forgot-password');
                    }}
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
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginTop: '0.5rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
                }}
              >
                {isSubmitting ? 'Authenticating...' : `Sign In as ${selectedRole.toUpperCase()}`}
                {!isSubmitting && <ArrowRight size={18} />}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: isDark ? '#64748b' : '#94a3b8' }}>
              Secure Enterprise Payroll Portal &bull; SSL 256-bit Encryption
            </div>
          </div>
        </div>
      )}

      {/* Watch Demo Video Modal */}
      {isDemoModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '800px',
              background: isDark ? '#0f172a' : '#ffffff',
              color: isDark ? '#ffffff' : '#0f172a',
              borderRadius: '20px',
              padding: '1.5rem',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>PayFlow HR Product Demonstration</div>
              <button onClick={() => setIsDemoModalOpen(false)} style={{ background: 'none', border: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>
            <div style={{ width: '100%', height: '400px', background: isDark ? '#1e293b' : '#f8fafc', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => { setIsDemoModalOpen(false); handleOpenLogin('admin'); }}>
                <Play size={28} fill="#ffffff" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Click to Launch Full Interactive SaaS Demo</div>
              <button onClick={() => { setIsDemoModalOpen(false); handleOpenLogin('admin'); }} className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
                Open Login Modal Overlay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
