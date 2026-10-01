import { supabase } from '../lib/supabase';

export async function fetchDashboardMetrics(role = 'admin', userDept = '', userEmpId = '') {
  try {
    const [
      empRes,
      deptRes,
      attendanceRes,
      leaveRes,
      payrollRes,
      auditRes
    ] = await Promise.allSettled([
      supabase.from('employees').select('id, employee_code, first_name, last_name, email, status, department_id, profiles(full_name, role), departments(id, name, code)'),
      supabase.from('departments').select('id, name, code'),
      supabase.from('attendance').select('id, employee_id, status, work_hours, date, employees(department_id, employee_code, departments(name))'),
      supabase.from('leave_records').select('id, employee_id, status, start_date, end_date, total_days, employees(department_id, employee_code, departments(name))').eq('record_type', 'request'),
      supabase.from('payroll').select('id, cycle_name, total_gross, net_total, status, period_start'),
      supabase.from('audit_logs').select('id, action, user_id, security_level, created_at').order('created_at', { ascending: false }).limit(6)
    ]);

    let dbEmployees = empRes.status === 'fulfilled' && empRes.value.data ? empRes.value.data : [];
    const departments = deptRes.status === 'fulfilled' && deptRes.value.data ? deptRes.value.data : [];
    let attendanceLogs = attendanceRes.status === 'fulfilled' && attendanceRes.value.data ? attendanceRes.value.data : [];
    let leaveRequests = leaveRes.status === 'fulfilled' && leaveRes.value.data ? leaveRes.value.data : [];
    const payrollBatches = payrollRes.status === 'fulfilled' && payrollRes.value.data ? payrollRes.value.data : [];
    const auditLogs = auditRes.status === 'fulfilled' && auditRes.value.data ? auditRes.value.data : [];

    // Fallback for leave requests if leave_records returned empty or failed
    if (leaveRequests.length === 0) {
      try {
        const { data: legacyLeaves } = await supabase.from('leave_requests').select('id, employee_id, status, start_date, end_date, total_days, employees(department_id, employee_code, departments(name))');
        if (legacyLeaves && legacyLeaves.length > 0) leaveRequests = legacyLeaves;
      } catch {}
    }

    // Merge locally cached employees so dashboard updates immediately even before cloud refresh
    let localEmployees = [];
    try {
      const raw = localStorage.getItem('payflow_employees_cache_v2');
      if (raw) localEmployees = JSON.parse(raw);
    } catch {}

    const dbKeys = new Set(dbEmployees.map((e) => (e.employee_code || e.id || '').toLowerCase()));
    const extraLocals = localEmployees.filter(
      (l) => !dbKeys.has((l.id || '').toLowerCase()) && !dbKeys.has((l.dbId || '').toLowerCase())
    ).map((l) => ({
      id: l.dbId || l.id,
      employee_code: l.id,
      first_name: l.firstName,
      last_name: l.lastName,
      email: l.email,
      status: l.status || 'active',
      department_id: null,
      departments: { name: l.department || 'Engineering & Tech' },
      profiles: { full_name: l.fullName }
    }));

    let employees = [...dbEmployees, ...extraLocals];

    // Manager department filtering
    if (role === 'manager' && userDept) {
      const cleanDept = userDept.toLowerCase().split('&')[0].trim();
      employees = employees.filter((e) => {
        const dName = e.departments?.name;
        if (dName) {
          return dName.toLowerCase().includes(cleanDept);
        }
        // If employee has no department specified, include them if manager is Engineering
        return cleanDept === 'engineering';
      });

      attendanceLogs = attendanceLogs.filter((a) => {
        const dName = a.employees?.departments?.name;
        return !dName || dName.toLowerCase().includes(cleanDept);
      });

      leaveRequests = leaveRequests.filter((l) => {
        const dName = l.employees?.departments?.name;
        return !dName || dName.toLowerCase().includes(cleanDept);
      });
    }

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
      count: employees.filter((e) => e.department_id === d.id || (e.departments?.name && e.departments.name.toLowerCase() === d.name.toLowerCase())).length
    })) : [];

    // 2. Monthly Payroll History Chart Data
    const payrollHistory = payrollBatches.length > 0 ? payrollBatches.map((p) => ({
      month: p.cycle_name || 'Cycle',
      amount: p.net_total || 0
    })) : [];

    // 3. Attendance Distribution Stats
    const attendanceStats = {
      present: presentToday,
      late: attendanceLogs.filter((a) => a.status === 'Half Day' || a.status === 'late').length,
      onLeave: onLeaveToday,
      absent: attendanceLogs.filter((a) => a.status === 'Absent' || a.status === 'absent').length,
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
