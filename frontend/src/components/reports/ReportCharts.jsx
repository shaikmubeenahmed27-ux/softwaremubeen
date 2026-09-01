import React from 'react';

export const ReportCharts = ({ reportType = 'employee' }) => {
  const getChartData = () => {
    switch (reportType) {
      case 'employee':
        return [
          { label: 'Engineering & Tech', value: 43, percentage: 43, color: '#3b82f6' },
          { label: 'Sales & Marketing', value: 26, percentage: 26, color: '#10b981' },
          { label: 'Finance & Accounting', value: 15, percentage: 15, color: '#a855f7' },
          { label: 'Product & Design', value: 12, percentage: 12, color: '#f59e0b' },
          { label: 'Human Resources', value: 4, percentage: 4, color: '#ef4444' }
        ];

      case 'attendance':
        return [
          { label: 'On-Time Present', value: 94, percentage: 94, color: '#10b981' },
          { label: 'Late Punch In', value: 3.5, percentage: 3.5, color: '#f59e0b' },
          { label: 'Half Day', value: 1.5, percentage: 1.5, color: '#3b82f6' },
          { label: 'Unexcused Absent', value: 1.0, percentage: 1.0, color: '#ef4444' }
        ];

      case 'leave':
        return [
          { label: 'Earned Leave Utilization', value: 45, percentage: 45, color: '#10b981' },
          { label: 'Casual Leave Utilization', value: 32, percentage: 32, color: '#3b82f6' },
          { label: 'Sick Leave Utilization', value: 18, percentage: 18, color: '#a855f7' },
          { label: 'Unpaid Leave Days', value: 5, percentage: 5, color: '#ef4444' }
        ];

      case 'payroll':
      case 'department':
      case 'overtime':
      default:
        return [
          { label: 'Engineering & Tech', value: 48, percentage: 48, color: '#3b82f6' },
          { label: 'Executive Leadership', value: 18, percentage: 18, color: '#a855f7' },
          { label: 'Finance & Accounting', value: 14, percentage: 14, color: '#10b981' },
          { label: 'Product & Design', value: 12, percentage: 12, color: '#f59e0b' },
          { label: 'Sales & Marketing', value: 8, percentage: 8, color: '#64748b' }
        ];
    }
  };

  const chartItems = getChartData();

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="card-header" style={{ marginBottom: 0 }}>
        <h2 className="card-title">Visual Distribution & Breakdown</h2>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Proportional Share Analytics</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {chartItems.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{item.label}</span>
              <span style={{ color: 'var(--text-muted)' }}>{item.percentage}% ({item.value})</span>
            </div>
            <div style={{ height: '8px', background: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${item.percentage}%`,
                  background: item.color,
                  borderRadius: '4px',
                  transition: 'width 0.5s ease'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
