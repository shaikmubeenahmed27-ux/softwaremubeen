import { supabase } from '../lib/supabase';

// Leave type definitions
export const LEAVE_TYPES = [
  { code: 'CASUAL', name: 'Casual Leave',  isPaid: true,  defaultDays: 0, color: '#2563eb' },
  { code: 'SICK',   name: 'Sick Leave',    isPaid: true,  defaultDays: 0, color: '#9333ea' },
  { code: 'EARNED', name: 'Earned Leave',  isPaid: true,  defaultDays: 0, color: '#059669' },
  { code: 'UNPAID', name: 'Unpaid Leave',  isPaid: false, defaultDays: 0, color: '#d97706' },
  { code: 'OTHER',  name: 'Other',         isPaid: true,  defaultDays: 0, color: '#e11d48' }
];

export async function getLeaveTypes() {
  return LEAVE_TYPES;
}

const LOCAL_LEAVE_KEY = 'payflow_real_leave_records';

// Clear legacy dummy caches if any
try {
  localStorage.removeItem('payflow_leave_records_cache_v2');
  localStorage.removeItem('payflow_leave_balances_cache_v2');
  localStorage.removeItem('payflow_leave_requests_v3');
  localStorage.removeItem('payflow_leave_emp_balances_v3');
} catch {}

function getLocalRequests() {
  try {
    const raw = localStorage.getItem(LOCAL_LEAVE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalRequests(records) {
  try {
    localStorage.setItem(LOCAL_LEAVE_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('Could not cache leave records', err);
  }
}

export function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  if (/[a-zA-Z]/.test(dateStr)) return dateStr;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export function getAvatarMeta(name = 'User') {
  const parts = name.trim().split(' ');
  const initials = parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();

  const colors = ['#2563eb', '#9333ea', '#059669', '#f97316', '#e11d48', '#0891b2', '#4f46e5'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = colors[Math.abs(hash) % colors.length];

  return { initials, color };
}

// ─── Get Real Leave Balances for an Employee ──────────────────────────────────
export async function getLeaveBalances(employeeIdentifier = '', userEmail = '') {
  const baseBalances = LEAVE_TYPES.map((lt) => ({
    type: lt.name,
    code: lt.code,
    allocated: 0,
    used: 0,
    remaining: 0
  }));

  if (!employeeIdentifier && !userEmail) return baseBalances;

  try {
    let empUuid = null;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(employeeIdentifier);

    // Resolve employee UUID from employees table
    let orQuery = [];
    if (isUuid) {
      orQuery.push(`id.eq.${employeeIdentifier}`, `profile_id.eq.${employeeIdentifier}`);
    } else if (employeeIdentifier) {
      orQuery.push(`employee_code.eq.${employeeIdentifier}`);
    }
    if (userEmail) {
      orQuery.push(`email.eq.${userEmail}`);
    }

    if (orQuery.length > 0) {
      const { data: matchedEmp } = await supabase
        .from('employees')
        .select('id, employee_code, profile_id, email')
        .or(orQuery.join(','))
        .maybeSingle();

      if (matchedEmp?.id) {
        empUuid = matchedEmp.id;
      }
    }

    if (!empUuid && isUuid) {
      empUuid = employeeIdentifier;
    }

    const year = new Date().getFullYear();

    // Query explicit balance rows from Supabase
    let dbBalances = [];
    if (empUuid) {
      const { data } = await supabase
        .from('leave_records')
        .select('*')
        .eq('employee_id', empUuid)
        .eq('record_type', 'balance')
        .eq('balance_year', year);
      dbBalances = data || [];
    }

    // Query approved leave requests from Supabase to count real used days
    let approvedRequests = [];
    if (empUuid) {
      const { data } = await supabase
        .from('leave_records')
        .select('*')
        .eq('employee_id', empUuid)
        .eq('record_type', 'request')
        .eq('status', 'approved');
      approvedRequests = data || [];
    }

    return baseBalances.map((base) => {
      const found = dbBalances.find((b) => b.leave_type?.toUpperCase() === base.code);
      const usedDaysFromRequests = approvedRequests
        .filter((r) => r.leave_type?.toUpperCase() === base.code)
        .reduce((sum, r) => sum + (Number(r.total_days) || 0), 0);

      const allocated = found?.allocated_days ?? 0;
      const used = found?.used_days ?? usedDaysFromRequests;
      const remaining = found?.remaining_days ?? Math.max(0, allocated - used);

      return {
        type: base.type,
        code: base.code,
        allocated,
        used,
        remaining
      };
    });
  } catch (err) {
    console.warn('getLeaveBalances calculation:', err);
    return baseBalances;
  }
}

// ─── Get Real Leave Requests from Database ────────────────────────────────────
export async function getLeaveRequests({
  userRole = 'admin',
  userDept = 'Executive',
  authEmployeeId = '',
  userEmail = '',
  search = '',
  statusFilter = 'All',
  typeFilter = 'All',
  activeTab = 'requests'
} = {}) {
  let records = [];

  try {
    const { data, error } = await supabase
      .from('leave_records')
      .select('*, employees(*, profiles(*), departments(*))')
      .eq('record_type', 'request')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      records = data.map((r, idx) => {
        const empName = r.employees?.profiles?.full_name || 
          `${r.employees?.first_name || ''} ${r.employees?.last_name || ''}`.trim() || 
          'Staff Member';
        const meta = getAvatarMeta(empName);
        return {
          id: r.id || `LR-${100 + idx}`,
          empId: r.employee_id,
          empCode: r.employees?.employee_code || r.employee_id,
          profileId: r.employees?.profile_id,
          email: r.employees?.email || r.employees?.profiles?.email,
          empName,
          department: r.employees?.departments?.name || 'General',
          initials: meta.initials,
          avatarBg: meta.color,
          leaveType: r.leave_type_name || r.leave_type || 'Casual Leave',
          typeCode: r.leave_type || 'CASUAL',
          startDate: formatDateDisplay(r.start_date),
          endDate: formatDateDisplay(r.end_date),
          rawStartDate: r.start_date,
          rawEndDate: r.end_date,
          totalDays: r.total_days || 1,
          reason: r.reason || 'Personal leave',
          status: r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : 'Pending',
          appliedOn: formatDateDisplay(r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : ''),
          approvedBy: r.approved_by || null,
          rejectionReason: r.rejection_reason || null
        };
      });
    } else {
      // Return only locally added user records (no dummy seed data)
      records = getLocalRequests();
    }
  } catch (err) {
    console.warn('Supabase leave_records query:', err);
    records = getLocalRequests();
  }

  // Merge locally created requests that haven't synced yet
  const localList = getLocalRequests();
  const dbIds = new Set(records.map((r) => r.id));
  const uniqueLocal = localList.filter((l) => !dbIds.has(l.id));
  records = [...uniqueLocal, ...records];

  // Role-based filtering
  if (userRole === 'employee') {
    records = records.filter((r) =>
      (authEmployeeId && (r.empId === authEmployeeId || r.empCode === authEmployeeId || r.profileId === authEmployeeId)) ||
      (userEmail && r.email?.toLowerCase() === userEmail.toLowerCase())
    );
  } else if (userRole === 'manager' && userDept) {
    records = records.filter((r) => r.department === userDept);
  }

  // Tab filter: 'history' shows only processed requests (Approved, Rejected, Cancelled)
  if (activeTab === 'history') {
    records = records.filter((r) => r.status === 'Approved' || r.status === 'Rejected' || r.status === 'Cancelled');
  }

  // Search filter
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    records = records.filter((r) =>
      r.empName?.toLowerCase().includes(q) ||
      r.department?.toLowerCase().includes(q) ||
      r.leaveType?.toLowerCase().includes(q) ||
      r.reason?.toLowerCase().includes(q) ||
      r.id?.toLowerCase().includes(q)
    );
  }

  // Status filter
  if (statusFilter !== 'All') {
    records = records.filter((r) => r.status.toLowerCase() === statusFilter.toLowerCase());
  }

  // Leave Type filter
  if (typeFilter !== 'All') {
    records = records.filter(
      (r) =>
        r.leaveType.toLowerCase() === typeFilter.toLowerCase() ||
        r.typeCode.toLowerCase() === typeFilter.toLowerCase()
    );
  }

  return records;
}

// ─── Apply for Leave (Real Database Insert) ──────────────────────────────────
export async function applyForLeave(applicationData) {
  const start = new Date(applicationData.startDate);
  const end = new Date(applicationData.endDate);
  const totalDays = isNaN(start.getTime()) || isNaN(end.getTime())
    ? 1
    : Math.max(1, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1);

  const leaveTypeMeta = LEAVE_TYPES.find(
    (lt) => lt.code === (applicationData.typeCode || 'CASUAL') || lt.name === applicationData.leaveType
  ) || LEAVE_TYPES[0];

  const applicantName = applicationData.empName || 'Employee';
  const meta = getAvatarMeta(applicantName);

  const newRecord = {
    id: `LR-${Date.now().toString().slice(-4)}`,
    empId: applicationData.empId,
    empCode: applicationData.empCode || applicationData.empId,
    empName: applicantName,
    department: applicationData.department || 'General',
    initials: meta.initials,
    avatarBg: meta.color,
    leaveType: leaveTypeMeta.name,
    typeCode: leaveTypeMeta.code,
    startDate: formatDateDisplay(applicationData.startDate),
    endDate: formatDateDisplay(applicationData.endDate),
    rawStartDate: applicationData.startDate,
    rawEndDate: applicationData.endDate,
    totalDays: totalDays,
    reason: applicationData.reason || 'Personal leave request',
    status: 'Pending',
    appliedOn: formatDateDisplay(new Date().toISOString().split('T')[0]),
    approvedBy: null,
    rejectionReason: null
  };

  // Add to local state for instantaneous UI display
  const localList = getLocalRequests();
  saveLocalRequests([newRecord, ...localList]);

  // Persist to Supabase Database
  try {
    let empUuid = applicationData.empId;

    let orQuery = [];
    if (empUuid) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(empUuid);
      if (isUuid) {
        orQuery.push(`id.eq.${empUuid}`, `profile_id.eq.${empUuid}`);
      } else {
        orQuery.push(`employee_code.eq.${empUuid}`);
      }
    }
    if (applicationData.email) {
      orQuery.push(`email.eq.${applicationData.email}`);
    }

    if (orQuery.length > 0) {
      const { data: empRow } = await supabase
        .from('employees')
        .select('id')
        .or(orQuery.join(','))
        .maybeSingle();

      if (empRow?.id) empUuid = empRow.id;
    }

    const { data: inserted, error: insErr } = await supabase.from('leave_records').insert({
      employee_id: empUuid,
      leave_type: leaveTypeMeta.code,
      leave_type_name: leaveTypeMeta.name,
      is_paid: leaveTypeMeta.isPaid,
      record_type: 'request',
      start_date: applicationData.startDate,
      end_date: applicationData.endDate,
      total_days: totalDays,
      reason: applicationData.reason,
      status: 'pending'
    }).select().maybeSingle();

    if (inserted?.id) {
      newRecord.id = inserted.id;
    }
    if (insErr) {
      console.warn('applyForLeave DB insert error:', insErr);
    }
  } catch (err) {
    console.warn('applyForLeave DB insert:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('payflow:leave_updated'));
  }

  return { success: true, data: newRecord };
}

// ─── Approve Leave Request ────────────────────────────────────────────────────
export async function approveLeaveRequest(requestId, approverName = 'Administrator') {
  const localList = getLocalRequests().map((r) => {
    if (r.id === requestId) {
      return { ...r, status: 'Approved', approvedBy: approverName };
    }
    return r;
  });
  saveLocalRequests(localList);

  try {
    const { data: updatedReq } = await supabase.from('leave_records').update({
      status: 'approved',
      approved_by: approverName,
      approved_at: new Date().toISOString()
    }).eq('id', requestId).select().maybeSingle();

    if (updatedReq?.employee_id && updatedReq?.leave_type) {
      const year = new Date().getFullYear();
      const { data: balRow } = await supabase
        .from('leave_records')
        .select('*')
        .eq('employee_id', updatedReq.employee_id)
        .eq('leave_type', updatedReq.leave_type)
        .eq('record_type', 'balance')
        .eq('balance_year', year)
        .maybeSingle();

      if (balRow) {
        const newUsed = (balRow.used_days || 0) + (Number(updatedReq.total_days) || 0);
        const newRemaining = Math.max(0, (balRow.allocated_days || 0) - newUsed);
        await supabase
          .from('leave_records')
          .update({
            used_days: newUsed,
            remaining_days: newRemaining
          })
          .eq('id', balRow.id);
      }
    }
  } catch (err) {
    console.warn('approveLeaveRequest DB update:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('payflow:leave_updated'));
  }

  return { success: true };
}

// ─── Reject Leave Request ─────────────────────────────────────────────────────
export async function rejectLeaveRequest(requestId, rejectionReason, rejecterName = 'Administrator') {
  const localList = getLocalRequests().map((r) => {
    if (r.id === requestId) {
      return {
        ...r,
        status: 'Rejected',
        rejectionReason: rejectionReason || 'Declined by administrator.',
        approvedBy: null
      };
    }
    return r;
  });
  saveLocalRequests(localList);

  try {
    await supabase.from('leave_records').update({
      status: 'rejected',
      rejection_reason: rejectionReason || 'Declined by administrator.'
    }).eq('id', requestId);
  } catch (err) {
    console.warn('rejectLeaveRequest DB update:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('payflow:leave_updated'));
  }

  return { success: true };
}

// ─── Cancel Leave Request ─────────────────────────────────────────────────────
export async function cancelLeaveRequest(requestId) {
  const localList = getLocalRequests().map((r) => {
    if (r.id === requestId) {
      return { ...r, status: 'Cancelled' };
    }
    return r;
  });
  saveLocalRequests(localList);

  try {
    await supabase.from('leave_records').update({
      status: 'cancelled'
    }).eq('id', requestId);
  } catch (err) {
    console.warn('cancelLeaveRequest DB update:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('payflow:leave_updated'));
  }

  return { success: true };
}

// ─── Unpaid Leave Summary ─────────────────────────────────────────────────────
export async function getUnpaidLeaveSummary(employeeId = 'All') {
  try {
    const records = getLocalRequests().filter((r) => r.typeCode === 'UNPAID' && r.status === 'Approved');
    const totalUnpaidDays = records.reduce((acc, r) => acc + (r.totalDays || 0), 0);
    return {
      employeeId,
      unpaidDays: totalUnpaidDays,
      payrollDeductionRequired: totalUnpaidDays > 0
    };
  } catch {
    return { employeeId, unpaidDays: 0, payrollDeductionRequired: false };
  }
}