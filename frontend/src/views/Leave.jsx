import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getLeaveRequests,
  getLeaveBalances,
  applyForLeave,
  cancelLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  getUnpaidLeaveSummary,
  formatDateDisplay,
  getAvatarMeta
} from '../services/leaveService';
import { getEmployees } from '../services/employeeService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Components & Modals
import { ApplyLeaveModal } from '../components/leave/ApplyLeaveModal';
import { RejectLeaveModal } from '../components/leave/RejectLeaveModal';
import { LeaveBalanceCards } from '../components/leave/LeaveBalanceCards';
import { LeaveDetailModal } from '../components/leave/LeaveDetailModal';

// Icons
import {
  Calendar,
  Plus,
  Search,
  RotateCcw,
  Eye,
  Check,
  X,
  Clock,
  Inbox,
  UserPlus
} from 'lucide-react';

export const LeaveView = () => {
  const { currentRole, currentUser } = useAuth();

  // Real employee list from database + fallback to current user
  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'history'

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateRange, setDateRange] = useState('');

  // Data state
  const [requests, setRequests] = useState([]);
  const [balances, setBalances] = useState([]);
  const [unpaidSummary, setUnpaidSummary] = useState({});
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestToReject, setRequestToReject] = useState(null);

  // Load real employees
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const activeDept = currentRole === 'manager' ? currentUser?.department : 'All';
        const res = await getEmployees({ pageSize: 100, department: activeDept });
        const empList = res?.data || (Array.isArray(res) ? res : []);

        if (empList && empList.length > 0) {
          if (currentRole === 'employee') {
            const selfEmp = empList.find(
              (e) =>
                (currentUser?.email && e.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
                e.dbId === currentUser?.id ||
                e.id === currentUser?.id ||
                e.fullName?.toLowerCase() === currentUser?.name?.toLowerCase()
            );
            if (selfEmp) {
              setEmployees([selfEmp]);
              setSelectedEmpId(selfEmp.dbId || selfEmp.id);
            } else {
              setEmployees(empList);
              setSelectedEmpId(empList[0].dbId || empList[0].id);
            }
          } else {
            setEmployees(empList);
            setSelectedEmpId(empList[0].dbId || empList[0].id);
          }
        } else if (currentUser) {
          // If no staff members added yet, include current logged-in user profile
          const selfEmp = {
            id: currentUser.id || 'EMP-ADMIN',
            dbId: currentUser.id || 'EMP-ADMIN',
            fullName: currentUser.name || 'Staff Member',
            name: currentUser.name || 'Staff Member',
            email: currentUser.email || '',
            department: currentUser.department || 'Executive & Management',
            joiningDate: '2024-01-15',
            employmentType: 'Full-time'
          };
          setEmployees([selfEmp]);
          setSelectedEmpId(selfEmp.dbId || selfEmp.id);
        } else {
          setEmployees([]);
          setSelectedEmpId('');
        }
      } catch (err) {
        console.error('Error fetching employees in Leave view:', err);
      }
    }
    fetchEmployees();
  }, [currentUser, currentRole]);

  // Current selected employee object
  const currentSelectedEmployee = employees.find(
    (e) => e.id === selectedEmpId || e.dbId === selectedEmpId
  ) || (employees.length > 0 ? employees[0] : null);

  const selectedMeta = currentSelectedEmployee
    ? getAvatarMeta(currentSelectedEmployee.fullName || currentSelectedEmployee.name || 'User')
    : getAvatarMeta(currentUser?.name || 'User');

  const loadData = async () => {
    setLoading(true);
    const empIdentifier = currentRole === 'employee'
      ? (currentSelectedEmployee?.dbId || currentSelectedEmployee?.id || currentUser?.id || '')
      : (selectedEmpId || currentSelectedEmployee?.dbId || currentSelectedEmployee?.id || '');

    const reqs = await getLeaveRequests({
      userRole: currentRole,
      userDept: currentUser?.department || 'Executive',
      authEmployeeId: currentRole === 'employee' ? empIdentifier : '',
      userEmail: currentUser?.email || '',
      search: searchTerm,
      statusFilter,
      typeFilter,
      activeTab
    });
    setRequests(reqs);

    const bals = await getLeaveBalances(empIdentifier, currentUser?.email || '');
    setBalances(bals);

    const unpaid = await getUnpaidLeaveSummary(empIdentifier);
    setUnpaidSummary(unpaid);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedEmpId, searchTerm, statusFilter, typeFilter, activeTab, currentRole, currentUser]);

  // Listen for real-time leave events
  useEffect(() => {
    const handleSync = () => loadData();
    window.addEventListener('payflow:leave_updated', handleSync);
    return () => window.removeEventListener('payflow:leave_updated', handleSync);
  }, [selectedEmpId, searchTerm, statusFilter, typeFilter, activeTab, currentRole, currentUser]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setTypeFilter('All');
    setDateRange('');
  };

  // Actions
  const handleApplySubmit = async (formData) => {
    await applyForLeave({
      ...formData,
      empId: formData.empId || currentSelectedEmployee?.dbId || currentSelectedEmployee?.id || currentUser?.id,
      empCode: formData.empCode || currentSelectedEmployee?.id || '',
      empName: formData.empName || currentSelectedEmployee?.fullName || currentUser?.name,
      email: currentSelectedEmployee?.email || currentUser?.email,
      department: formData.department || currentSelectedEmployee?.department || currentUser?.department
    });
    loadData();
  };

  const handleApprove = async (id) => {
    await approveLeaveRequest(id, `${currentUser?.name || 'Admin'} (${currentRole.toUpperCase()})`);
    loadData();
  };

  const handleCancel = async (id) => {
    await cancelLeaveRequest(id);
    loadData();
  };

  const handleRejectConfirm = async (id, reason) => {
    await rejectLeaveRequest(id, reason, `${currentUser?.name || 'Admin'} (${currentRole.toUpperCase()})`);
    loadData();
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            background: '#fef3c7',
            color: '#b45309',
            border: '1px solid #fde68a'
          }}>
            <Clock size={12} style={{ color: '#d97706' }} /> Pending
          </span>
        );
      case 'Approved':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            background: '#dcfce7',
            color: '#15803d',
            border: '1px solid #bbf7d0'
          }}>
            <Check size={12} style={{ color: '#16a34a', strokeWidth: 3 }} /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            background: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fecaca'
          }}>
            <X size={12} style={{ color: '#dc2626', strokeWidth: 3 }} /> Rejected
          </span>
        );
      default:
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.25rem 0.65rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: '#f1f5f9',
            color: '#64748b'
          }}>
            {status}
          </span>
        );
    }
  };

  // Leave Type Badge Helper
  const renderLeaveTypeBadge = (type) => {
    const t = (type || '').toLowerCase();
    let bg = '#eff6ff';
    let color = '#2563eb';
    let border = '#dbeafe';

    if (t.includes('sick')) {
      bg = '#faf5ff';
      color = '#9333ea';
      border = '#f3e8ff';
    } else if (t.includes('earned')) {
      bg = '#ecfdf5';
      color = '#059669';
      border = '#d1fae5';
    } else if (t.includes('unpaid')) {
      bg = '#fffbeb';
      color = '#d97706';
      border = '#fef3c7';
    } else if (t.includes('other')) {
      bg = '#fff1f2';
      color = '#e11d48';
      border = '#ffe4e6';
    }

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.75rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        background: bg,
        color: color,
        border: `1px solid ${border}`
      }}>
        {type}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* ─── 1. Page Header ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'transparent'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.12)'
          }}>
            <Calendar size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>
              {currentRole === 'admin'
                ? 'Global Leave Management & Approvals'
                : currentRole === 'manager'
                ? `Team Leave Management — ${currentUser?.department || 'Department'}`
                : 'My Leave Portal & Balances'}
            </h1>
            <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted, #64748b)' }}>
              {currentRole === 'admin'
                ? 'Company-wide leave request tracking, allowances, and executive approval decisions.'
                : currentRole === 'manager'
                ? `Review, approve, or reject leave requests for team members in ${currentUser?.department || 'your department'}.`
                : 'Track your personal leave quota, submit time-off requests, and monitor approval statuses.'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          className="btn btn-primary"
          onClick={() => setIsApplyModalOpen(true)}
          style={{
            background: '#2563eb',
            borderColor: '#2563eb',
            color: '#ffffff',
            borderRadius: '10px',
            padding: '0.55rem 1.15rem',
            fontWeight: 600,
            fontSize: '0.875rem',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Plus size={18} /> {currentRole === 'admin' ? 'Apply Leave for Employee' : currentRole === 'manager' ? 'Apply Leave for Team' : 'Apply for Leave'}
        </button>
      </div>

      {/* ─── 2. Profile / Employee Bar (Role-Specific) ─────────────── */}
      {currentRole === 'employee' ? (
        <div style={{
          background: 'var(--bg-surface, #ffffff)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--border-color, #e2e8f0)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr',
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#2563eb',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {selectedMeta.initials}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                {currentUser?.name || 'Staff Member'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>
                Personal Leave Account
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', marginBottom: '0.25rem' }}>
              Employee ID
            </div>
            <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
              {currentUser?.id || 'EMP-SELF'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', marginBottom: '0.25rem' }}>
              Department
            </div>
            <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
              {currentUser?.department || 'General'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', marginBottom: '0.25rem' }}>
              Role
            </div>
            <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#10b981' }}>
              Staff Member
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', marginBottom: '0.25rem' }}>
              Leave Status
            </div>
            <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#2563eb' }}>
              Active / Eligible
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'var(--bg-surface, #ffffff)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--border-color, #e2e8f0)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr',
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          {/* Select Employee Dropdown */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', marginBottom: '0.4rem' }}>
              {currentRole === 'manager' ? 'Select Team Member' : 'Select Employee'}
            </div>
            {employees.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  background: 'var(--bg-app, #f8fafc)',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: selectedMeta.color || '#2563eb',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {selectedMeta.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <select
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-main, #0f172a)',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      outline: 'none',
                      cursor: 'pointer',
                      paddingRight: '1rem'
                    }}
                  >
                    {employees.map((emp) => (
                      <option key={emp.id || emp.dbId} value={emp.id || emp.dbId}>
                        {emp.fullName || emp.name} ({emp.id || 'EMP'})
                      </option>
                    ))}
                  </select>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted, #64748b)', marginTop: '-2px' }}>
                    {currentSelectedEmployee?.department || 'General'}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                No employees found in directory.
              </div>
            )}
          </div>

          {/* Employee ID */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', marginBottom: '0.25rem' }}>
              Employee ID
            </div>
            <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
              {currentSelectedEmployee?.id || currentSelectedEmployee?.dbId || '—'}
            </div>
          </div>

          {/* Department */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', marginBottom: '0.25rem' }}>
              Department
            </div>
            <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
              {currentSelectedEmployee?.department || '—'}
            </div>
          </div>

          {/* Date of Joining */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', marginBottom: '0.25rem' }}>
              Date of Joining
            </div>
            <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
              {currentSelectedEmployee?.joiningDate ? formatDateDisplay(currentSelectedEmployee.joiningDate) : '—'}
            </div>
          </div>

          {/* Scope / Employment Type */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', marginBottom: '0.25rem' }}>
              {currentRole === 'manager' ? 'Scope' : 'Employment Type'}
            </div>
            <div style={{ fontSize: '0.925rem', fontWeight: 700, color: currentRole === 'manager' ? '#2563eb' : 'var(--text-main, #0f172a)' }}>
              {currentRole === 'manager' ? 'Department Team' : (currentSelectedEmployee?.employmentType || 'Full-time')}
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. Leave Balance Cards (Casual, Sick, Earned, Unpaid, Other) ─────── */}
      <LeaveBalanceCards balances={balances} />

      {/* ─── 4. Search and Filters Toolbar ───────────────────────────────────── */}
      <div style={{
        background: 'var(--bg-surface, #ffffff)',
        padding: '0.85rem 1.25rem',
        borderRadius: '14px',
        border: '1px solid var(--border-color, #e2e8f0)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end', flex: 1 }}>
          {/* Search Input */}
          <div style={{ minWidth: '280px', flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted, #64748b)', marginBottom: '0.35rem' }}>
              Search Leave Requests
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', color: '#94a3b8' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by employee name, leave type, reason..."
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem 0.55rem 2.25rem',
                  borderRadius: '10px',
                  background: 'var(--bg-app, #f8fafc)',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  color: 'var(--text-main, #0f172a)',
                  fontSize: '0.825rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Leave Type Dropdown */}
          <div style={{ minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted, #64748b)', marginBottom: '0.35rem' }}>
              Leave Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '10px',
                background: 'var(--bg-app, #f8fafc)',
                border: '1px solid var(--border-color, #cbd5e1)',
                color: 'var(--text-main, #0f172a)',
                fontSize: '0.825rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Types</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Earned Leave">Earned Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div style={{ minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted, #64748b)', marginBottom: '0.35rem' }}>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '10px',
                background: 'var(--bg-app, #f8fafc)',
                border: '1px solid var(--border-color, #cbd5e1)',
                color: 'var(--text-main, #0f172a)',
                fontSize: '0.825rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Range */}
          <div style={{ minWidth: '170px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted, #64748b)', marginBottom: '0.35rem' }}>
              Date Range
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Calendar size={15} style={{ position: 'absolute', left: '0.75rem', color: '#94a3b8' }} />
              <input
                type="date"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem 0.55rem 2.25rem',
                  borderRadius: '10px',
                  background: 'var(--bg-app, #f8fafc)',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  color: 'var(--text-main, #0f172a)',
                  fontSize: '0.825rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div>
          <button
            onClick={handleResetFilters}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.55rem 0.95rem',
              borderRadius: '10px',
              background: 'transparent',
              border: '1px solid var(--border-color, #cbd5e1)',
              color: 'var(--text-main, #0f172a)',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} style={{ color: '#64748b' }} /> Reset
          </button>
        </div>
      </div>

      {/* ─── 5. Tabbed Requests Table Container ──────────────────────────────── */}
      <div style={{
        background: 'var(--bg-surface, #ffffff)',
        borderRadius: '16px',
        border: '1px solid var(--border-color, #e2e8f0)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        overflow: 'hidden'
      }}>
        {/* Tab Headers */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          padding: '0 1.5rem',
          background: 'var(--bg-surface, #ffffff)'
        }}>
          <button
            onClick={() => setActiveTab('requests')}
            style={{
              padding: '1rem 1.25rem',
              border: 'none',
              background: 'transparent',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: activeTab === 'requests' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'requests' ? '2.5px solid #2563eb' : '2.5px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Leave Requests
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              padding: '1rem 1.25rem',
              border: 'none',
              background: 'transparent',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: activeTab === 'history' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'history' ? '2.5px solid #2563eb' : '2.5px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Leave History
          </button>
        </div>

        {/* Table View */}
        {loading ? (
          <div style={{ padding: '3.5rem 1rem' }}>
            <LoadingSpinner size={36} label="Loading leave requests..." />
          </div>
        ) : requests.length === 0 ? (
          <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#f1f5f9',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Inbox size={24} />
            </div>
            <h3 style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              No Leave Requests Found
            </h3>
            <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              {activeTab === 'history'
                ? 'No processed leave history records found.'
                : 'No pending leave applications. Click "Apply Leave for Employee" above to create one.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-app, #f8fafc)', borderBottom: '1px solid var(--border-color, #e2e8f0)', color: '#64748b', fontSize: '0.75rem' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>#</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Employee</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Leave Type</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>From Date</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>To Date</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Days</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Reason</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Applied On</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => (
                  <tr
                    key={req.id}
                    style={{
                      borderBottom: '1px solid var(--border-color, #f1f5f9)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-app, #f8fafc)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Index */}
                    <td style={{ padding: '1rem', color: '#64748b', fontWeight: 600 }}>
                      {index + 1}
                    </td>

                    {/* Employee */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: req.avatarBg || '#2563eb',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.825rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {req.initials || (req.empName ? req.empName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'EM')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main, #0f172a)', fontSize: '0.875rem' }}>
                            {req.empName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                            {req.department}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Leave Type */}
                    <td style={{ padding: '1rem' }}>
                      {renderLeaveTypeBadge(req.leaveType)}
                    </td>

                    {/* From Date */}
                    <td style={{ padding: '1rem', color: 'var(--text-main, #334155)', fontWeight: 500 }}>
                      {req.startDate}
                    </td>

                    {/* To Date */}
                    <td style={{ padding: '1rem', color: 'var(--text-main, #334155)', fontWeight: 500 }}>
                      {req.endDate}
                    </td>

                    {/* Days */}
                    <td style={{ padding: '1rem', color: 'var(--text-main, #0f172a)', fontWeight: 600 }}>
                      {req.totalDays}
                    </td>

                    {/* Reason */}
                    <td style={{ padding: '1rem', color: 'var(--text-main, #334155)', maxWidth: '180px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {req.reason}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '1rem' }}>
                      {renderStatusBadge(req.status)}
                    </td>

                    {/* Applied On */}
                    <td style={{ padding: '1rem', color: 'var(--text-muted, #64748b)', fontSize: '0.825rem' }}>
                      {req.appliedOn || req.startDate}
                    </td>

                    {/* Action Icon Buttons */}
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                        {/* View Eye Button */}
                        <button
                          onClick={() => {
                            setSelectedRequest(req);
                            setIsDetailModalOpen(true);
                          }}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: '#eff6ff',
                            border: '1px solid #dbeafe',
                            color: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>

                        {/* Approve and Reject Buttons: ONLY Admin or Manager for Pending requests */}
                        {currentRole !== 'employee' && req.status?.toLowerCase() === 'pending' && (
                          <>
                            {/* Approve Button */}
                            <button
                              onClick={() => handleApprove(req.id)}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: '#ecfdf5',
                                border: '1px solid #d1fae5',
                                color: '#059669',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              title="Approve Leave"
                            >
                              <Check size={14} />
                            </button>

                            {/* Reject Button */}
                            <button
                              onClick={() => {
                                setRequestToReject(req);
                                setIsRejectModalOpen(true);
                              }}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: '#fff1f2',
                                border: '1px solid #ffe4e6',
                                color: '#e11d48',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              title="Reject Leave"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Modals ─────────────────────────────────────────────────────────── */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleApplySubmit}
        currentRole={currentRole}
        userDepartment={currentUser?.department}
        currentUser={currentUser}
        balances={balances}
      />

      <RejectLeaveModal
        isOpen={isRejectModalOpen}
        request={requestToReject}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRequestToReject(null);
        }}
        onConfirm={handleRejectConfirm}
      />

      <LeaveDetailModal
        isOpen={isDetailModalOpen}
        request={selectedRequest}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRequest(null);
        }}
        onApprove={handleApprove}
        onReject={(req) => {
          setRequestToReject(req);
          setIsRejectModalOpen(true);
        }}
        currentRole={currentRole}
      />
    </div>
  );
};
export default LeaveView;
