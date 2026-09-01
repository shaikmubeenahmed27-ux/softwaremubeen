import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calculator, CheckCircle2 } from 'lucide-react';
import { calculateSalaryTotals } from '../../services/salaryService';

export const SalaryStructureModal = ({ isOpen, initialData = null, onClose, onSubmit }) => {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    empId: 'EMP-103',
    empName: 'Elena Rostova',
    payFrequency: 'Monthly',
    effectiveDate: new Date().toISOString().split('T')[0],

    // 7 Configurable Earnings
    earnings: {
      basic: 6500,
      hra: 1500,
      conveyance: 500,
      medical: 400,
      special: 1200,
      bonus: 500,
      overtime: 250
    },

    // 6 Configurable Deductions
    deductions: {
      pf: 520,
      pt: 150,
      tds: 650,
      loan: 200,
      leave: 0,
      other: 0
    }
  });

  const [totals, setTotals] = useState({ grossSalary: 10850, totalDeductions: 1520, netSalary: 9330 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        empId: initialData.empId || 'EMP-103',
        empName: initialData.empName || 'Elena Rostova',
        payFrequency: initialData.payFrequency || 'Monthly',
        effectiveDate: initialData.effectiveDate || new Date().toISOString().split('T')[0],
        earnings: {
          basic: initialData.earnings?.basic || 6500,
          hra: initialData.earnings?.hra || 1500,
          conveyance: initialData.earnings?.conveyance || 500,
          medical: initialData.earnings?.medical || 400,
          special: initialData.earnings?.special || 1200,
          bonus: initialData.earnings?.bonus || 500,
          overtime: initialData.earnings?.overtime || 250
        },
        deductions: {
          pf: initialData.deductions?.pf || 520,
          pt: initialData.deductions?.pt || 150,
          tds: initialData.deductions?.tds || 650,
          loan: initialData.deductions?.loan || 200,
          leave: initialData.deductions?.leave || 0,
          other: initialData.deductions?.other || 0
        }
      });
    }
  }, [initialData, isOpen]);

  // Recalculate Gross Salary, Total Deductions, and Net Salary live
  useEffect(() => {
    const res = calculateSalaryTotals(formData.earnings, formData.deductions);
    setTotals(res);
  }, [formData.earnings, formData.deductions]);

  if (!isOpen) return null;

  const handleEarningChange = (field, value) => {
    setFormData({
      ...formData,
      earnings: { ...formData.earnings, [field]: parseFloat(value) || 0 }
    });
  };

  const handleDeductionChange = (field, value) => {
    setFormData({
      ...formData,
      deductions: { ...formData.deductions, [field]: parseFloat(value) || 0 }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
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
          maxWidth: '740px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-main)' }}>
            <DollarSign size={22} style={{ color: 'var(--primary-400)' }} />
            <span>{isEdit ? 'Edit Salary Structure' : 'Assign Salary Structure'}</span>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Live Calculation Header Banner */}
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
            border: '1px solid var(--primary-500)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gross Salary (Total Earnings)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '0.15rem' }}>
              \${totals.grossSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Deductions</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444', marginTop: '0.15rem' }}>
              -\${totals.totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Net Take-Home Salary</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', marginTop: '0.15rem' }}>
              \${totals.netSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Employee & Effective Date */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Select Employee
              </label>
              <select
                value={formData.empId}
                onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                disabled={isEdit}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              >
                <option value="EMP-101">EMP-101 - Sarah Jenkins</option>
                <option value="EMP-102">EMP-102 - Marcus Vance</option>
                <option value="EMP-103">EMP-103 - Elena Rostova</option>
                <option value="EMP-104">EMP-104 - David Miller</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Pay Frequency
              </label>
              <select
                value={formData.payFrequency}
                onChange={(e) => setFormData({ ...formData, payFrequency: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              >
                <option value="Monthly">Monthly</option>
                <option value="Bi-weekly">Bi-weekly</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Effective Date
              </label>
              <input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Section 1: Earnings Components (7 Fields) */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#10b981', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Itemized Earnings Components (\$)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Basic Salary</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.earnings.basic}
                  onChange={(e) => handleEarningChange('basic', e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>HRA Allowance</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.earnings.hra}
                  onChange={(e) => handleEarningChange('hra', e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Conveyance</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.earnings.conveyance}
                  onChange={(e) => handleEarningChange('conveyance', e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Medical Allowance</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.earnings.medical}
                  onChange={(e) => handleEarningChange('medical', e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Special Allowance</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.earnings.special}
                  onChange={(e) => handleEarningChange('special', e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Bonus Pay</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.earnings.bonus}
                  onChange={(e) => handleEarningChange('bonus', e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Overtime Pay</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.earnings.overtime}
                  onChange={(e) => handleEarningChange('overtime', e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Deductions Components (6 Fields) */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#ef4444', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Itemized Deductions Components (\$)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Provident Fund (PF)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.deductions.pf}
                  onChange={(e) => handleDeductionChange('pf', e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Professional Tax (PT)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.deductions.pt}
                  onChange={(e) => handleDeductionChange('pt', e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>TDS / Income Tax</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.deductions.tds}
                  onChange={(e) => handleDeductionChange('tds', e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Loan Repayment</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.deductions.loan}
                  onChange={(e) => handleDeductionChange('loan', e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Unpaid Leave Deduction</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.deductions.leave}
                  onChange={(e) => handleDeductionChange('leave', e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Other Deductions</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.deductions.other}
                  onChange={(e) => handleDeductionChange('other', e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving Structure...' : isEdit ? 'Update Structure' : 'Assign Structure'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
