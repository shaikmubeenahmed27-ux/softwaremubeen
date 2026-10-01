import { supabase } from '../lib/supabase';
import { getEmployees } from './employeeService';
import { getAttendanceRecords } from './attendanceService';
import { getLeaveRequests } from './leaveService';
import { getPayrollBatches, getPayrollItems, calculateEmployeePayroll } from './payrollService';

export async function generateReportData({
  reportType = 'payroll',
  month = 'September 2026',
  department = 'All',
  employeeId = 'All',
  status = 'All',
  userRole = 'admin',
  userDept = 'Executive',
  authEmployeeId = ''
} = {}) {
  try {
    switch (reportType) {
      // ─── 1. Employee Report ────────────────────────────────────────────────
      case 'employee': {
        const effectiveDept = userRole === 'manager' ? userDept : department;
        const empRes = await getEmployees({ pageSize: 100, department: effectiveDept });
        let employees = empRes?.data || [];

        if (status !== 'All') {
          employees = employees.filter((e) => (e.status || '').toLowerCase() === status.toLowerCase());
        }

        const rows = employees.map((e) => ({
          employeeCode: e.id || 'EMP',
          employeeName: e.fullName || e.name || 'Staff Member',
          department: e.department || 'General',
          designation: e.designation || 'Team Member',
          employmentType: e.employmentType || 'Full-time',
          joiningDate: e.joiningDate || '—',
          status: e.status || 'Active'
        }));

        const totalActive = rows.filter((r) => (r.status || '').toLowerCase() === 'active').length;
        const ftCount = rows.filter((r) => (r.employmentType || '').toLowerCase().includes('full')).length;
        const ftRatio = rows.length > 0 ? Math.round((ftCount / rows.length) * 100) : 100;

        return {
          title: 'Employee Headcount & Department Distribution Report',
          summary: {
            kpi1Label: 'Total Headcount',
            kpi1Value: `${rows.length} Staff`,
            kpi2Label: 'Active Employees',
            kpi2Value: `${totalActive} Active`,
            kpi3Label: 'Full-Time Ratio',
            kpi3Value: `${ftRatio}%`
          },
          rows
        };
      }

      // ─── 2. Attendance Report ──────────────────────────────────────────────
      case 'attendance': {
        let attRecords = await getAttendanceRecords({
          department,
          status,
          userRole,
          userDept,
          authEmployeeId
        });

        if (employeeId !== 'All') {
          attRecords = attRecords.filter((a) => a.empId === employeeId || a._employeeId === employeeId);
        }

        const rows = attRecords.map((a) => ({
          date: a.date || '—',
          employeeCode: a.empId || 'EMP',
          employeeName: a.empName || 'Employee',
          department: a.department || 'General',
          checkIn: a.checkIn || '--:--',
          checkOut: a.checkOut || '--:--',
          regularHours: `${(parseFloat(a.workHours) || 0).toFixed(1)} hrs`,
          overtimeHours: `${(parseFloat(a.overtimeHours) || 0).toFixed(1)} hrs`,
          attendanceStatus: a.status || 'Present'
        }));

        const totalWorkHours = attRecords.reduce((acc, r) => acc + (parseFloat(r.workHours) || 0), 0);
        const presentCount = attRecords.filter((r) => (r.status || '').toLowerCase() === 'present').length;
        const rate = attRecords.length > 0 ? Math.round((presentCount / attRecords.length) * 100) : 100;

        if (userRole === 'employee') {
          return {
            title: 'My Attendance Logs & Work Hours Report',
            summary: {
              kpi1Label: 'My Logged Days',
              kpi1Value: `${rows.length} Days`,
              kpi2Label: 'My Total Work Hours',
              kpi2Value: `${totalWorkHours.toFixed(1)} hrs`,
              kpi3Label: 'My Punctuality Rate',
              kpi3Value: `${rate}%`
            },
            rows
          };
        }

        return {
          title: userRole === 'manager' ? `Team Attendance & Shift Audit Report — ${userDept}` : 'Attendance, Punctuality & Overtime Audit Report',
          summary: {
            kpi1Label: 'Total Shift Logs',
            kpi1Value: `${rows.length} Records`,
            kpi2Label: 'Total Work Hours',
            kpi2Value: `${totalWorkHours.toFixed(1)} hrs`,
            kpi3Label: 'Present Punctuality',
            kpi3Value: `${rate}%`
          },
          rows
        };
      }

      // ─── 3. Leave Report ───────────────────────────────────────────────────
      case 'leave': {
        const effectiveDept = userRole === 'manager' ? userDept : department;
        let leaveList = await getLeaveRequests({
          userRole,
          userDept: effectiveDept,
          authEmployeeId,
          statusFilter: status
        });

        if (effectiveDept !== 'All') {
          leaveList = leaveList.filter((l) => l.department === effectiveDept);
        }

        if (employeeId !== 'All') {
          leaveList = leaveList.filter((l) => l.empId === employeeId || l.employee_id === employeeId);
        }

        const rows = leaveList.map((l) => ({
          requestID: l.id || 'REQ',
          employeeName: l.empName || 'Employee',
          department: l.department || 'General',
          leaveCategory: l.leaveType || 'Casual Leave',
          duration: `${l.totalDays || 1} Days`,
          period: `${l.startDate || ''} to ${l.endDate || ''}`,
          reason: l.reason || 'General Leave',
          status: l.status || 'Pending'
        }));

        const approvedCount = leaveList.filter((l) => l.status === 'Approved').length;
        const pendingCount = leaveList.filter((l) => l.status === 'Pending').length;

        if (userRole === 'employee') {
          return {
            title: 'My Leave History & Utilization Report',
            summary: {
              kpi1Label: 'My Leave Requests',
              kpi1Value: `${rows.length} Total`,
              kpi2Label: 'Approved Leaves',
              kpi2Value: `${approvedCount} Approved`,
              kpi3Label: 'Pending Reviews',
              kpi3Value: `${pendingCount} Pending`
            },
            rows
          };
        }

        return {
          title: userRole === 'manager' ? `Team Leave Applications & Utilization Report — ${userDept}` : 'Leave Applications & Balance Utilization Report',
          summary: {
            kpi1Label: 'Total Requests',
            kpi1Value: `${rows.length} Total`,
            kpi2Label: 'Approved Leaves',
            kpi2Value: `${approvedCount} Approved`,
            kpi3Label: 'Pending Reviews',
            kpi3Value: `${pendingCount} Pending`
          },
          rows
        };
      }

      // ─── 4. Payroll Report ─────────────────────────────────────────────────
      case 'payroll':
      default: {
        const batches = await getPayrollBatches();
        let allItems = [];

        for (const b of batches) {
          const itms = await getPayrollItems(b.id);
          if (itms && itms.length > 0) {
            allItems = [...allItems, ...itms];
          }
        }

        // If no batches have been run yet, project active directory employees
        if (batches.length === 0 || allItems.length === 0) {
          const empRes = await getEmployees({ pageSize: 100 });
          const emps = empRes?.data || [];
          if (emps.length > 0) {
            for (const emp of emps) {
              const calc = await calculateEmployeePayroll(emp.id || emp.dbId, '09', '2026', emp);
              allItems.push({
                id: `PROJ-${emp.id || emp.dbId}`,
                batchId: 'PROJECTED',
                empId: emp.id || emp.dbId,
                empName: emp.fullName || emp.name || calc.empName,
                department: emp.department || calc.department || 'General',
                basicSalary: calc.basicSalary || 0,
                allowances: calc.allowances || 0,
                grossSalary: calc.grossSalary || 0,
                totalDeductions: calc.totalDeductions || 0,
                netSalary: calc.netSalary || 0,
                status: 'Projected'
              });
            }
          }
        }

        if (userRole === 'employee' && authEmployeeId) {
          allItems = allItems.filter((i) => i.empId === authEmployeeId || i.id === authEmployeeId || i.id === `PROJ-${authEmployeeId}`);
        } else if (department !== 'All') {
          allItems = allItems.filter((i) => i.department === department);
        }

        if (status !== 'All') {
          allItems = allItems.filter((i) => (i.status || '').toLowerCase() === status.toLowerCase());
        }

        const rows = allItems.map((item) => ({
          payrollBatch: item.batchId || 'PAY-CYCLE',
          employeeCode: item.empId || 'EMP',
          employeeName: item.empName || 'Staff Member',
          department: item.department || 'General',
          basicSalary: `$${(Number(item.basicSalary) || 0).toLocaleString()}`,
          allowances: `$${(Number(item.allowances) || 0).toLocaleString()}`,
          grossSalary: `$${(Number(item.grossSalary) || 0).toLocaleString()}`,
          totalDeductions: `-$${(Number(item.totalDeductions) || 0).toLocaleString()}`,
          netPayable: `$${(Number(item.netSalary) || 0).toLocaleString()}`,
          status: item.status || 'Calculated'
        }));

        const totalGross = allItems.reduce((acc, i) => acc + (Number(i.grossSalary) || 0), 0);
        const totalNet = allItems.reduce((acc, i) => acc + (Number(i.netSalary) || 0), 0);
        const totalDeductions = allItems.reduce((acc, i) => acc + (Number(i.totalDeductions) || 0), 0);
        const totalStaff = allItems.length;

        if (userRole === 'employee') {
          return {
            title: 'My Payslip & Compensation Summary Report',
            summary: {
              kpi1Label: 'My Net Payout',
              kpi1Value: `$${totalNet.toLocaleString()}`,
              kpi2Label: 'My Gross Earnings',
              kpi2Value: `$${totalGross.toLocaleString()}`,
              kpi3Label: 'Total Deductions',
              kpi3Value: `$${totalDeductions.toLocaleString()}`
            },
            rows
          };
        }

        return {
          title: 'Monthly Payroll Expenditure, Compensation & Tax Audit Report',
          summary: {
            kpi1Label: batches.length > 0 ? 'Total Net Disbursed' : 'Projected Net Payroll',
            kpi1Value: `$${totalNet.toLocaleString()}`,
            kpi2Label: 'Gross Payroll Expense',
            kpi2Value: `$${totalGross.toLocaleString()}`,
            kpi3Label: 'Processed Workforce',
            kpi3Value: `${totalStaff} Employees`
          },
          rows
        };
      }
    }
  } catch (err) {
    console.error('generateReportData error:', err);
    return {
      title: 'Analytics Report',
      summary: { kpi1Label: 'Total Records', kpi1Value: '0', kpi2Label: 'Filter Status', kpi2Value: 'Active', kpi3Label: 'Export Status', kpi3Value: 'Ready' },
      rows: []
    };
  }
}

/**
 * Formats report JSON data into a downloadable CSV spreadsheet file.
 */
export function exportReportToCSV(reportType, reportData) {
  if (!reportData || !reportData.rows || reportData.rows.length === 0) {
    alert('No records available in this report to export.');
    return;
  }

  const headers = Object.keys(reportData.rows[0]);
  const csvLines = [];

  // Header line
  csvLines.push(headers.map((h) => `"${h.replace(/([A-Z])/g, ' $1').toUpperCase()}"`).join(','));

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
