import React from 'react';
import { X, CreditCard, Clock, CalendarDays, DollarSign } from 'lucide-react';
import { Badge } from '../common/Badge';

export const PayrollDetailModal = ({ isOpen, item, onClose }) => {
  if (!isOpen || !item) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        className="glass"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.875rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-main)' }}>
              <CreditCard size={22} style={{ color: 'var(--primary-400)' }} /> Calculation Breakdown - {item.empName}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Employee ID: {item.empId} &bull; {item.department} &bull; {item.designation}
            </p>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Header Summary Banner */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
            border: '1px solid var(--primary-500)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Net Disbursable Salary</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>
              \${item.netSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Badge variant="purple" size="sm">{item.status || 'Calculated'}</Badge>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Gross: \${item.grossSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Module Input Source Badges */}
        <div className="grid grid-cols-3" style={{ gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'var(--bg-app)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={12} style={{ color: 'var(--primary-400)' }} /> Attendance Inputs
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '0.15rem' }}>
              {item.attendanceDays || 22} Days Present
            </div>
            <div style={{ fontSize: '0.7rem', color: '#10b981' }}>+{item.overtimeHours || 0} hrs Overtime</div>
          </div>

          <div style={{ background: 'var(--bg-app)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CalendarDays size={12} style={{ color: '#f59e0b' }} /> Leave Inputs
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '0.15rem' }}>
              {item.unpaidDays || 0} Unpaid Leave Days
            </div>
            <div style={{ fontSize: '0.7rem', color: '#ef4444' }}>-\${item.unpaidLeaveDeduction || 0} Deducted</div>
          </div>

          <div style={{ background: 'var(--bg-app)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <DollarSign size={12} style={{ color: '#a855f7' }} /> Base Structure
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '0.15rem' }}>
              \${item.basicSalary.toLocaleString()} Basic
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Configured Structure</div>
          </div>
        </div>

        {/* Itemized Calculation Tables */}
        <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#10b981', marginBottom: '0.5rem' }}>Gross Earnings</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.3rem 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Basic Salary</span>
              <span style={{ fontWeight: 600 }}>+\${item.basicSalary.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.3rem 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Allowances (HRA/Med/Spec)</span>
              <span style={{ fontWeight: 600 }}>+\${item.allowances.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.3rem 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Overtime Pay</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>+\${(item.overtimePay || 0).toLocaleString()}</span>
            </div>
          </div>

          <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ef4444', marginBottom: '0.5rem' }}>Deductions</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.3rem 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Statutory (PF/PT/TDS)</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>-\${(item.totalDeductions - (item.unpaidLeaveDeduction || 0)).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.3rem 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Unpaid Leave Deduction</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>-\${(item.unpaidLeaveDeduction || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
