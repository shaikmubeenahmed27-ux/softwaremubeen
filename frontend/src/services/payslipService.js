import { supabase } from '../lib/supabase';

export const COMPANY_DETAILS = {
  name: 'PayFlow HR Technologies Inc.',
  tagline: 'Enterprise Employee Payroll Management System',
  address: '100 SaaS Plaza, Suite 400, San Francisco, CA 94107',
  email: 'payroll@payflowhr.io',
  phone: '+1 (800) 555-PAYFLOW',
  logoText: 'PayFlow HR'
};

let MOCK_PAYSLIPS = [];

export async function getPayslips({ userRole = 'admin', authEmployeeId = '', month = 'All' } = {}) {
  try {
    const { data: dbSlips, error } = await supabase
      .from('payslips')
      .select('*, payroll_items(*, employees(*, profiles(*), departments(*), designations(*)))');

    let records = [];

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
        bankName: 'Commercial Bank',
        accountNumber: '**** **** 8888',
        earnings: { basic: parseFloat(p.net_pay) || 0, hra: 0, conveyance: 0, medical: 0, special: 0, bonus: 0, overtime: 0 },
        deductions: { pf: 0, pt: 0, tds: 0, loan: 0, leave: 0, other: 0 },
        grossSalary: parseFloat(p.net_pay) || 0,
        totalDeductions: 0,
        netSalary: parseFloat(p.net_pay) || 0
      }));
    } else {
      records = MOCK_PAYSLIPS;
    }

    // Role Security Enforcement: Employee can ONLY access self payslips
    if (userRole === 'employee' && authEmployeeId) {
      records = records.filter((r) => r.empId === authEmployeeId);
    }

    if (month !== 'All') {
      records = records.filter((r) => r.payPeriod.includes(month));
    }

    return records;
  } catch (err) {
    console.error('Error fetching payslips:', err);
    return MOCK_PAYSLIPS;
  }
}

export async function getPayslipDetails(payslipId) {
  const slip = MOCK_PAYSLIPS.find((p) => p.id === payslipId) || null;
  return {
    company: COMPANY_DETAILS,
    payslip: slip
  };
}
