import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 24, label = 'Loading data...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      gap: '0.75rem',
      color: 'var(--text-muted)'
    }}>
      <Loader2
        size={size}
        style={{
          animation: 'spin 1s linear infinite',
          color: 'var(--primary-500)'
        }}
      />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</span>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="card" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
      <div style={{ height: '20px', width: '40%', background: 'var(--slate-700)', borderRadius: '4px', marginBottom: '12px' }} />
      <div style={{ height: '32px', width: '65%', background: 'var(--slate-800)', borderRadius: '4px', marginBottom: '8px' }} />
      <div style={{ height: '14px', width: '50%', background: 'var(--slate-800)', borderRadius: '4px' }} />
    </div>
  );
};
