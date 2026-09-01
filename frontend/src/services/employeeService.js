import { supabase } from '../lib/supabase';

// Empty store for clean production usage — populates strictly from database and user entry
let MOCK_EMPLOYEES_STORE = [];

export async function getEmployees({
  search = '',
  department = 'All',
  status = 'All',
  employmentType = 'All',
  sortBy = 'name',
  sortOrder = 'asc',
  page = 1,
  pageSize = 5
} = {}) {
  try {
    // Query Supabase database first
    const { data: dbEmployees, error } = await supabase
      .from('employees')
      .select('*, profiles(*), departments(*), designations(*)');

    let records = [];

    if (!error && dbEmployees && dbEmployees.length > 0) {
      records = dbEmployees.map((e) => ({
        id: e.employee_code || e.id,
        dbId: e.id,
        firstName: e.first_name || e.profiles?.full_name?.split(' ')[0] || 'Staff',
        lastName: e.last_name || e.profiles?.full_name?.split(' ')[1] || '',
        fullName: `${e.first_name || ''} ${e.last_name || ''}`.trim() || e.profiles?.full_name || 'Staff Member',
        email: e.email || e.profiles?.email || '',
        avatar: e.profiles?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        department: e.departments?.name || 'General',
        designation: e.designations?.title || 'Team Member',
        status: e.status || 'active',
        joiningDate: e.joining_date || new Date().toISOString().split('T')[0],
        employmentType: e.employment_type || 'Full-time'
      }));
    } else {
      records = MOCK_EMPLOYEES_STORE;
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      records = records.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q)
      );
    }

    // Department filter
    if (department !== 'All') {
      records = records.filter((e) => e.department === department);
    }

    // Status filter
    if (status !== 'All') {
      records = records.filter((e) => e.status === status);
    }

    // Employment Type filter
    if (employmentType !== 'All') {
      records = records.filter((e) => e.employmentType === employmentType);
    }

    // Sorting
    records = [...records].sort((a, b) => {
      let valA = a.fullName;
      let valB = b.fullName;

      if (sortBy === 'id') {
        valA = a.id;
        valB = b.id;
      } else if (sortBy === 'joiningDate') {
        valA = a.joiningDate;
        valB = b.joiningDate;
      }

      if (sortOrder === 'asc') {
        return valA.localeCompare(valB);
      }
      return valB.localeCompare(valA);
    });

    // Pagination
    const totalCount = records.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedRecords = records.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedRecords,
      totalCount,
      totalPages,
      currentPage: page
    };
  } catch (err) {
    console.error('Error fetching employees:', err);
    return { data: MOCK_EMPLOYEES_STORE, totalCount: MOCK_EMPLOYEES_STORE.length, totalPages: 1, currentPage: 1 };
  }
}

export async function getEmployeeById(id) {
  const found = MOCK_EMPLOYEES_STORE.find((e) => e.id === id || e.dbId === id);
  return found || null;
}

export async function createEmployee(newEmployeeData) {
  const newCode = `EMP-${100 + MOCK_EMPLOYEES_STORE.length + 1}`;
  const record = {
    id: newCode,
    dbId: `db_${Date.now()}`,
    firstName: newEmployeeData.firstName,
    lastName: newEmployeeData.lastName,
    fullName: `${newEmployeeData.firstName} ${newEmployeeData.lastName}`,
    email: newEmployeeData.email,
    phone: newEmployeeData.phone || '',
    avatar: newEmployeeData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    dateOfBirth: newEmployeeData.dateOfBirth || '',
    gender: newEmployeeData.gender || 'Other',
    address: newEmployeeData.address || '',
    department: newEmployeeData.department || 'General',
    designation: newEmployeeData.designation || 'Team Member',
    manager: newEmployeeData.manager || 'None',
    joiningDate: newEmployeeData.joiningDate || new Date().toISOString().split('T')[0],
    employmentType: newEmployeeData.employmentType || 'Full-time',
    status: 'active',
    role: 'employee'
  };

  try {
    // Save to Supabase if connected
    await supabase.from('employees').insert([
      {
        employee_code: newCode,
        first_name: newEmployeeData.firstName,
        last_name: newEmployeeData.lastName,
        email: newEmployeeData.email,
        phone: newEmployeeData.phone,
        joining_date: newEmployeeData.joiningDate || new Date().toISOString().split('T')[0],
        employment_type: newEmployeeData.employmentType || 'Full-time',
        status: 'active'
      }
    ]);
  } catch (err) {
    console.warn('Saved to local employee store:', err);
  }

  MOCK_EMPLOYEES_STORE = [record, ...MOCK_EMPLOYEES_STORE];
  return { success: true, data: record };
}

export async function updateEmployee(id, updatedFields) {
  MOCK_EMPLOYEES_STORE = MOCK_EMPLOYEES_STORE.map((emp) => {
    if (emp.id === id || emp.dbId === id) {
      return {
        ...emp,
        ...updatedFields,
        fullName: updatedFields.firstName && updatedFields.lastName ? `${updatedFields.firstName} ${updatedFields.lastName}` : emp.fullName
      };
    }
    return emp;
  });
  return { success: true };
}

// Soft Deletion: Update status to 'inactive' or 'terminated'
export async function deactivateEmployee(id) {
  MOCK_EMPLOYEES_STORE = MOCK_EMPLOYEES_STORE.map((emp) => {
    if (emp.id === id || emp.dbId === id) {
      return { ...emp, status: 'inactive' };
    }
    return emp;
  });
  return { success: true };
}

// Tabbed details for Employee Profile View
export async function getEmployeeTabDetails(employeeId) {
  return {
    attendance: [],
    leave: {
      balances: [
        { type: 'Casual Leave', allocated: 10, used: 0, remaining: 10 },
        { type: 'Sick Leave', allocated: 12, used: 0, remaining: 12 },
        { type: 'Earned Leave', allocated: 20, used: 0, remaining: 20 }
      ],
      history: []
    },
    salary: {
      basePay: '\$0.00',
      allowances: [],
      deductions: [],
      netMonthly: '\$0.00'
    },
    payroll: [],
    payslips: []
  };
}
