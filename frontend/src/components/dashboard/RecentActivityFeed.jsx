import React from 'react';
import { Activity, Shield, Clock, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Badge } from '../common/Badge';

export const RecentActivityFeed = ({ activities = [] }) => {
  const getBadgeVariant = (level) => {
    if (level === 'CRITICAL' || level === 'WARNING') return 'warning';
    return 'info';
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="card-header" style={{ marginBottom: 0 }}>
        <h2 className="card-title">
          <Activity size={18} style={{ color: 'var(--primary-400)' }} /> Recent System Activities
        </h2>
        <Badge variant="neutral">Real-time Logs</Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {activities.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ marginTop: '0.15rem' }}>
              {item.level === 'WARNING' ? (
                <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
              ) : (
                <CheckCircle2 size={16} style={{ color: '#10b981' }} />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                {item.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                <span>{item.user}</span>
                <span>&bull;</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Clock size={11} /> {item.time}
                </div>
              </div>
            </div>

            <Badge variant={getBadgeVariant(item.level)} size="sm">
              {item.level || 'INFO'}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
