import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getAttendanceRecords,
  createAttendanceRecord,
  updateAttendanceRecord,
  getMonthlyAttendanceSummary
} from '../services/attendanceService';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Components
import { AttendanceFormModal } from '../components/attendance/AttendanceFormModal';
import { MonthlyCalendarView } from '../components/attendance/MonthlyCalendarView';
import { AttendanceSummaryCard } from '../components/attendance/AttendanceSummaryCard';

// Icons
import {
  Clock,
  Plus,
  Calendar,
  Filter,
  Search,
  Edit2,
  List,
  Grid,
  Play,
  Square,
  FileCheck,
  Zap
} from 'lucide-react';

export const AttendanceView = () => {
  const { currentRole, currentUser } = useAuth();

  // View mode tab: 'table' or 'calendar'
  const [viewMode, setViewMode] = useState('table');

  // Filters
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [empFilter, setEmpFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Data
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Quick Clock state for employee/admin toggle demo
  const [isCheckedIn, setIsCheckedIn] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await getAttendanceRecords({
      date: selectedDate,
      employeeId: empFilter,
      department: deptFilter,
      status: statusFilter,
      userRole: currentRole,
      userDept: currentUser?.department,
      authEmployeeId: currentUser?.id
    });
    setRecords(data);

    const now = new Date();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentYear = String(now.getFullYear());
    const sum = await getMonthlyAttendanceSummary(
      empFilter === 'All' ? 'All' : empFilter,
      currentMonth,
      currentYear
    );
    setSummary(sum);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedDate, empFilter, deptFilter, statusFilter, currentRole]);

  // Auto-refresh when attendance is marked from any role
  useEffect(() => {
    const handler = () => loadData();
    window.addEventListener('payflow:attendance_updated', handler);
    return () => window.removeEventListener('payflow:attendance_updated', handler);
  }, [selectedDate, empFilter, deptFilter, statusFilter, currentRole]);

  const handleFormSubmit = async (formData) => {
    if (editingRecord) {
      await updateAttendanceRecord(editingRecord.id, formData);
    } else {
      await createAttendanceRecord(formData);
    }
    loadData();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present': return <Badge variant="success" dot>Present</Badge>;
      case 'Half Day': return <Badge variant="warning" dot>Half Day</Badge>;
      case 'Leave': return <Badge variant="info" dot>Leave</Badge>;
      case 'Holiday': return <Badge variant="purple" dot>Holiday</Badge>;
      case 'Absent': return <Badge variant="danger" dot>Absent</Badge>;
      default: return <Badge variant="neutral" dot>{status}</Badge>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Clock size={24} style={{ color: 'var(--primary-400)' }} /> Time & Attendance Management
          </h1>
          <p>
            {currentRole === 'admin' && 'Admin Mode: Full timecard management, overtime calculation & monthly matrix.'}
            {currentRole === 'manager' && `Manager Mode: Monitoring ${currentUser.department} team attendance & logs.`}
            {currentRole === 'employee' && 'Employee Self Service: View your daily timecard and monthly attendance stats.'}
          </p>
        </div>
        <div className="page-actions">
          {(currentRole === 'admin' || currentRole === 'manager') && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingRecord(null);
                setIsFormModalOpen(true);
              }}
            >
              <Plus size={16} /> Add Attendance Record
            </button>
          )}

          {/* View Switcher Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: '0.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'table' ? 'var(--primary-600)' : 'transparent',
                color: viewMode === 'table' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <List size={15} /> Log View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'calendar' ? 'var(--primary-600)' : 'transparent',
                color: viewMode === 'calendar' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Grid size={15} /> Monthly Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Summary Stat Panel */}
      <AttendanceSummaryCard summary={summary} />

      {/* Quick Clock-in Widget */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))', border: '1px solid var(--primary-500)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary-300)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
              Quick Clock Station ({currentUser.name})
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0.2rem 0' }}>
              Tuesday, September 01, 2026
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Standard Shift: <strong style={{ color: '#ffffff' }}>09:00 AM - 05:30 PM (8.0 Regular Hrs)</strong>
            </p>
          </div>

          <div>
            {isCheckedIn ? (
              <button
                className="btn btn-secondary"
                onClick={() => setIsCheckedIn(false)}
                style={{ borderColor: '#ef4444', color: '#ef4444' }}
              >
                <Square size={16} fill="#ef4444" /> Clock Out for Day
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setIsCheckedIn(true)}
              >
                <Play size={16} fill="#ffffff" /> Clock In Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Calendar size={15} /> Select Date:
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.825rem',
              outline: 'none'
            }}
          />

          {currentRole === 'admin' && (
            <>
              <Filter size={15} style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }} />

              {/* Department Filter */}
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
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
              </select>

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
                <option value="Present">Present</option>
                <option value="Half Day">Half Day</option>
                <option value="Leave">Leave</option>
                <option value="Holiday">Holiday</option>
                <option value="Absent">Absent</option>
              </select>
            </>
          )}

          {currentRole === 'manager' && (
            <>
              <Filter size={15} style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }} />

              {/* Status Filter for Manager */}
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
                <option value="Present">Present</option>
                <option value="Half Day">Half Day</option>
                <option value="Leave">Leave</option>
                <option value="Absent">Absent Only</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Main View Content */}
      {loading ? (
        <LoadingSpinner size={36} label="Fetching attendance timecard records..." />
      ) : viewMode === 'calendar' ? (
        <MonthlyCalendarView logs={records} monthName="September 2026" />
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee Code</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Regular Hours</th>
                <th>Overtime</th>
                <th>Status</th>
                <th>Remarks / Shift Notes</th>
                {(currentRole === 'admin' || currentRole === 'manager') && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={currentRole === 'admin' ? 11 : 10} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <Clock size={32} style={{ opacity: 0.3, marginBottom: '0.5rem', display: 'block', margin: '0 auto 0.5rem' }} />
                    {currentRole === 'manager'
                      ? `No attendance records found for ${currentUser.department} team on this date. Records will appear here once your team clocks in.`
                      : 'No attendance records found for the selected filters.'}
                  </td>
                </tr>
              ) : records.map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.date}</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary-400)', fontFamily: 'monospace' }}>{rec.empId}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{rec.empName}</td>
                  <td><Badge variant="info">{rec.department}</Badge></td>
                  <td>{rec.checkIn}</td>
                  <td>{rec.checkOut}</td>
                  <td style={{ fontWeight: 600 }}>{rec.workHours}h</td>
                  <td style={{ fontWeight: 600, color: rec.overtimeHours > 0 ? '#10b981' : 'var(--text-muted)' }}>
                    {rec.overtimeHours > 0 ? `+${rec.overtimeHours}h` : '0h'}
                  </td>
                  <td>{getStatusBadge(rec.status)}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {rec.remarks || 'Standard shift'}
                  </td>
                  {(currentRole === 'admin' || currentRole === 'manager') && (
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-icon"
                        title="Edit Attendance Entry"
                        onClick={() => {
                          setEditingRecord(rec);
                          setIsFormModalOpen(true);
                        }}
                      >
                        <Edit2 size={15} style={{ color: 'var(--primary-400)' }} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Admin Add/Edit Attendance Form Modal */}
      <AttendanceFormModal
        isOpen={isFormModalOpen}
        initialData={editingRecord}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingRecord(null);
        }}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};
