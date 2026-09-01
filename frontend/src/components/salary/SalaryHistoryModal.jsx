import React from 'react';
import { X, History, TrendingUp } from 'lucide-react';
import { Badge } from '../common/Badge';

export const SalaryHistoryModal = ({ isOpen, employee, history = [], onClose }) => {
  if (!isOpen || !employee) return null;

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
          maxWidth: '560px',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
            <History size={20} style={{ color: 'var(--primary-400)' }} /> Salary Revision History
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Compensation revision history for <strong>{employee.empName || employee.fullName}</strong> ({employee.empId}).
        </p>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Effective Date</th>
                <th>Basic Pay</th>
                <th>Monthly Net Pay</th>
                <th>Revision Reason</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{h.date}</td>
                  <td>\${h.basic.toLocaleString()}</td>
                  <td style={{ fontWeight: 700, color: '#10b981' }}>\${h.net.toLocaleString()}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
