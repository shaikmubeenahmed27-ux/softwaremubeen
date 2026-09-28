import React from 'react';

export const ReportCharts = ({ reportType = 'payroll', rows = [] }) => {
  const getChartData = () => {
    if (!rows || rows.length === 0) {
      return [
        { label: 'Awaiting Records', value: '0', percentage: 0, color: 'var(--text-muted)' }
      ];
    }

    const palette = ['#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

    switch (reportType) {
      case 'employee': {
        const deptCounts = {};
        rows.forEach((r) => {
          const d = r.department || 'General';
          deptCounts[d] = (deptCounts[d] || 0) + 1;
        });
        const total = rows.length || 1;
        return Object.entries(deptCounts).map(([label, count], idx) => ({
          label,
          value: `${count} Staff`,
          percentage: Math.round((count / total) * 100),
          color: palette[idx % palette.length]
        }));
      }

      case 'attendance': {
        const statusCounts = {};
        rows.forEach((r) => {
          const s = r.attendanceStatus || 'Present';
          statusCounts[s] = (statusCounts[s] || 0) + 1;
        });
        const total = rows.length || 1;
        return Object.entries(statusCounts).map(([label, count], idx) => ({
          label,
          value: `${count} Logs`,
          percentage: Math.round((count / total) * 100),
          color: label.toLowerCase().includes('present') ? '#10b981' : label.toLowerCase().includes('late') ? '#f59e0b' : '#ef4444'
        }));
      }

      case 'leave': {
        const catCounts = {};
        rows.forEach((r) => {
          const c = r.leaveCategory || 'Leave';
          catCounts[c] = (catCounts[c] || 0) + 1;
        });
        const total = rows.length || 1;
        return Object.entries(catCounts).map(([label, count], idx) => ({
          label,
          value: `${count} Requests`,
          percentage: Math.round((count / total) * 100),
          color: palette[idx % palette.length]
        }));
      }

      case 'payroll':
      default: {
        const deptGross = {};
        let totalSum = 0;
        rows.forEach((r) => {
          const d = r.department || 'General';
          const grossNum = parseFloat(String(r.grossSalary || r.grossTotal || '0').replace(/[^0-9.-]/g, '')) || 0;
          deptGross[d] = (deptGross[d] || 0) + grossNum;
          totalSum += grossNum;
        });
        if (totalSum === 0) totalSum = 1;

        return Object.entries(deptGross).map(([label, gross], idx) => ({
          label,
          value: `$${Math.round(gross).toLocaleString()}`,
          percentage: Math.round((gross / totalSum) * 100),
          color: palette[idx % palette.length]
        }));
      }
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
