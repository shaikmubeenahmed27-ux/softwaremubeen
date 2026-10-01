import { supabase } from '../lib/supabase';
import { getLocalGeneratedPayslips } from './payrollService';

export const COMPANY_DETAILS = {
  name: 'PayFlow HR Technologies Inc.',
  tagline: 'Enterprise Employee Payroll Management System',
  address: '100 SaaS Plaza, Suite 400, San Francisco, CA 94107',
  email: 'payroll@payflowhr.io',
  phone: '+1 (800) 555-PAYFLOW',
  logoText: 'PayFlow HR'
};

export async function getPayslips({ userRole = 'admin', authEmployeeId = '', authUserEmail = '', month = 'All' } = {}) {
  let records = [];

  try {
    const { data: dbSlips, error } = await supabase
      .from('payslips')
      .select('*, payroll_items(*, employees(*, profiles(*), departments(*), designations(*)))');

    if (!error && dbSlips && dbSlips.length > 0) {
      records = dbSlips.map((p) => {
        const emp = p.payroll_items?.employees;
        const profile = emp?.profiles;
        const gross = parseFloat(p.payroll_items?.gross_pay) || parseFloat(p.gross_salary) || parseFloat(p.net_pay) || 0;
        const deductions = parseFloat(p.payroll_items?.deductions) || parseFloat(p.total_deductions) || 0;
        const net = parseFloat(p.payroll_items?.net_pay) || parseFloat(p.net_salary) || (gross - deductions);

        return {
          id: p.id || p.payslip_number,
          payslipNumber: p.payslip_number || p.id,
          payrollItemId: p.payroll_item_id,
          empId: emp?.employee_code || emp?.id || p.employee_id,
          dbEmpId: emp?.id || p.employee_id,
          profileId: profile?.id || emp?.profile_id,
          empEmail: emp?.email || profile?.email || '',
          empName: profile?.full_name || (emp ? `${emp.first_name || ''} ${emp.last_name || ''}`.trim() : 'Staff'),
          department: emp?.departments?.name || 'General',
          designation: emp?.designations?.title || 'Team Member',
          payPeriod: p.pay_period || 'Current Month',
          paymentDate: p.issue_date || new Date().toISOString().split('T')[0],
          paymentMode: 'Direct Bank Transfer',
          bankName: emp?.bank_name || 'Federal Trust Bank',
          accountNumber: emp?.bank_account_number ? `**** **** ${emp.bank_account_number.slice(-4)}` : '**** **** 8888',
          earnings: { basic: gross, hra: 0, conveyance: 0, medical: 0, special: 0, bonus: 0, overtime: 0 },
          deductions: { pf: 0, pt: 0, tds: 0, loan: 0, leave: deductions, other: 0 },
          grossSalary: gross,
          totalDeductions: deductions,
          netSalary: net
        };
      });
    }
  } catch (err) {
    console.warn('Error fetching payslips from Supabase:', err);
  }

  // Merge with locally generated payslips from processed payroll batches
  const localSlips = getLocalGeneratedPayslips();
  const dbIds = new Set(records.map((r) => r.id));
  records = [...records, ...localSlips.filter((l) => !dbIds.has(l.id))];

  // Role Security Enforcement: Employee can ONLY access self payslips
  if (userRole === 'employee') {
    const employeeIdentifiers = new Set();
    if (authEmployeeId) employeeIdentifiers.add(authEmployeeId);
    if (authUserEmail) employeeIdentifiers.add(authUserEmail.toLowerCase());

    // Resolve employee code, profile ID, and employee ID from Supabase employees table
    try {
      if (authEmployeeId || authUserEmail) {
        let query = supabase.from('employees').select('id, profile_id, employee_code, email');
        if (authEmployeeId && authUserEmail) {
          query = query.or(`profile_id.eq.${authEmployeeId},email.eq.${authUserEmail},id.eq.${authEmployeeId},employee_code.eq.${authEmployeeId}`);
        } else if (authEmployeeId) {
          query = query.or(`profile_id.eq.${authEmployeeId},id.eq.${authEmployeeId},employee_code.eq.${authEmployeeId}`);
        } else {
          query = query.eq('email', authUserEmail);
        }
        const { data: matchedEmps } = await query;
        if (matchedEmps && matchedEmps.length > 0) {
          matchedEmps.forEach((e) => {
            if (e.id) employeeIdentifiers.add(e.id);
            if (e.profile_id) employeeIdentifiers.add(e.profile_id);
            if (e.employee_code) employeeIdentifiers.add(e.employee_code);
            if (e.email) employeeIdentifiers.add(e.email.toLowerCase());
          });
        }
      }
    } catch (empLookupErr) {
      console.warn('Employee ID lookup warning:', empLookupErr);
    }

    // Resolve matching employee identifiers from local employees cache
    try {
      const rawCache = localStorage.getItem('payflow_employees_cache_v2');
      if (rawCache) {
        const cachedEmps = JSON.parse(rawCache);
        cachedEmps.forEach((ce) => {
          const isMatch =
            (authEmployeeId && (ce.id === authEmployeeId || ce.dbId === authEmployeeId)) ||
            (authUserEmail && ce.email && ce.email.toLowerCase() === authUserEmail.toLowerCase());
          if (isMatch) {
            if (ce.id) employeeIdentifiers.add(ce.id);
            if (ce.dbId) employeeIdentifiers.add(ce.dbId);
            if (ce.email) employeeIdentifiers.add(ce.email.toLowerCase());
          }
        });
      }
    } catch (cacheErr) {}

    // Filter payslips matching ANY of the resolved employee identifiers
    records = records.filter((r) => {
      const matchId = r.empId && employeeIdentifiers.has(r.empId);
      const matchDbId = r.dbEmpId && employeeIdentifiers.has(r.dbEmpId);
      const matchProfile = r.profileId && employeeIdentifiers.has(r.profileId);
      const matchEmail = r.empEmail && employeeIdentifiers.has(r.empEmail.toLowerCase());
      return matchId || matchDbId || matchProfile || matchEmail;
    });
  }

  if (month !== 'All') {
    records = records.filter((r) => (r.payPeriod || '').includes(month));
  }

  return records;
}

export async function getPayslipDetails(payslipId) {
  const slips = await getPayslips({ userRole: 'admin' });
  const slip = slips.find((p) => p.id === payslipId) || null;
  return {
    company: COMPANY_DETAILS,
    payslip: slip
  };
}
