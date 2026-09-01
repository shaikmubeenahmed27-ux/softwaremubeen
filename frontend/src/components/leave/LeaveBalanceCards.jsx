import React from 'react';
import { CalendarDays, AlertTriangle } from 'lucide-react';
import { Badge } from '../common/Badge';

export const LeaveBalanceCards = ({ balances = [] }) => {
  const getVariant = (code) => {
    switch (code) {
      case 'CASUAL': return 'info';
      case 'SICK': return 'purple';
      case 'EARNED': return 'success';
      case 'UNPAID': return 'warning';
      default: return 'neutral';
    }
  };

  return (
    <div className="grid grid-cols-5" style={{ gap: '1rem' }}>
      {balances.map((b, idx) => (
        <div key={idx} className="card" style={{ padding: '0.875rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Badge variant={getVariant(b.code)} size="sm">{b.code || b.type.split(' ')[0]}</Badge>
            <CalendarDays size={16} style={{ color: 'var(--slate-400)' }} />
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{b.type}</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.15rem 0' }}>
            {b.remaining} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {b.allocated} Days</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
            {b.used} days used this year
          </div>
        </div>
      ))}
    </div>
  );
};
