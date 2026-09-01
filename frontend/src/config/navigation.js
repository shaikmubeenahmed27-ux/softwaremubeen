// Role-based navigation structure for PayFlow HR

export const NAV_ITEMS = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
    {
      group: 'Organization',
      items: [
        { id: 'employees', label: 'Employees', icon: 'Users', path: '/employees' },
        { id: 'departments', label: 'Departments', icon: 'Building2', path: '/departments' },
        { id: 'designations', label: 'Designations', icon: 'Briefcase', path: '/designations' },
      ]
    },
    {
      group: 'Time & Attendance',
      items: [
        { id: 'attendance', label: 'Attendance', icon: 'Clock', path: '/attendance' },
        { id: 'leave', label: 'Leave Management', icon: 'CalendarDays', path: '/leave' },
      ]
    },
    {
      group: 'Payroll & Finance',
      items: [
        { id: 'salary', label: 'Salary Structures', icon: 'DollarSign', path: '/salary' },
        { id: 'payroll', label: 'Payroll Processing', icon: 'CreditCard', path: '/payroll' },
        { id: 'payslips', label: 'Payslips', icon: 'FileText', path: '/payslips' },
        { id: 'reports', label: 'Reports & Analytics', icon: 'BarChart3', path: '/reports' },
      ]
    },
    {
      group: 'System',
      items: [
        { id: 'notifications', label: 'Notifications', icon: 'Bell', path: '/notifications' },
        { id: 'audit-logs', label: 'Audit Logs', icon: 'ShieldAlert', path: '/audit-logs' },
        { id: 'settings', label: 'Settings', icon: 'Settings', path: '/settings' },
      ]
    }
  ],

  manager: [
    { id: 'dashboard', label: 'Team Overview', icon: 'LayoutDashboard', path: '/dashboard' },
    {
      group: 'Team Management',
      items: [
        { id: 'employees', label: 'Team Members', icon: 'Users', path: '/employees' },
        { id: 'attendance', label: 'Team Attendance', icon: 'Clock', path: '/attendance' },
        { id: 'leave', label: 'Leave Requests', icon: 'CalendarDays', path: '/leave' },
      ]
    },
    {
      group: 'Personal & Reports',
      items: [
        { id: 'payslips', label: 'My Payslips', icon: 'FileText', path: '/payslips' },
        { id: 'reports', label: 'Team Reports', icon: 'BarChart3', path: '/reports' },
        { id: 'notifications', label: 'Notifications', icon: 'Bell', path: '/notifications' },
        { id: 'settings', label: 'Settings', icon: 'Settings', path: '/settings' },
      ]
    }
  ],

  employee: [
    { id: 'dashboard', label: 'My Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
    {
      group: 'Self Service',
      items: [
        { id: 'attendance', label: 'My Attendance', icon: 'Clock', path: '/attendance' },
        { id: 'leave', label: 'My Leave', icon: 'CalendarDays', path: '/leave' },
        { id: 'payslips', label: 'My Payslips', icon: 'FileText', path: '/payslips' },
      ]
    },
    {
      group: 'Account',
      items: [
        { id: 'notifications', label: 'Notifications', icon: 'Bell', path: '/notifications' },
        { id: 'settings', label: 'My Settings', icon: 'Settings', path: '/settings' },
      ]
    }
  ]
};

export const USER_ROLES = [
  { id: 'admin', name: 'System Admin', badgeColor: 'bg-purple' },
  { id: 'manager', name: 'HR Manager', badgeColor: 'bg-blue' },
  { id: 'employee', name: 'Employee', badgeColor: 'bg-emerald' }
];
