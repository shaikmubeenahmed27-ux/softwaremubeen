import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPayslips } from '../services/payslipService';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Modals
import { PayslipModal } from '../components/payslips/PayslipModal';

// Icons
import {
  FileText,
  Search,
  Filter,
  Eye,
  Inbox,
  ArrowRight
} from 'lucide-react';

export const PayslipsView = () => {
  const { currentRole, currentUser, navigateTo } = useAuth();

  const [payslips, setPayslips] = useState([]);
  const [search, setSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const list = await getPayslips({
      userRole: currentRole,
      authEmployeeId: currentUser?.id,
      authUserEmail: currentUser?.email,
      month: monthFilter
    });
    setPayslips(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [currentRole, monthFilter, currentUser]);

  const filteredSlips = payslips.filter(
    (p) =>
      (p.empName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.empId || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.id || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <FileText size={24} style={{ color: 'var(--primary-400)' }} /> {currentRole === 'employee' ? 'My Payslips' : 'Payslips Repository'}
          </h1>
          <p>
            {currentRole === 'employee' && 'Employee Self Service: View, download PDF, or print your official monthly payslips.'}
            {currentRole === 'admin' && 'Admin Directory: Access authorized payslips across all organizational payroll cycles.'}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: '280px', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--slate-400)' }} />
          <input
            type="text"
            placeholder="Search payslip ID, employee name, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.875rem 0.5rem 2.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Filter size={15} style={{ color: 'var(--text-muted)' }} />
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.825rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Months</option>
            <option value="September 2026">September 2026</option>
            <option value="August 2026">August 2026</option>
            <option value="October 2026">October 2026</option>
          </select>
        </div>
      </div>

      {/* Data Table / Empty State */}
      {loading ? (
        <LoadingSpinner size={36} label="Loading issued payslips..." />
      ) : filteredSlips.length === 0 ? (
        <div className="card" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--bg-app)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Inbox size={24} />
          </div>
          <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            No payslips available.
          </h3>
          <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {currentRole === 'employee'
              ? 'Your payslips will appear here automatically as soon as HR or Admin processes your monthly payroll.'
              : 'Payslips are automatically generated and published when you approve and disburse a payroll cycle on the Payroll page.'}
          </p>
          {currentRole === 'admin' && (
            <button className="btn btn-primary" onClick={() => navigateTo('payroll')} style={{ margin: '0 auto' }}>
              Go to Payroll Engine <ArrowRight size={15} />
            </button>
          )}
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Payslip Statement ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Pay Period</th>
                <th>Payment Date</th>
                <th>Gross Salary</th>
                <th>Net Disbursed Pay</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSlips.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: 'var(--primary-400)', fontFamily: 'monospace' }}>{p.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.empName}</td>
                  <td><Badge variant="info">{p.department}</Badge></td>
                  <td>{p.payPeriod}</td>
                  <td>{p.paymentDate}</td>
                  <td>${(p.grossSalary || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ fontWeight: 800, color: '#10b981' }}>${(p.netSalary || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td><Badge variant="success" dot>Disbursed</Badge></td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedPayslip(p);
                        setIsModalOpen(true);
                      }}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      <Eye size={15} /> View & Print (A4)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* A4 Printable Payslip Modal */}
      <PayslipModal
        isOpen={isModalOpen}
        payslip={selectedPayslip}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPayslip(null);
        }}
      />
    </div>
  );
};
export default PayslipsView;
