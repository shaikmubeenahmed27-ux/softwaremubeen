import React, { useState, useEffect } from 'react';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
  deleteEmployee
} from '../services/employeeService';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Modals
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal';
import { EmployeeProfileView } from '../components/employees/EmployeeProfileView';
import { ConfirmationModal } from '../components/common/ConfirmationModal';

// Icons
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  UserX,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  MoreVertical,
  Building2
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export const EmployeesView = () => {
  const { currentRole, currentUser } = useAuth();

  // State
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter, Sort, Pagination
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState(currentRole === 'manager' ? currentUser.department : 'All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProfileEmployee, setSelectedProfileEmployee] = useState(null);

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [employeeToDeactivate, setEmployeeToDeactivate] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const activeDept = currentRole === 'manager' ? currentUser.department : deptFilter;
    const res = await getEmployees({
      search,
      department: activeDept,
      status: statusFilter,
      employmentType: typeFilter,
      sortBy,
      sortOrder,
      page,
      pageSize: 5
    });
    setEmployees(res.data);
    setTotalCount(res.totalCount);
    setTotalPages(res.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [search, deptFilter, statusFilter, typeFilter, sortBy, sortOrder, page, currentRole]);

  const handleSortToggle = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Actions
  const handleCreateSubmit = async (formData) => {
    if (editingEmployee) {
      const res = await updateEmployee(editingEmployee.id, formData);
      if (res?.error) throw res.error;
    } else {
      const res = await createEmployee(formData);
      if (res?.error) throw res.error;
    }
    loadData();
  };

  const handleDeactivateConfirm = async () => {
    if (employeeToDeactivate) {
      await deactivateEmployee(employeeToDeactivate.id);
      setIsDeactivateModalOpen(false);
      setEmployeeToDeactivate(null);
      loadData();
    }
  };

  const handleDeleteConfirm = async () => {
    if (employeeToDelete) {
      await deleteEmployee(employeeToDelete.id);
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
      loadData();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Users size={24} style={{ color: 'var(--primary-400)' }} />{' '}
            {currentRole === 'manager' ? `${currentUser.department} Team Members` : 'Employee Directory'}
          </h1>
          <p>
            {currentRole === 'manager'
              ? `View basic information of employees in the ${currentUser.department} department.`
              : 'Add, edit, view, activate/deactivate employees and assign departments or designations.'}
          </p>
        </div>
        <div className="page-actions">
          {currentRole === 'admin' && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingEmployee(null);
                setIsFormModalOpen(true);
              }}
            >
              <Plus size={16} /> Onboard New Employee
            </button>
          )}
          {currentRole === 'manager' && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingEmployee(null);
                setIsFormModalOpen(true);
              }}
            >
              <Plus size={16} /> Add Team Member
            </button>
          )}
        </div>
      </div>

      {/* Search & Multi-Filter Toolbar */}
      <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: '280px', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--slate-400)' }} />
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
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

          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
            <Filter size={15} style={{ color: 'var(--text-muted)' }} />

            {/* Dept Filter */}
            {currentRole === 'manager' ? (
              <span
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid var(--primary-500)',
                  color: 'var(--primary-400)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Building2 size={14} /> {currentUser.department}
              </span>
            ) : (
              <select
                value={deptFilter}
                onChange={(e) => {
                  setDeptFilter(e.target.value);
                  setPage(1);
                }}
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
                <option value="All">All Departments</option>
                <option value="Executive">Executive</option>
                <option value="Engineering & Tech">Engineering & Tech</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance & Accounting">Finance & Accounting</option>
                <option value="Product & Design">Product & Design</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
              </select>
            )}

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
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
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Employment Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
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
              <option value="All">All Employment Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data View */}
      {loading ? (
        <LoadingSpinner size={36} label="Fetching employee directory records..." />
      ) : employees.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Matching Employees Found"
          description="No employee records matched your filter criteria."
          actionLabel="Clear All Filters"
          onAction={() => {
            setSearch('');
            setDeptFilter('All');
            setStatusFilter('All');
            setTypeFilter('All');
            setPage(1);
          }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => handleSortToggle('id')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>Employee ID</span> <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th onClick={() => handleSortToggle('name')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>Employee Name</span> <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th onClick={() => handleSortToggle('joiningDate')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>Joining Date</span> <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th>Employment</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary-400)', fontFamily: 'monospace' }}>
                      {emp.id}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {emp.avatar && !emp.avatar.includes('photo-1494790108377') ? (
                          <img
                            src={emp.avatar}
                            alt={emp.fullName}
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              flexShrink: 0
                            }}
                          >
                            {(emp.fullName || 'Staff')
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{emp.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><Badge variant="info">{emp.department}</Badge></td>
                    <td>{emp.designation}</td>
                    <td>{emp.joiningDate}</td>
                    <td>{emp.employmentType}</td>
                    <td>
                      {emp.status === 'active' && <Badge variant="success" dot>Active</Badge>}
                      {emp.status === 'on_leave' && <Badge variant="warning" dot>On Leave</Badge>}
                      {emp.status === 'inactive' && <Badge variant="neutral" dot>Deactivated</Badge>}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        {/* View Profile / Details */}
                        <button
                          className="btn-icon"
                          title="View Employee Profile"
                          onClick={() => {
                            setSelectedProfileEmployee(emp);
                            setIsProfileOpen(true);
                          }}
                        >
                          <Eye size={16} style={{ color: 'var(--primary-400)' }} />
                        </button>

                        {/* Edit Profile: Admin or Manager */}
                        {(currentRole === 'admin' || currentRole === 'manager') && (
                          <button
                            className="btn-icon"
                            title="Edit Profile"
                            onClick={() => {
                              setEditingEmployee(emp);
                              setIsFormModalOpen(true);
                            }}
                          >
                            <Edit2 size={16} style={{ color: 'var(--text-main)' }} />
                          </button>
                        )}

                        {/* Admin-only: Deactivate & Delete */}
                        {currentRole === 'admin' && (
                          <>
                            {emp.status !== 'inactive' && (
                              <button
                                className="btn-icon"
                                title="Deactivate Account (Soft Delete)"
                                onClick={() => {
                                  setEmployeeToDeactivate(emp);
                                  setIsDeactivateModalOpen(true);
                                }}
                              >
                                <UserX size={16} style={{ color: '#f59e0b' }} />
                              </button>
                            )}

                            <button
                              className="btn-icon"
                              title="Permanently Delete Employee"
                              onClick={() => {
                                setEmployeeToDelete(emp);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <Trash2 size={16} style={{ color: '#ef4444' }} />
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

          {/* Pagination Controls */}
          <div className="card" style={{ padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing Page <strong style={{ color: 'var(--text-main)' }}>{page}</strong> of <strong style={{ color: 'var(--text-main)' }}>{totalPages}</strong> ({totalCount} Total Employees)
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                <ChevronLeft size={15} /> Previous
              </button>
              <button
                className="btn btn-secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        initialData={editingEmployee}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={handleCreateSubmit}
        lockedDepartment={currentRole === 'manager' ? currentUser.department : null}
      />

      {/* 7-Tab Profile View */}
      <EmployeeProfileView
        isOpen={isProfileOpen}
        employee={selectedProfileEmployee}
        onClose={() => {
          setIsProfileOpen(false);
          setSelectedProfileEmployee(null);
        }}
      />

      {/* Deactivation Soft-Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeactivateModalOpen}
        title="Deactivate Employee Account?"
        message={`Are you sure you want to deactivate ${employeeToDeactivate?.fullName}? Their status will be set to Inactive to preserve historical payroll and attendance audit records.`}
        confirmLabel="Deactivate Account"
        confirmVariant="danger"
        onConfirm={handleDeactivateConfirm}
        onClose={() => {
          setIsDeactivateModalOpen(false);
          setEmployeeToDeactivate(null);
        }}
      />

      {/* Permanent Deletion Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Permanently Delete Employee Profile?"
        message={`Are you sure you want to permanently delete ${employeeToDelete?.fullName}? This profile and their employee record will be completely removed.`}
        confirmLabel="Permanently Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
      />
    </div>
  );
};
