import { supabase } from '../lib/supabase';

export async function generateReportData({
  reportType = 'employee',
  dateRange = '2026-08-01 to 2026-08-31',
  month = 'August 2026',
  department = 'All',
  employeeId = 'All',
  status = 'All',
  userRole = 'admin',
  userDept = 'Executive',
  authEmployeeId = ''
} = {}) {
  try {
    switch (reportType) {
      case 'employee': {
        const { data: dbEmp } = await supabase.from('employees').select('*, departments(*), designations(*)');
        const rows = (dbEmp || []).map((e) => ({
          code: e.employee_code || e.id,
          name: `${e.first_name || ''} ${e.last_name || ''}`.trim() || 'Employee',
          dept: e.departments?.name || 'General',
          title: e.designations?.title || 'Staff',
          status: e.status || 'Active',
          joinDate: e.joining_date || ''
        }));
        return {
          title: 'Employee Headcount & Demographic Analytics',
          summary: { kpi1Label: 'Total Active Staff', kpi1Value: String(rows.length), kpi2Label: 'New Joiners', kpi2Value: '0', kpi3Label: 'Full-Time Ratio', kpi3Value: rows.length > 0 ? '100%' : '0%' },
          rows
        };
      }

      case 'attendance': {
        const { data: dbAtt } = await supabase.from('attendance').select('*, employees(*)');
        const rows = (dbAtt || []).map((a) => ({
          code: a.employees?.employee_code || a.employee_id,
          name: a.employees?.first_name || 'Staff',
          dept: 'General',
          presentDays: a.status === 'Present' ? 1 : 0,
          absentDays: a.status === 'Absent' ? 1 : 0,
          workHours: parseFloat(a.work_hours) || 0,
          status: a.status
        }));
        return {
          title: 'Attendance & Punctuality Audit Report',
          summary: { kpi1Label: 'Total Attendance Logs', kpi1Value: String(rows.length), kpi2Label: 'Total Work Hours', kpi2Value: `${rows.reduce((acc, r) => acc + r.workHours, 0)} hrs`, kpi3Label: 'Present Rate', kpi3Value: rows.length > 0 ? '100%' : '0%' },
          rows
        };
      }

      case 'leave': {
        const { data: dbLeaves } = await supabase.from('leave_requests').select('*, employees(*), leave_types(*)');
        const rows = (dbLeaves || []).map((l) => ({
          code: l.employees?.employee_code || l.employee_id,
          name: l.employees?.first_name || 'Staff',
          dept: 'General',
          type: l.leave_types?.name || 'Leave',
          duration: `${l.total_days} Days`,
          status: l.status,
          period: `${l.start_date} - ${l.end_date}`
        }));
        return {
          title: 'Leave Application & Utilization Audit Report',
          summary: { kpi1Label: 'Total Applications', kpi1Value: String(rows.length), kpi2Label: 'Approved Days', kpi2Value: `${rows.filter(r => r.status === 'approved').length} Days`, kpi3Label: 'Pending Days', kpi3Value: `${rows.filter(r => r.status === 'pending').length} Days` },
          rows
        };
      }

      case 'payroll': {
        const { data: dbPayroll } = await supabase.from('payroll').select('*');
        const rows = (dbPayroll || []).map((p) => ({
          cycle: p.cycle_name,
          month: p.month,
          year: p.year,
          gross: `\$${p.total_gross || 0}`,
          net: `\$${p.net_total || 0}`,
          status: p.status
        }));
        return {
          title: 'Monthly Payroll Expenditure & Tax Audit Report',
          summary: { kpi1Label: 'Total Payroll Cycles', kpi1Value: String(rows.length), kpi2Label: 'Total Gross Disbursed', kpi2Value: '\$0.00', kpi3Label: 'Net Disbursed Pay', kpi3Value: '\$0.00' },
          rows
        };
      }

      default:
        return { title: 'Report Data', summary: { kpi1Label: 'Total Records', kpi1Value: '0', kpi2Label: 'Filter Status', kpi2Value: 'Active', kpi3Label: 'Export Status', kpi3Value: 'Ready' }, rows: [] };
    }
  } catch (err) {
    return { title: 'Report Data', summary: { kpi1Label: 'Total Records', kpi1Value: '0', kpi2Label: 'Filter Status', kpi2Value: 'Active', kpi3Label: 'Export Status', kpi3Value: 'Ready' }, rows: [] };
  }
}

/**
 * Formats report JSON data into a downloadable CSV spreadsheet file.
 */
export function exportReportToCSV(reportType, reportData) {
  if (!reportData || !reportData.rows || reportData.rows.length === 0) return;

  const headers = Object.keys(reportData.rows[0]);
  const csvLines = [];

  // Header line
  csvLines.push(headers.map((h) => `"${h.toUpperCase()}"`).join(','));

  // Data rows
  reportData.rows.forEach((row) => {
    const line = headers.map((h) => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(',');
    csvLines.push(line);
  });

  const csvString = csvLines.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `PayFlow_HR_${reportType.toUpperCase()}_Report_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
