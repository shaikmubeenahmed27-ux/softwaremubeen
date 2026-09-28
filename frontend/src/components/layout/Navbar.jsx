import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserProfileMenu } from './UserProfileMenu';
import { NotificationDropdown } from './NotificationDropdown';
import { Menu, Search, Sun, Moon, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

export const Navbar = () => {
  const {
    currentRole,
    switchRole,
    theme,
    toggleTheme,
    toggleSidebar,
    setMobileMenuOpen,
    mobileMenuOpen
  } = useAuth();

  const getRoleVariant = (role) => {
    if (role === 'admin') return 'purple';
    if (role === 'manager') return 'info';
    return 'success';
  };

  return (
    <header
      style={{
        height: 'var(--navbar-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Left side controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Toggle desktop sidebar */}
        <button
          onClick={toggleSidebar}
          className="btn-icon"
          title="Toggle Navigation Sidebar"
          style={{ display: 'flex' }}
        >
          <Menu size={20} />
        </button>

        {/* Search Input Cue */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            minWidth: '260px'
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              color: 'var(--slate-400)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Search employees, payroll, reports..."
            style={{
              width: '100%',
              padding: '0.45rem 0.875rem 0.45rem 2.25rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Right side controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        {/* Interactive Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={16} style={{ color: currentRole === 'admin' ? '#c084fc' : currentRole === 'manager' ? '#60a5fa' : '#34d399' }} />
          <select
            value={currentRole}
            onChange={(e) => switchRole(e.target.value)}
            title="Switch Active User Role"
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: currentRole === 'admin' ? 'rgba(168, 85, 247, 0.15)' : currentRole === 'manager' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: currentRole === 'admin' ? '#c084fc' : currentRole === 'manager' ? '#60a5fa' : '#34d399',
              border: `1px solid ${currentRole === 'admin' ? '#a855f7' : currentRole === 'manager' ? '#3b82f6' : '#10b981'}`,
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              textAlign: 'center'
            }}
          >
            <option value="admin" style={{ background: '#0f172a', color: '#ffffff' }}>Admin (Executive)</option>
            <option value="manager" style={{ background: '#0f172a', color: '#ffffff' }}>Manager (Eng & Tech)</option>
            <option value="employee" style={{ background: '#0f172a', color: '#ffffff' }}>Employee (Staff)</option>
          </select>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={19} style={{ color: '#f59e0b' }} /> : <Moon size={19} />}
        </button>

        {/* Notification Icon Dropdown */}
        <NotificationDropdown />

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 0.25rem' }} />

        {/* User Profile Menu */}
        <UserProfileMenu />
      </div>
    </header>
  );
};
