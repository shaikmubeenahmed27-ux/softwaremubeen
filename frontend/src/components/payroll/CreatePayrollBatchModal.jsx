import React, { useState } from 'react';
import { X, CreditCard, Play, AlertCircle, CheckCircle2 } from 'lucide-react';
import { checkDuplicatePayrollBatch } from '../../services/payrollService';

export const CreatePayrollBatchModal = ({ isOpen, onClose, onSubmit }) => {
  const [month, setMonth] = useState('September 2026');
  const [department, setDepartment] = useState('All Departments');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateError, setDuplicateError] = useState('');

  if (!isOpen) return null;

  const handleMonthChange = (val) => {
    setMonth(val);
    if (checkDuplicatePayrollBatch(val, department)) {
      setDuplicateError(`Duplicate Warning: A payroll batch for ${val} (${department}) has already been generated.`);
    } else {
      setDuplicateError('');
    }
  };

  const handleDeptChange = (val) => {
    setDepartment(val);
    if (checkDuplicatePayrollBatch(month, val)) {
      setDuplicateError(`Duplicate Warning: A payroll batch for ${month} (${val}) has already been generated.`);
    } else {
      setDuplicateError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (duplicateError) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ month, department });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          maxWidth: '520px',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
            <CreditCard size={20} style={{ color: 'var(--primary-400)' }} /> Initialize Payroll Calculation Cycle
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {duplicateError && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid #f59e0b', color: '#f59e0b', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <AlertCircle size={18} /> {duplicateError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Select Payroll Cycle Month
            </label>
            <select
              value={month}
              onChange={(e) => handleMonthChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            >
              <option value="September 2026">September 2026 Cycle</option>
              <option value="August 2026">August 2026 Cycle</option>
              <option value="October 2026">October 2026 Cycle</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Target Department Scope
            </label>
            <select
              value={department}
              onChange={(e) => handleDeptChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            >
              <option value="All Departments">All Departments (Organization Wide)</option>
              <option value="Engineering & Tech">Engineering & Tech</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance & Accounting">Finance & Accounting</option>
            </select>
          </div>

          {/* Workflow Notice */}
          <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            <strong style={{ color: 'var(--primary-400)' }}>Automated Cross-Module Integration:</strong> The payroll engine will automatically pull attendance work hours, overtime, approved unpaid leave days, and salary structure rates to generate itemized calculation previews.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || Boolean(duplicateError)}>
              <Play size={16} /> {isSubmitting ? 'Calculating Batch...' : 'Run Payroll Calculation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
