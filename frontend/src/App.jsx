import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Views
import { LandingPageView } from './views/LandingPage';
import { LoginView } from './views/Login';
import { ForgotPasswordView } from './views/ForgotPassword';
import { ResetPasswordView } from './views/ResetPassword';
import { DashboardView } from './views/Dashboard';
import { EmployeesView } from './views/Employees';
import { DepartmentsView } from './views/Departments';
import { DesignationsView } from './views/Designations';
import { AttendanceView } from './views/Attendance';
import { LeaveView } from './views/Leave';
import { SalaryView } from './views/Salary';
import { PayrollView } from './views/Payroll';
import { PayslipsView } from './views/Payslips';
import { ReportsView } from './views/Reports';
import { NotificationsView } from './views/Notifications';
import { AuditLogsView } from './views/AuditLogs';
import { SettingsView } from './views/Settings';

const MainContent = () => {
  const { isAuthenticated, currentRoute } = useAuth();

  // Landing Page is the default entry point
  if (currentRoute === 'landing') {
    return <LandingPageView />;
  }

  if (currentRoute === 'login' || !isAuthenticated) {
    return <LoginView />;
  }

  if (currentRoute === 'forgot-password') {
    return <ForgotPasswordView />;
  }

  if (currentRoute === 'reset-password') {
    return <ResetPasswordView />;
  }

  const renderView = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardView />;
      case 'employees':
        return (
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <EmployeesView />
          </ProtectedRoute>
        );
      case 'departments':
        return (
          <ProtectedRoute allowedRoles={['admin']}>
            <DepartmentsView />
          </ProtectedRoute>
        );
      case 'designations':
        return (
          <ProtectedRoute allowedRoles={['admin']}>
            <DesignationsView />
          </ProtectedRoute>
        );
      case 'attendance':
        return <AttendanceView />;
      case 'leave':
        return (
          <ProtectedRoute allowedRoles={['admin', 'manager', 'employee']}>
            <LeaveView />
          </ProtectedRoute>
        );
      case 'salary':
        return (
          <ProtectedRoute allowedRoles={['admin']}>
            <SalaryView />
          </ProtectedRoute>
        );
      case 'payroll':
        return (
          <ProtectedRoute allowedRoles={['admin']}>
            <PayrollView />
          </ProtectedRoute>
        );
      case 'payslips':
        return <PayslipsView />;
      case 'reports':
        return (
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <ReportsView />
          </ProtectedRoute>
        );
      case 'notifications':
        return <NotificationsView />;
      case 'audit-logs':
        return (
          <ProtectedRoute allowedRoles={['admin']}>
            <AuditLogsView />
          </ProtectedRoute>
        );
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return <AppShell>{renderView()}</AppShell>;
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
