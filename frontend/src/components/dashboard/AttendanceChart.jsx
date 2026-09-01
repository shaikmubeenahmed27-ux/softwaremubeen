import React from 'react';
import { Clock } from 'lucide-react';
import { Badge } from '../common/Badge';

export const AttendanceChart = ({ stats = {} }) => {
  const present = stats.present || 136;
  const late = stats.late || 6;
  const onLeave = stats.onLeave || 4;
  const absent = stats.absent || 2;
  const total = present + late + onLeave + absent;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="card-header" style={{ marginBottom: 0 }}>
        <h2 className="card-title">
          <Clock size={18} style={{ color: '#3b82f6' }} /> Attendance Distribution (Today)
        </h2>
        <Badge variant="success" dot>{stats.rate || '95.8%'} Rate</Badge>
      </div>

      {/* Multi-segmented Progress Bar */}
      <div style={{ display: 'flex', height: '14px', borderRadius: '7px', overflow: 'hidden', width: '100%', margin: '0.5rem 0' }}>
        <div style={{ width: `${(present / total) * 100}%`, background: '#10b981' }} title={`Present: ${present}`} />
        <div style={{ width: `${(late / total) * 100}%`, background: '#f59e0b' }} title={`Late: ${late}`} />
        <div style={{ width: `${(onLeave / total) * 100}%`, background: '#3b82f6' }} title={`On Leave: ${onLeave}`} />
        <div style={{ width: `${(absent / total) * 100}%`, background: '#ef4444' }} title={`Absent: ${absent}`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.825rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          <span>Present: <strong style={{ color: 'var(--text-main)' }}>{present}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
          <span>Late Check-in: <strong style={{ color: 'var(--text-main)' }}>{late}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }} />
          <span>On Leave: <strong style={{ color: 'var(--text-main)' }}>{onLeave}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
          <span>Unexcused: <strong style={{ color: 'var(--text-main)' }}>{absent}</strong></span>
        </div>
      </div>
    </div>
  );
};
