import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getPayrollBatches,
  getPayrollItems,
  createPayrollBatch,
  approvePayrollBatch,
  processPayrollBatch,
  checkDuplicatePayrollBatch
} from '../services/payrollService';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Modals
import { CreatePayrollBatchModal } from '../components/payroll/CreatePayrollBatchModal';
import { PayrollDetailModal } from '../components/payroll/PayrollDetailModal';

// Icons
import {
  CreditCard,
  Play,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Eye,
  ShieldCheck,
  Zap,
  ArrowRight,
  FileText
} from 'lucide-react';

export const PayrollView = () => {
  const { currentRole, currentUser, navigateTo } = useAuth();

  // Batches and items
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const bList = await getPayrollBatches();
    setBatches(bList);

    const activeBatch = selectedBatch || bList[0];
    if (activeBatch) {
      setSelectedBatch(activeBatch);
      const itms = await getPayrollItems(activeBatch.id);
      setItems(itms);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBatchSelect = async (batch) => {
    setSelectedBatch(batch);
    const itms = await getPayrollItems(batch.id);
    setItems(itms);
  };

  const handleCreateBatch = async ({ month, department }) => {
    const res = await createPayrollBatch({ month, department, adminName: currentUser.name });
    if (res.success) {
      await loadData();
    }
  };

  const handleApproveBatch = async () => {
    if (selectedBatch) {
      await approvePayrollBatch(selectedBatch.id, currentUser.name);
      await loadData();
    }
  };

  const handleProcessBatch = async () => {
    if (selectedBatch) {
      const res = await processPayrollBatch(selectedBatch.id);
      if (res.success) {
        await loadData();
        alert(`Payroll Processed Successfully! ${res.payslips.length} Payslip records generated for employees.`);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Draft': return <Badge variant="neutral">Draft</Badge>;
      case 'Calculated': return <Badge variant="warning" dot>Calculated Preview</Badge>;
      case 'Approved': return <Badge variant="purple" dot>Admin Approved</Badge>;
      case 'Processed': return <Badge variant="success" dot>Processed & Disbursed</Badge>;
      default: return <Badge variant="info">{status}</Badge>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <CreditCard size={24} style={{ color: 'var(--primary-400)' }} /> Monthly Payroll Processing Engine
          </h1>
          <p>
            Cross-module payroll cycle execution incorporating Attendance hours, Unpaid Leave deductions, and Salary structures.
          </p>
        </div>
        <div className="page-actions">
          {currentRole === 'admin' && (
            <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
              <Play size={16} /> Run New Payroll Cycle
            </button>
          )}
        </div>
      </div>

      {/* 8-Step Workflow Stepper Navigation Banner */}
      <div className="card" style={{ background: 'var(--bg-surface)' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-400)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          8-Step Execution Workflow Stepper
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-400)' }}>STEPS 1 & 2</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>1. Select Month & Dept</div>
          </div>

          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-400)' }}>STEPS 3 & 4</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>2. Calculate & Preview</div>
          </div>

          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-400)' }}>STEPS 5 & 6</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>3. Admin Review & Approve</div>
          </div>

          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-400)' }}>STEPS 7 & 8</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>4. Process & Generate Slips</div>
          </div>
        </div>
      </div>

      {/* Selected Batch Active Controls */}
      {selectedBatch && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))', border: '1px solid var(--primary-500)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>{selectedBatch.cycleName}</h2>
                {getStatusBadge(selectedBatch.status)}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Target: <strong style={{ color: '#ffffff' }}>{selectedBatch.department}</strong> &bull; Total Disbursable Net: <strong style={{ color: '#10b981' }}>\${selectedBatch.netTotal.toLocaleString()}</strong>
              </p>
            </div>

            {currentRole === 'admin' && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {selectedBatch.status === 'Calculated' && (
                  <button className="btn btn-primary" onClick={handleApproveBatch}>
                    <ShieldCheck size={16} /> Approve Payroll Batch
                  </button>
                )}

                {selectedBatch.status === 'Approved' && (
                  <button className="btn btn-primary" onClick={handleProcessBatch} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <Zap size={16} /> Mark Processed & Generate Payslips
                  </button>
                )}

                {selectedBatch.status === 'Processed' && (
                  <button className="btn btn-secondary" onClick={() => navigateTo('payslips')}>
                    <FileText size={16} /> View Generated Payslips
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Batches Selector List */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
        {batches.map((b) => (
          <button
            key={b.id}
            onClick={() => handleBatchSelect(b)}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: selectedBatch?.id === b.id ? 'var(--primary-500)' : 'var(--border-color)',
              background: selectedBatch?.id === b.id ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {b.cycleName} ({b.status})
          </button>
        ))}
      </div>

      {/* Main Table: Payroll Line Items */}
      {loading ? (
        <LoadingSpinner size={36} label="Calculating payroll items and cross-module deductions..." />
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Basic Salary</th>
                <th>Gross Salary (Earnings)</th>
                <th>Total Deductions</th>
                <th>Net Payable Salary</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Calculations</th>
              </tr>
            </thead>
            <tbody>
              {items.map((pi) => (
                <tr key={pi.id}>
                  <td style={{ fontWeight: 600, color: 'var(--primary-400)', fontFamily: 'monospace' }}>{pi.empId}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{pi.empName}</td>
                  <td><Badge variant="info">{pi.department}</Badge></td>
                  <td>\${pi.basicSalary.toLocaleString()}</td>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>\${pi.grossSalary.toLocaleString()}</td>
                  <td style={{ fontWeight: 600, color: '#ef4444' }}>-\${pi.totalDeductions.toLocaleString()}</td>
                  <td style={{ fontWeight: 800, color: '#10b981' }}>\${pi.netSalary.toLocaleString()}</td>
                  <td>{getStatusBadge(pi.status || selectedBatch?.status)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-icon"
                      title="View Detailed Itemized Calculation Breakdown"
                      onClick={() => {
                        setSelectedItem(pi);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      <Eye size={16} style={{ color: 'var(--primary-400)' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Batch Modal */}
      <CreatePayrollBatchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBatch}
      />

      {/* Detailed Calculation Breakdown Modal */}
      <PayrollDetailModal
        isOpen={isDetailModalOpen}
        item={selectedItem}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
};
