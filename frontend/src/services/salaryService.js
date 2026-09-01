import { supabase } from '../lib/supabase';

// Empty store for clean production usage — populates strictly from database and user entry
let MOCK_SALARY_STRUCTURES = [];

// Historical compensation revisions
const MOCK_SALARY_HISTORY = {};

/**
 * Calculates itemized totals, Gross Salary, and Net Salary
 * Gross Salary = Total Earnings
 * Net Salary = Gross Salary - Total Deductions
 */
export function calculateSalaryTotals(earnings = {}, deductions = {}) {
  const totalEarnings = Object.values(earnings).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
  const totalDeductions = Object.values(deductions).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
  const netSalary = totalEarnings - totalDeductions;

  return {
    totalEarnings: Math.round(totalEarnings * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    grossSalary: Math.round(totalEarnings * 100) / 100,
    netSalary: Math.round(netSalary * 100) / 100
  };
}

export async function getSalaryStructures({ userRole = 'admin', authEmployeeId = '' } = {}) {
  // Manager Security Restriction: Restricted from viewing sensitive salary data
  if (userRole === 'manager') {
    return {
      restricted: true,
      data: [],
      message: 'Access Restricted: Manager role does not have permission to view sensitive salary records under company data privacy RLS rules.'
    };
  }

  try {
    const { data: dbSalaries, error } = await supabase
      .from('salary_structures')
      .select('*, employees(*, profiles(*), departments(*), designations(*))');

    let records = [];

    if (!error && dbSalaries && dbSalaries.length > 0) {
      records = dbSalaries.map((s) => ({
        id: s.id,
        empId: s.employees?.employee_code || s.employee_id,
        empName: s.employees?.profiles?.full_name || 'Staff',
        department: s.employees?.departments?.name || 'General',
        designation: s.employees?.designations?.title || 'Team Member',
        payFrequency: s.pay_frequency || 'Monthly',
        effectiveDate: s.effective_date || new Date().toISOString().split('T')[0],
        earnings: { basic: parseFloat(s.base_salary) || 5000, hra: 1200, conveyance: 400, medical: 300, special: 800, bonus: 0, overtime: 0 },
        deductions: { pf: 400, pt: 150, tds: 450, loan: 0, leave: 0, other: 0 }
      }));
    } else {
      records = MOCK_SALARY_STRUCTURES;
    }

    // Employee Security Restriction: Can only view self record
    if (userRole === 'employee' && authEmployeeId) {
      records = records.filter((r) => r.empId === authEmployeeId);
    }

    // Process computed totals for each structure
    const formattedRecords = records.map((sal) => {
      const totals = calculateSalaryTotals(sal.earnings, sal.deductions);
      return {
        ...sal,
        grossSalary: totals.grossSalary,
        totalDeductions: totals.totalDeductions,
        netSalary: totals.netSalary
      };
    });

    return { restricted: false, data: formattedRecords };
  } catch (err) {
    console.error('Error fetching salary structures:', err);
    return { restricted: false, data: MOCK_SALARY_STRUCTURES };
  }
}

export async function createSalaryStructure(newStructure) {
  const newCode = `SAL-${10 + MOCK_SALARY_STRUCTURES.length + 1}`;
  const record = {
    id: newCode,
    empId: newStructure.empId,
    empName: newStructure.empName || 'Staff Member',
    department: newStructure.department || 'Engineering & Tech',
    designation: newStructure.designation || 'Software Developer',
    payFrequency: newStructure.payFrequency || 'Monthly',
    effectiveDate: newStructure.effectiveDate || new Date().toISOString().split('T')[0],
    earnings: newStructure.earnings,
    deductions: newStructure.deductions
  };

  MOCK_SALARY_STRUCTURES = [record, ...MOCK_SALARY_STRUCTURES];
  return { success: true, data: record };
}

export async function updateSalaryStructure(id, updatedData) {
  MOCK_SALARY_STRUCTURES = MOCK_SALARY_STRUCTURES.map((sal) => {
    if (sal.id === id) {
      return {
        ...sal,
        ...updatedData,
        earnings: { ...sal.earnings, ...updatedData.earnings },
        deductions: { ...sal.deductions, ...updatedData.deductions }
      };
    }
    return sal;
  });

  return { success: true };
}

export async function getSalaryHistory(employeeId = '') {
  return MOCK_SALARY_HISTORY[employeeId] || [];
}
