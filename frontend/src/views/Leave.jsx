import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getLeaveRequests,
  getLeaveBalances,
  applyForLeave,
  cancelLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  getUnpaidLeaveSummary
} from '../services/leaveService';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Components & Modals
import { ApplyLeaveModal } from '../components/leave/ApplyLeaveModal';
import { RejectLeaveModal } from '../components/leave/RejectLeaveModal';
import { LeaveBalanceCards } from '../components/leave/LeaveBalanceCards';

// Icons
import {
  CalendarDays,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Ban,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export const LeaveView = () => {
  const { currentRole, currentUser } = useAuth();

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Data
  const [requests, setRequests] = useState([]);
  const [balances, setBalances] = useState([]);
  const [unpaidSummary, setUnpaidSummary] = useState({});
  const [loading, setLoading] = useState(true);

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [requestToReject, setRequestToReject] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const reqs = await getLeaveRequests({
      userRole: currentRole,
      userDept: currentUser.department,
      authEmployeeId: currentUser.id,
      statusFilter,
      typeFilter
    });
    setRequests(reqs);

    const bals = await getLeaveBalances(currentUser.id);
    setBalances(bals);

    const unpaid = await getUnpaidLeaveSummary(currentUser.id, '09', '2026');
    setUnpaidSummary(unpaid);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, typeFilter, currentRole]);

  // Actions
  const handleApplySubmit = async (formData) => {
    await applyForLeave({
      ...formData,
      empId: currentUser.id,
      empName: currentUser.name,
      department: currentUser.department
    });
    loadData();
  };

  const handleApprove = async (id) => {
    await approveLeaveRequest(id, `${currentUser.name} (${currentRole.toUpperCase()})`);
    loadData();
  };

  const handleCancel = async (id) => {
    await cancelLeaveRequest(id);
    loadData();
  };

  const handleRejectConfirm = async (id, reason) => {
    await rejectLeaveRequest(id, reason, `${currentUser.name} (${currentRole.toUpperCase()})`);
    loadData();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <Badge variant="warning" dot>Pending Review</Badge>;
      case 'Approved': return <Badge variant="success" dot>Approved</Badge>;
      case 'Rejected': return <Badge variant="danger" dot>Rejected</Badge>;
      case 'Cancelled': return <Badge variant="neutral" dot>Cancelled</Badge>;
      default: return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <CalendarDays size={24} style={{ color: 'var(--primary-400)' }} /> Leave Management & Approvals
          </h1>
          <p>
            {currentRole === 'employee' && 'Employee Self Service: Apply for leave, track balances, and manage applications.'}
            {currentRole === 'manager' && `Manager Mode: Reviewing ${currentUser.department} leave applications.`}
            {currentRole === 'admin' && 'Admin Mode: Full leave request approvals, balance overrides & payroll connections.'}
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsApplyModalOpen(true)}>
            <Plus size={16} /> Apply for Leave
          </button>
        </div>
      </div>

      {/* Leave Balances Grid */}
      <LeaveBalanceCards balances={balances} />

      {/* Unpaid Leave Payroll Connection Alert */}
      {unpaidSummary.unpaidDays > 0 && (
        <div
          style={{
            padding: '0.875rem 1.25rem',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid #f59e0b',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontWeight: 600 }}>
            <DollarSign size={18} /> Payroll Notice: {unpaidSummary.unpaidDays} Approved Unpaid Leave Days Recorded
          </div>
          <Badge variant="warning">Payroll Deduction Active</Badge>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Filter size={15} style={{ color: 'var(--text-muted)' }} />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.825rem',
              outline: 'none'
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Category Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.825rem',
              outline: 'none'
            }}
          >
            <option value="All">All Categories</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Earned Leave">Earned Leave</option>
            <option value="Unpaid Leave">Unpaid Leave</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <LoadingSpinner size={36} label="Fetching leave applications and balance logs..." />
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Applicant</th>
                <th>Leave Category</th>
                <th>Duration Dates</th>
                <th>Total Days</th>
                <th>Reason / Rationale</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions & Approvals</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td style={{ fontWeight: 600, color: 'var(--primary-400)', fontFamily: 'monospace' }}>{req.id}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{req.empName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.department}</div>
                  </td>
                  <td>
                    <Badge variant={req.leaveType === 'Unpaid Leave' ? 'warning' : 'info'}>
                      {req.leaveType}
                    </Badge>
                  </td>
                  <td>{req.startDate} to {req.endDate}</td>
                  <td style={{ fontWeight: 700 }}>{req.totalDays} Days</td>
                  <td>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-main)' }}>{req.reason}</div>
                    {req.rejectionReason && (
                      <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.2rem' }}>
                        Rejection Note: {req.rejectionReason}
                      </div>
                    )}
                  </td>
                  <td>{getStatusBadge(req.status)}</td>
                  <td style={{ textAlign: 'right' }}>
                    {req.status === 'Pending' ? (
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        {/* Manager/Admin Approve button */}
                        {(currentRole === 'admin' || currentRole === 'manager') && (
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleApprove(req.id)}
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#10b981', borderColor: '#10b981' }}
                            title="Approve Request & Automatically Deduct Leave Balance"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                        )}

                        {/* Manager/Admin Reject button */}
                        {(currentRole === 'admin' || currentRole === 'manager') && (
                          <button
                            className="btn btn-secondary"
                            onClick={() => {
                              setRequestToReject(req);
                              setIsRejectModalOpen(true);
                            }}
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#ef4444', borderColor: '#ef4444' }}
                            title="Reject Application with Rationale"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        )}

                        {/* Employee Cancel button */}
                        {currentRole === 'employee' && (
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleCancel(req.id)}
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}
                            title="Cancel Application"
                          >
                            <Ban size={14} /> Cancel
                          </button>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                        {req.approvedBy ? `By ${req.approvedBy}` : 'Processed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleApplySubmit}
      />

      {/* Reject Leave Modal */}
      <RejectLeaveModal
        isOpen={isRejectModalOpen}
        request={requestToReject}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRequestToReject(null);
        }}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
};
