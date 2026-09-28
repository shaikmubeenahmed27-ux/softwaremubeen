import React, { useState, useEffect } from 'react';
import { X, Clock, Calculator, CheckCircle2 } from 'lucide-react';
import { calculateShiftHours } from '../../services/attendanceService';
import { getEmployees } from '../../services/employeeService';

export const AttendanceFormModal = ({ isOpen, initialData = null, onClose, onSubmit }) => {
  const isEdit = Boolean(initialData);
  const [employeeList, setEmployeeList] = useState([]);

  const [formData, setFormData] = useState({
    empId: '',
    employeeDbId: '',
    empName: '',
    department: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:00 AM',
    checkOut: '05:00 PM',
    status: 'Present',
    remarks: ''
  });

  const [computed, setComputed] = useState({ workHours: 8.0, overtimeHours: 0.0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getEmployees({ pageSize: 100 }).then((res) => {
        if (res?.data && res.data.length > 0) {
          setEmployeeList(res.data);
          if (!initialData && !formData.empId) {
            setFormData((prev) => ({
              ...prev,
              empId: res.data[0].id,
              employeeDbId: res.data[0].dbId || res.data[0].id,
              empName: res.data[0].fullName,
              department: res.data[0].department || 'General'
            }));
          }
        }
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        empId: initialData.empId || '',
        empName: initialData.empName || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        checkIn: initialData.checkIn || '09:00 AM',
        checkOut: initialData.checkOut || '05:00 PM',
        status: initialData.status || 'Present',
        remarks: initialData.remarks || ''
      });
    }
  }, [initialData, isOpen]);

  // Recalculate work & overtime hours automatically when checkIn / checkOut changes
  useEffect(() => {
    if (formData.status === 'Absent' || formData.status === 'Leave' || formData.status === 'Holiday') {
      setComputed({ workHours: 0.0, overtimeHours: 0.0 });
    } else {
      const res = calculateShiftHours(formData.checkIn, formData.checkOut, 8.0);
      setComputed(res);
    }
  }, [formData.checkIn, formData.checkOut, formData.status]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        workHours: computed.workHours,
        overtimeHours: computed.overtimeHours
      });
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
          maxWidth: '540px',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
            <Clock size={20} style={{ color: 'var(--primary-400)' }} />
            <span>{isEdit ? 'Edit Attendance Record' : 'Add Attendance Entry'}</span>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Employee
              </label>
              <select
                value={formData.empId}
                onChange={(e) => {
                  const selectedEmp = employeeList.find((emp) => emp.id === e.target.value);
                  setFormData({
                    ...formData,
                    empId: e.target.value,
                    employeeDbId: selectedEmp?.dbId || e.target.value,
                    empName: selectedEmp?.fullName || '',
                    department: selectedEmp?.department || 'General'
                  });
                }}
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
                {employeeList.length === 0 ? (
                  <option value="">No employees found</option>
                ) : (
                  employeeList.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.id} - {emp.fullName}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                <option value="Present">Present</option>
                <option value="Half Day">Half Day</option>
                <option value="Leave">Leave</option>
                <option value="Holiday">Holiday</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Check-in Time
              </label>
              <input
                type="text"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                placeholder="08:30 AM"
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

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Check-out Time
              </label>
              <input
                type="text"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                placeholder="05:30 PM"
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

          {/* Auto Calculation Preview Banner */}
          <div
            style={{
              padding: '0.875rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid var(--primary-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-300)', fontWeight: 600 }}>
              <Calculator size={16} /> Auto Shift Calculation:
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div>Work: <strong style={{ color: '#ffffff' }}>{computed.workHours} hrs</strong></div>
              <div>Overtime: <strong style={{ color: '#10b981' }}>+{computed.overtimeHours} hrs</strong></div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Shift Remarks / Notes
            </label>
            <textarea
              rows={2}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Add optional notes (e.g., Extended evening release build support)..."
              style={{
                width: '100%',
                padding: '0.55rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving Timecard...' : isEdit ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
