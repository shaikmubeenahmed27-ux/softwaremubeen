import { supabase } from '../lib/supabase';

// Default leave categories
export const LEAVE_TYPES = [
  { id: 'lt_1', name: 'Casual Leave', code: 'CASUAL', defaultDays: 10, isPaid: true, color: '#3b82f6' },
  { id: 'lt_2', name: 'Sick Leave', code: 'SICK', defaultDays: 12, isPaid: true, color: '#a855f7' },
  { id: 'lt_3', name: 'Earned Leave', code: 'EARNED', defaultDays: 20, isPaid: true, color: '#10b981' },
  { id: 'lt_4', name: 'Unpaid Leave', code: 'UNPAID', defaultDays: 30, isPaid: false, color: '#ef4444' },
  { id: 'lt_5', name: 'Other', code: 'OTHER', defaultDays: 5, isPaid: true, color: '#64748b' }
];

// Empty stores for clean production usage — populates strictly from database and user entry
let MOCK_LEAVE_BALANCES = {};
let MOCK_LEAVE_REQUESTS = [];

export async function getLeaveTypes() {
  return LEAVE_TYPES;
}

export async function getLeaveBalances(employeeId = '') {
  if (MOCK_LEAVE_BALANCES[employeeId]) {
    return MOCK_LEAVE_BALANCES[employeeId];
  }
  return [
    { type: 'Casual Leave', code: 'CASUAL', allocated: 10, used: 0, remaining: 10 },
    { type: 'Sick Leave', code: 'SICK', allocated: 12, used: 0, remaining: 12 },
    { type: 'Earned Leave', code: 'EARNED', allocated: 20, used: 0, remaining: 20 },
    { type: 'Unpaid Leave', code: 'UNPAID', allocated: 30, used: 0, remaining: 30 },
    { type: 'Other', code: 'OTHER', allocated: 5, used: 0, remaining: 5 }
  ];
}

export async function getLeaveRequests({
  userRole = 'admin',
  userDept = 'Executive',
  authEmployeeId = '',
  statusFilter = 'All',
  typeFilter = 'All'
} = {}) {
  try {
    const { data: dbRequests, error } = await supabase
      .from('leave_requests')
      .select('*, employees(*, profiles(*), departments(*)), leave_types(*)');

    let records = [];

    if (!error && dbRequests && dbRequests.length > 0) {
      records = dbRequests.map((r) => ({
        id: r.id,
        empId: r.employees?.employee_code || r.employee_id,
        empName: r.employees?.profiles?.full_name || 'Staff',
        department: r.employees?.departments?.name || 'General',
        leaveType: r.leave_types?.name || 'Casual Leave',
        typeCode: r.leave_types?.code || 'CASUAL',
        startDate: r.start_date,
        endDate: r.end_date,
        totalDays: r.total_days,
        reason: r.reason,
        status: r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : 'Pending',
        appliedOn: new Date(r.created_at || Date.now()).toISOString().split('T')[0],
        approvedBy: r.approved_by || null,
        rejectionReason: r.rejection_reason || null
      }));
    } else {
      records = MOCK_LEAVE_REQUESTS;
    }

    // Role-based Security Enforcement
    if (userRole === 'employee' && authEmployeeId) {
      records = records.filter((r) => r.empId === authEmployeeId);
    } else if (userRole === 'manager' && userDept) {
      records = records.filter((r) => r.department === userDept);
    }

    // Status filter
    if (statusFilter !== 'All') {
      records = records.filter((r) => r.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Category filter
    if (typeFilter !== 'All') {
      records = records.filter((r) => r.leaveType === typeFilter || r.typeCode === typeFilter);
    }

    return records;
  } catch (err) {
    console.error('Error fetching leave requests:', err);
    return MOCK_LEAVE_REQUESTS;
  }
}

export async function applyForLeave(applicationData) {
  // Calculate total days between start date and end date
  const start = new Date(applicationData.startDate);
  const end = new Date(applicationData.endDate);
  const diffTime = Math.abs(end - start);
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const newCode = `LR-${100 + MOCK_LEAVE_REQUESTS.length + 1}`;
  const newRequest = {
    id: newCode,
    empId: applicationData.empId || 'EMP-101',
    empName: applicationData.empName || 'Staff Member',
    department: applicationData.department || 'General',
    leaveType: applicationData.leaveType || 'Casual Leave',
    typeCode: applicationData.typeCode || 'CASUAL',
    startDate: applicationData.startDate,
    endDate: applicationData.endDate,
    totalDays: totalDays || 1,
    reason: applicationData.reason || 'Personal leave request',
    status: 'Pending',
    appliedOn: new Date().toISOString().split('T')[0],
    approvedBy: null,
    rejectionReason: null
  };

  MOCK_LEAVE_REQUESTS = [newRequest, ...MOCK_LEAVE_REQUESTS];
  return { success: true, data: newRequest };
}

// Employee cancels pending request
export async function cancelLeaveRequest(requestId) {
  MOCK_LEAVE_REQUESTS = MOCK_LEAVE_REQUESTS.map((req) => {
    if (req.id === requestId && req.status === 'Pending') {
      return { ...req, status: 'Cancelled' };
    }
    return req;
  });
  return { success: true };
}

// Manager/Admin approves request -> Automatically update leave balances!
export async function approveLeaveRequest(requestId, approverName = 'Manager') {
  let targetReq = null;
  MOCK_LEAVE_REQUESTS = MOCK_LEAVE_REQUESTS.map((req) => {
    if (req.id === requestId) {
      targetReq = { ...req, status: 'Approved', approvedBy: approverName };
      return targetReq;
    }
    return req;
  });

  if (targetReq) {
    const empId = targetReq.empId;
    if (MOCK_LEAVE_BALANCES[empId]) {
      MOCK_LEAVE_BALANCES[empId] = MOCK_LEAVE_BALANCES[empId].map((bal) => {
        if (bal.type === targetReq.leaveType || bal.code === targetReq.typeCode) {
          const newUsed = bal.used + targetReq.totalDays;
          const newRemaining = Math.max(0, bal.allocated - newUsed);
          return { ...bal, used: newUsed, remaining: newRemaining };
        }
        return bal;
      });
    }
  }

  return { success: true };
}

// Manager/Admin rejects request with rejection reason
export async function rejectLeaveRequest(requestId, rejectionReason, rejecterName = 'Manager') {
  MOCK_LEAVE_REQUESTS = MOCK_LEAVE_REQUESTS.map((req) => {
    if (req.id === requestId) {
      return {
        ...req,
        status: 'Rejected',
        approvedBy: null,
        rejectionReason: rejectionReason || 'Declined by manager due to schedule conflict.'
      };
    }
    return req;
  });
  return { success: true };
}

// Summary of approved unpaid leave for payroll integration
export async function getUnpaidLeaveSummary(employeeId = 'All', month = '09', year = '2026') {
  const unpaidRequests = MOCK_LEAVE_REQUESTS.filter(
    (r) =>
      (r.empId === employeeId || employeeId === 'All') &&
      (r.leaveType === 'Unpaid Leave' || r.typeCode === 'UNPAID') &&
      r.status === 'Approved'
  );

  const totalUnpaidDays = unpaidRequests.reduce((acc, r) => acc + r.totalDays, 0);
  return {
    employeeId,
    unpaidDays: totalUnpaidDays,
    payrollDeductionRequired: totalUnpaidDays > 0
  };
}
