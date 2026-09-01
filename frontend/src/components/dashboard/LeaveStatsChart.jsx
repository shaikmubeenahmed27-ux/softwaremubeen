import React from 'react';
import { CalendarDays } from 'lucide-react';
import { Badge } from '../common/Badge';

export const LeaveStatsChart = ({ stats = {} }) => {
  const approved = stats.approved || 18;
  const pending = stats.pending || 5;
  const rejected = stats.rejected || 3;
  const total = approved + pending + rejected;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="card-header" style={{ marginBottom: 0 }}>
        <h2 className="card-title">
          <CalendarDays size={18} style={{ color: '#f59e0b' }} /> Leave Request Statistics
        </h2>
        <Badge variant="warning">{pending} Pending</Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.25rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.25rem' }}>
            <span>Approved Applications</span>
            <strong style={{ color: '#10b981' }}>{approved} ({Math.round((approved / total) * 100)}%)</strong>
          </div>
          <div style={{ height: '8px', background: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${(approved / total) * 100}%`, height: '100%', background: '#10b981' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.25rem' }}>
            <span>Pending Manager Review</span>
            <strong style={{ color: '#f59e0b' }}>{pending} ({Math.round((pending / total) * 100)}%)</strong>
          </div>
          <div style={{ height: '8px', background: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${(pending / total) * 100}%`, height: '100%', background: '#f59e0b' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.25rem' }}>
            <span>Rejected / Declined</span>
            <strong style={{ color: '#ef4444' }}>{rejected} ({Math.round((rejected / total) * 100)}%)</strong>
          </div>
          <div style={{ height: '8px', background: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${(rejected / total) * 100}%`, height: '100%', background: '#ef4444' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
