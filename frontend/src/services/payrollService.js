import { supabase } from '../lib/supabase';
import { getMonthlyAttendanceSummary } from './attendanceService';
import { getUnpaidLeaveSummary } from './leaveService';
import { getSalaryStructures } from './salaryService';
import { getEmployees } from './employeeService';

const LOCAL_BATCH_KEY = 'payflow_payroll_batches_v2';
const LOCAL_ITEMS_KEY = 'payflow_payroll_items_v2';
const LOCAL_PAYSLIPS_KEY = 'payflow_generated_payslips_v2';

function getLocalBatches() {
  try {
    const raw = localStorage.getItem(LOCAL_BATCH_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalBatches(batches) {
  try {
    localStorage.setItem(LOCAL_BATCH_KEY, JSON.stringify(batches));
  } catch (err) {
    console.warn('Could not save payroll batches locally', err);
  }
}

function getLocalItems() {
  try {
    const raw = localStorage.getItem(LOCAL_ITEMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalItems(items) {
  try {
    localStorage.setItem(LOCAL_ITEMS_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('Could not save payroll items locally', err);
  }
}

export function getLocalGeneratedPayslips() {
  try {
    const raw = localStorage.getItem(LOCAL_PAYSLIPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalGeneratedPayslips(slips) {
  try {
    localStorage.setItem(LOCAL_PAYSLIPS_KEY, JSON.stringify(slips));
  } catch (err) {
    console.warn('Could not save payslips locally', err);
  }
}

/**
 * Calculates complete itemized employee payroll by connecting Attendance, Leave, and Salary modules.
 */
export async function calculateEmployeePayroll(empId, month = '09', year = '2026', fallbackEmp = null) {
  // 1. Fetch Salary Structure
  const salaryRes = await getSalaryStructures({ userRole: 'admin', authEmployeeId: empId });
  const salStructure = salaryRes.data?.find((s) => s.empId === empId || s.dbEmployeeId === empId) || {
    empId: empId || fallbackEmp?.id || 'EMP001',
    empName: fallbackEmp?.fullName || fallbackEmp?.name || 'Staff Member',
    department: fallbackEmp?.department || 'General',
    designation: fallbackEmp?.designation || 'Team Member',
    earnings: { basic: 5000, hra: 1200, conveyance: 400, medical: 300, special: 800, bonus: 0, overtime: 0 },
    deductions: { pf: 400, pt: 150, tds: 450, loan: 0, leave: 0, other: 0 }
  };

  // 2. Fetch Attendance Summary (Work hours & Overtime)
  const attSummary = await getMonthlyAttendanceSummary(empId, month, year);

  // 3. Fetch Approved Unpaid Leave Days
  const leaveSummary = await getUnpaidLeaveSummary(empId, month, year);

  // Cross-module calculations
  const basicSalary = salStructure.earnings?.basic || 5000;
  const allowances = (salStructure.earnings?.hra || 0) +
    (salStructure.earnings?.conveyance || 0) +
    (salStructure.earnings?.medical || 0) +
    (salStructure.earnings?.special || 0) +
    (salStructure.earnings?.bonus || 0);

  // Overtime pay derived from attendance overtime hours ($45/hr rate)
  const overtimePay = Math.round((attSummary.totalOvertimeHours || 0) * 45 * 100) / 100;

  // Unpaid leave deduction derived from approved unpaid leave days
  const perDayRate = basicSalary / 22;
  const unpaidLeaveDeduction = Math.round((leaveSummary.unpaidDays || 0) * perDayRate * 100) / 100;

  const grossSalary = basicSalary + allowances + overtimePay;

  const standardDeductions = (salStructure.deductions?.pf || 0) +
    (salStructure.deductions?.pt || 0) +
    (salStructure.deductions?.tds || 0) +
    (salStructure.deductions?.loan || 0) +
    (salStructure.deductions?.other || 0);

  const totalDeductions = standardDeductions + unpaidLeaveDeduction;
  const netSalary = grossSalary - totalDeductions;

  return {
    empId: salStructure.empId || empId,
    empName: salStructure.empName || fallbackEmp?.fullName || 'Staff Member',
    department: salStructure.department || fallbackEmp?.department || 'General',
    designation: salStructure.designation || fallbackEmp?.designation || 'Team Member',
    basicSalary,
    allowances,
    overtimePay,
    unpaidLeaveDeduction,
    grossSalary: Math.round(grossSalary * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    netSalary: Math.round(netSalary * 100) / 100,
    attendanceDays: attSummary.payableDays || 22,
    overtimeHours: attSummary.totalOvertimeHours || 0,
    unpaidDays: leaveSummary.unpaidDays || 0
  };
}

export function checkDuplicatePayrollBatch(month, department) {
  const batches = getLocalBatches();
  return batches.some(
    (b) => b.month === month && (b.department === department || b.department === 'All Departments' || department === 'All Departments')
  );
}

export async function getPayrollBatches() {
  return getLocalBatches();
}

export async function getPayrollItems(batchId = '') {
  const items = getLocalItems();
  return items.filter((pi) => pi.batchId === batchId || batchId === 'All');
}

/**
 * Creates a new Payroll Batch (Calculated status) with cross-module employee items
 */
export async function createPayrollBatch({ month, department = 'All Departments', adminName = 'Admin' }) {
  if (checkDuplicatePayrollBatch(month, department)) {
    return {
      error: { message: `Duplicate Payroll Warning: A payroll cycle for ${month} (${department}) has already been generated.` }
    };
  }

  const batchId = `PAY-${Date.now().toString().slice(-4)}`;
  const filterDept = (!department || department === 'All Departments' || department === 'All') ? 'All' : department;

  // 1. Fetch active employees from employee directory
  const empRes = await getEmployees({ pageSize: 100, department: filterDept });
  let employees = empRes?.data || [];

  // 2. If no employees in directory yet, check assigned salary structures
  if (employees.length === 0) {
    const salRes = await getSalaryStructures({ userRole: 'admin' });
    const salList = salRes?.data || [];
    if (salList.length > 0) {
      employees = salList.map((s) => ({
        id: s.empId,
        dbId: s.dbEmployeeId || s.empId,
        fullName: s.empName,
        department: s.department,
        designation: s.designation
      }));
    } else {
      // Default to current admin user
      employees = [{
        id: 'EMP001',
        dbId: 'EMP001',
        fullName: adminName || 'System Administrator',
        department: 'Executive',
        designation: 'Administrator'
      }];
    }
  }

  let batchGross = 0;
  let batchDeductions = 0;
  let batchNet = 0;
  const newItems = [];

  for (const emp of employees) {
    const calc = await calculateEmployeePayroll(emp.id || emp.dbId, '09', '2026', emp);
    batchGross += calc.grossSalary;
    batchDeductions += calc.totalDeductions;
    batchNet += calc.netSalary;

    newItems.push({
      id: `ITEM-${Date.now().toString().slice(-4)}-${newItems.length + 1}`,
      batchId,
      empId: emp.id || emp.dbId,
      empName: emp.fullName || emp.name || calc.empName,
      department: emp.department || calc.department || department,
      designation: emp.designation || calc.designation || 'Staff',
      basicSalary: calc.basicSalary,
      allowances: calc.allowances,
      overtimePay: calc.overtimePay,
      unpaidLeaveDeduction: calc.unpaidLeaveDeduction,
      grossSalary: calc.grossSalary,
      totalDeductions: calc.totalDeductions,
      netSalary: calc.netSalary,
      attendanceDays: calc.attendanceDays,
      overtimeHours: calc.overtimeHours,
      unpaidDays: calc.unpaidDays,
      status: 'Calculated'
    });
  }

  const newBatch = {
    id: batchId,
    cycleName: `${month} Payroll Run`,
    month,
    department: department || 'All Departments',
    periodStart: new Date().toISOString().split('T')[0],
    periodEnd: new Date().toISOString().split('T')[0],
    totalEmployees: newItems.length,
    grossTotal: Math.round(batchGross * 100) / 100,
    deductionsTotal: Math.round(batchDeductions * 100) / 100,
    netTotal: Math.round(batchNet * 100) / 100,
    status: 'Calculated',
    createdBy: adminName,
    createdAt: new Date().toISOString().split('T')[0]
  };

  const batches = getLocalBatches();
  saveLocalBatches([newBatch, ...batches]);

  const items = getLocalItems();
  saveLocalItems([...newItems, ...items]);

  return { success: true, batch: newBatch, items: newItems };
}

/**
 * Admin approves payroll batch (Calculated -> Approved)
 */
export async function approvePayrollBatch(batchId, adminName = 'Admin') {
  const batches = getLocalBatches().map((b) => {
    if (b.id === batchId) {
      return { ...b, status: 'Approved', approvedBy: adminName };
    }
    return b;
  });
  saveLocalBatches(batches);

  const items = getLocalItems().map((it) => {
    if (it.batchId === batchId) {
      return { ...it, status: 'Approved' };
    }
    return it;
  });
  saveLocalItems(items);

  return { success: true };
}

/**
 * Marks payroll as Processed and automatically generates payslip records!
 */
export async function processPayrollBatch(batchId) {
  let targetBatch = null;
  const batches = getLocalBatches().map((b) => {
    if (b.id === batchId) {
      targetBatch = { ...b, status: 'Processed' };
      return targetBatch;
    }
    return b;
  });
  saveLocalBatches(batches);

  const items = getLocalItems().map((it) => {
    if (it.batchId === batchId) {
      return { ...it, status: 'Processed' };
    }
    return it;
  });
  saveLocalItems(items);

  const batchItems = items.filter((pi) => pi.batchId === batchId);

  // Generate Payslips
  const existingSlips = getLocalGeneratedPayslips();
  const newSlips = batchItems.map((item, idx) => ({
    id: `SLIP-${Date.now().toString().slice(-4)}-${idx + 1}`,
    payrollItemId: item.id,
    empId: item.empId,
    empName: item.empName,
    department: item.department,
    designation: item.designation,
    payPeriod: targetBatch?.month || 'Current Month',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: 'Direct Bank Transfer',
    bankName: 'Federal Trust Bank',
    accountNumber: `**** **** ${1000 + idx}`,
    earnings: {
      basic: item.basicSalary,
      allowances: item.allowances,
      overtime: item.overtimePay
    },
    deductions: {
      standard: item.totalDeductions - item.unpaidLeaveDeduction,
      unpaidLeave: item.unpaidLeaveDeduction
    },
    grossSalary: item.grossSalary,
    totalDeductions: item.totalDeductions,
    netSalary: item.netSalary
  }));

  saveLocalGeneratedPayslips([...newSlips, ...existingSlips]);

  // Attempt database sync to Supabase payslips table if connected
  try {
    for (const slip of newSlips) {
      const { data: dbEmp } = await supabase
        .from('employees')
        .select('id')
        .or(`employee_code.eq.${slip.empId},id.eq.${slip.empId}`)
        .maybeSingle();

      if (dbEmp?.id) {
        await supabase.from('payslips').insert({
          employee_id: dbEmp.id,
          payslip_number: slip.id,
          issue_date: slip.paymentDate
        });
      }
    }
  } catch (dbErr) {
    console.warn('Supabase payslips DB insert warning:', dbErr);
  }

  return { success: true, payslips: newSlips };
}
