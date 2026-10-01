import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Play,
  Users,
  Shield,
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
  FileCheck2,
  Award,
  Layers,
  PieChart,
  Activity,
  ArrowUpRight,
  Briefcase,
  HelpCircle,
  Crown,
  Eye,
  EyeOff
} from 'lucide-react';

export const LandingPageView = () => {
  const { navigateTo, login, theme, toggleTheme } = useAuth();
  const isDark = theme === 'dark';

  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState('payroll');
  const [activeSection, setActiveSection] = useState('');

  // Scroll handler for navbar background shadow effect and active section scrollspy
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sectionIds = ['features', 'solutions', 'how-it-works', 'security', 'roles', 'about'];
      const scrollPosition = window.scrollY + 140;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionIds[i]);
            return;
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, targetId) => {
    if (e) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }
    setMobileMenuOpen(false);
    setSolutionsOpen(false);

    const elem = document.getElementById(targetId);
    if (!elem) return;

    const headerOffset = 80;
    const elementPosition = elem.getBoundingClientRect().top;
    const startPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const targetPosition = Math.max(0, elementPosition + startPosition - headerOffset);
    const distance = targetPosition - startPosition;

    if (Math.abs(distance) < 2) return;

    const duration = 650; // Smooth 650ms gliding animation
    let startTime = null;

    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      const nextScroll = startPosition + distance * ease;

      window.scrollTo(0, nextScroll);
      document.documentElement.scrollTop = nextScroll;
      document.body.scrollTop = nextScroll;

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        window.scrollTo(0, targetPosition);
        document.documentElement.scrollTop = targetPosition;
        document.body.scrollTop = targetPosition;
        setActiveSection(targetId);
      }
    };

    requestAnimationFrame(animation);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        overflowX: 'clip',
        backgroundColor: isDark ? '#0b1120' : '#ffffff',
        color: isDark ? '#f8fafc' : '#0f172a',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}
      className="bg-grid-pattern"
    >
      {/* Background ambient glow highlights */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1200px',
          height: '700px',
          background: isDark
            ? 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, rgba(124, 58, 237, 0.12) 40%, rgba(11, 17, 32, 0) 80%)'
            : 'radial-gradient(circle, rgba(219, 234, 254, 0.7) 0%, rgba(237, 233, 254, 0.4) 45%, rgba(255, 255, 255, 0) 80%)',
          filter: 'blur(80px)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
        className="glow-pulse"
      />

      {/* 1. STICKY / FIXED NAVBAR */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 1000,
          backgroundColor: scrolled
            ? isDark
              ? 'rgba(15, 23, 42, 0.95)'
              : 'rgba(255, 255, 255, 0.95)'
            : isDark
            ? 'rgba(11, 17, 32, 0.85)'
            : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: isDark ? '1px solid rgba(51, 65, 85, 0.6)' : '1px solid rgba(226, 232, 240, 0.8)',
          padding: '0.85rem 2rem',
          boxShadow: scrolled
            ? isDark
              ? '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
              : '0 10px 30px -10px rgba(0, 0, 0, 0.08)'
            : 'none',
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
          {/* LEFT: Logo + Title + Subtitle */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
            onClick={(e) => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setActiveSection('');
            }}
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

          {/* CENTER NAVIGATION (Desktop) */}
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
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, 'features')}
              style={{
                color: activeSection === 'features' ? '#2563eb' : 'inherit',
                textDecoration: 'none',
                transition: 'color 0.2s',
                fontWeight: activeSection === 'features' ? 800 : 600,
                borderBottom: activeSection === 'features' ? '2px solid #2563eb' : '2px solid transparent',
                paddingBottom: '2px'
              }}
            >
              Features
            </a>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeSection === 'solutions' ? '#2563eb' : 'inherit',
                  font: 'inherit',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontWeight: activeSection === 'solutions' ? 800 : 600,
                  borderBottom: activeSection === 'solutions' ? '2px solid #2563eb' : '2px solid transparent',
                  paddingBottom: '2px'
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
                    width: '250px',
                    background: isDark ? '#1e293b' : '#ffffff',
                    color: isDark ? '#ffffff' : '#0f172a',
                    borderRadius: '14px',
                    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                    boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.15)',
                    padding: '0.6rem',
                    zIndex: 110
                  }}
                >
                  <div
                    style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
                    onClick={(e) => scrollToSection(e, 'solutions')}
                  >
                    For Enterprise HR Teams
                  </div>
                  <div
                    style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
                    onClick={(e) => scrollToSection(e, 'features')}
                  >
                    For Small & Medium Businesses
                  </div>
                  <div
                    style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
                    onClick={(e) => scrollToSection(e, 'security')}
                  >
                    For Global & Remote Workforces
                  </div>
                </div>
              )}
            </div>

            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              style={{
                color: activeSection === 'how-it-works' ? '#2563eb' : 'inherit',
                textDecoration: 'none',
                transition: 'color 0.2s',
                fontWeight: activeSection === 'how-it-works' ? 800 : 600,
                borderBottom: activeSection === 'how-it-works' ? '2px solid #2563eb' : '2px solid transparent',
                paddingBottom: '2px'
              }}
            >
              How It Works
            </a>
            <a
              href="#security"
              onClick={(e) => scrollToSection(e, 'security')}
              style={{
                color: activeSection === 'security' ? '#2563eb' : 'inherit',
                textDecoration: 'none',
                transition: 'color 0.2s',
                fontWeight: activeSection === 'security' ? 800 : 600,
                borderBottom: activeSection === 'security' ? '2px solid #2563eb' : '2px solid transparent',
                paddingBottom: '2px'
              }}
            >
              Security
            </a>
            <a
              href="#roles"
              onClick={(e) => scrollToSection(e, 'roles')}
              style={{
                color: activeSection === 'roles' ? '#2563eb' : 'inherit',
                textDecoration: 'none',
                transition: 'color 0.2s',
                fontWeight: activeSection === 'roles' ? 800 : 600,
                borderBottom: activeSection === 'roles' ? '2px solid #2563eb' : '2px solid transparent',
                paddingBottom: '2px'
              }}
            >
              User Roles
            </a>
            <a
              href="#about"
              onClick={(e) => scrollToSection(e, 'about')}
              style={{
                color: activeSection === 'about' ? '#2563eb' : 'inherit',
                textDecoration: 'none',
                transition: 'color 0.2s',
                fontWeight: activeSection === 'about' ? 800 : 600,
                borderBottom: activeSection === 'about' ? '2px solid #2563eb' : '2px solid transparent',
                paddingBottom: '2px'
              }}
            >
              About
            </a>
          </nav>

          {/* RIGHT: CTAs & Theme Switcher */}
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

            {/* Log In Button -> Navigates to existing Login page */}
            <button
              onClick={() => navigateTo('login')}
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

            {/* Get Started Button -> Navigates to existing Auth flow */}
            <button
              onClick={() => navigateTo('login')}
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
              Get Started →
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

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              background: isDark ? '#1e293b' : '#ffffff',
              borderTop: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: '0.75rem',
              borderRadius: '14px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
            }}
            className="animate-fade-in"
          >
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} style={{ color: activeSection === 'features' ? '#2563eb' : 'inherit', textDecoration: 'none', fontWeight: 600 }}>Features</a>
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} style={{ color: activeSection === 'how-it-works' ? '#2563eb' : 'inherit', textDecoration: 'none', fontWeight: 600 }}>How It Works</a>
            <a href="#security" onClick={(e) => scrollToSection(e, 'security')} style={{ color: activeSection === 'security' ? '#2563eb' : 'inherit', textDecoration: 'none', fontWeight: 600 }}>Security</a>
            <a href="#roles" onClick={(e) => scrollToSection(e, 'roles')} style={{ color: activeSection === 'roles' ? '#2563eb' : 'inherit', textDecoration: 'none', fontWeight: 600 }}>User Roles</a>
            <a href="#about" onClick={(e) => scrollToSection(e, 'about')} style={{ color: activeSection === 'about' ? '#2563eb' : 'inherit', textDecoration: 'none', fontWeight: 600 }}>About</a>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button onClick={() => { setMobileMenuOpen(false); navigateTo('login'); }} style={{ flex: 1, padding: '0.65rem', borderRadius: '10px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', background: isDark ? '#0f172a' : '#ffffff', fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a', fontSize: '0.85rem' }}>Log In</button>
              <button onClick={() => { setMobileMenuOpen(false); navigateTo('login'); }} style={{ flex: 1, padding: '0.65rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>Get Started →</button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '6.5rem 2rem 3rem 2rem',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1.15fr', gap: '3.5rem', alignItems: 'center' }} className="hero-responsive-grid">
          {/* Hero Left Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Small Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 1.1rem',
                borderRadius: '9999px',
                background: isDark ? 'rgba(30, 58, 138, 0.6)' : 'rgba(219, 234, 254, 0.8)',
                border: isDark ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(147, 197, 253, 0.8)',
                color: isDark ? '#60a5fa' : '#1d4ed8',
                fontSize: '0.825rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                width: 'fit-content'
              }}
            >
              <ShieldCheck size={16} /> ALL-IN-ONE PAYROLL & HR PLATFORM
            </div>

            {/* Main Heading */}
            <h1
              style={{
                fontSize: '3.6rem',
                fontWeight: 900,
                lineHeight: 1.12,
                letterSpacing: '-0.04em',
                color: isDark ? '#ffffff' : '#0f172a'
              }}
              className="hero-title-responsive"
            >
              Smart Payroll.<br />
              Happy Employees.<br />
              <span className="gradient-text-primary">
                Stronger Business.
              </span>
            </h1>

            {/* Supporting Text */}
            <p
              style={{
                fontSize: '1.125rem',
                color: isDark ? '#94a3b8' : '#475569',
                lineHeight: 1.65,
                maxWidth: '540px'
              }}
            >
              PayFlow HR brings employee management, attendance, leave, salary processing and payroll together in one secure platform — helping teams save time, reduce errors and focus on their people.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <button
                onClick={() => navigateTo('login')}
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
                Get Started Free →
              </button>

              <a
                href="#solutions"
                onClick={(e) => scrollToSection(e, 'solutions')}
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
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                Explore Platform
              </a>
            </div>

            {/* Trust Indicators Underneath */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem', fontSize: '0.875rem', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={16} style={{ color: '#10b981' }} /> Secure & Reliable
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={16} style={{ color: '#10b981' }} /> Easy to Use
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={16} style={{ color: '#10b981' }} /> Real-Time Insights
              </div>
            </div>
          </div>

          {/* Hero Right Side: Floating Laptop Admin Dashboard Mockup */}
          <div
            style={{
              position: 'relative',
              perspective: '1200px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {/* Subtle glow background circle behind laptop */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                height: '90%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, rgba(124, 58, 237, 0.1) 60%, rgba(0,0,0,0) 80%)',
                filter: 'blur(50px)',
                zIndex: 0,
                pointerEvents: 'none'
              }}
            />

            {/* Floating Laptop Frame */}
            <div
              className="float-animation"
              style={{
                width: '100%',
                maxWidth: '680px',
                borderRadius: '18px',
                background: '#0f172a',
                padding: '12px 12px 0 12px',
                boxShadow: '0 35px 80px -15px rgba(15, 23, 42, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.12)',
                position: 'relative',
                zIndex: 1
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
                  overflow: 'hidden',
                  minHeight: '400px',
                  display: 'flex',
                  gap: '0.85rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Micro Sidebar */}
                <div style={{ width: '135px', background: '#0f172a', borderRadius: '8px', padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 900, fontSize: '0.8rem', color: '#3b82f6', marginBottom: '0.4rem' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>P</div>
                    PayFlow HR
                  </div>
                  <div style={{ background: '#1e293b', color: '#3b82f6', padding: '0.35rem 0.5rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.675rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <BarChart3 size={11} /> Admin Dashboard
                  </div>
                  <div style={{ color: '#94a3b8', padding: '0.25rem 0.5rem', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Users size={11} /> Employees
                  </div>
                  <div style={{ color: '#94a3b8', padding: '0.25rem 0.5rem', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={11} /> Attendance
                  </div>
                  <div style={{ color: '#94a3b8', padding: '0.25rem 0.5rem', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CalendarDays size={11} /> Leave
                  </div>
                  <div style={{ color: '#94a3b8', padding: '0.25rem 0.5rem', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CreditCard size={11} /> Payroll
                  </div>
                  <div style={{ color: '#94a3b8', padding: '0.25rem 0.5rem', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FileText size={11} /> Payslips
                  </div>
                  <div style={{ color: '#94a3b8', padding: '0.25rem 0.5rem', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <TrendingUp size={11} /> Reports
                  </div>
                </div>

                {/* Dashboard Main Content Mockup */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>
                    <div style={{ color: '#cbd5e1', fontWeight: 700, fontSize: '0.675rem' }}>Dashboard Overview &bull; Sept 2026</div>
                    <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.6rem' }}>
                      Payroll Disbursed
                    </div>
                  </div>

                  {/* Top 4 KPI Metrics Required by Prompt */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                    <div style={{ background: '#0f172a', padding: '0.5rem 0.4rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.55rem', color: '#94a3b8' }}>Total Employees</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#3b82f6' }}>245</div>
                    </div>

                    <div style={{ background: '#0f172a', padding: '0.5rem 0.4rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.55rem', color: '#94a3b8' }}>Present Today</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>194</div>
                    </div>

                    <div style={{ background: '#0f172a', padding: '0.5rem 0.4rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.55rem', color: '#94a3b8' }}>On Leave</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f59e0b' }}>18</div>
                    </div>

                    <div style={{ background: '#0f172a', padding: '0.5rem 0.4rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.55rem', color: '#94a3b8' }}>Current Month</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#a855f7' }}>₹ 28,45,600</div>
                    </div>
                  </div>

                  {/* 2 Middle Mock Panels: Dept Chart & Payroll Status */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                    {/* Employees by Dept */}
                    <div style={{ background: '#0f172a', padding: '0.55rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>Employees by Department</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '4px solid #3b82f6', borderTopColor: '#10b981', borderRightColor: '#a855f7' }}></div>
                        <div style={{ fontSize: '0.525rem', color: '#94a3b8', lineHeight: 1.4 }}>
                          <span style={{ color: '#3b82f6' }}>■</span> Engineering (33.4%)<br />
                          <span style={{ color: '#10b981' }}>■</span> Sales & HR (31.8%)<br />
                          <span style={{ color: '#a855f7' }}>■</span> Operations (34.8%)
                        </div>
                      </div>
                    </div>

                    {/* Payroll Breakdown */}
                    <div style={{ background: '#0f172a', padding: '0.55rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>Monthly Payroll Trend</div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.3rem', height: '32px', marginTop: '0.2rem' }}>
                        <div style={{ flex: 1, background: 'rgba(59, 130, 246, 0.4)', height: '40%', borderRadius: '2px' }}></div>
                        <div style={{ flex: 1, background: 'rgba(59, 130, 246, 0.6)', height: '65%', borderRadius: '2px' }}></div>
                        <div style={{ flex: 1, background: 'rgba(59, 130, 246, 0.8)', height: '80%', borderRadius: '2px' }}></div>
                        <div style={{ flex: 1, background: 'linear-gradient(to top, #2563eb, #7c3aed)', height: '100%', borderRadius: '2px' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Panel: Recent Activities */}
                  <div style={{ background: '#0f172a', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.3rem' }}>Recent Activities</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.55rem', color: '#94a3b8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle2 size={9} style={{ color: '#10b981' }} /> Sept Payroll calculated for 245 staff</span>
                        <span style={{ color: '#64748b' }}>2 hrs ago</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle2 size={9} style={{ color: '#10b981' }} /> Leave approved for Marcus Vance</span>
                        <span style={{ color: '#64748b' }}>4 hrs ago</span>
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

      {/* 3. TRUST SECTION */}
      <section style={{ maxWidth: '1280px', margin: '2rem auto 0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem', fontSize: '0.825rem', fontWeight: 800, color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Built for modern HR teams
        </div>
        <div
          style={{
            background: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '20px',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
            boxShadow: isDark ? '0 20px 40px -15px rgba(0,0,0,0.3)' : '0 20px 40px -15px rgba(0, 0, 0, 0.06)',
            padding: '2.25rem 2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}
          className="stats-grid"
        >
          <div>
            <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#2563eb', lineHeight: 1 }}>500+</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a', marginTop: '0.5rem' }}>Employees Managed</div>
          </div>

          <div>
            <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#10b981', lineHeight: 1 }}>98%</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a', marginTop: '0.5rem' }}>Payroll Accuracy</div>
          </div>

          <div>
            <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#f97316', lineHeight: 1 }}>80%</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a', marginTop: '0.5rem' }}>Less Manual Work</div>
          </div>

          <div>
            <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#a855f7', lineHeight: 1 }}>24/7</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a', marginTop: '0.5rem' }}>Access</div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION (6 Core SaaS Cards) */}
      <section id="features" style={{ padding: '6rem 2rem 4rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ color: '#2563eb', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.825rem' }}>
            Everything You Need to Run Payroll Smarter
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.03em', marginTop: '0.4rem' }}>
            One platform to manage your entire employee payroll lifecycle.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }} className="features-grid">
          {/* Card 1 */}
          <div
            className="feature-card-hover"
            style={{
              background: isDark ? '#1e293b' : '#ffffff',
              padding: '2.25rem',
              borderRadius: '20px',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: isDark ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Users size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.6rem' }}>Employee Management</h3>
            <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Manage employee profiles, departments, designations and employment information from one centralized platform.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="feature-card-hover"
            style={{
              background: isDark ? '#1e293b' : '#ffffff',
              padding: '2.25rem',
              borderRadius: '20px',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Clock size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.6rem' }}>Attendance Tracking</h3>
            <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Track attendance, working hours, overtime and employee availability effortlessly.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="feature-card-hover"
            style={{
              background: isDark ? '#1e293b' : '#ffffff',
              padding: '2.25rem',
              borderRadius: '20px',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: isDark ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <CalendarDays size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.6rem' }}>Leave Management</h3>
            <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Simplify leave requests, approvals, balances and employee leave history.
            </p>
          </div>

          {/* Card 4 */}
          <div
            className="feature-card-hover"
            style={{
              background: isDark ? '#1e293b' : '#ffffff',
              padding: '2.25rem',
              borderRadius: '20px',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: isDark ? 'rgba(168, 85, 247, 0.2)' : '#f3e8ff', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <CreditCard size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.6rem' }}>Payroll Automation</h3>
            <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Calculate salaries, allowances, deductions, overtime and monthly payroll with confidence.
            </p>
          </div>

          {/* Card 5 */}
          <div
            className="feature-card-hover"
            style={{
              background: isDark ? '#1e293b' : '#ffffff',
              padding: '2.25rem',
              borderRadius: '20px',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: isDark ? 'rgba(6, 182, 212, 0.2)' : '#ecfeff', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <FileText size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.6rem' }}>Payslips & Reports</h3>
            <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Generate professional payslips and powerful reports for better payroll visibility.
            </p>
          </div>

          {/* Card 6 */}
          <div
            className="feature-card-hover"
            style={{
              background: isDark ? '#1e293b' : '#ffffff',
              padding: '2.25rem',
              borderRadius: '20px',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: isDark ? 'rgba(225, 29, 72, 0.2)' : '#fff1f2', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Shield size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.6rem' }}>Secure & Reliable</h3>
            <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Protect employee information with secure authentication, role-based access and audit tracking.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PRODUCT SHOWCASE & SOLUTIONS SECTION */}
      <section id="solutions" style={{ backgroundColor: isDark ? '#080d1a' : '#f8fafc', padding: '6rem 2rem', borderTop: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', borderBottom: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0' }}>
        <span id="showcase" style={{ position: 'relative', top: '-85px', display: 'block' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ color: '#2563eb', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.825rem' }}>PRODUCT SHOWCASE</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.03em', marginTop: '0.4rem', marginBottom: '2.5rem' }}>
            Your Entire Payroll Workflow. In One Place.
          </h2>

          {/* Floating Module Selector Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {[
              { id: 'payroll', label: 'Payroll' },
              { id: 'employees', label: 'Employee Management' },
              { id: 'attendance', label: 'Attendance' },
              { id: 'leave', label: 'Leave' },
              { id: 'payslips', label: 'Payslips' },
              { id: 'reports', label: 'Reports' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveShowcaseTab(tab.id)}
                style={{
                  padding: '0.65rem 1.35rem',
                  borderRadius: '9999px',
                  border: activeShowcaseTab === tab.id
                    ? '1px solid #2563eb'
                    : isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                  background: activeShowcaseTab === tab.id
                    ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                    : isDark ? '#1e293b' : '#ffffff',
                  color: activeShowcaseTab === tab.id ? '#ffffff' : isDark ? '#94a3b8' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: activeShowcaseTab === tab.id ? '0 4px 14px rgba(37, 99, 235, 0.35)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Screen Preview Container */}
          <div
            style={{
              background: isDark ? '#1e293b' : '#ffffff',
              borderRadius: '24px',
              padding: '1.75rem',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              boxShadow: isDark ? '0 30px 60px -15px rgba(0, 0, 0, 0.4)' : '0 25px 50px -15px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div style={{ background: '#090d16', borderRadius: '16px', padding: '1.5rem', color: '#ffffff', textAlign: 'left', minHeight: '340px' }}>
              {activeShowcaseTab === 'payroll' && (
                <div className="animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Automated Monthly Payroll Run</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>September 2026 Salary Cycle &bull; 245 Employees</div>
                    </div>
                    <button onClick={() => navigateTo('login')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                      Run Payroll Process →
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Gross Basic Payroll</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#3b82f6' }}>₹ 22,10,000</div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>HRA & Allowances</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>₹ 8,40,000</div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Tax & PF Deductions</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ef4444' }}>- ₹ 2,04,400</div>
                    </div>
                    <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Net Disbursed Pay</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#a855f7' }}>₹ 28,45,600</div>
                    </div>
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'employees' && (
                <div className="animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Centralized Employee Directory</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Search profiles, designations, and departments</div>
                    </div>
                  </div>
                  <div style={{ background: '#0f172a', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#1e293b', borderRadius: '6px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 700 }}>HR Administrator</span>
                      <span style={{ color: '#94a3b8' }}>Executive &bull; VP of Operations</span>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>Active</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#1e293b', borderRadius: '6px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 700 }}>Team Manager</span>
                      <span style={{ color: '#94a3b8' }}>Engineering &bull; Lead Manager</span>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>Active</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#1e293b', borderRadius: '6px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 700 }}>Staff Engineer</span>
                      <span style={{ color: '#94a3b8' }}>Engineering &bull; Senior Engineer</span>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>Active</span>
                    </div>
                  </div>
                </div>
              )}

              {activeShowcaseTab !== 'payroll' && activeShowcaseTab !== 'employees' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px', textTransform: 'capitalize' }}>
                  <Sparkles size={36} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{activeShowcaseTab} Module Overview</div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                    Full real-time visibility into {activeShowcaseTab} calculations, audit logs, and status records.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section id="how-it-works" style={{ padding: '6rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ color: '#2563eb', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.825rem' }}>
            Simple 4-Step Process
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.03em', marginTop: '0.4rem' }}>
            Payroll Management Made Simple
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', position: 'relative' }} className="steps-grid">
          {/* Step 01 */}
          <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2rem 1.5rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', position: 'relative' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2563eb', opacity: 0.85, marginBottom: '0.5rem' }}>01</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>ADD EMPLOYEES</h3>
            <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Create and manage employee profiles.
            </p>
          </div>

          {/* Step 02 */}
          <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2rem 1.5rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', position: 'relative' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2563eb', opacity: 0.85, marginBottom: '0.5rem' }}>02</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>TRACK ATTENDANCE & LEAVE</h3>
            <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Monitor working hours, attendance and leave.
            </p>
          </div>

          {/* Step 03 */}
          <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2rem 1.5rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', position: 'relative' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2563eb', opacity: 0.85, marginBottom: '0.5rem' }}>03</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>PROCESS PAYROLL</h3>
            <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Calculate salaries, deductions, overtime and net pay.
            </p>
          </div>

          {/* Step 04 */}
          <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2rem 1.5rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', position: 'relative' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2563eb', opacity: 0.85, marginBottom: '0.5rem' }}>04</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>GENERATE PAYSLIPS</h3>
            <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Create professional payslips instantly.
            </p>
          </div>
        </div>
      </section>

      {/* 7. WHY PAYFLOW HR (BENEFITS SECTION) */}
      <section style={{ backgroundColor: isDark ? '#080d1a' : '#f8fafc', padding: '6rem 2rem', borderTop: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ color: '#2563eb', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.825rem' }}>KEY BENEFITS</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.03em', marginTop: '0.4rem' }}>
              Built to Make HR Teams More Efficient
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }} className="features-grid">
            {/* Benefit 1 */}
            <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2.5rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: isDark ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Zap size={26} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
                SAVE TIME
              </h3>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Automate repetitive payroll and HR tasks.
              </p>
            </div>

            {/* Benefit 2 */}
            <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2.5rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <CheckCircle2 size={26} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
                REDUCE ERRORS
              </h3>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Minimize manual calculations and payroll mistakes.
              </p>
            </div>

            {/* Benefit 3 */}
            <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2.5rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: isDark ? 'rgba(168, 85, 247, 0.2)' : '#f3e8ff', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <TrendingUp size={26} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
                MAKE BETTER DECISIONS
              </h3>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Use dashboards and reports to understand your workforce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SECURITY SECTION (DARK NAVY PREMIUM STYLE) */}
      <section id="security" style={{ backgroundColor: '#070c18', color: '#ffffff', padding: '6rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ color: '#60a5fa', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.825rem' }}>
              ENTERPRISE-GRADE PROTECTION
            </div>
            <h2 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', marginTop: '0.4rem' }}>
              Your Payroll Data Deserves Complete Protection
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginTop: '0.75rem', maxWidth: '600px', margin: '0.75rem auto 0 auto' }}>
              PayFlow HR is designed with security and controlled access at every level.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.75rem' }} className="security-grid">
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.6rem' }}>
                <CheckCircle2 size={22} style={{ color: '#3b82f6' }} /> Role-Based Access
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Strict permission tiers separate Admin, Manager, and Employee operations.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.6rem' }}>
                <CheckCircle2 size={22} style={{ color: '#10b981' }} /> Secure Authentication
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Supabase Auth token management with 256-bit SSL encrypted transit.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.6rem' }}>
                <CheckCircle2 size={22} style={{ color: '#f59e0b' }} /> Protected Employee Data
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Encrypted salary values and audit logs ensure confidential data protection.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.6rem' }}>
                <CheckCircle2 size={22} style={{ color: '#a855f7' }} /> Database-Level Security
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                PostgreSQL row-level security (RLS) enforcement on every query.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.6rem' }}>
                <CheckCircle2 size={22} style={{ color: '#06b6d4' }} /> Audit Logs
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Comprehensive logging of every payroll calculation, leave approval, and login event.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.6rem' }}>
                <CheckCircle2 size={22} style={{ color: '#f43f5e' }} /> Controlled Permissions
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Granular administrative controls over departments, salary structures, and payslips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. USER ROLES SECTION */}
      <section id="roles" style={{ padding: '6rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ color: '#2563eb', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.825rem' }}>
            TAILORED ACCESS CONTROLS
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.03em', marginTop: '0.4rem' }}>
            Designed for Every HR Role
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }} className="roles-grid">
          {/* Card 1: ADMIN / HR */}
          <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2.25rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'inline-block', padding: '0.35rem 0.85rem', borderRadius: '6px', background: 'rgba(37, 99, 235, 0.15)', color: '#2563eb', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
                ADMIN / HR
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.75rem' }}>
                Full System Control
              </h3>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.925rem', lineHeight: 1.65 }}>
                Manage employees, salary structures, payroll, attendance, leave and reports.
              </p>
            </div>
            <button onClick={() => navigateTo('login')} style={{ marginTop: '1.5rem', padding: '0.65rem', borderRadius: '10px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', background: 'transparent', color: isDark ? '#ffffff' : '#0f172a', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
              Sign In as Admin →
            </button>
          </div>

          {/* Card 2: MANAGER */}
          <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2.25rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'inline-block', padding: '0.35rem 0.85rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
                MANAGER
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.75rem' }}>
                Department Leadership
              </h3>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.925rem', lineHeight: 1.65 }}>
                Manage department employees, attendance and leave approvals.
              </p>
            </div>
            <button onClick={() => navigateTo('login')} style={{ marginTop: '1.5rem', padding: '0.65rem', borderRadius: '10px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', background: 'transparent', color: isDark ? '#ffffff' : '#0f172a', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
              Sign In as Manager →
            </button>
          </div>

          {/* Card 3: EMPLOYEE */}
          <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '2.25rem', borderRadius: '20px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'inline-block', padding: '0.35rem 0.85rem', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
                EMPLOYEE
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '0.75rem' }}>
                Self-Service Portal
              </h3>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.925rem', lineHeight: 1.65 }}>
                View profile, attendance, leave, salary and payslips.
              </p>
            </div>
            <button onClick={() => navigateTo('login')} style={{ marginTop: '1.5rem', padding: '0.65rem', borderRadius: '10px', border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', background: 'transparent', color: isDark ? '#ffffff' : '#0f172a', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
              Sign In as Employee →
            </button>
          </div>
        </div>
      </section>

      {/* 10. DASHBOARD PREVIEW / POWERFUL INSIGHTS */}
      <section style={{ backgroundColor: isDark ? '#080d1a' : '#f8fafc', padding: '6rem 2rem', borderTop: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ color: '#2563eb', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.825rem' }}>ANALYTICS & REPORTING</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.03em', marginTop: '0.4rem', marginBottom: '1rem' }}>
            Powerful Insights at a Glance
          </h2>
          <p style={{ fontSize: '1.1rem', color: isDark ? '#94a3b8' : '#64748b', maxWidth: '650px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
            See what is happening across your organization without digging through spreadsheets.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }} className="stats-grid">
            <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '1.75rem', borderRadius: '18px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', textAlign: 'left' }}>
              <Users size={24} style={{ color: '#3b82f6', marginBottom: '0.75rem' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>Employee Distribution</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', margin: '0.25rem 0' }}>5 Departments</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Engineering, HR, Sales, Finance, Ops</div>
            </div>

            <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '1.75rem', borderRadius: '18px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', textAlign: 'left' }}>
              <TrendingUp size={24} style={{ color: '#10b981', marginBottom: '0.75rem' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>Payroll Trends</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', margin: '0.25rem 0' }}>100% Calculated</div>
              <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Instant PDF Payslip Generation</div>
            </div>

            <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '1.75rem', borderRadius: '18px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', textAlign: 'left' }}>
              <Clock size={24} style={{ color: '#f59e0b', marginBottom: '0.75rem' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>Attendance Rate</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', margin: '0.25rem 0' }}>95.8% Average</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Real-time check-in logs</div>
            </div>

            <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '1.75rem', borderRadius: '18px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', textAlign: 'left' }}>
              <CalendarDays size={24} style={{ color: '#a855f7', marginBottom: '0.75rem' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>Leave Statistics</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', margin: '0.25rem 0' }}>Automated Balance</div>
              <div style={{ fontSize: '0.75rem', color: '#a855f7' }}>Manager approval workflows</div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA SECTION */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '6rem 2rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)',
            borderRadius: '28px',
            padding: '4.5rem 3rem',
            color: '#ffffff',
            textAlign: 'center',
            boxShadow: '0 25px 60px -15px rgba(37, 99, 235, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <h2 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.035em', marginBottom: '1rem' }} className="hero-title-responsive">
            Ready to Simplify Your Payroll?
          </h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '640px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
            Bring employee management, attendance, leave and payroll together in one powerful platform.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigateTo('login')}
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
              onClick={() => navigateTo('login')}
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

      {/* 12. FOOTER */}
      <footer id="about" style={{ backgroundColor: '#070c18', color: '#ffffff', padding: '5rem 2rem 2.5rem 2rem', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr repeat(4, 1fr)', gap: '3rem', paddingBottom: '3.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }} className="footer-grid">
          {/* Brand Column */}
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>P</div>
              PayFlow <span style={{ color: '#3b82f6' }}>HR</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '280px' }}>
              Smart payroll and employee management for modern workplaces.
            </p>
          </div>

          {/* Column 1: PRODUCT */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>PRODUCT</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: '#94a3b8' }}>
              <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a></li>
              <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Employee Management</a></li>
              <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Attendance</a></li>
              <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Leave</a></li>
              <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Payroll</a></li>
              <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Payslips</a></li>
              <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Reports</a></li>
            </ul>
          </div>

          {/* Column 2: COMPANY */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>COMPANY</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: '#94a3b8' }}>
              <li><a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>About</a></li>
              <li><a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a></li>
              <li><a href="#careers" style={{ color: 'inherit', textDecoration: 'none' }}>Careers</a></li>
            </ul>
          </div>

          {/* Column 3: RESOURCES */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>RESOURCES</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: '#94a3b8' }}>
              <li><a href="#docs" style={{ color: 'inherit', textDecoration: 'none' }}>Documentation</a></li>
              <li><a href="#help" style={{ color: 'inherit', textDecoration: 'none' }}>Help Center</a></li>
              <li><a href="#faqs" style={{ color: 'inherit', textDecoration: 'none' }}>FAQs</a></li>
            </ul>
          </div>

          {/* Column 4: LEGAL */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>LEGAL</h4>
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
  );
};
