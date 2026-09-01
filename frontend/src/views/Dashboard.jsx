import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardMetrics } from '../services/dashboardService';

// Dashboard Components
import { StatCard } from '../components/dashboard/StatCard';
import { DepartmentChart } from '../components/dashboard/DepartmentChart';
import { PayrollTrendChart } from '../components/dashboard/PayrollTrendChart';
import { AttendanceChart } from '../components/dashboard/AttendanceChart';
import { LeaveStatsChart } from '../components/dashboard/LeaveStatsChart';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Modals
import { AddEmployeeModal } from '../components/modals/AddEmployeeModal';
import { MarkAttendanceModal } from '../components/modals/MarkAttendanceModal';

// Icons
import {
  Users,
  UserCheck,
  Clock,
  CalendarDays,
  FileCheck,
  DollarSign,
  CreditCard,
  Building2,
  UserPlus,
  BarChart3,
  RefreshCw
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
    const metrics = await fetchDashboardMetrics();
    setData(metrics);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div style={{ padding: '4rem 0' }}>
        <LoadingSpinner size={36} label="Loading PayFlow HR Dashboard metrics from database..." />
      </div>
    );
  }

  const { kpi, deptDistribution, payrollHistory, attendanceStats, leaveStats, recentActivities } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Dashboard Top Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Welcome back, {currentUser.name}!</h1>
          <p>Real-time {currentRole.toUpperCase()} executive summary & database performance indicators.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={loadData} title="Refresh Database Metrics">
            <RefreshCw size={15} /> Refresh Data
          </button>
        </div>
      </div>

      {/* Quick Action Buttons Toolbar */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
          border: '1px solid var(--primary-500)',
          padding: '1rem 1.25rem'
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-300)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          Quick Operational Actions
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
            <CreditCard size={16} /> Create Payroll
          </button>
          <button className="btn btn-secondary" onClick={() => navigateTo('reports')}>
            <BarChart3 size={16} /> View Reports
          </button>
        </div>
      </div>

      {/* 8 KPI Stat Cards Grid */}
      <div className="grid grid-cols-4">
        <StatCard
          title="Total Employees"
          value={kpi.totalEmployees}
          subtext="Headcount in DB"
          icon={Users}
          iconBg="rgba(59, 130, 246, 0.12)"
          badgeText="+4 New"
          badgeVariant="success"
        />

        <StatCard
          title="Active Employees"
          value={kpi.activeEmployees}
          subtext="On Active Duty"
          icon={UserCheck}
          iconBg="rgba(16, 185, 129, 0.12)"
          badgeText="Active"
          badgeVariant="success"
        />

        <StatCard
          title="Present Today"
          value={kpi.presentToday}
          subtext="Clocked In"
          icon={Clock}
          iconBg="rgba(59, 130, 246, 0.12)"
          badgeText={`${Math.round((kpi.presentToday / kpi.activeEmployees) * 100)}% Rate`}
          badgeVariant="info"
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

        <StatCard
          title="Current Month Payroll"
          value={`\$${kpi.currentMonthPayroll.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtext="Aug 2026 Batch"
          icon={DollarSign}
          iconBg="rgba(168, 85, 247, 0.12)"
          badgeText="Processed"
          badgeVariant="purple"
        />

        <StatCard
          title="Pending Payroll"
          value={`\$${kpi.pendingPayroll.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtext="Unprocessed Items"
          icon={CreditCard}
          iconBg="rgba(245, 158, 11, 0.12)"
          badgeText="Pending"
          badgeVariant="warning"
        />

        <StatCard
          title="Number of Departments"
          value={kpi.totalDepartments}
          subtext="Active Units"
          icon={Building2}
          iconBg="rgba(59, 130, 246, 0.12)"
          badgeText="Configured"
          badgeVariant="info"
        />
      </div>

      {/* 4 Interactive Analytics Charts Grid */}
      <div className="grid grid-cols-2">
        <DepartmentChart data={deptDistribution} />
        <PayrollTrendChart data={payrollHistory} />
        <AttendanceChart stats={attendanceStats} />
        <LeaveStatsChart stats={leaveStats} />
      </div>

      {/* Recent Activities Section */}
      <RecentActivityFeed activities={recentActivities} />

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
};
