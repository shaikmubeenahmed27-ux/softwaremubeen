// Role-based navigation structure for PayFlow HR

export const NAV_ITEMS = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
    { id: 'employees', label: 'Employees', icon: 'Users', path: '/employees' },
    { id: 'attendance', label: 'Attendance', icon: 'Clock', path: '/attendance' },
    { id: 'leave', label: 'Leave', icon: 'CalendarDays', path: '/leave' },
    { id: 'salary', label: 'Salary', icon: 'DollarSign', path: '/salary' },
    { id: 'payroll', label: 'Payroll', icon: 'CreditCard', path: '/payroll' },
    { id: 'payslips', label: 'Payslips', icon: 'FileText', path: '/payslips' },
    { id: 'reports', label: 'Reports', icon: 'BarChart3', path: '/reports' },
    { id: 'settings', label: 'Settings', icon: 'Settings', path: '/settings' }
  ],

  manager: [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
    { id: 'employees', label: 'Team', icon: 'Users', path: '/employees' },
    { id: 'attendance', label: 'Attendance', icon: 'Clock', path: '/attendance' },
    { id: 'leave', label: 'Leave', icon: 'CalendarDays', path: '/leave' },
    { id: 'reports', label: 'Reports', icon: 'BarChart3', path: '/reports' }
  ],

  employee: [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
    { id: 'profile', label: 'My Profile', icon: 'User', path: '/profile' },
    { id: 'attendance', label: 'Attendance', icon: 'Clock', path: '/attendance' },
    { id: 'leave', label: 'Leave', icon: 'CalendarDays', path: '/leave' },
    { id: 'salary', label: 'Salary', icon: 'DollarSign', path: '/salary' },
    { id: 'payslips', label: 'Payslips', icon: 'FileText', path: '/payslips' },
    { id: 'reports', label: 'My Reports', icon: 'BarChart3', path: '/reports' }
  ]
};

export const USER_ROLES = [
  { id: 'admin', name: 'System Admin', badgeColor: 'bg-purple' },
  { id: 'manager', name: 'HR Manager', badgeColor: 'bg-blue' },
  { id: 'employee', name: 'Employee', badgeColor: 'bg-emerald' }
];
