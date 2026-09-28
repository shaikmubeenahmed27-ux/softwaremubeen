import { supabase } from '../lib/supabase';

// ─── LocalStorage fallback cache ─────────────────────────────────────────────
const LOCAL_KEY = 'payflow_attendance_cache';

function getLocalRecords() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch { return []; }
}
function saveLocalRecords(records) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(records)); } catch {}
}
function addLocalRecord(record) {
  const existing = getLocalRecords();
  const filtered = existing.filter((r) => r.id !== record.id);
  saveLocalRecords([record, ...filtered]);
}
function updateLocalRecord(id, fields) {
  const existing = getLocalRecords();
  saveLocalRecords(existing.map((r) => r.id === id ? { ...r, ...fields } : r));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Automatically calculates Regular Work Hours and Overtime Hours
 * from checkIn and checkOut time strings. Standard shift = 8.0 hrs.
 */
export function calculateShiftHours(checkInStr, checkOutStr, standardShiftHours = 8.0) {
  if (!checkInStr || !checkOutStr || checkInStr === '--:--' || checkOutStr === '--:--') {
    return { workHours: 0.0, overtimeHours: 0.0 };
  }

  const parseTimeToMinutes = (timeStr) => {
    const clean = timeStr.trim().toUpperCase();
    const isPM = clean.includes('PM');
    const isAM = clean.includes('AM');
    const timeParts = clean.replace(/(AM|PM)/g, '').trim().split(':');
    let hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10) || 0;
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  try {
    const startMins = parseTimeToMinutes(checkInStr);
    const endMins = parseTimeToMinutes(checkOutStr);
    let diffMins = endMins - startMins;
    if (diffMins < 0) diffMins += 24 * 60;
    const totalHours = Math.round((diffMins / 60) * 100) / 100;
    const workHours = Math.min(totalHours, standardShiftHours);
    const overtimeHours = Math.max(0, Math.round((totalHours - standardShiftHours) * 100) / 100);
    return { workHours, overtimeHours };
  } catch {
    return { workHours: 8.0, overtimeHours: 0.0 };
  }
}

// ─── Read attendance records ──────────────────────────────────────────────────

export async function getAttendanceRecords({
  date = '',
  employeeId = 'All',
  department = 'All',
  status = 'All',
  userRole = 'admin',
  userDept = 'Executive',
  authEmployeeId = ''
} = {}) {
  try {
    // FIX 1: declare records with let BEFORE the if/else
    let records = [];

    const { data: dbRecords, error } = await supabase
      .from('attendance')
      .select('*, employees(*, profiles(*), departments(*))');

    if (!error && dbRecords && dbRecords.length > 0) {
      // Map DB rows to app format
      records = dbRecords.map((a) => ({
        id: a.id,
        date: a.date,
        empId: a.employees?.employee_code || a.employee_id,
        empName: (
          a.employees?.profiles?.full_name ||
          `${a.employees?.first_name || ''} ${a.employees?.last_name || ''}`.trim() ||
          'Employee'
        ),
        department: a.employees?.departments?.name || 'General',
        checkIn: a.check_in ? a.check_in.slice(0, 5) : '--:--',
        checkOut: a.check_out ? a.check_out.slice(0, 5) : '--:--',
        workHours: parseFloat(a.work_hours) || 0,
        overtimeHours: parseFloat(a.overtime_hours) || 0,
        status: a.status || 'Present',
        remarks: a.remarks || '',
        _employeeId: a.employee_id
      }));

      // Merge local-only (offline) records not yet in DB
      const localOnly = getLocalRecords().filter((lr) => lr._localOnly);
      const dbIds = new Set(records.map((r) => r.id));
      records = [...records, ...localOnly.filter((lr) => !dbIds.has(lr.id))];
    } else {
      // Supabase error or RLS blocked read — fall back to local cache
      records = getLocalRecords();
    }

    // Role-based filtering
    if (userRole === 'employee' && authEmployeeId) {
      records = records.filter(
        (r) => r.empId === authEmployeeId || r._employeeId === authEmployeeId
      );
    } else if (userRole === 'manager' && userDept) {
      const cleanDept = userDept.toLowerCase().split('&')[0].trim();
      records = records.filter((r) => {
        const rDept = (r.department || '').toLowerCase();
        return rDept.includes(cleanDept) || cleanDept.includes(rDept.split('&')[0].trim());
      });
    }

    if (date)              records = records.filter((r) => r.date === date);
    if (employeeId !== 'All') records = records.filter((r) => r.empId === employeeId || r._employeeId === employeeId);
    if (department !== 'All') records = records.filter((r) => r.department === department);
    if (status !== 'All')  records = records.filter((r) => r.status.toLowerCase() === status.toLowerCase());

    return records;
  } catch (err) {
    console.error('Error in getAttendanceRecords:', err);
    return getLocalRecords(); // always return something
  }
}

// ─── Create attendance record ─────────────────────────────────────────────────

export async function createAttendanceRecord(recordData) {
  const { workHours, overtimeHours } = calculateShiftHours(recordData.checkIn, recordData.checkOut);

  const today = new Date().toISOString().split('T')[0];

  // Local record — shown immediately regardless of DB result
  const localRecord = {
    id: `local_${Date.now()}`,
    date: recordData.date || today,
    empId: recordData.empId || '',
    empName: recordData.empName || 'Employee',
    department: recordData.department || 'General',
    checkIn: recordData.checkIn || '09:00 AM',
    checkOut: recordData.checkOut || '05:00 PM',
    workHours: recordData.workHours !== undefined ? recordData.workHours : workHours,
    overtimeHours: recordData.overtimeHours !== undefined ? recordData.overtimeHours : overtimeHours,
    status: recordData.status || 'Present',
    remarks: recordData.remarks || '',
    _employeeId: recordData.employeeDbId || recordData.empId || '',
    _localOnly: true
  };

  // Save to local cache immediately so it shows in table right away
  addLocalRecord(localRecord);

  // Try to persist to Supabase
  try {
    const insertRow = {
      employee_id: recordData.employeeDbId || recordData.empId,
      date: localRecord.date,
      check_in: localRecord.checkIn,
      check_out: localRecord.checkOut,
      work_hours: localRecord.workHours,
      overtime_hours: localRecord.overtimeHours,
      status: localRecord.status,
      remarks: localRecord.remarks
    };

    const { data, error } = await supabase
      .from('attendance')
      .insert([insertRow])
      .select();

    if (error) {
      console.warn('Supabase insert blocked (record kept locally):', error.message);
      return { success: true, data: localRecord, localOnly: true };
    }

    // Replace local record with DB version (has real UUID)
    if (data?.[0]) {
      const dbRecord = { ...localRecord, id: data[0].id, _localOnly: false };
      addLocalRecord(dbRecord); // overwrites the local_ version
    }

    try { window.dispatchEvent(new Event('payflow:attendance_updated')); } catch {}
    return { success: true, data: data?.[0] || localRecord };
  } catch (err) {
    console.warn('Network error on attendance insert (kept locally):', err.message);
    return { success: true, data: localRecord, localOnly: true };
  }
}

// ─── Update attendance record ─────────────────────────────────────────────────

export async function updateAttendanceRecord(id, updatedFields) {
  const { workHours, overtimeHours } = calculateShiftHours(
    updatedFields.checkIn,
    updatedFields.checkOut
  );

  const patch = {
    checkIn: updatedFields.checkIn,
    checkOut: updatedFields.checkOut,
    workHours: updatedFields.workHours !== undefined ? updatedFields.workHours : workHours,
    overtimeHours: updatedFields.overtimeHours !== undefined ? updatedFields.overtimeHours : overtimeHours,
    status: updatedFields.status,
    remarks: updatedFields.remarks
  };

  // Update local cache immediately
  updateLocalRecord(id, patch);

  // Try Supabase update
  try {
    const updateRow = {
      check_in: patch.checkIn,
      check_out: patch.checkOut,
      work_hours: patch.workHours,
      overtime_hours: patch.overtimeHours,
      status: patch.status,
      remarks: patch.remarks
    };
    Object.keys(updateRow).forEach((k) => updateRow[k] === undefined && delete updateRow[k]);

    const { error } = await supabase.from('attendance').update(updateRow).eq('id', id);
    if (error) console.warn('Supabase update blocked (updated locally):', error.message);
    else { try { window.dispatchEvent(new Event('payflow:attendance_updated')); } catch {} }
  } catch (err) {
    console.warn('Network error on attendance update:', err.message);
  }

  return { success: true };
}

// ─── Monthly summary ──────────────────────────────────────────────────────────

export async function getMonthlyAttendanceSummary(employeeId = 'All', month = '09', year = '2026') {
  try {
    const startDate = `${year}-${month}-01`;
    // FIX 2: compute actual last day of month (avoids invalid dates like Sep-31)
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

    let query = supabase
      .from('attendance')
      .select('status, work_hours, overtime_hours, employee_id')
      .gte('date', startDate)
      .lte('date', endDate);

    if (employeeId !== 'All') {
      query = query.eq('employee_id', employeeId);
    }

    const { data: dbRows, error } = await query;

    // If Supabase fails, fall back to local cache for summary
    const rows = (!error && dbRows) ? dbRows : getLocalRecords().filter((r) => {
      const d = r.date || '';
      return d >= startDate && d <= endDate &&
        (employeeId === 'All' || r.empId === employeeId || r._employeeId === employeeId);
    });

    const presentDays     = rows.filter((x) => x.status === 'Present').length;
    const absentDays      = rows.filter((x) => x.status === 'Absent').length;
    const halfDays        = rows.filter((x) => x.status === 'Half Day').length;
    const leaveDays       = rows.filter((x) => x.status === 'Leave').length;
    const holidays        = rows.filter((x) => x.status === 'Holiday').length;
    const totalWorkHours  = rows.reduce((s, x) => s + (parseFloat(x.work_hours || x.workHours) || 0), 0);
    const totalOTHours    = rows.reduce((s, x) => s + (parseFloat(x.overtime_hours || x.overtimeHours) || 0), 0);
    const payableDays     = presentDays + halfDays * 0.5 + leaveDays + holidays;

    return {
      employeeId, presentDays, absentDays, halfDays, leaveDays, holidays,
      totalWorkHours: Math.round(totalWorkHours * 100) / 100,
      totalOvertimeHours: Math.round(totalOTHours * 100) / 100,
      payableDays, payrollReady: true
    };
  } catch (err) {
    console.error('Error in getMonthlyAttendanceSummary:', err);
    return {
      employeeId, presentDays: 0, absentDays: 0, halfDays: 0,
      leaveDays: 0, holidays: 0, totalWorkHours: 0,
      totalOvertimeHours: 0, payableDays: 0, payrollReady: false
    };
  }
}
