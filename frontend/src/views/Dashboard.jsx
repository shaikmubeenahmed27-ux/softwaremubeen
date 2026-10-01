import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardMetrics } from '../services/dashboardService';
import { getPayslips } from '../services/payslipService';

// Dashboard Components
import { StatCard } from '../components/dashboard/StatCard';
import { DepartmentChart } from '../components/dashboard/DepartmentChart';
import { PayrollTrendChart } from '../components/dashboard/PayrollTrendChart';
import { AttendanceChart } from '../components/dashboard/AttendanceChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';

// Modals
import { AddEmployeeModal } from '../components/modals/AddEmployeeModal';
import { MarkAttendanceModal } from '../components/modals/MarkAttendanceModal';
import { PayslipModal } from '../components/payslips/PayslipModal';

// Icons
import {
  Users,
  Clock,
  CalendarDays,
  FileCheck,
  DollarSign,
  CreditCard,
  UserPlus,
  RefreshCw,
  FileText,
  CheckCircle,
  ArrowRight,
  Eye
} from 'lucide-react';

export const DashboardView = () => {
  const { currentUser, currentRole, navigateTo } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Employee payslips state
  const [empPayslips, setEmpPayslips] = useState([]);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);

  // Modals state
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isMarkAttendanceOpen, setIsMarkAttendanceOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const metrics = await fetchDashboardMetrics(currentRole, currentUser?.department, currentUser?.id);
    setData(metrics);

    if (currentRole === 'employee') {
      const slips = await getPayslips({
        userRole: 'employee',
        authEmployeeId: currentUser?.id,
        authUserEmail: currentUser?.email
      });
      setEmpPayslips(slips);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('payflow:employees_updated', handleUpdate);
    return () => window.removeEventListener('payflow:employees_updated', handleUpdate);
  }, [currentRole, currentUser]);

  if (loading || !data) {
    return (
      <div style={{ padding: '4rem 0' }}>
        <LoadingSpinner size={36} label="Loading PayFlow HR Dashboard metrics..." />
      </div>
    );
  }

  const { kpi, deptDistribution, payrollHistory, attendanceStats } = data;

  // ----------------------------------------------------
  // ADMIN DASHBOARD
  // ----------------------------------------------------
  if (currentRole === 'admin') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Header */}
        <div className="page-header">
          <div className="page-title-group">
            <h1>Welcome back, {currentUser.name}!</h1>
            <p>System Administrator Overview & Organization Health Indicators.</p>
          </div>
          <div className="page-actions">
            <button className="btn btn-secondary" onClick={loadData} title="Refresh Metrics">
              <RefreshCw size={15} /> Refresh Data
            </button>
          </div>
        </div>

        {/* 5 Statistics Cards */}
        <div className="grid grid-cols-5">
          <StatCard
            title="Total Employees"
            value={kpi.totalEmployees}
            subtext="Company Headcount"
            icon={Users}
            iconBg="rgba(59, 130, 246, 0.12)"
            badgeText="Total"
            badgeVariant="info"
          />

          <StatCard
            title="Present Today"
            value={kpi.presentToday}
            subtext="Clocked In"
            icon={Clock}
            iconBg="rgba(16, 185, 129, 0.12)"
            badgeText={`${kpi.activeEmployees > 0 ? Math.round((kpi.presentToday / kpi.activeEmployees) * 100) : 0}% Rate`}
            badgeVariant="success"
          />

          <StatCard
            title="Employees on Leave"
            value={kpi.onLeaveToday}
            subtext="Approved Absences"
            icon={CalendarDays}
            iconBg="rgba(168, 85, 247, 0.12)"
            badgeText="On Leave"
            badgeVariant="purple"
          />

          <StatCard
            title="Pending Leave Requests"
            value={kpi.pendingLeaves}
            subtext="Action Required"
            icon={FileCheck}
            iconBg="rgba(245, 158, 11, 0.12)"
            badgeText="Review"
            badgeVariant="warning"
          />

          <StatCard
            title="Current Month Payroll"
            value={`$${kpi.currentMonthPayroll.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            subtext="Processed Total"
            icon={DollarSign}
            iconBg="rgba(59, 130, 246, 0.12)"
            badgeText="Disbursed"
            badgeVariant="success"
          />
        </div>

        {/* Split Grid: Attendance Chart & Admin Executive Actions */}
        <div className="grid grid-cols-2">
          <AttendanceChart stats={attendanceStats} />

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
            <h2 className="card-title">Admin Actions</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Executive shortcuts to manage company headcount, approve leave, and run monthly payroll.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button className="btn btn-primary" onClick={() => setIsAddEmployeeOpen(true)} style={{ justifyContent: 'space-between' }}>
                <span><UserPlus size={16} /> Add New Employee to Directory</span>
                <ArrowRight size={16} />
              </button>
              <button className="btn btn-secondary" onClick={() => navigateTo('payroll')} style={{ justifyContent: 'space-between' }}>
                <span><CreditCard size={16} /> Run & Process Monthly Payroll Engine</span>
                <ArrowRight size={16} />
              </button>
              <button className="btn btn-secondary" onClick={() => navigateTo('leave')} style={{ justifyContent: 'space-between' }}>
                <span><FileCheck size={16} /> Review Pending Leave Requests ({kpi.pendingLeaves})</span>
                <ArrowRight size={16} />
              </button>
              <button className="btn btn-secondary" onClick={() => setIsMarkAttendanceOpen(true)} style={{ justifyContent: 'space-between' }}>
                <span><Clock size={16} /> Log Employee Attendance Record</span>
                <ArrowRight size={16} />
              </button>
              <button className="btn btn-secondary" onClick={() => navigateTo('employees')} style={{ justifyContent: 'space-between' }}>
                <span><Users size={16} /> Manage Company Employee Directory</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-2">
          <PayrollTrendChart data={payrollHistory} />
          <DepartmentChart data={deptDistribution} />
        </div>

        {/* Quick Action Modals */}
        <AddEmployeeModal
          isOpen={isAddEmployeeOpen}
          onClose={() => setIsAddEmployeeOpen(false)}
          onSuccess={loadData}
        />

        <MarkAttendanceModal
          isOpen={isMarkAttendanceOpen}
          onClose={() => setIsMarkAttendanceOpen(false)}
          onSuccess={loadData}
        />
      </div>
    );
  }

  // ----------------------------------------------------
  // MANAGER DASHBOARD
  // ----------------------------------------------------
  if (currentRole === 'manager') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Header */}
        <div className="page-header">
          <div className="page-title-group">
            <h1>Welcome back, {currentUser.name}!</h1>
            <p>Department Overview for <strong>{currentUser.department}</strong>.</p>
          </div>
          <div className="page-actions">
            <button className="btn btn-secondary" onClick={loadData} title="Refresh Metrics">
              <RefreshCw size={15} /> Refresh Data
            </button>
          </div>
        </div>

        {/* 4 Statistics */}
        <div className="grid grid-cols-4">
          <StatCard
            title="Team Members"
            value={kpi.totalEmployees}
            subtext={`${currentUser.department} Dept`}
            icon={Users}
            iconBg="rgba(59, 130, 246, 0.12)"
            badgeText="Team"
            badgeVariant="info"
          />

          <StatCard
            title="Present Today"
            value={kpi.presentToday}
            subtext="Clocked In"
            icon={Clock}
            iconBg="rgba(16, 185, 129, 0.12)"
            badgeText={`${kpi.totalEmployees > 0 ? Math.round((kpi.presentToday / kpi.totalEmployees) * 100) : 0}% Rate`}
            badgeVariant="success"
          />

          <StatCard
            title="Employees on Leave"
            value={kpi.onLeaveToday}
            subtext="Approved Out"
            icon={CalendarDays}
            iconBg="rgba(168, 85, 247, 0.12)"
            badgeText="On Leave"
            badgeVariant="purple"
          />

          <StatCard
            title="Pending Leave Requests"
            value={kpi.pendingLeaves}
            subtext="Requires Review"
            icon={FileCheck}
            iconBg="rgba(245, 158, 11, 0.12)"
            badgeText="Action Needed"
            badgeVariant="warning"
          />
        </div>

        {/* Minimal Chart & Quick Links */}
        <div className="grid grid-cols-2">
          <AttendanceChart stats={attendanceStats} />

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
            <h2 className="card-title">Manager Actions</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Quick shortcuts to manage department attendance and approve team leave requests.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button className="btn btn-primary" onClick={() => navigateTo('leave')} style={{ justifyContent: 'space-between' }}>
                <span><FileCheck size={16} /> Review Pending Team Leave Requests ({kpi.pendingLeaves})</span>
                <ArrowRight size={16} />
              </button>
              <button className="btn btn-secondary" onClick={() => navigateTo('employees')} style={{ justifyContent: 'space-between' }}>
                <span><Users size={16} /> View Team Members Directory</span>
                <ArrowRight size={16} />
              </button>
              <button className="btn btn-secondary" onClick={() => navigateTo('attendance')} style={{ justifyContent: 'space-between' }}>
                <span><Clock size={16} /> Check Team Daily Attendance Logs</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // EMPLOYEE DASHBOARD
  // ----------------------------------------------------
  const latestPayslip = empPayslips.length > 0 ? empPayslips[0] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Welcome, {currentUser.name}!</h1>
          <p>Employee Self Service Overview.</p>
        </div>
      </div>

      {/* 5 Statistics */}
      <div className="grid grid-cols-5">
        <StatCard
          title="My Salary"
          value={latestPayslip ? `$${(latestPayslip.netSalary || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : "$0.00"}
          subtext="Net Monthly Pay"
          icon={DollarSign}
          iconBg="rgba(16, 185, 129, 0.12)"
          badgeText="Active"
          badgeVariant="success"
        />

        <StatCard
          title="Attendance"
          value={attendanceStats.rate}
          subtext={`${kpi.presentToday} Days Present`}
          icon={Clock}
          iconBg="rgba(59, 130, 246, 0.12)"
          badgeText="Present Rate"
          badgeVariant="info"
        />

        <StatCard
          title="Leave Balance"
          value="0 Days"
          subtext="Available Paid Leave"
          icon={CalendarDays}
          iconBg="rgba(168, 85, 247, 0.12)"
          badgeText="Available"
          badgeVariant="purple"
        />

        <StatCard
          title="Latest Payslip"
          value={latestPayslip ? `$${(latestPayslip.netSalary || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : "No payslips available"}
          subtext={latestPayslip ? `Issued: ${latestPayslip.paymentDate}` : "Disbursed $0.00"}
          icon={FileText}
          iconBg="rgba(16, 185, 129, 0.12)"
          badgeText={latestPayslip ? "Disbursed" : "Status"}
          badgeVariant={latestPayslip ? "success" : "neutral"}
        />

        <StatCard
          title="Pending Leave Request"
          value={`${kpi.pendingLeaves} Pending`}
          subtext="Up to date"
          icon={CheckCircle}
          iconBg="rgba(245, 158, 11, 0.12)"
          badgeText="Status"
          badgeVariant="neutral"
        />
      </div>

      {/* Dedicated My Payslips Section */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} style={{ color: 'var(--primary-400)' }} /> My Payslips
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
              View and download your official monthly payslip statements.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => navigateTo('payslips')} style={{ fontSize: '0.8rem' }}>
            View All ({empPayslips.length}) <ArrowRight size={14} />
          </button>
        </div>

        {empPayslips.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
            <FileText size={32} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>No payslips available.</div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Your payslips will automatically appear here once published by HR/Admin.</div>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payslip ID</th>
                  <th>Pay Period</th>
                  <th>Payment Date</th>
                  <th>Gross Salary</th>
                  <th>Net Disbursed Pay</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {empPayslips.slice(0, 3).map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary-400)', fontFamily: 'monospace' }}>{p.id}</td>
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
                          setIsPayslipModalOpen(true);
                        }}
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      >
                        <Eye size={14} /> View / Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Simple Employee Actions Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 className="card-title">My Shortcuts</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => navigateTo('leave')}>
            <CalendarDays size={16} /> Apply for Leave
          </button>
          <button className="btn btn-secondary" onClick={() => navigateTo('attendance')}>
            <Clock size={16} /> Clock In / View Attendance
          </button>
          <button className="btn btn-secondary" onClick={() => navigateTo('payslips')}>
            <FileText size={16} /> Open Payslips Repository
          </button>
          <button className="btn btn-secondary" onClick={() => navigateTo('profile')}>
            <Users size={16} /> View My Profile
          </button>
        </div>
      </div>

      {/* Payslip Modal for Employee Dashboard */}
      <PayslipModal
        isOpen={isPayslipModalOpen}
        payslip={selectedPayslip}
        onClose={() => {
          setIsPayslipModalOpen(false);
          setSelectedPayslip(null);
        }}
      />
    </div>
  );
};
export default DashboardView;
