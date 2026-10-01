import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'md', dot = false }) => {
  const styles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    borderRadius: '9999px',
    fontWeight: 600,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    textTransform: 'capitalize',
    padding: size === 'sm' ? '0.25rem 0.5rem' : '0.35rem 0.75rem',
    fontSize: size === 'sm' ? '0.7rem' : '0.75rem',
  };

  const variantMap = {
    success: { bg: 'var(--success-bg)', color: 'var(--success-text)', border: '1px solid var(--success-border)', dotColor: '#10b981' },
    warning: { bg: 'var(--warning-bg)', color: 'var(--warning-text)', border: '1px solid var(--warning-border)', dotColor: '#f59e0b' },
    danger: { bg: 'var(--danger-bg)', color: 'var(--danger-text)', border: '1px solid var(--danger-border)', dotColor: '#ef4444' },
    info: { bg: 'var(--info-bg)', color: 'var(--info-text)', border: '1px solid var(--info-border)', dotColor: '#3b82f6' },
    purple: { bg: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', dotColor: '#a855f7' },
    neutral: { bg: 'var(--neutral-badge-bg)', color: 'var(--neutral-badge-text)', border: '1px solid var(--neutral-badge-border)', dotColor: '#64748b' },
  };

  const activeStyle = variantMap[variant] || variantMap.neutral;

  return (
    <span
      style={{
        ...styles,
        backgroundColor: activeStyle.bg,
        color: activeStyle.color,
        border: activeStyle.border
      }}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: activeStyle.dotColor
          }}
        />
      )}
      {children}
    </span>
  );
};
