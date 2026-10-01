import React from 'react';
import { Building2 } from 'lucide-react';
import { Badge } from '../common/Badge';

export const DepartmentChart = ({ data = [] }) => {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="card-header" style={{ marginBottom: 0 }}>
        <h2 className="card-title">
          <Building2 size={18} style={{ color: 'var(--primary-400)' }} /> Employees by Department
        </h2>
        <Badge variant="purple">Distribution</Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', paddingTop: '0.5rem' }}>
        {data.map((dept, idx) => {
          const percentage = Math.round((dept.count / maxCount) * 100);
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{dept.fullName || dept.name}</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-400)' }}>{dept.count} Staff</span>
              </div>
              <div style={{ height: '8px', width: '100%', background: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: dept.color || 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                    borderRadius: '4px',
                    transition: 'width 0.6s ease-in-out'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
