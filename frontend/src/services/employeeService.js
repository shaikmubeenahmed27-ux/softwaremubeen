import { supabase } from '../lib/supabase';
import { getLeaveBalances } from './leaveService';

const LOCAL_EMP_KEY = 'payflow_employees_cache_v2';

function getLocalEmployees() {
  try {
    const raw = localStorage.getItem(LOCAL_EMP_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalEmployees(records) {
  try {
    localStorage.setItem(LOCAL_EMP_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('Could not save employees to localStorage', err);
  }
}

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
      records = dbEmployees.map((e) => {
        const fullName = `${e.first_name || ''} ${e.last_name || ''}`.trim() || e.profiles?.full_name || 'Staff Member';
        const hasCustomAvatar = e.profiles?.avatar_url && !e.profiles.avatar_url.includes('1494790108377');
        return {
          id: e.employee_code || e.id,
          dbId: e.id,
          firstName: e.first_name || e.profiles?.full_name?.split(' ')[0] || 'Staff',
          lastName: e.last_name || e.profiles?.full_name?.split(' ')[1] || '',
          fullName,
          email: e.email || e.profiles?.email || '',
          avatar: hasCustomAvatar ? e.profiles.avatar_url : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=3b82f6&color=fff&bold=true`,
          department: e.departments?.name || 'General',
          designation: e.designations?.title || 'Team Member',
          status: e.status || 'active',
          joiningDate: e.joining_date || new Date().toISOString().split('T')[0],
          employmentType: e.employment_type || 'Full-time'
        };
      });

      // Merge local-only employees that might not be in DB yet
      const localOnly = getLocalEmployees();
      const dbIds = new Set(records.map((r) => r.id));
      const combined = [...records, ...localOnly.filter((l) => !dbIds.has(l.id))];
      saveLocalEmployees(combined);
      records = combined;
    } else {
      records = getLocalEmployees();
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
  const list = getLocalEmployees();
  const found = list.find((e) => e.id === id || e.dbId === id);
  return found || null;
}

export async function createEmployee(newEmployeeData) {
  const newCode = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
  const email = (newEmployeeData.email || '').trim();
  const firstName = newEmployeeData.firstName?.trim() || '';
  const lastName = newEmployeeData.lastName?.trim() || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Team Member';
  const requestedDept = newEmployeeData.department || 'Engineering & Tech';
  const requestedDesig = newEmployeeData.designation || 'Team Member';

  try {
    // 1. Resolve Department ID if selected (or create department if missing)
    let deptId = null;
    try {
      const { data: depts } = await supabase
        .from('departments')
        .select('id, name');

      if (depts && depts.length > 0) {
        const cleanReq = requestedDept.toLowerCase().split('&')[0].trim();
        const found = depts.find((d) => d.name.toLowerCase().includes(cleanReq));
        if (found) deptId = found.id;
      }

      if (!deptId) {
        const deptCode = requestedDept.replace(/[^A-Z]/gi, '').toUpperCase().slice(0, 5) || 'DEPT';
        const { data: newDept } = await supabase
          .from('departments')
          .insert({ name: requestedDept, code: deptCode })
          .select('id')
          .maybeSingle();
        if (newDept?.id) deptId = newDept.id;
      }
    } catch (dErr) {
      console.warn('Could not resolve/create department:', dErr);
    }

    // 2. Resolve Designation ID if selected
    let desigId = null;
    try {
      let query = supabase.from('designations').select('id, title, department_id');
      if (deptId) query = query.eq('department_id', deptId);
      const { data: desigs } = await query;

      if (desigs && desigs.length > 0) {
        const found = desigs.find((d) => d.title.toLowerCase().includes(requestedDesig.toLowerCase()));
        if (found) desigId = found.id;
      }

      if (!desigId && deptId) {
        const { data: newDesig } = await supabase
          .from('designations')
          .insert({
            title: requestedDesig,
            department_id: deptId,
            seniority_band: 'L3',
            pay_range_min: 4000,
            pay_range_max: 12000
          })
          .select('id')
          .maybeSingle();
        if (newDesig?.id) desigId = newDesig.id;
      }
    } catch (desErr) {
      console.warn('Could not resolve/create designation:', desErr);
    }

    // 3. Resolve profile ID if this email already exists in profiles
    let profileId = null;
    if (email) {
      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .maybeSingle();
        if (existingProfile?.id) profileId = existingProfile.id;
      } catch (pErr) {
        console.warn('Profile lookup warning:', pErr);
      }
    }

    // 4. Insert into Supabase `employees` table
    const empPayload = {
      profile_id: profileId,
      employee_code: newCode,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: newEmployeeData.phone || '',
      department_id: deptId,
      designation_id: desigId,
      joining_date: newEmployeeData.joiningDate || new Date().toISOString().split('T')[0],
      employment_type: newEmployeeData.employmentType || 'Full-time',
      status: 'active'
    };

    const { data: insertedEmp, error: empErr } = await supabase
      .from('employees')
      .insert([empPayload])
      .select('*, departments(*), designations(*), profiles(*)')
      .single();

    if (empErr) {
      console.error('Supabase employee insert error:', empErr);
      throw empErr;
    }

    const record = {
      id: insertedEmp.employee_code || insertedEmp.id,
      dbId: insertedEmp.id,
      firstName: insertedEmp.first_name || firstName,
      lastName: insertedEmp.last_name || lastName,
      fullName: `${insertedEmp.first_name || ''} ${insertedEmp.last_name || ''}`.trim() || fullName,
      email: insertedEmp.email || email,
      department: insertedEmp.departments?.name || requestedDept,
      designation: insertedEmp.designations?.title || requestedDesig,
      joiningDate: insertedEmp.joining_date,
      employmentType: insertedEmp.employment_type,
      status: insertedEmp.status
    };

    saveLocalEmployees([record, ...getLocalEmployees().filter((e) => e.id !== record.id)]);
    try { window.dispatchEvent(new Event('payflow:employees_updated')); } catch {}
    return { success: true, data: record };
  } catch (err) {
    console.error('Failed to insert employee into Supabase:', err);

    const record = {
      id: newCode,
      dbId: `db_${Date.now()}`,
      firstName: firstName,
      lastName: lastName,
      fullName: fullName,
      email: email,
      department: requestedDept,
      designation: requestedDesig,
      joiningDate: newEmployeeData.joiningDate || new Date().toISOString().split('T')[0],
      employmentType: newEmployeeData.employmentType || 'Full-time',
      status: 'active'
    };
    saveLocalEmployees([record, ...getLocalEmployees().filter((e) => e.id !== record.id)]);
    try { window.dispatchEvent(new Event('payflow:employees_updated')); } catch {}

    const isRlsOrNetwork = err?.code === '42501' || err?.message?.includes('row-level security') || !navigator.onLine;
    if (isRlsOrNetwork) {
      console.warn('Supabase RLS blocked insert — saved to local cache. Apply migration 06 to fix DB policies.');
      return { success: true, data: record, warning: 'Saved locally. Please run migration 06 in Supabase SQL editor to sync with cloud database.' };
    }
    return { error: err, data: record };
  }
}

export async function updateEmployee(id, updatedFields) {
  try {
    const { error } = await supabase
      .from('employees')
      .update({
        employment_type: updatedFields.employmentType,
        joining_date: updatedFields.joiningDate,
        status: updatedFields.status
      })
      .or(`id.eq.${id},employee_code.eq.${id}`);

    if (error) console.warn('Supabase update warning:', error);
  } catch (err) {
    console.error('Error updating employee in Supabase:', err);
  }

  const updated = getLocalEmployees().map((emp) => {
    if (emp.id === id || emp.dbId === id) {
      return {
        ...emp,
        ...updatedFields,
        fullName: updatedFields.firstName && updatedFields.lastName ? `${updatedFields.firstName} ${updatedFields.lastName}` : emp.fullName
      };
    }
    return emp;
  });
  saveLocalEmployees(updated);
  return { success: true };
}

// Soft Deletion: Update status to 'inactive' or 'terminated'
export async function deactivateEmployee(id) {
  try {
    const { error } = await supabase
      .from('employees')
      .update({ status: 'terminated' })
      .or(`id.eq.${id},employee_code.eq.${id}`);

    if (error) console.warn('Supabase deactivation warning:', error);
  } catch (err) {
    console.error('Error deactivating employee in Supabase:', err);
  }

  const updated = getLocalEmployees().map((emp) => {
    if (emp.id === id || emp.dbId === id) {
      return { ...emp, status: 'terminated' };
    }
    return emp;
  });
  saveLocalEmployees(updated);
  return { success: true };
}

// Permanent Deletion: Remove employee row completely
export async function deleteEmployee(id) {
  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .or(`id.eq.${id},employee_code.eq.${id}`);

    if (error) console.warn('Supabase delete warning:', error);
  } catch (err) {
    console.error('Error deleting employee from Supabase:', err);
  }

  const updated = getLocalEmployees().filter((emp) => emp.id !== id && emp.dbId !== id);
  saveLocalEmployees(updated);
  return { success: true };
}

// Tabbed details for Employee Profile View
export async function getEmployeeTabDetails(employeeId) {
  let balances = [];
  try {
    balances = await getLeaveBalances(employeeId);
  } catch {
    balances = [];
  }

  return {
    attendance: [],
    leave: {
      balances,
      history: []
    },
    salary: {
      basePay: '$0.00',
      allowances: [],
      deductions: [],
      netMonthly: '$0.00'
    },
    payroll: [],
    payslips: []
  };
}
