import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, FileText, Calendar, CreditCard, Megaphone, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, markAsRead, markAllAsRead } from '../../services/notificationService';

export const NotificationDropdown = () => {
  const { currentRole, currentUser, navigateTo } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const loadNotifs = async () => {
    const list = await getNotifications({ userRole: currentRole, authEmployeeId: currentUser.id });
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifs();
  }, [currentRole]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    await markAsRead(id);
    loadNotifs();
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    loadNotifs();
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'leave': return <Calendar size={16} style={{ color: '#3b82f6' }} />;
      case 'payroll': return <CreditCard size={16} style={{ color: '#10b981' }} />;
      case 'payslip': return <FileText size={16} style={{ color: '#a855f7' }} />;
      default: return <Megaphone size={16} style={{ color: '#f59e0b' }} />;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-icon"
        style={{ position: 'relative' }}
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#ef4444',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--bg-surface)'
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="glass"
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.75rem)',
            right: 0,
            width: '360px',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 200
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
              Notifications ({unreadCount} Unread)
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{ background: 'none', border: 'none', color: 'var(--primary-400)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '320px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                No notifications to display.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '0.65rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: n.read ? 'var(--bg-app)' : 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid',
                    borderColor: n.read ? 'var(--border-color)' : 'var(--primary-500)',
                    display: 'flex',
                    gap: '0.65rem',
                    alignItems: 'flex-start'
                  }}
                >
                  <div style={{ marginTop: '0.15rem' }}>{getCategoryIcon(n.category)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)' }}>{n.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.15rem 0' }}>{n.message}</div>
                    <div style={{ fontSize: '0.675rem', color: 'var(--slate-500)' }}>{n.timestamp}</div>
                  </div>
                  {!n.read && (
                    <button
                      onClick={(e) => handleMarkRead(n.id, e)}
                      title="Mark as Read"
                      style={{ background: 'none', border: 'none', color: 'var(--primary-400)', cursor: 'pointer', padding: '0.2rem' }}
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
            <button
              onClick={() => {
                setIsOpen(false);
                navigateTo('notifications');
              }}
              style={{ background: 'none', border: 'none', color: 'var(--primary-400)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              View All Notifications & Notification Center &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
