import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import { Badge } from '../common/Badge';

export const PayrollTrendChart = ({ data = [] }) => {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="card-header" style={{ marginBottom: 0 }}>
        <h2 className="card-title">
          <DollarSign size={18} style={{ color: '#10b981' }} /> Monthly Payroll (Last 6 Months)
        </h2>
        <Badge variant="success" dot>+7.3% Growth</Badge>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', padding: '1rem 0.5rem 0.25rem 0.5rem', gap: '0.75rem' }}>
        {data.map((item, idx) => {
          const heightPercent = Math.round((item.amount / maxAmount) * 100);
          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                \${(item.amount / 1000).toFixed(0)}k
              </span>
              <div
                style={{
                  width: '100%',
                  maxWidth: '36px',
                  height: `${heightPercent}%`,
                  background: idx === data.length - 1 ? 'linear-gradient(180deg, #10b981, #059669)' : 'linear-gradient(180deg, #3b82f6, #1e40af)',
                  borderRadius: '6px 6px 0 0',
                  boxShadow: idx === data.length - 1 ? '0 0 12px rgba(16, 185, 129, 0.4)' : 'none',
                  transition: 'height 0.5s ease'
                }}
              />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
