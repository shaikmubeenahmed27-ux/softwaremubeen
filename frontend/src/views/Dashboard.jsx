import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardMetrics } from '../services/dashboardService';

// Dashboard Components
import { StatCard } from '../components/dashboard/StatCard';
import { DepartmentChart } from '../components/dashboard/DepartmentChart';
import { PayrollTrendChart } from '../components/dashboard/PayrollTrendChart';
import { AttendanceChart } from '../components/dashboard/AttendanceChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Modals
import { AddEmployeeModal } from '../components/modals/AddEmployeeModal';
import { MarkAttendanceModal } from '../components/modals/MarkAttendanceModal';

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
  ArrowRight
} from 'lucide-react';

export const DashboardView = () => {
  const { currentUser, currentRole, navigateTo } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isMarkAttendanceOpen, setIsMarkAttendanceOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const metrics = await fetchDashboardMetrics(currentRole, currentUser?.department, currentUser?.id);
    setData(metrics);
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
            <p>Admin Overview & Executive Payroll Indicators.</p>
          </div>
          <div className="page-actions">
            <button className="btn btn-secondary" onClick={loadData} title="Refresh Metrics">
              <RefreshCw size={15} /> Refresh Data
            </button>
          </div>
        </div>

        {/* 4 Quick Actions */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
            border: '1px solid var(--primary-500)',
            padding: '1rem 1.25rem'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-300)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Quick Actions
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={() => setIsAddEmployeeOpen(true)}>
              <UserPlus size={16} /> Add Employee
            </button>
            <button className="btn btn-secondary" onClick={() => setIsMarkAttendanceOpen(true)}>
              <Clock size={16} /> Mark Attendance
            </button>
            <button className="btn btn-secondary" onClick={() => navigateTo('leave')}>
              <FileCheck size={16} /> Review Leave
            </button>
            <button className="btn btn-secondary" onClick={() => navigateTo('payroll')}>
              <CreditCard size={16} /> Process Payroll
            </button>
          </div>
        </div>

        {/* 5 Statistics */}
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

        {/* 3 Charts Grid */}
        <div className="grid grid-cols-3">
          <PayrollTrendChart data={payrollHistory} />
          <DepartmentChart data={deptDistribution} />
          <AttendanceChart stats={attendanceStats} />
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
          value="$0.00"
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
          value="None"
          subtext="Disbursed $0.00"
          icon={FileText}
          iconBg="rgba(16, 185, 129, 0.12)"
          badgeText="Status"
          badgeVariant="success"
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
            <FileText size={16} /> Download Latest Payslip PDF
          </button>
          <button className="btn btn-secondary" onClick={() => navigateTo('profile')}>
            <Users size={16} /> View My Profile
          </button>
        </div>
      </div>
    </div>
  );
};
