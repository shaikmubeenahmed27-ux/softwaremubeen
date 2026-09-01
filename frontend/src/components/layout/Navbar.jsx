import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserProfileMenu } from './UserProfileMenu';
import { NotificationDropdown } from './NotificationDropdown';
import { Menu, Search, Sun, Moon, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

export const Navbar = () => {
  const {
    currentRole,
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
        {/* Role indicator badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={16} style={{ color: 'var(--primary-400)' }} />
          <Badge variant={getRoleVariant(currentRole)} size="sm" dot>
            {currentRole.toUpperCase()} ROLE
          </Badge>
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
