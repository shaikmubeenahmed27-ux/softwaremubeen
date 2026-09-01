import { supabase } from '../lib/supabase';

// Empty store for clean production usage — populates strictly from database and user entry
let MOCK_ATTENDANCE_LOGS = [];

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
    if (diffMins < 0) diffMins += 24 * 60; // Midnight crossover

    const totalHours = Math.round((diffMins / 60) * 100) / 100;
    const workHours = Math.min(totalHours, standardShiftHours);
    const overtimeHours = Math.max(0, Math.round((totalHours - standardShiftHours) * 100) / 100);

    return { workHours, overtimeHours };
  } catch (err) {
    return { workHours: 8.0, overtimeHours: 0.0 };
  }
}

export async function getAttendanceRecords({
  date = new Date().toISOString().split('T')[0],
  employeeId = 'All',
  department = 'All',
  status = 'All',
  userRole = 'admin',
  userDept = 'Executive',
  authEmployeeId = ''
} = {}) {
  try {
    // Query Supabase database
    const { data: dbRecords, error } = await supabase
      .from('attendance')
      .select('*, employees(*, profiles(*), departments(*))');

    let records = [];

    if (!error && dbRecords && dbRecords.length > 0) {
      records = dbRecords.map((a) => ({
        id: a.id,
        date: a.date,
        empId: a.employees?.employee_code || a.employee_id,
        empName: a.employees?.profiles?.full_name || 'Employee',
        department: a.employees?.departments?.name || 'General',
        checkIn: a.check_in || '--:--',
        checkOut: a.check_out || '--:--',
        workHours: parseFloat(a.work_hours) || 0,
        overtimeHours: parseFloat(a.overtime_hours) || 0,
        status: a.status || 'Present',
        remarks: a.remarks || ''
      }));
    } else {
      records = MOCK_ATTENDANCE_LOGS;
    }

    // Role-based Security Restrictions
    if (userRole === 'employee' && authEmployeeId) {
      records = records.filter((r) => r.empId === authEmployeeId);
    } else if (userRole === 'manager' && userDept) {
      records = records.filter((r) => r.department === userDept);
    }

    // Date filter
    if (date) {
      records = records.filter((r) => r.date === date);
    }

    // Employee filter
    if (employeeId !== 'All') {
      records = records.filter((r) => r.empId === employeeId);
    }

    // Department filter
    if (department !== 'All') {
      records = records.filter((r) => r.department === department);
    }

    // Status filter
    if (status !== 'All') {
      records = records.filter((r) => r.status.toLowerCase() === status.toLowerCase());
    }

    return records;
  } catch (err) {
    console.error('Error in getAttendanceRecords:', err);
    return MOCK_ATTENDANCE_LOGS;
  }
}

export async function createAttendanceRecord(recordData) {
  const { workHours, overtimeHours } = calculateShiftHours(recordData.checkIn, recordData.checkOut);

  const newRecord = {
    id: `att_${Date.now()}`,
    date: recordData.date || new Date().toISOString().split('T')[0],
    empId: recordData.empId || 'EMP-101',
    empName: recordData.empName || 'Staff Member',
    department: recordData.department || 'General',
    checkIn: recordData.checkIn || '09:00 AM',
    checkOut: recordData.checkOut || '05:00 PM',
    workHours: recordData.workHours || workHours,
    overtimeHours: recordData.overtimeHours || overtimeHours,
    status: recordData.status || 'Present',
    remarks: recordData.remarks || 'Recorded by User'
  };

  MOCK_ATTENDANCE_LOGS = [newRecord, ...MOCK_ATTENDANCE_LOGS];
  return { success: true, data: newRecord };
}

export async function updateAttendanceRecord(id, updatedFields) {
  const { workHours, overtimeHours } = calculateShiftHours(
    updatedFields.checkIn,
    updatedFields.checkOut
  );

  MOCK_ATTENDANCE_LOGS = MOCK_ATTENDANCE_LOGS.map((rec) => {
    if (rec.id === id) {
      return {
        ...rec,
        ...updatedFields,
        workHours: updatedFields.workHours !== undefined ? updatedFields.workHours : workHours,
        overtimeHours: updatedFields.overtimeHours !== undefined ? updatedFields.overtimeHours : overtimeHours
      };
    }
    return rec;
  });

  return { success: true };
}

// Monthly summary calculations for Payroll System Connection
export async function getMonthlyAttendanceSummary(employeeId = 'All', month = '09', year = '2026') {
  const records = MOCK_ATTENDANCE_LOGS.filter((r) => r.empId === employeeId || employeeId === 'All');

  const presentDays = records.filter((r) => r.status === 'Present').length;
  const absentDays = records.filter((r) => r.status === 'Absent').length;
  const halfDays = records.filter((r) => r.status === 'Half Day').length;
  const leaveDays = records.filter((r) => r.status === 'Leave').length;
  const holidays = records.filter((r) => r.status === 'Holiday').length;

  const totalWorkHours = records.reduce((acc, r) => acc + (r.workHours || 0), 0);
  const totalOvertimeHours = records.reduce((acc, r) => acc + (r.overtimeHours || 0), 0);

  const payableDays = presentDays + halfDays * 0.5 + leaveDays + holidays;

  return {
    employeeId,
    presentDays,
    absentDays,
    halfDays,
    leaveDays,
    holidays,
    totalWorkHours,
    totalOvertimeHours,
    payableDays,
    payrollReady: true
  };
}
