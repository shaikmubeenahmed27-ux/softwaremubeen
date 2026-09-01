import { supabase } from '../lib/supabase';

export async function fetchDashboardMetrics() {
  try {
    const [
      empRes,
      deptRes,
      attendanceRes,
      leaveRes,
      payrollRes,
      auditRes
    ] = await Promise.allSettled([
      supabase.from('employees').select('id, status, department_id, profiles(full_name, role)'),
      supabase.from('departments').select('id, name, code'),
      supabase.from('attendance').select('id, status, work_hours, date'),
      supabase.from('leave_requests').select('id, status, start_date, end_date, total_days'),
      supabase.from('payroll').select('id, cycle_name, total_gross, net_total, status, period_start'),
      supabase.from('audit_logs').select('id, action, user_id, security_level, created_at').order('created_at', { ascending: false }).limit(6)
    ]);

    const employees = empRes.status === 'fulfilled' && empRes.value.data ? empRes.value.data : [];
    const departments = deptRes.status === 'fulfilled' && deptRes.value.data ? deptRes.value.data : [];
    const attendanceLogs = attendanceRes.status === 'fulfilled' && attendanceRes.value.data ? attendanceRes.value.data : [];
    const leaveRequests = leaveRes.status === 'fulfilled' && leaveRes.value.data ? leaveRes.value.data : [];
    const payrollBatches = payrollRes.status === 'fulfilled' && payrollRes.value.data ? payrollRes.value.data : [];
    const auditLogs = auditRes.status === 'fulfilled' && auditRes.value.data ? auditRes.value.data : [];

    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((e) => e.status === 'active').length;
    const presentToday = attendanceLogs.filter((a) => a.status === 'Present' || a.status === 'present').length;
    const onLeaveToday = attendanceLogs.filter((a) => a.status === 'Leave' || a.status === 'on_leave').length;
    const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending' || l.status === 'Pending').length;

    const totalDepartments = departments.length;
    const currentMonthPayroll = payrollBatches.length > 0 ? payrollBatches[0].net_total || 0 : 0;
    const pendingPayroll = payrollBatches.filter((p) => p.status !== 'processed' && p.status !== 'Processed').reduce((acc, p) => acc + (p.net_total || 0), 0);

    // 1. Employees by Department Chart Data
    const deptDistribution = departments.length > 0 ? departments.map((d) => ({
      name: d.code || d.name,
      fullName: d.name,
      count: employees.filter((e) => e.department_id === d.id).length
    })) : [
      { name: 'ENG', fullName: 'Engineering & Tech', count: 0 },
      { name: 'HR', fullName: 'Human Resources', count: 0 },
      { name: 'FIN', fullName: 'Finance & Accounting', count: 0 },
      { name: 'SALES', fullName: 'Sales & Marketing', count: 0 }
    ];

    // 2. Monthly Payroll History Chart Data
    const payrollHistory = payrollBatches.length > 0 ? payrollBatches.map((p) => ({
      month: p.cycle_name || 'Cycle',
      amount: p.net_total || 0
    })) : [
      { month: 'Current', amount: 0 }
    ];

    // 3. Attendance Distribution Stats
    const attendanceStats = {
      present: presentToday,
      late: attendanceLogs.filter((a) => a.status === 'Half Day').length,
      onLeave: onLeaveToday,
      absent: attendanceLogs.filter((a) => a.status === 'Absent').length,
      rate: totalEmployees > 0 ? `${Math.round((presentToday / totalEmployees) * 100)}%` : '0%'
    };

    // 4. Leave Statistics Breakdown
    const leaveStats = {
      approved: leaveRequests.filter((l) => l.status === 'approved' || l.status === 'Approved').length,
      pending: pendingLeaves,
      rejected: leaveRequests.filter((l) => l.status === 'rejected' || l.status === 'Rejected').length,
      totalThisMonth: leaveRequests.length
    };

    // 5. Recent Activities Feed
    const recentActivities = auditLogs.length > 0 ? auditLogs.map((log) => ({
      id: log.id,
      title: log.action,
      user: 'Authenticated Admin',
      time: new Date(log.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      level: log.security_level || 'INFO'
    })) : [];

    return {
      kpi: {
        totalEmployees,
        activeEmployees,
        presentToday,
        onLeaveToday,
        pendingLeaves,
        currentMonthPayroll,
        pendingPayroll,
        totalDepartments
      },
      deptDistribution,
      payrollHistory,
      attendanceStats,
      leaveStats,
      recentActivities
    };
  } catch (err) {
    console.error('Error fetching dashboard metrics:', err);
    return {
      kpi: {
        totalEmployees: 0,
        activeEmployees: 0,
        presentToday: 0,
        onLeaveToday: 0,
        pendingLeaves: 0,
        currentMonthPayroll: 0,
        pendingPayroll: 0,
        totalDepartments: 0
      },
      deptDistribution: [],
      payrollHistory: [],
      attendanceStats: { present: 0, late: 0, onLeave: 0, absent: 0, rate: '0%' },
      leaveStats: { approved: 0, pending: 0, rejected: 0, totalThisMonth: 0 },
      recentActivities: []
    };
  }
}
