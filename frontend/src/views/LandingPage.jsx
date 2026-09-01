import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
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
  AlertCircle,
  X,
  Sun,
  Moon,
  Menu,
  Sparkles,
  TrendingUp,
  UserCheck,
  HelpCircle,
  FileCheck2,
  Award
} from 'lucide-react';

export const LandingPageView = () => {
  const { navigateTo, login, theme, toggleTheme } = useAuth();
  const isDark = theme === 'dark';

  // State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState('payroll');

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
      {/* LANDING PAGE WRAPPER (Blurs when login modal is active) */}
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          color: isDark ? '#f8fafc' : '#0f172a',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          filter: isLoginModalOpen ? 'blur(10px) brightness(0.7)' : 'none',
          transition: 'filter 0.35s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease',
          pointerEvents: isLoginModalOpen ? 'none' : 'auto'
        }}
      >
        {/* Subtle Ambient Background Gradient Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-5%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '1100px',
            height: '650px',
            background: isDark
              ? 'radial-gradient(circle, rgba(30, 58, 138, 0.35) 0%, rgba(15, 23, 42, 0.15) 50%, rgba(15, 23, 42, 0) 80%)'
              : 'radial-gradient(circle, rgba(219, 234, 254, 0.6) 0%, rgba(238, 242, 255, 0.3) 50%, rgba(255, 255, 255, 0) 80%)',
            filter: 'blur(70px)',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />

        {/* 1. FIXED / STICKY NAVBAR */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: isDark ? '1px solid rgba(51, 65, 85, 0.7)' : '1px solid rgba(226, 232, 240, 0.8)',
            padding: '0.875rem 2rem',
            transition: 'all 0.3s ease'
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
            {/* Left: Brand Logo + Name + Tagline */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
              onClick={() => navigateTo('landing')}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '1.45rem',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                }}
              >
                P
              </div>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
                  PayFlow <span style={{ color: '#2563eb' }}>HR</span>
                </div>
                <div style={{ fontSize: '0.675rem', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Payroll Made Simple
                </div>
              </div>
            </div>

            {/* Middle: Navigation Links (Desktop) */}
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2.25rem',
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
                      top: 'calc(100% + 0.6rem)',
                      left: '-10px',
                      width: '240px',
                      background: isDark ? '#1e293b' : '#ffffff',
                      color: isDark ? '#ffffff' : '#0f172a',
                      borderRadius: '14px',
                      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                      boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.15)',
                      padding: '0.6rem',
                      zIndex: 110
                    }}
                  >
                    <div style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }} onClick={() => setSolutionsOpen(false)}>For Enterprise Organizations</div>
                    <div style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }} onClick={() => setSolutionsOpen(false)}>For Small & Medium Business</div>
                    <div style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }} onClick={() => setSolutionsOpen(false)}>For Remote & Global Teams</div>
                  </div>
                )}
              </div>

              <a href="#how-it-works" style={{ color: 'inherit', textDecoration: 'none' }}>How It Works</a>
              <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
              <a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
            </nav>

            {/* Right: Action CTAs & Theme Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
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
                  padding: '0.6rem 1.35rem',
                  borderRadius: '10px',
                  border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                  background: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f172a',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Log In
              </button>

              <button
                onClick={() => handleOpenLogin('admin')}
                style={{
                  padding: '0.65rem 1.45rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  transition: 'transform 0.2s'
                }}
              >
                Get Started
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  display: 'none',
                  padding: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: isDark ? '#ffffff' : '#0f172a',
                  cursor: 'pointer'
                }}
                className="show-mobile-flex"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown Panel */}
          {mobileMenuOpen && (
            <div
              style={{
                background: isDark ? '#1e293b' : '#ffffff',
                borderTop: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginTop: '0.75rem'
              }}
            >
              <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>How It Works</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>Pricing</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>About</a>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button onClick={() => { setMobileMenuOpen(false); handleOpenLogin('admin'); }} style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 700 }}>Log In</button>
                <button onClick={() => { setMobileMenuOpen(false); handleOpenLogin('admin'); }} style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700 }}>Get Started</button>
              </div>
            </div>
          )}
        </header>

        {/* 2. HERO SECTION */}
        <section
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '4rem 2rem 2.5rem 2rem',
            position: 'relative',
            zIndex: 1
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1.15fr', gap: '3.5rem', alignItems: 'center' }} className="hero-responsive-grid">
            {/* Hero Left Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Small Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 1.1rem',
                  borderRadius: '9999px',
                  background: isDark ? 'rgba(30, 58, 138, 0.6)' : 'rgba(219, 234, 254, 0.75)',
                  border: isDark ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(147, 197, 253, 0.8)',
                  color: isDark ? '#60a5fa' : '#1d4ed8',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  width: 'fit-content'
                }}
              >
                <ShieldCheck size={16} /> All-in-One Payroll & HR Management
              </div>

              {/* Main Heading */}
              <h1
                style={{
                  fontSize: '3.8rem',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.04em',
                  color: isDark ? '#ffffff' : '#0f172a'
                }}
              >
                Smart Payroll.<br />
                Happy Employees.<br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                  }}
                >
                  Stronger Business.
                </span>
              </h1>

              {/* Description */}
              <p
                style={{
                  fontSize: '1.15rem',
                  color: isDark ? '#94a3b8' : '#475569',
                  lineHeight: 1.6,
                  maxWidth: '540px'
                }}
              >
                PayFlow HR simplifies payroll, attendance, leave, salary processing, and employee management in one secure platform—so you can save time, reduce errors, and focus on what matters most.
              </p>

              {/* Primary & Secondary Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <button
                  onClick={() => handleOpenLogin('admin')}
                  style={{
                    padding: '0.9rem 1.85rem',
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
                    transition: 'transform 0.2s'
                  }}
                >
                  Get Started Free <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  style={{
                    padding: '0.9rem 1.85rem',
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
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: isDark ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                    <Play size={12} fill="#2563eb" />
                  </div>
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Hero Right Visual: Laptop Dashboard Mockup */}
            <div
              style={{
                position: 'relative',
                perspective: '1200px',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              {/* Laptop Shell */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '680px',
                  borderRadius: '18px',
                  background: '#0f172a',
                  padding: '12px 12px 0 12px',
                  boxShadow: '0 35px 80px -15px rgba(15, 23, 42, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  transform: 'rotateY(-6deg) rotateX(4deg)',
                  transition: 'transform 0.4s ease'
                }}
              >
                {/* Webcam Notch */}
                <div style={{ height: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#334155' }}></div>
                </div>

                {/* Dashboard Screen */}
                <div
                  style={{
                    background: '#090d16',
                    color: '#ffffff',
                    borderRadius: '10px 10px 0 0',
                    padding: '1rem',
                    fontSize: '0.75rem',
                    fontFamily: "'Inter', sans-serif",
                    overflow: 'hidden',
                    minHeight: '390px',
                    display: 'flex',
                    gap: '0.875rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Micro Sidebar */}
                  <div style={{ width: '130px', background: '#0f172a', borderRadius: '8px', padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 900, fontSize: '0.8rem', color: '#3b82f6', marginBottom: '0.5rem' }}>
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
                  </div>

                  {/* Dashboard Content Mockup */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                      <div style={{ background: '#1e293b', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#94a3b8', fontSize: '0.65rem' }}>🔍 Search anything...</div>
                      <div style={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.65rem' }}>Admin User</div>
                    </div>

                    {/* KPI Metric Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem' }}>
                      <div style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.55rem', color: '#94a3b8' }}>Total Employees</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#3b82f6' }}>245</div>
                      </div>

                      <div style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.55rem', color: '#94a3b8' }}>Present Today</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>194</div>
                      </div>

                      <div style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.55rem', color: '#94a3b8' }}>On Leave</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f59e0b' }}>18</div>
                      </div>

                      <div style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.55rem', color: '#94a3b8' }}>Monthly Payroll</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#a855f7' }}>₹ 28,45,600</div>
                      </div>
                    </div>

                    {/* Chart Mockups */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                      <div style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>Employees by Dept</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '50%', border: '4px solid #3b82f6', borderTopColor: '#10b981', borderRightColor: '#a855f7' }}></div>
                          <div style={{ fontSize: '0.5rem', color: '#94a3b8' }}>IT (33.4%)<br />HR (16.3%)<br />Finance (15.5%)</div>
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

                {/* Base Hinge */}
                <div style={{ height: '14px', background: 'linear-gradient(to bottom, #1e293b, #0f172a)', borderRadius: '0 0 18px 18px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '4px', background: '#334155', borderRadius: '2px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TRUST / BENEFITS BAR */}
        <section style={{ maxWidth: '1280px', margin: '1rem auto 0 auto', padding: '0 2rem' }}>
          <div
            style={{
              background: isDark ? '#1e293b' : '#ffffff',
              borderRadius: '20px',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              boxShadow: isDark ? '0 20px 40px -15px rgba(0,0,0,0.3)' : '0 20px 40px -15px rgba(0, 0, 0, 0.06)',
              padding: '1.5rem 2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem',
              alignItems: 'center',
              transition: 'all 0.3s ease'
            }}
            className="benefits-grid"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: isDark ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isDark ? '#ffffff' : '#0f172a' }}>Secure & Reliable</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={22} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isDark ? '#ffffff' : '#0f172a' }}>Easy to Use</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: isDark ? 'rgba(249, 115, 22, 0.2)' : '#fff7ed', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={22} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isDark ? '#ffffff' : '#0f172a' }}>Save Time & Reduce Errors</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: isDark ? 'rgba(168, 85, 247, 0.2)' : '#f3e8ff', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={22} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isDark ? '#ffffff' : '#0f172a' }}>Real-Time Insights</div>
            </div>
          </div>
        </section>

        {/* 4. FEATURES SECTION (6 Core Cards) */}
        <section id="features" style={{ backgroundColor: isDark ? '#0b1120' : '#f8fafc', padding: '6rem 2rem', marginTop: '5rem', borderTop: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', transition: 'all 0.3s ease' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div style={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.85rem' }}>
                Everything You Need to Manage Payroll
              </div>
              <h2 style={{ fontSize: '2.6rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.03em', marginTop: '0.35rem' }}>
                Powerful HR and payroll tools designed to simplify everyday employee management.
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }} className="features-grid">
              {/* Feature 1 */}
              <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2.25rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: isDark ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Users size={26} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.6rem' }}>1. Employee Management</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>Manage employee profiles, departments, designations, and employment information in one place.</p>
              </div>

              {/* Feature 2 */}
              <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2.25rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Clock size={26} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.6rem' }}>2. Attendance Tracking</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>Track attendance, working hours, overtime, and employee availability with ease.</p>
              </div>

              {/* Feature 3 */}
              <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2.25rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: isDark ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <CalendarDays size={26} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.6rem' }}>3. Leave Management</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>Manage leave requests, approvals, balances, and leave history efficiently.</p>
              </div>

              {/* Feature 4 */}
              <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2.25rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: isDark ? 'rgba(168, 85, 247, 0.2)' : '#f3e8ff', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <CreditCard size={26} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.6rem' }}>4. Payroll Automation</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>Automate salary calculations, deductions, overtime, and monthly payroll processing.</p>
              </div>

              {/* Feature 5 */}
              <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2.25rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: isDark ? 'rgba(6, 182, 212, 0.2)' : '#ecfeff', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <FileText size={26} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.6rem' }}>5. Payslips & Reports</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>Generate professional payslips and access powerful payroll and HR reports.</p>
              </div>

              {/* Feature 6 */}
              <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2.25rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: isDark ? 'rgba(225, 29, 72, 0.2)' : '#fff1f2', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Shield size={26} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.6rem' }}>6. Secure & Compliant</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>Protect employee information with role-based access control and secure data management.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. HOW IT WORKS SECTION */}
        <section id="how-it-works" style={{ padding: '6rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.85rem' }}>Simple Step-by-Step Workflow</div>
            <h2 style={{ fontSize: '2.6rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.03em', marginTop: '0.35rem' }}>
              Payroll Management Made Simple
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', position: 'relative' }} className="steps-grid">
            {/* Step 1 */}
            <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2rem 1.5rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2563eb', opacity: 0.8, marginBottom: '0.5rem' }}>01</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem' }}>Add Employees</h3>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>Create and manage employee profiles.</p>
            </div>

            {/* Step 2 */}
            <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2rem 1.5rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2563eb', opacity: 0.8, marginBottom: '0.5rem' }}>02</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem' }}>Track Attendance & Leave</h3>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>Monitor attendance, working hours, and leave.</p>
            </div>

            {/* Step 3 */}
            <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2rem 1.5rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2563eb', opacity: 0.8, marginBottom: '0.5rem' }}>03</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem' }}>Process Payroll</h3>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>Calculate salaries, deductions, overtime, and net pay.</p>
            </div>

            {/* Step 4 */}
            <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2rem 1.5rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2563eb', opacity: 0.8, marginBottom: '0.5rem' }}>04</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem' }}>Generate Payslips</h3>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>Generate and deliver professional payslips.</p>
            </div>
          </div>
        </section>

        {/* 6. DASHBOARD PREVIEW SHOWCASE */}
        <section style={{ backgroundColor: isDark ? '#0b1120' : '#f8fafc', padding: '6rem 2rem', borderTop: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.85rem' }}>Full Platform Visibility</div>
            <h2 style={{ fontSize: '2.6rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.03em', marginTop: '0.35rem', marginBottom: '2.5rem' }}>
              Everything You Need. One Powerful Platform.
            </h2>

            {/* Floating Module Highlights Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              {['Employee Management', 'Attendance', 'Leave', 'Payroll', 'Payslips', 'Reports'].map((mod) => (
                <button
                  key={mod}
                  onClick={() => handleOpenLogin('admin')}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '12px',
                    border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                    background: isDark ? '#1e293b' : '#ffffff',
                    color: isDark ? '#ffffff' : '#0f172a',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Sparkles size={16} style={{ color: '#2563eb' }} /> {mod}
                </button>
              ))}
            </div>

            {/* Big Mockup Display Card */}
            <div
              style={{
                background: isDark ? '#1e293b' : '#ffffff',
                borderRadius: '24px',
                padding: '2rem',
                border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ background: '#090d16', borderRadius: '16px', padding: '1.5rem', color: '#ffffff', textAlign: 'left', minHeight: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>PayFlow HR Central Operational Dashboard</div>
                  <div style={{ background: '#2563eb', padding: '0.35rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>Live RLS System</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px' }}><div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Active Staff</div><div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3b82f6' }}>245</div></div>
                  <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px' }}><div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Present Rate</div><div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>95.8%</div></div>
                  <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px' }}><div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Approved Leave</div><div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>18</div></div>
                  <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px' }}><div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Disbursed Payroll</div><div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a855f7' }}>₹ 28,45,600</div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. STATISTICS SECTION */}
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 2rem' }}>
          <div
            style={{
              background: isDark ? '#1e293b' : '#ffffff',
              borderRadius: '24px',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              boxShadow: isDark ? '0 20px 40px -15px rgba(0, 0, 0, 0.3)' : '0 20px 40px -15px rgba(0, 0, 0, 0.06)',
              padding: '3rem 2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '2rem',
              textAlign: 'center'
            }}
            className="stats-grid"
          >
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#2563eb', lineHeight: 1 }}>500+</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a', marginTop: '0.5rem' }}>Employees Managed</div>
            </div>

            <div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#10b981', lineHeight: 1 }}>98%</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a', marginTop: '0.5rem' }}>Payroll Accuracy</div>
            </div>

            <div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#f97316', lineHeight: 1 }}>80%</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a', marginTop: '0.5rem' }}>Less Manual Work</div>
            </div>

            <div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#a855f7', lineHeight: 1 }}>24/7</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a', marginTop: '0.5rem' }}>Access</div>
            </div>
          </div>
        </section>

        {/* 8. SECURITY SECTION */}
        <section style={{ backgroundColor: isDark ? '#0b1120' : '#f8fafc', padding: '6rem 2rem', borderTop: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div style={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.85rem' }}>Enterprise Security & Compliance</div>
              <h2 style={{ fontSize: '2.6rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.03em', marginTop: '0.35rem' }}>
                Your Payroll Data Deserves Complete Protection
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }} className="security-grid">
              <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2rem', borderRadius: '16px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
                <ShieldCheck size={28} style={{ color: '#2563eb', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem' }}>Role-Based Access</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem' }}>Admin, Manager, and Employee RLS policies enforce strict data privacy boundaries.</p>
              </div>

              <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2rem', borderRadius: '16px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
                <Lock size={28} style={{ color: '#10b981', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem' }}>Secure Authentication</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem' }}>Supabase Auth session tokens with 256-bit SSL encrypted transport layer.</p>
              </div>

              <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2rem', borderRadius: '16px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
                <UserCheck size={28} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem' }}>Protected Employee Data</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem' }}>Soft-deactivation safety ensures employee payroll history is never lost or corrupted.</p>
              </div>

              <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2rem', borderRadius: '16px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
                <Building2 size={28} style={{ color: '#a855f7', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem' }}>Database-Level Security</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem' }}>PostgreSQL SECURITY DEFINER functions prevent unauthenticated data leaks.</p>
              </div>

              <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2rem', borderRadius: '16px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
                <FileCheck2 size={28} style={{ color: '#06b6d4', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem' }}>Audit Logs</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem' }}>Immutable event tracking records every login, employee update, leave decision, and payroll run.</p>
              </div>

              <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2rem', borderRadius: '16px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
                <Award size={28} style={{ color: '#e11d48', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem' }}>Controlled Access</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem' }}>Restricted manager permissions ensure compensation files remain strictly confidential.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. FINAL CALL TO ACTION */}
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '6rem 2rem' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)',
              borderRadius: '28px',
              padding: '4.5rem 3rem',
              color: '#ffffff',
              textAlign: 'center',
              boxShadow: '0 25px 60px -15px rgba(37, 99, 235, 0.4)'
            }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.035em', marginBottom: '1rem' }}>
              Ready to Simplify Your Payroll?
            </h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
              Bring employee management, attendance, leave, and payroll together in one powerful platform.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleOpenLogin('admin')}
                style={{
                  padding: '0.9rem 2.25rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#ffffff',
                  color: '#1d4ed8',
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
                }}
              >
                Get Started Free →
              </button>
              <button
                onClick={() => handleOpenLogin('admin')}
                style={{
                  padding: '0.9rem 2.25rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Log In
              </button>
            </div>
          </div>
        </section>

        {/* 10. FOOTER */}
        <footer style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '5rem 2rem 2.5rem 2rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr repeat(4, 1fr)', gap: '3rem', paddingBottom: '3.5rem', borderBottom: '1px solid #334155' }} className="footer-grid">
            {/* Brand Column */}
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.75rem' }}>
                PayFlow <span style={{ color: '#3b82f6' }}>HR</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '280px' }}>
                Smart payroll and employee management for modern workplaces.
              </p>
            </div>

            {/* Column 1: Product */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a></li>
                <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Payroll</a></li>
                <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Attendance</a></li>
                <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Leave Management</a></li>
                <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Reports</a></li>
              </ul>
            </div>

            {/* Column 2: Company */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                <li><a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>About</a></li>
                <li><a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a></li>
                <li><a href="#careers" style={{ color: 'inherit', textDecoration: 'none' }}>Careers</a></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resources</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                <li><a href="#docs" style={{ color: 'inherit', textDecoration: 'none' }}>Documentation</a></li>
                <li><a href="#help" style={{ color: 'inherit', textDecoration: 'none' }}>Help Center</a></li>
                <li><a href="#faqs" style={{ color: 'inherit', textDecoration: 'none' }}>FAQs</a></li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                <li><a href="#privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a></li>
                <li><a href="#terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div style={{ maxWidth: '1280px', margin: '2rem auto 0 auto', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
            &copy; 2026 PayFlow HR. All rights reserved.
          </div>
        </footer>
      </div>

      {/* LOGIN MODAL OVERLAY (Keeps existing authentication & persona switches 100% working!) */}
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

      {/* DEMO MODAL */}
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
            <div style={{ width: '100%', height: '380px', background: isDark ? '#1e293b' : '#f8fafc', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => { setIsDemoModalOpen(false); handleOpenLogin('admin'); }}>
                <Play size={28} fill="#ffffff" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Click to Launch Live Interactive System Demo</div>
              <button onClick={() => { setIsDemoModalOpen(false); handleOpenLogin('admin'); }} className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
                Open Login Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
