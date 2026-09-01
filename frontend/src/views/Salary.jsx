import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getSalaryStructures,
  createSalaryStructure,
  updateSalaryStructure,
  getSalaryHistory
} from '../services/salaryService';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';

// Modals
import { SalaryStructureModal } from '../components/salary/SalaryStructureModal';
import { SalaryHistoryModal } from '../components/salary/SalaryHistoryModal';

// Icons
import {
  DollarSign,
  Plus,
  Sliders,
  History,
  Edit2,
  ShieldAlert,
  Search,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const SalaryView = () => {
  const { currentRole, currentUser, navigateTo } = useAuth();

  const [salaryData, setSalaryData] = useState([]);
  const [isRestricted, setIsRestricted] = useState(false);
  const [restrictedMessage, setRestrictedMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyEmployee, setHistoryEmployee] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);

  const loadData = async () => {
    setLoading(true);
    const res = await getSalaryStructures({
      userRole: currentRole,
      authEmployeeId: currentUser.id
    });

    if (res.restricted) {
      setIsRestricted(true);
      setRestrictedMessage(res.message);
    } else {
      setIsRestricted(false);
      setSalaryData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [currentRole]);

  const handleStructureSubmit = async (formData) => {
    if (editingStructure) {
      await updateSalaryStructure(editingStructure.id, formData);
    } else {
      await createSalaryStructure(formData);
    }
    loadData();
  };

  const handleViewHistory = async (emp) => {
    const logs = await getSalaryHistory(emp.empId);
    setHistoryEmployee(emp);
    setHistoryLogs(logs);
    setIsHistoryModalOpen(true);
  };

  // 1. Manager Access Restriction Enforcement
  if (isRestricted) {
    return (
      <div style={{ padding: '2rem 0' }}>
        <ErrorState
          title="Sensitive Data Privacy Protection (403 Forbidden)"
          message={restrictedMessage}
          onRetry={() => navigateTo('dashboard')}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <DollarSign size={24} style={{ color: 'var(--primary-400)' }} /> Compensation & Salary Management
          </h1>
          <p>
            {currentRole === 'admin' && 'Admin Mode: Configurable salary structures, earnings, deductions & assignment.'}
            {currentRole === 'employee' && 'Employee Self Service: View your monthly compensation breakdown.'}
          </p>
        </div>
        <div className="page-actions">
          {currentRole === 'admin' && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingStructure(null);
                setIsStructureModalOpen(true);
              }}
            >
              <Plus size={16} /> Assign Salary Structure
            </button>
          )}
        </div>
      </div>

      {/* Main View Content */}
      {loading ? (
        <LoadingSpinner size={36} label="Loading salary structures and tax configurations..." />
      ) : currentRole === 'employee' && salaryData.length > 0 ? (
        /* Employee Self-Service Read-Only View */
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div>
              <h2 className="card-title">My Compensation Breakdown</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Pay Frequency: <strong>{salaryData[0].payFrequency}</strong> &bull; Effective Date: {salaryData[0].effectiveDate}
              </p>
            </div>
            <Badge variant="success" dot>Active Structure</Badge>
          </div>

          {/* Employee Net Pay Card */}
          <div style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Net Monthly Take-Home Pay</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>
                \${salaryData[0].netSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Gross Monthly Salary</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                \${salaryData[0].grossSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Itemized Earnings & Deductions Tables */}
          <div className="grid grid-cols-2" style={{ gap: '1.25rem' }}>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#10b981', marginBottom: '0.75rem' }}>Itemized Earnings</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.35rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                <span>Basic Salary</span>
                <span style={{ fontWeight: 600 }}>+\${salaryData[0].earnings.basic}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.35rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                <span>HRA Allowance</span>
                <span style={{ fontWeight: 600 }}>+\${salaryData[0].earnings.hra}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.35rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                <span>Conveyance Allowance</span>
                <span style={{ fontWeight: 600 }}>+\${salaryData[0].earnings.conveyance}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.35rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                <span>Medical Allowance</span>
                <span style={{ fontWeight: 600 }}>+\${salaryData[0].earnings.medical}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.35rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                <span>Special Allowance</span>
                <span style={{ fontWeight: 600 }}>+\${salaryData[0].earnings.special}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.35rem 0' }}>
                <span>Bonus & Overtime</span>
                <span style={{ fontWeight: 600 }}>+\${(salaryData[0].earnings.bonus + salaryData[0].earnings.overtime)}</span>
              </div>
            </div>

            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ef4444', marginBottom: '0.75rem' }}>Itemized Deductions</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.35rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                <span>Provident Fund (PF)</span>
                <span style={{ fontWeight: 600, color: '#ef4444' }}>-\${salaryData[0].deductions.pf}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.35rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                <span>Professional Tax (PT)</span>
                <span style={{ fontWeight: 600, color: '#ef4444' }}>-\${salaryData[0].deductions.pt}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.35rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                <span>TDS / Income Tax</span>
                <span style={{ fontWeight: 600, color: '#ef4444' }}>-\${salaryData[0].deductions.tds}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.35rem 0' }}>
                <span>Loan / Other Deductions</span>
                <span style={{ fontWeight: 600, color: '#ef4444' }}>-\${(salaryData[0].deductions.loan + salaryData[0].deductions.other)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Admin Management Data Table */
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Structure ID</th>
                <th>Employee Name</th>
                <th>Basic Pay</th>
                <th>Gross Salary (Earnings)</th>
                <th>Total Deductions</th>
                <th>Net Monthly Pay</th>
                <th>Frequency</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaryData.map((sal) => (
                <tr key={sal.id}>
                  <td style={{ fontWeight: 600, color: 'var(--primary-400)', fontFamily: 'monospace' }}>{sal.id}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{sal.empName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sal.department} &bull; {sal.designation}</div>
                  </td>
                  <td>\${sal.earnings.basic.toLocaleString()}</td>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>\${sal.grossSalary.toLocaleString()}</td>
                  <td style={{ fontWeight: 600, color: '#ef4444' }}>-\${sal.totalDeductions.toLocaleString()}</td>
                  <td style={{ fontWeight: 800, color: '#10b981' }}>\${sal.netSalary.toLocaleString()}</td>
                  <td><Badge variant="purple">{sal.payFrequency}</Badge></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        className="btn-icon"
                        title="View Pay Revision History"
                        onClick={() => handleViewHistory(sal)}
                      >
                        <History size={16} style={{ color: 'var(--primary-400)' }} />
                      </button>
                      <button
                        className="btn-icon"
                        title="Edit Salary Structure & Rates"
                        onClick={() => {
                          setEditingStructure(sal);
                          setIsStructureModalOpen(true);
                        }}
                      >
                        <Edit2 size={16} style={{ color: 'var(--text-main)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Admin Create/Edit Salary Structure Modal */}
      <SalaryStructureModal
        isOpen={isStructureModalOpen}
        initialData={editingStructure}
        onClose={() => {
          setIsStructureModalOpen(false);
          setEditingStructure(null);
        }}
        onSubmit={handleStructureSubmit}
      />

      {/* Salary Revision History Modal */}
      <SalaryHistoryModal
        isOpen={isHistoryModalOpen}
        employee={historyEmployee}
        history={historyLogs}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setHistoryEmployee(null);
        }}
      />
    </div>
  );
};
