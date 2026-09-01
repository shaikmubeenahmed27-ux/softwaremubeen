import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Clock, CalendarCheck } from 'lucide-react';

export const ReportSummaryCards = ({ summary = {} }) => {
  if (!summary.kpi1Label) return null;

  return (
    <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
      <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary-400)' }}>
          <TrendingUp size={22} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{summary.kpi1Label}</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.1rem' }}>
            {summary.kpi1Value}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
          <DollarSign size={22} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{summary.kpi2Label}</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.1rem' }}>
            {summary.kpi2Value}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
          <BarChart3 size={22} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{summary.kpi3Label}</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.1rem' }}>
            {summary.kpi3Value}
          </div>
        </div>
      </div>
    </div>
  );
};
