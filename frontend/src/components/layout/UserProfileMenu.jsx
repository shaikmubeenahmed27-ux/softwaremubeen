import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../config/navigation';
import { Badge } from '../common/Badge';
import { User, Settings, LogOut, ChevronDown, CheckCircle2, Shield } from 'lucide-react';

export const UserProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, currentRole, switchRole, logout, navigateTo } = useAuth();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
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
          src={currentUser.avatar}
          alt={currentUser.name}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid var(--primary-500)'
          }}
        />
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.2 }}>{currentUser.name}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser.roleLabel}</span>
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
            width: '280px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 100,
            overflow: 'hidden',
            padding: '0.5rem 0'
          }}
        >
          {/* User info card */}
          <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{currentUser.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{currentUser.email}</div>
            <Badge variant={getRoleVariant(currentRole)} dot>
              {currentUser.roleLabel}
            </Badge>
          </div>

          {/* Switch Role Section */}
          <div style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0.35rem 1rem' }}>
              Demo Role Navigation
            </div>
            {USER_ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  switchRole(role.id);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  background: currentRole === role.id ? 'var(--bg-surface-hover)' : 'transparent',
                  border: 'none',
                  color: currentRole === role.id ? 'var(--primary-400)' : 'var(--text-main)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={14} style={{ color: currentRole === role.id ? 'var(--primary-500)' : 'var(--slate-400)' }} />
                  <span>{role.name} View</span>
                </div>
                {currentRole === role.id && <CheckCircle2 size={15} style={{ color: 'var(--primary-500)' }} />}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div style={{ padding: '0.35rem 0' }}>
            <button
              onClick={() => {
                navigateTo('settings');
                setIsOpen(false);
              }}
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
                cursor: 'pointer'
              }}
            >
              <Settings size={16} style={{ color: 'var(--text-muted)' }} />
              <span>Account Settings</span>
            </button>

            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                width: '100%',
                padding: '0.55rem 1rem',
                fontSize: '0.875rem',
                color: 'var(--danger-text)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
