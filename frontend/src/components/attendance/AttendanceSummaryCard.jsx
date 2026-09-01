import React from 'react';
import { Clock, CalendarCheck, Award, Zap } from 'lucide-react';
import { Badge } from '../common/Badge';

export const AttendanceSummaryCard = ({ summary = {} }) => {
  return (
    <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Payable Work Days</span>
          <CalendarCheck size={18} style={{ color: '#10b981' }} />
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.25rem 0' }}>
          {summary.payableDays || 22} Days
        </div>
        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          {summary.presentDays || 20} Present &bull; {summary.leaveDays || 2} Paid Leave
        </div>
      </div>

      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Total Regular Hours</span>
          <Clock size={18} style={{ color: 'var(--primary-400)' }} />
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-400)', margin: '0.25rem 0' }}>
          {summary.totalWorkHours || 160.0} hrs
        </div>
        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          Base 8.0 hr/day standard
        </div>
      </div>

      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Total Overtime Hours</span>
          <Zap size={18} style={{ color: '#a855f7' }} />
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a855f7', margin: '0.25rem 0' }}>
          +{summary.totalOvertimeHours || 14.5} hrs
        </div>
        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          1.5x Overtime Multiplier
        </div>
      </div>

      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Payroll Integration</span>
          <Award size={18} style={{ color: '#f59e0b' }} />
        </div>
        <div style={{ margin: '0.35rem 0' }}>
          <Badge variant="purple">Ready for Payroll</Badge>
        </div>
        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          Timecard data locked for Aug/Sep cycle
        </div>
      </div>
    </div>
  );
};
