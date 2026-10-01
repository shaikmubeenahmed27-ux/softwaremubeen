import React from 'react';
import { Badge } from '../common/Badge';

export const StatCard = ({ title, value, subtext, icon: Icon, iconBg, badgeText, badgeVariant = 'neutral' }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
        <span style={{ fontSize: '0.825rem', fontWeight: 600, letterSpacing: '0.01em' }}>{title}</span>
        {Icon && (
          <div
            style={{
              padding: '0.45rem',
              borderRadius: 'var(--radius-md)',
              background: iconBg || 'rgba(59, 130, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
        {value}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', marginTop: 'auto' }}>
        {badgeText && <Badge variant={badgeVariant} size="sm">{badgeText}</Badge>}
        {subtext && <span style={{ color: 'var(--text-muted)' }}>{subtext}</span>}
      </div>
    </div>
  );
};
