import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle2 } from 'lucide-react';
import { getEmployees } from '../../services/employeeService';

export const MarkAttendanceModal = ({ isOpen, onClose, onSuccess }) => {
  const [employeeList, setEmployeeList] = useState([]);
  const [employee, setEmployee] = useState('');
  const [status, setStatus] = useState('present');
  const [time, setTime] = useState('09:00 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getEmployees({ pageSize: 100 }).then((res) => {
        if (res?.data && res.data.length > 0) {
          setEmployeeList(res.data);
          setEmployee(`${res.data[0].id} - ${res.data[0].fullName}`);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess && onSuccess();
        onClose();
      }, 1000);
    }, 500);
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
          maxWidth: '440px',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
            <Clock size={20} style={{ color: '#10b981' }} /> Mark Daily Attendance
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div style={{ padding: '1.5rem 1rem', textAlign: 'center', color: '#10b981' }}>
            <CheckCircle2 size={42} style={{ margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Attendance Marked!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status recorded for {employee || 'employee'}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Select Employee
              </label>
              <select
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
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
                    <option key={emp.id} value={`${emp.id} - ${emp.fullName}`}>
                      {emp.id} - {emp.fullName}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
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
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="leave">On Leave</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Check In Time
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Recording...' : 'Record Timecard'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
