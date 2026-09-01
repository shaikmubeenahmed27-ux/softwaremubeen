import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markAsRead, markAllAsRead } from '../services/notificationService';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Icons
import {
  Bell,
  CheckCheck,
  Check,
  Calendar,
  CreditCard,
  FileText,
  Megaphone,
  Filter
} from 'lucide-react';

export const NotificationsView = () => {
  const { currentRole, currentUser } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const list = await getNotifications({ userRole: currentRole, authEmployeeId: currentUser.id });
    setNotifications(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [currentRole]);

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    loadData();
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    loadData();
  };

  const filtered = notifications.filter(
    (n) => filterCategory === 'All' || n.category === filterCategory
  );

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'leave': return <Badge variant="info">Leave Event</Badge>;
      case 'payroll': return <Badge variant="success">Payroll Cycle</Badge>;
      case 'payslip': return <Badge variant="purple">Payslip Statement</Badge>;
      default: return <Badge variant="warning">HR Announcement</Badge>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Bell size={24} style={{ color: 'var(--primary-400)' }} /> Notification & Alert Center
          </h1>
          <p>
            Real-time updates for leave requests, payroll processing cycles, payslip generation, and corporate announcements.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleMarkAllRead}>
            <CheckCheck size={16} /> Mark All as Read
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Filter size={15} style={{ color: 'var(--text-muted)' }} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.825rem',
              outline: 'none'
            }}
          >
            <option value="All">All Categories</option>
            <option value="leave">Leave Events</option>
            <option value="payroll">Payroll Cycles</option>
            <option value="payslip">Payslips Statements</option>
            <option value="announcement">HR Announcements</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <LoadingSpinner size={36} label="Fetching notification alerts..." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((n) => (
            <div
              key={n.id}
              className="card"
              style={{
                padding: '1.25rem',
                borderLeft: '4px solid',
                borderLeftColor: n.read ? 'var(--border-color)' : 'var(--primary-500)',
                background: n.read ? 'var(--bg-surface)' : 'var(--bg-surface-hover)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  {getCategoryBadge(n.category)}
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{n.title}</h3>
                  {!n.read && <Badge variant="danger" size="sm">Unread</Badge>}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0.5rem 0' }}>{n.message}</p>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Timestamp: {n.timestamp}</div>
              </div>

              {!n.read && (
                <button className="btn btn-secondary" onClick={() => handleMarkRead(n.id)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
                  <Check size={14} /> Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
