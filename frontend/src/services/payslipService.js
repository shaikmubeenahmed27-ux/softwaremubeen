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

export async function getPayslips({ userRole = 'admin', authEmployeeId = '', month = 'All' } = {}) {
  let records = [];

  try {
    const { data: dbSlips, error } = await supabase
      .from('payslips')
      .select('*, payroll_items(*, employees(*, profiles(*), departments(*), designations(*)))');

    if (!error && dbSlips && dbSlips.length > 0) {
      records = dbSlips.map((p) => ({
        id: p.id,
        payrollItemId: p.payroll_item_id,
        empId: p.payroll_items?.employees?.employee_code || p.employee_id,
        empName: p.payroll_items?.employees?.profiles?.full_name || 'Staff',
        department: p.payroll_items?.employees?.departments?.name || 'General',
        designation: p.payroll_items?.employees?.designations?.title || 'Team Member',
        payPeriod: 'Current Month',
        paymentDate: p.issue_date || new Date().toISOString().split('T')[0],
        paymentMode: 'Direct Bank Transfer',
        bankName: 'Federal Trust Bank',
        accountNumber: '**** **** 8888',
        earnings: { basic: parseFloat(p.net_pay) || 0, hra: 0, conveyance: 0, medical: 0, special: 0, bonus: 0, overtime: 0 },
        deductions: { pf: 0, pt: 0, tds: 0, loan: 0, leave: 0, other: 0 },
        grossSalary: parseFloat(p.net_pay) || 0,
        totalDeductions: 0,
        netSalary: parseFloat(p.net_pay) || 0
      }));
    }
  } catch (err) {
    console.warn('Error fetching payslips from Supabase:', err);
  }

  // Merge with locally generated payslips from processed payroll batches
  const localSlips = getLocalGeneratedPayslips();
  const dbIds = new Set(records.map((r) => r.id));
  records = [...records, ...localSlips.filter((l) => !dbIds.has(l.id))];

  // Role Security Enforcement: Employee can ONLY access self payslips
  if (userRole === 'employee' && authEmployeeId) {
    records = records.filter((r) => r.empId === authEmployeeId);
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
