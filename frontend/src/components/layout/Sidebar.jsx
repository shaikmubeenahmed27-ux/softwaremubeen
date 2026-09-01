import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS } from '../../config/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Clock,
  CalendarDays,
  DollarSign,
  CreditCard,
  FileText,
  BarChart3,
  Bell,
  ShieldAlert,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

const ICON_MAP = {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Clock,
  CalendarDays,
  DollarSign,
  CreditCard,
  FileText,
  BarChart3,
  Bell,
  ShieldAlert,
  Settings
};

export const Sidebar = () => {
  const {
    currentRole,
    currentRoute,
    navigateTo,
    isSidebarOpen,
    toggleSidebar,
    mobileMenuOpen,
    setMobileMenuOpen
  } = useAuth();

  const navGroups = NAV_ITEMS[currentRole] || NAV_ITEMS.admin;

  const renderIcon = (iconName) => {
    const IconComponent = ICON_MAP[iconName] || LayoutDashboard;
    return <IconComponent size={19} />;
  };

  const renderNavItem = (item) => {
    const isActive = currentRoute === item.id;
    return (
      <button
        key={item.id}
        onClick={() => navigateTo(item.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          width: '100%',
          padding: isSidebarOpen ? '0.65rem 0.875rem' : '0.65rem',
          justifyContent: isSidebarOpen ? 'flex-start' : 'center',
          borderRadius: 'var(--radius-md)',
          background: isActive ? 'var(--primary-600)' : 'transparent',
          color: isActive ? '#ffffff' : 'var(--text-muted)',
          fontWeight: isActive ? 600 : 500,
          fontSize: '0.875rem',
          border: 'none',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
          margin: '2px 0'
        }}
        title={!isSidebarOpen ? item.label : undefined}
      >
        <span style={{ display: 'inline-flex', color: isActive ? '#ffffff' : 'inherit' }}>
          {renderIcon(item.icon)}
        </span>
        {isSidebarOpen && <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>}
      </button>
    );
  };

  return (
    <aside
      style={{
        width: isSidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed-width)',
        height: '100vh',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'width var(--transition-normal)',
        flexShrink: 0
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: 'var(--navbar-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarOpen ? 'space-between' : 'center',
          padding: '0 1rem',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)',
              flexShrink: 0
            }}
          >
            <Zap size={22} />
          </div>
          {isSidebarOpen && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                PayFlow<span style={{ color: 'var(--primary-500)' }}>HR</span>
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Payroll SaaS
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation menu list */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isSidebarOpen ? '1rem 0.75rem' : '1rem 0.35rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}
      >
        {navGroups.map((group, idx) => {
          if (group.id) {
            // Direct item
            return renderNavItem(group);
          }

          return (
            <div key={idx} style={{ marginTop: '0.75rem' }}>
              {isSidebarOpen && group.group && (
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--slate-500)',
                    padding: '0.5rem 0.75rem 0.25rem 0.75rem'
                  }}
                >
                  {group.group}
                </div>
              )}
              {group.items.map((item) => renderNavItem(item))}
            </div>
          );
        })}
      </div>

      {/* Footer Collapse / System info toggle */}
      <div
        style={{
          padding: '0.875rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarOpen ? 'space-between' : 'center'
        }}
      >
        {isSidebarOpen && (
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            <div>PayFlow HR v1.0</div>
            <div style={{ color: 'var(--slate-500)' }}>Enterprise Edition</div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="btn-icon"
          title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
    </aside>
  );
};
