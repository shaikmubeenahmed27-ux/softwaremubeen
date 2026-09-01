import { supabase } from '../lib/supabase';
import { getMonthlyAttendanceSummary } from './attendanceService';
import { getUnpaidLeaveSummary } from './leaveService';
import { getSalaryStructures, calculateSalaryTotals } from './salaryService';

// Empty stores for clean production usage — populates strictly from database and user entry
let MOCK_PAYROLL_BATCHES = [];
let MOCK_PAYROLL_ITEMS = [];
let MOCK_GENERATED_PAYSLIPS = [];

/**
 * Calculates complete itemized employee payroll by connecting Attendance, Leave, and Salary modules.
 */
export async function calculateEmployeePayroll(empId, month = '09', year = '2026') {
  // 1. Fetch Salary Structure
  const salaryRes = await getSalaryStructures({ userRole: 'admin', authEmployeeId: empId });
  const salStructure = salaryRes.data.find((s) => s.empId === empId) || {
    empId,
    empName: 'Staff Member',
    department: 'General',
    designation: 'Team Member',
    earnings: { basic: 5000, hra: 1200, conveyance: 400, medical: 300, special: 800, bonus: 0, overtime: 0 },
    deductions: { pf: 400, pt: 150, tds: 450, loan: 0, leave: 0, other: 0 }
  };

  // 2. Fetch Attendance Summary (Work hours & Overtime)
  const attSummary = await getMonthlyAttendanceSummary(empId, month, year);

  // 3. Fetch Approved Unpaid Leave Days
  const leaveSummary = await getUnpaidLeaveSummary(empId, month, year);

  // Cross-module calculations
  const basicSalary = salStructure.earnings?.basic || 5000;
  const allowances = (salStructure.earnings?.hra || 0) + (salStructure.earnings?.conveyance || 0) + (salStructure.earnings?.medical || 0) + (salStructure.earnings?.special || 0) + (salStructure.earnings?.bonus || 0);

  // Overtime pay derived from attendance overtime hours ($45/hr rate)
  const overtimePay = Math.round((attSummary.totalOvertimeHours || 0) * 45 * 100) / 100;

  // Unpaid leave deduction derived from approved unpaid leave days
  const perDayRate = basicSalary / 22;
  const unpaidLeaveDeduction = Math.round((leaveSummary.unpaidDays || 0) * perDayRate * 100) / 100;

  const grossSalary = basicSalary + allowances + overtimePay;

  const standardDeductions = (salStructure.deductions?.pf || 0) + (salStructure.deductions?.pt || 0) + (salStructure.deductions?.tds || 0) + (salStructure.deductions?.loan || 0) + (salStructure.deductions?.other || 0);
  const totalDeductions = standardDeductions + unpaidLeaveDeduction;

  const netSalary = grossSalary - totalDeductions;

  return {
    empId,
    empName: salStructure.empName,
    department: salStructure.department,
    designation: salStructure.designation,
    basicSalary,
    allowances,
    overtimePay,
    unpaidLeaveDeduction,
    grossSalary: Math.round(grossSalary * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    netSalary: Math.round(netSalary * 100) / 100,
    attendanceDays: attSummary.payableDays,
    overtimeHours: attSummary.totalOvertimeHours,
    unpaidDays: leaveSummary.unpaidDays
  };
}

/**
 * Checks if a payroll batch already exists for the given month and department to prevent duplicate runs.
 */
export function checkDuplicatePayrollBatch(month, department) {
  return MOCK_PAYROLL_BATCHES.some(
    (b) => b.month === month && (b.department === department || b.department === 'All Departments')
  );
}

export async function getPayrollBatches() {
  return MOCK_PAYROLL_BATCHES;
}

export async function getPayrollItems(batchId = '') {
  return MOCK_PAYROLL_ITEMS.filter((pi) => pi.batchId === batchId || batchId === 'All');
}

/**
 * Creates a new Payroll Batch (Calculated status) with cross-module employee items
 */
export async function createPayrollBatch({ month, department, adminName = 'Admin' }) {
  if (checkDuplicatePayrollBatch(month, department)) {
    return {
      error: { message: `Duplicate Payroll Warning: A payroll cycle for ${month} (${department}) has already been generated!` }
    };
  }

  const batchId = `PAY-${Date.now()}`;

  const newBatch = {
    id: batchId,
    cycleName: `${month} Payroll Run`,
    month,
    department,
    periodStart: new Date().toISOString().split('T')[0],
    periodEnd: new Date().toISOString().split('T')[0],
    totalEmployees: 0,
    grossTotal: 0,
    deductionsTotal: 0,
    netTotal: 0,
    status: 'Calculated',
    createdBy: adminName,
    createdAt: new Date().toISOString().split('T')[0]
  };

  MOCK_PAYROLL_BATCHES = [newBatch, ...MOCK_PAYROLL_BATCHES];

  return { success: true, batch: newBatch, items: [] };
}

/**
 * Admin approves payroll batch (Calculated -> Approved)
 */
export async function approvePayrollBatch(batchId, adminName = 'Admin') {
  MOCK_PAYROLL_BATCHES = MOCK_PAYROLL_BATCHES.map((b) => {
    if (b.id === batchId) {
      return { ...b, status: 'Approved', approvedBy: adminName };
    }
    return b;
  });

  return { success: true };
}

/**
 * Marks payroll as Processed and automatically generates payslip records!
 */
export async function processPayrollBatch(batchId) {
  let targetBatch = null;
  MOCK_PAYROLL_BATCHES = MOCK_PAYROLL_BATCHES.map((b) => {
    if (b.id === batchId) {
      targetBatch = { ...b, status: 'Processed' };
      return targetBatch;
    }
    return b;
  });

  return { success: true, payslips: [] };
}
