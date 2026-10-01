import React from 'react';
import { Palmtree, Stethoscope, CalendarCheck, FileText, MoreHorizontal } from 'lucide-react';

export const LeaveBalanceCards = ({ balances = [] }) => {
  const cardConfigs = [
    {
      code: 'CASUAL',
      name: 'Casual Leave',
      icon: Palmtree,
      themeColor: '#2563eb',
      borderColor: '#dbeafe',
      iconBg: '#eff6ff',
      iconColor: '#2563eb'
    },
    {
      code: 'SICK',
      name: 'Sick Leave',
      icon: Stethoscope,
      themeColor: '#9333ea',
      borderColor: '#f3e8ff',
      iconBg: '#faf5ff',
      iconColor: '#9333ea'
    },
    {
      code: 'EARNED',
      name: 'Earned Leave',
      icon: CalendarCheck,
      themeColor: '#059669',
      borderColor: '#d1fae5',
      iconBg: '#ecfdf5',
      iconColor: '#059669'
    },
    {
      code: 'UNPAID',
      name: 'Unpaid Leave',
      icon: FileText,
      themeColor: '#d97706',
      borderColor: '#fef3c7',
      iconBg: '#fffbeb',
      iconColor: '#d97706'
    },
    {
      code: 'OTHER',
      name: 'Other',
      icon: MoreHorizontal,
      themeColor: '#e11d48',
      borderColor: '#ffe4e6',
      iconBg: '#fff1f2',
      iconColor: '#e11d48'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      width: '100%'
    }}>
      {cardConfigs.map((cfg) => {
        const found = balances.find(
          (b) => b.code?.toUpperCase() === cfg.code || b.type?.toLowerCase().includes(cfg.name.toLowerCase())
        );

        const total = found?.allocated ?? 0;
        const used = found?.used ?? 0;
        const remaining = found?.remaining ?? Math.max(0, total - used);
        const percentUsed = total > 0 ? Math.round((used / total) * 100) : 0;
        const IconComponent = cfg.icon;

        return (
          <div
            key={cfg.code}
            style={{
              background: 'var(--bg-surface, #ffffff)',
              borderRadius: '16px',
              padding: '1.25rem',
              border: `1px solid ${cfg.borderColor}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: cfg.iconBg,
                  color: cfg.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <IconComponent size={20} />
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
                {cfg.name}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>
                  {remaining}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted, #64748b)' }}>
                  / {total} Days
                </span>
              </div>

              {/* Subtext: "X days used this year" */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', marginBottom: '0.85rem' }}>
                {used} {used === 1 ? 'day' : 'days'} used this year
              </div>

              {/* Progress bar */}
              <div
                style={{
                  width: '100%',
                  height: '5px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--bg-app, #f1f5f9)',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, percentUsed)}%`,
                    backgroundColor: cfg.themeColor,
                    borderRadius: '999px',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
