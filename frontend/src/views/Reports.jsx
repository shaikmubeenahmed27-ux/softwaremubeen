import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateReportData, exportReportToCSV } from '../services/reportService';
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
  Calendar,
  Users,
  Clock,
  CalendarDays,
  CreditCard,
  Building2,
  Zap
} from 'lucide-react';

export const ReportsView = () => {
  const { currentRole, currentUser } = useAuth();

  // Active Report Category
  const [reportType, setReportType] = useState(currentRole === 'admin' ? 'payroll' : 'attendance');

  // Filters
  const [month, setMonth] = useState('August 2026');
  const [deptFilter, setDeptFilter] = useState('All');
  const [empFilter, setEmpFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Data
  const [reportData, setReportData] = useState({ title: '', summary: {}, rows: [] });
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    setLoading(true);
    const res = await generateReportData({
      reportType,
      month,
      department: deptFilter,
      employeeId: empFilter,
      status: statusFilter,
      userRole: currentRole,
      userDept: currentUser.department,
      authEmployeeId: currentUser.id
    });
    setReportData(res);
    setLoading(false);
  };

  useEffect(() => {
    loadReport();
  }, [reportType, month, deptFilter, empFilter, statusFilter, currentRole]);

  const handleExportCSV = () => {
    exportReportToCSV(reportType, reportData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <BarChart3 size={24} style={{ color: 'var(--primary-400)' }} /> Reports & Analytics Hub
          </h1>
          <p>
            {currentRole === 'admin' && 'Admin Mode: Executive reporting across all organizational metrics & departments.'}
            {currentRole === 'manager' && `Manager Mode: Departmental analytics for ${currentUser.department}.`}
            {currentRole === 'employee' && 'Employee Self Service: View personal attendance, leave, and compensation reports.'}
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
              { id: 'employee', label: '4. Employee Report', icon: Users }
            ]
          : [
              { id: 'attendance', label: '1. Team Attendance Report', icon: Clock },
              { id: 'leave', label: '2. Team Leave Report', icon: CalendarDays },
              { id: 'employee', label: '3. Department Employee Report', icon: Users }
            ]
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = reportType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
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
                cursor: 'pointer'
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
              outline: 'none'
            }}
          >
            <option value="August 2026">August 2026</option>
            <option value="September 2026">September 2026</option>
            <option value="July 2026">July 2026</option>
          </select>

          {/* Department Filter (Admin Only) */}
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
                outline: 'none'
              }}
            >
              <option value="All">All Departments</option>
              <option value="Executive">Executive</option>
              <option value="Engineering & Tech">Engineering & Tech</option>
              <option value="Finance & Accounting">Finance & Accounting</option>
              <option value="Product & Design">Product & Design</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
            </select>
          )}

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
            <option value="Active">Active</option>
            <option value="Approved">Approved</option>
            <option value="Processed">Processed</option>
          </select>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Showing database records for <strong>{reportData.title}</strong>
        </div>
      </div>

      {/* Main Grid: Data Table & Charts */}
      {loading ? (
        <LoadingSpinner size={36} label="Processing analytics database queries..." />
      ) : (
        <div className="grid grid-cols-3" style={{ gap: '1.25rem' }}>
          {/* Data Table (2 Cols) */}
          <div style={{ gridColumn: 'span 2' }}>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    {reportData.rows.length > 0 &&
                      Object.keys(reportData.rows[0]).map((key) => (
                        <th key={key} style={{ textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.rows.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, i) => (
                        <td key={i} style={{ fontWeight: i === 0 ? 600 : 400 }}>
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytical Charts Widget (1 Col) */}
          <div>
            <ReportCharts reportType={reportType} />
          </div>
        </div>
      )}
    </div>
  );
};
