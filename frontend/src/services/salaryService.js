import { supabase } from '../lib/supabase';

const LOCAL_SALARY_KEY = 'payflow_salary_structures_v1';
const LOCAL_HISTORY_KEY = 'payflow_salary_history_v1';

function getLocalSalaries() {
  try {
    const raw = localStorage.getItem(LOCAL_SALARY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalSalaries(salaries) {
  try {
    localStorage.setItem(LOCAL_SALARY_KEY, JSON.stringify(salaries));
  } catch (err) {
    console.warn('Could not save salaries to localStorage', err);
  }
}

function getLocalHistory() {
  try {
    const raw = localStorage.getItem(LOCAL_HISTORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalHistory(history) {
  try {
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.warn('Could not save salary history to localStorage', err);
  }
}

/**
 * Calculates itemized totals, Gross Salary, and Net Salary
 * Gross Salary = Total Earnings
 * Net Salary = Gross Salary - Total Deductions
 */
export function calculateSalaryTotals(earnings = {}, deductions = {}) {
  const totalEarnings = Object.values(earnings || {}).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
  const totalDeductions = Object.values(deductions || {}).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
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

  let records = [];

  try {
    const { data: dbSalaries, error } = await supabase
      .from('salary_structures')
      .select('*, employees(*, profiles(*), departments(*), designations(*)), salary_components(*)');

    if (!error && dbSalaries && dbSalaries.length > 0) {
      records = dbSalaries.map((s) => {
        const components = s.salary_components || [];
        const earningsObj = {
          basic: parseFloat(s.base_salary) || 0,
          hra: 0,
          conveyance: 0,
          medical: 0,
          special: 0,
          bonus: 0,
          overtime: 0
        };
        const deductionsObj = {
          pf: 0,
          pt: 0,
          tds: 0,
          loan: 0,
          leave: 0,
          other: 0
        };

        components.forEach((c) => {
          const amt = parseFloat(c.amount) || 0;
          const nameLower = (c.name || '').toLowerCase();
          if (c.type === 'allowance') {
            if (nameLower.includes('hra')) earningsObj.hra = amt;
            else if (nameLower.includes('conveyance') || nameLower.includes('travel')) earningsObj.conveyance = amt;
            else if (nameLower.includes('medical')) earningsObj.medical = amt;
            else if (nameLower.includes('special')) earningsObj.special = amt;
            else if (nameLower.includes('bonus')) earningsObj.bonus = amt;
            else if (nameLower.includes('overtime')) earningsObj.overtime = amt;
            else earningsObj.special = (earningsObj.special || 0) + amt;
          } else if (c.type === 'deduction') {
            if (nameLower.includes('pf') || nameLower.includes('provident')) deductionsObj.pf = amt;
            else if (nameLower.includes('pt') || nameLower.includes('professional')) deductionsObj.pt = amt;
            else if (nameLower.includes('tds') || nameLower.includes('tax')) deductionsObj.tds = amt;
            else if (nameLower.includes('loan')) deductionsObj.loan = amt;
            else if (nameLower.includes('leave')) deductionsObj.leave = amt;
            else deductionsObj.other = (deductionsObj.other || 0) + amt;
          }
        });

        return {
          id: s.id,
          empId: s.employees?.employee_code || s.employee_id,
          dbEmployeeId: s.employee_id,
          empName: s.employees?.profiles?.full_name || 'Staff Member',
          department: s.employees?.departments?.name || 'General',
          designation: s.employees?.designations?.title || 'Team Member',
          payFrequency: s.pay_frequency || 'Monthly',
          effectiveDate: s.effective_date || new Date().toISOString().split('T')[0],
          earnings: earningsObj,
          deductions: deductionsObj
        };
      });
    }
  } catch (err) {
    console.warn('Error querying Supabase salary structures:', err);
  }

  // Merge with local persistent storage
  const localList = getLocalSalaries();
  const dbIds = new Set(records.map((r) => r.id));
  const merged = [...records, ...localList.filter((l) => !dbIds.has(l.id))];
  records = merged;

  // Employee Security Restriction: Can only view self record
  if (userRole === 'employee' && authEmployeeId) {
    records = records.filter((r) => r.empId === authEmployeeId || r.dbEmployeeId === authEmployeeId);
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
}

export async function createSalaryStructure(newStructure) {
  const localList = getLocalSalaries();
  const newCode = `SAL-${100 + localList.length + 1}`;

  const record = {
    id: newCode,
    empId: newStructure.empId,
    empName: newStructure.empName || 'Staff Member',
    department: newStructure.department || 'General',
    designation: newStructure.designation || 'Team Member',
    payFrequency: newStructure.payFrequency || 'Monthly',
    effectiveDate: newStructure.effectiveDate || new Date().toISOString().split('T')[0],
    earnings: newStructure.earnings || {},
    deductions: newStructure.deductions || {}
  };

  // 1. Save to localStorage immediately so it survives refresh
  const updatedList = [record, ...localList.filter((r) => r.empId !== record.empId)];
  saveLocalSalaries(updatedList);

  // 2. Add revision log to history
  const totals = calculateSalaryTotals(record.earnings, record.deductions);
  const history = getLocalHistory();
  const empHistory = history[record.empId] || [];
  history[record.empId] = [
    {
      id: `REV-${Date.now().toString().slice(-4)}`,
      effectiveDate: record.effectiveDate,
      grossSalary: totals.grossSalary,
      netSalary: totals.netSalary,
      revisedBy: 'Admin',
      revisedAt: new Date().toISOString().split('T')[0],
      remarks: 'Initial salary structure assignment'
    },
    ...empHistory
  ];
  saveLocalHistory(history);

  // 3. Persist to Supabase in background
  try {
    let empUuid = newStructure.empId;
    if (empUuid && !empUuid.includes('-')) {
      const { data: empRow } = await supabase
        .from('employees')
        .select('id')
        .eq('employee_code', empUuid)
        .maybeSingle();
      if (empRow?.id) empUuid = empRow.id;
    }

    if (empUuid) {
      const baseSalary = parseFloat(newStructure.earnings?.basic) || 0;
      const { data: structRow, error: sErr } = await supabase
        .from('salary_structures')
        .upsert({
          employee_id: empUuid,
          base_salary: baseSalary,
          pay_frequency: newStructure.payFrequency || 'Monthly',
          effective_date: newStructure.effectiveDate || new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        }, { onConflict: 'employee_id' })
        .select('id')
        .single();

      if (structRow?.id) {
        // Insert itemized allowance & deduction components
        const components = [];
        Object.entries(newStructure.earnings || {}).forEach(([k, v]) => {
          if (k !== 'basic' && parseFloat(v) > 0) {
            components.push({
              salary_structure_id: structRow.id,
              type: 'allowance',
              name: k.toUpperCase(),
              amount: parseFloat(v),
              is_percentage: false
            });
          }
        });
        Object.entries(newStructure.deductions || {}).forEach(([k, v]) => {
          if (parseFloat(v) > 0) {
            components.push({
              salary_structure_id: structRow.id,
              type: 'deduction',
              name: k.toUpperCase(),
              amount: parseFloat(v),
              is_percentage: false
            });
          }
        });

        if (components.length > 0) {
          await supabase.from('salary_components').insert(components);
        }
      }
    }
  } catch (err) {
    console.warn('Could not sync salary structure to DB:', err);
  }

  return { success: true, data: record };
}

export async function updateSalaryStructure(id, updatedData) {
  const localList = getLocalSalaries().map((sal) => {
    if (sal.id === id || sal.empId === updatedData.empId) {
      return {
        ...sal,
        ...updatedData,
        earnings: { ...sal.earnings, ...updatedData.earnings },
        deductions: { ...sal.deductions, ...updatedData.deductions }
      };
    }
    return sal;
  });
  saveLocalSalaries(localList);

  // Add revision log to history
  if (updatedData.earnings && updatedData.deductions) {
    const totals = calculateSalaryTotals(updatedData.earnings, updatedData.deductions);
    const history = getLocalHistory();
    const empId = updatedData.empId || id;
    const empHistory = history[empId] || [];
    history[empId] = [
      {
        id: `REV-${Date.now().toString().slice(-4)}`,
        effectiveDate: updatedData.effectiveDate || new Date().toISOString().split('T')[0],
        grossSalary: totals.grossSalary,
        netSalary: totals.netSalary,
        revisedBy: 'Admin',
        revisedAt: new Date().toISOString().split('T')[0],
        remarks: 'Compensation revision and adjustments'
      },
      ...empHistory
    ];
    saveLocalHistory(history);
  }

  // Try DB update
  try {
    if (id && id.includes('-') && id.length > 20) {
      const baseSalary = parseFloat(updatedData.earnings?.basic) || 0;
      await supabase
        .from('salary_structures')
        .update({
          base_salary: baseSalary,
          pay_frequency: updatedData.payFrequency || 'Monthly',
          effective_date: updatedData.effectiveDate || new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
    }
  } catch (err) {
    console.warn('updateSalaryStructure DB sync:', err);
  }

  return { success: true };
}

export async function getSalaryHistory(employeeId = '') {
  const history = getLocalHistory();
  return history[employeeId] || [];
}
