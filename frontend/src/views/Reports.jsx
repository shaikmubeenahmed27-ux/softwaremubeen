import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateReportData, exportReportToCSV } from '../services/reportService';
import { getEmployees } from '../services/employeeService';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Components
import { ReportSummaryCards } from '../components/reports/ReportSummaryCards';
import { ReportCharts } from '../components/reports/ReportCharts';

// Icons
import {
  BarChart3,
  Download,
  Printer,
  Filter,
  Clock,
  CalendarDays,
  CreditCard,
  Users,
  Inbox,
  UserCheck,
  User,
  Building2
} from 'lucide-react';

export const ReportsView = () => {
  const { currentRole, currentUser } = useAuth();

  // Active Report Category
  const [reportType, setReportType] = useState(currentRole === 'admin' ? 'payroll' : 'attendance');

  // Filters
  const [month, setMonth] = useState('September 2026');
  const [deptFilter, setDeptFilter] = useState('All');
  const [empFilter, setEmpFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Directory Employee List for filter dropdown
  const [employeeOptions, setEmployeeOptions] = useState([]);

  // Data
  const [reportData, setReportData] = useState({ title: '', summary: {}, rows: [] });
  const [loading, setLoading] = useState(true);

  // Load employee directory options on mount (scoped for manager)
  useEffect(() => {
    async function loadEmpList() {
      try {
        const activeDept = currentRole === 'manager' ? currentUser?.department : 'All';
        const res = await getEmployees({ pageSize: 100, department: activeDept });
        setEmployeeOptions(res?.data || []);
      } catch (err) {
        console.warn('Could not load employee options for filter:', err);
      }
    }
    loadEmpList();
  }, [currentRole, currentUser]);

  // When reportType changes, reset status filter to 'All'
  const handleTabChange = (type) => {
    setReportType(type);
    setStatusFilter('All');
  };

  const loadReport = async () => {
    setLoading(true);
    const activeDept = currentRole === 'manager' ? currentUser?.department : deptFilter;
    const res = await generateReportData({
      reportType,
      month,
      department: activeDept,
      employeeId: empFilter,
      status: statusFilter,
      userRole: currentRole,
      userDept: currentUser?.department || 'Executive',
      authEmployeeId: currentUser?.id || ''
    });
    setReportData(res || { title: '', summary: {}, rows: [] });
    setLoading(false);
  };

  useEffect(() => {
    loadReport();
  }, [reportType, month, deptFilter, empFilter, statusFilter, currentRole, currentUser]);

  const handleExportCSV = () => {
    exportReportToCSV(reportType, reportData);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusOptions = () => {
    switch (reportType) {
      case 'payroll':
        return [
          { value: 'All', label: 'All Statuses' },
          { value: 'Calculated', label: 'Calculated' },
          { value: 'Disbursed', label: 'Disbursed' },
          { value: 'Projected', label: 'Projected' }
        ];
      case 'attendance':
        return [
          { value: 'All', label: 'All Statuses' },
          { value: 'Present', label: 'Present' },
          { value: 'Late', label: 'Late Punch In' },
          { value: 'Absent', label: 'Absent' }
        ];
      case 'leave':
        return [
          { value: 'All', label: 'All Statuses' },
          { value: 'Approved', label: 'Approved' },
          { value: 'Pending', label: 'Pending' },
          { value: 'Rejected', label: 'Rejected' }
        ];
      case 'employee':
      default:
        return [
          { value: 'All', label: 'All Statuses' },
          { value: 'Active', label: 'Active' },
          { value: 'Terminated', label: 'Terminated' }
        ];
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <BarChart3 size={24} style={{ color: 'var(--primary-400)' }} />
            {currentRole === 'admin' && 'Company Executive Reports & Global Analytics'}
            {currentRole === 'manager' && `Department Team Reports — ${currentUser?.department || 'Department'}`}
            {currentRole === 'employee' && 'My Personal Activity & Performance Reports'}
          </h1>
          <p>
            {currentRole === 'admin' && 'Cross-department financial audits, company-wide punctuality, leave liabilities, and staff headcounts.'}
            {currentRole === 'manager' && `Team attendance, punctuality, and leave utilization analytics for ${currentUser?.department || 'your department'}.`}
            {currentRole === 'employee' && 'Review your personal attendance timesheets, leave allowance history, and monthly payslip compensation summaries.'}
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} /> Print Report
          </button>
          <button className="btn btn-primary" onClick={handleExportCSV}>
            <Download size={16} /> Export to CSV
          </button>
        </div>
      </div>

      {/* Category Report Switcher Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: 'var(--bg-surface)', padding: '0.4rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        {(currentRole === 'admin'
          ? [
              { id: 'payroll', label: '1. Payroll Report', icon: CreditCard },
              { id: 'attendance', label: '2. Attendance Report', icon: Clock },
              { id: 'leave', label: '3. Leave Report', icon: CalendarDays },
              { id: 'employee', label: '4. Employee Directory Report', icon: Users }
            ]
          : currentRole === 'manager'
          ? [
              { id: 'attendance', label: '1. Team Attendance Report', icon: Clock },
              { id: 'leave', label: '2. Team Leave Report', icon: CalendarDays },
              { id: 'employee', label: '3. Department Roster Report', icon: Users }
            ]
          : [
              { id: 'attendance', label: '1. My Attendance Logs', icon: Clock },
              { id: 'leave', label: '2. My Leave Records', icon: CalendarDays },
              { id: 'payroll', label: '3. My Payslips & Payouts', icon: CreditCard }
            ]
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = reportType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--primary-600)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.825rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={15} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Summary KPI Cards */}
      <ReportSummaryCards summary={reportData.summary} />

      {/* Multi-Filter Toolbar */}
      <div className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Filter size={15} style={{ color: 'var(--text-muted)' }} />

          {/* Month Filter */}
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
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
            <option value="September 2026">September 2026</option>
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
          </select>

          {/* Role-Specific Department Indicator */}
          {currentRole === 'employee' && (
            <span
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10b981',
                color: '#059669',
                fontSize: '0.825rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <User size={14} /> Personal Records ({currentUser?.name})
            </span>
          )}

          {currentRole === 'manager' && (
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
              <Building2 size={14} /> {currentUser?.department}
            </span>
          )}

          {currentRole === 'admin' && (
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
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Departments</option>
              <option value="Executive">Executive</option>
              <option value="Engineering & Tech">Engineering & Tech</option>
              <option value="Finance & Accounting">Finance & Accounting</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Operations">Operations</option>
            </select>
          )}

          {/* Employee Filter: Admin and Manager only */}
          {currentRole !== 'employee' && employeeOptions.length > 0 && (
            <select
              value={empFilter}
              onChange={(e) => setEmpFilter(e.target.value)}
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
              <option value="All">{currentRole === 'manager' ? 'All Team Members' : 'All Employees'}</option>
              {employeeOptions.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName || emp.name} ({emp.id})
                </option>
              ))}
            </select>
          )}

          {/* Dynamic Status Filter */}
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
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {getStatusOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Showing records for <strong>{reportData.title || 'Analytics'}</strong>
        </div>
      </div>

      {/* Main Grid: Data Table & Charts */}
      {loading ? (
        <LoadingSpinner size={36} label="Processing analytics database queries..." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
          {/* Data Table (2 Cols) */}
          <div>
            {!reportData.rows || reportData.rows.length === 0 ? (
              <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'var(--bg-app)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem'
                }}>
                  <Inbox size={22} />
                </div>
                <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  No Records Found For This Report
                </h3>
                <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Try changing your filter criteria or switch to another report tab.
                </p>
              </div>
            ) : (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      {Object.keys(reportData.rows[0]).map((key) => (
                        <th key={key} style={{ textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.rows.map((row, idx) => (
                      <tr key={idx}>
                        {Object.entries(row).map(([key, val], i) => {
                          const strVal = String(val);
                          const isStatus = key.toLowerCase().includes('status');
                          return (
                            <td key={i} style={{ fontWeight: i === 0 ? 600 : 400 }}>
                              {isStatus ? (
                                <Badge variant={
                                  strVal.toLowerCase() === 'active' || strVal.toLowerCase() === 'approved' || strVal.toLowerCase() === 'present' || strVal.toLowerCase() === 'processed' || strVal.toLowerCase() === 'calculated'
                                    ? 'success'
                                    : strVal.toLowerCase() === 'pending' || strVal.toLowerCase() === 'projected'
                                    ? 'warning'
                                    : 'neutral'
                                }>
                                  {strVal}
                                </Badge>
                              ) : (
                                strVal
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Analytical Charts Widget (1 Col) */}
          <div>
            <ReportCharts reportType={reportType} rows={reportData.rows} />
          </div>
        </div>
      )}
    </div>
  );
};
export default ReportsView;
