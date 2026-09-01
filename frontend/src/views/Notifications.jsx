import React, { useState } from 'react';
import { Bell, CheckCheck, Filter, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/common/Badge';

const NOTIFICATION_LIST = [
  { id: '1', title: 'August Payroll Cycle Ready', msg: 'Payroll batch preview for August 2026 has been generated and awaits final sign-off.', time: '10 mins ago', category: 'Payroll', read: false },
  { id: '2', title: 'Leave Application Approved', msg: 'Marcus Vance approved 3 days Annual Paid Leave for Elena Rostova.', time: '1 hour ago', category: 'Leave', read: false },
  { id: '3', title: 'Security Audit Log Notice', msg: 'New admin login detected from IP address 192.168.1.104.', time: '3 hours ago', category: 'Security', read: true },
  { id: '4', title: 'System Maintenance Completed', msg: 'PayFlow HR core infrastructure update applied successfully with 0 downtime.', time: 'Yesterday', category: 'System', read: true },
];

export const NotificationsView = () => {
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState(NOTIFICATION_LIST);

  const filtered = notifications.filter((n) => filter === 'All' || n.category === filter);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header">
        <div className="page-title-group">
          <h1><Bell size={24} style={{ color: 'var(--primary-400)' }} /> Notification Center</h1>
          <p>Stay updated on payroll approvals, leave requests, and security activity alerts.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={markAllRead}>
            <CheckCheck size={16} /> Mark All as Read
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['All', 'Payroll', 'Leave', 'Security', 'System'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: filter === cat ? 'var(--primary-500)' : 'var(--border-color)',
              background: filter === cat ? 'var(--primary-600)' : 'var(--bg-surface)',
              color: filter === cat ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1rem',
              background: item.read ? 'transparent' : 'rgba(59, 130, 246, 0.05)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>{item.title}</span>
                <Badge variant={item.category === 'Security' ? 'warning' : 'info'} size="sm">{item.category}</Badge>
                {!item.read && <Badge variant="purple" size="sm">Unread</Badge>}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{item.msg}</p>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', whiteSpace: 'nowrap' }}>{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
