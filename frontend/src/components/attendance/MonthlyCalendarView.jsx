import React from 'react';
import { Badge } from '../common/Badge';

export const MonthlyCalendarView = ({ logs = [], monthName = 'September 2026' }) => {
  // Generate 30 days for month view
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  const getDayStatus = (dayNumber) => {
    const dayStr = dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`;
    const targetDate = `2026-09-${dayStr}`;
    const record = logs.find((l) => l.date === targetDate);

    if (record) {
      return record;
    }

    // Weekend rules (Sundays)
    if (dayNumber % 7 === 0) {
      return { status: 'Holiday', remarks: 'Weekend Sunday' };
    }
    return { status: 'Present', checkIn: '09:00 AM', checkOut: '05:30 PM', workHours: 8.0 };
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present': return <Badge variant="success" size="sm">Present</Badge>;
      case 'Half Day': return <Badge variant="warning" size="sm">Half Day</Badge>;
      case 'Leave': return <Badge variant="info" size="sm">Leave</Badge>;
      case 'Holiday': return <Badge variant="purple" size="sm">Holiday</Badge>;
      case 'Absent': return <Badge variant="danger" size="sm">Absent</Badge>;
      default: return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="card-header" style={{ marginBottom: 0 }}>
        <h2 className="card-title">Monthly Calendar Matrix - {monthName}</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Badge variant="success" size="sm">Present</Badge>
          <Badge variant="warning" size="sm">Half Day</Badge>
          <Badge variant="info" size="sm">Leave</Badge>
          <Badge variant="purple" size="sm">Holiday</Badge>
          <Badge variant="danger" size="sm">Absent</Badge>
        </div>
      </div>

      {/* Calendar Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.75rem'
        }}
      >
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div
            key={day}
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: '0.35rem 0'
            }}
          >
            {day}
          </div>
        ))}

        {daysInMonth.map((dayNum) => {
          const info = getDayStatus(dayNum);
          return (
            <div
              key={dayNum}
              style={{
                minHeight: '84px',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>{dayNum}</span>
                {getStatusBadge(info.status)}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                {info.checkIn && info.checkIn !== '--:--' ? (
                  <div>{info.checkIn} - {info.checkOut}</div>
                ) : (
                  <div>{info.remarks || 'No punch log'}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
