import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { User, Settings, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';

export const UserProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { currentUser, currentRole, logout, navigateTo } = useAuth();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowConfirm(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleVariant = (role) => {
    if (role === 'admin') return 'purple';
    if (role === 'manager') return 'info';
    return 'success';
  };

  const userName = currentUser?.name || 'User';
  const userEmail = currentUser?.email || '';
  const userAvatar = currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff`;

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.35rem 0.6rem',
          borderRadius: 'var(--radius-md)',
          background: isOpen ? 'var(--bg-surface-hover)' : 'transparent',
          border: '1px solid transparent',
          cursor: 'pointer',
          color: 'var(--text-main)',
          transition: 'all var(--transition-fast)'
        }}
      >
        <img
          src={userAvatar}
          alt={userName}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid var(--primary-500)'
          }}
        />
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.2 }}>{userName}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser?.roleLabel || currentRole.toUpperCase()}</span>
        </div>
        <ChevronDown size={16} style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition-fast)' }} />
      </button>

      {isOpen && (
        <div
          className="glass"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            width: '320px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 100,
            overflow: 'hidden',
            padding: '0.5rem 0'
          }}
        >
          {/* User info card */}
          <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>{userName}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>{userEmail}</div>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Badge variant={getRoleVariant(currentRole)} dot>
                {currentUser?.roleLabel || currentRole.toUpperCase()}
              </Badge>
              {currentUser?.department && (
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-app, #f1f5f9)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                  fontWeight: 500
                }}>
                  {currentUser.department}
                </span>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div style={{ padding: '0.35rem 0' }}>
            <button
              onClick={() => {
                navigateTo('profile');
                setIsOpen(false);
                setShowConfirm(false);
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                width: '100%',
                padding: '0.55rem 1rem',
                fontSize: '0.875rem',
                color: 'var(--text-main)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s'
              }}
            >
              <User size={16} style={{ color: 'var(--text-muted)' }} />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => {
                navigateTo('settings');
                setIsOpen(false);
                setShowConfirm(false);
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                width: '100%',
                padding: '0.55rem 1rem',
                fontSize: '0.875rem',
                color: 'var(--text-main)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s'
              }}
            >
              <Settings size={16} style={{ color: 'var(--text-muted)' }} />
              <span>Account Settings</span>
            </button>

            <button
              onClick={() => setShowConfirm(!showConfirm)}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                width: '100%',
                padding: '0.55rem 1rem',
                fontSize: '0.875rem',
                color: '#ef4444',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s'
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>

            {/* Inline Confirmation below Sign Out */}
            {showConfirm && (
              <div
                style={{
                  padding: '0.6rem 1rem',
                  marginTop: '0.35rem',
                  borderTop: '1px solid var(--border-color)',
                  background: 'rgba(239, 68, 68, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Do you want to sign out?
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={logout}
                    style={{
                      flex: 1,
                      padding: '0.35rem',
                      borderRadius: '6px',
                      background: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.775rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    style={{
                      flex: 1,
                      padding: '0.35rem',
                      borderRadius: '6px',
                      background: 'var(--bg-surface-hover)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
