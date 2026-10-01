import React, { useState, useEffect } from 'react';
import { X, CalendarDays, Calculator, CheckCircle2, User } from 'lucide-react';
import { LEAVE_TYPES } from '../../services/leaveService';
import { getEmployees } from '../../services/employeeService';

export const ApplyLeaveModal = ({ isOpen, onClose, onSubmit, currentRole = 'admin', userDepartment = null, currentUser = null }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: ''
  });

  const [totalDays, setTotalDays] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const dept = currentRole === 'manager' ? userDepartment : 'All';
      getEmployees({ pageSize: 100, department: dept }).then((res) => {
        const empList = res?.data || (Array.isArray(res) ? res : []);
        if (empList && empList.length > 0) {
          setEmployees(empList);

          if (currentRole === 'employee' && currentUser) {
            // Find the employee record matching the logged-in user by email or id
            const self = empList.find((e) =>
              (currentUser.email && e.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
              e.dbId === currentUser.id ||
              e.id === currentUser.id ||
              e.fullName?.toLowerCase() === currentUser.name?.toLowerCase()
            );
            const selfId = self ? (self.dbId || self.id) : (empList[0].dbId || empList[0].id);
            setSelectedEmployeeId(selfId);
          } else {
            setSelectedEmployeeId(empList[0].dbId || empList[0].id);
          }
        } else {
          setEmployees([]);
          setSelectedEmployeeId('');
        }
      });
    }
  }, [isOpen, currentRole, userDepartment, currentUser]);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setTotalDays(days);
      } else {
        setTotalDays(0);
      }
    }
  }, [formData.startDate, formData.endDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (totalDays <= 0) return;

    setIsSubmitting(true);
    try {
      const selectedCat = LEAVE_TYPES.find((lt) => lt.name === formData.leaveType);
      const chosenEmp = employees.find((emp) => emp.id === selectedEmployeeId || emp.dbId === selectedEmployeeId);

      await onSubmit({
        ...formData,
        empId: chosenEmp?.dbId || chosenEmp?.id || selectedEmployeeId,
        empCode: chosenEmp?.id || '',
        empName: chosenEmp?.fullName || chosenEmp?.name || currentUser?.name || 'Staff Member',
        email: chosenEmp?.email || currentUser?.email || '',
        department: chosenEmp?.department || 'General',
        typeCode: selectedCat ? selectedCat.code : 'CASUAL',
        totalDays
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isManagement = currentRole === 'admin' || currentRole === 'manager';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1050,
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
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-lg)',
          background: 'var(--bg-surface, #ffffff)',
          border: '1px solid var(--border-color, #e2e8f0)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarDays size={20} />
            </div>
            {isManagement ? 'Apply Leave for Employee' : 'Apply for Leave'}
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Employee Selector (Admin / Manager) */}
          {isManagement && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Select Employee <span style={{ color: '#ef4444' }}>*</span>
              </label>
              {employees.length > 0 ? (
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.875rem',
                      borderRadius: '10px',
                      background: 'var(--bg-app, #f8fafc)',
                      border: '1px solid var(--border-color, #cbd5e1)',
                      color: 'var(--text-main, #0f172a)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {employees.map((emp) => (
                      <option key={emp.id || emp.dbId} value={emp.id || emp.dbId}>
                        {emp.fullName || emp.name} — {emp.department} {emp.id ? `(${emp.id})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', padding: '0.5rem', background: 'var(--bg-app)', borderRadius: '8px' }}>
                  No employees found in directory. Add employees in Employees section first.
                </div>
              )}
            </div>
          )}

          {/* Leave Category */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Leave Category <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={formData.leaveType}
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
              style={{
                width: '100%',
                padding: '0.6rem 0.875rem',
                borderRadius: '10px',
                background: 'var(--bg-app, #f8fafc)',
                border: '1px solid var(--border-color, #cbd5e1)',
                color: 'var(--text-main, #0f172a)',
                fontSize: '0.875rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {LEAVE_TYPES.map((lt) => (
                <option key={lt.code} value={lt.name}>
                  {lt.name} {!lt.isPaid ? '(Unpaid - Subject to Deduction)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                From Date
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '10px',
                  background: 'var(--bg-app, #f8fafc)',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  color: 'var(--text-main, #0f172a)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                To Date
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '10px',
                  background: 'var(--bg-app, #f8fafc)',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  color: 'var(--text-main, #0f172a)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Duration Summary */}
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e40af', fontWeight: 600 }}>
              <Calculator size={16} /> Total Leave Duration:
            </div>
            <span style={{ fontWeight: 800, color: '#1d4ed8' }}>
              {totalDays} {totalDays === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          {/* Reason */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Reason / Notes <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide reason for leave (e.g., Medical rest, Personal work, Family emergency)..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '10px',
                background: 'var(--bg-app, #f8fafc)',
                border: '1px solid var(--border-color, #cbd5e1)',
                color: 'var(--text-main, #0f172a)',
                fontSize: '0.85rem',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || totalDays <= 0}
              className="btn btn-primary"
              style={{
                background: '#2563eb',
                borderColor: '#2563eb',
                color: '#ffffff',
                fontWeight: 700
              }}
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <CheckCircle2 size={16} /> {isManagement ? 'Grant & Record Leave' : 'Submit Leave Request'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
