-- ============================================================================
-- PayFlow HR - Phase 2: PostgreSQL / Supabase Schema & Row Level Security (RLS)
-- ============================================================================

-- Enable pgcrypto extension for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up existing objects if re-running
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payslips CASCADE;
DROP TABLE IF EXISTS payroll_items CASCADE;
DROP TABLE IF EXISTS payroll CASCADE;
DROP TABLE IF EXISTS salary_components CASCADE;
DROP TABLE IF EXISTS salary_structures CASCADE;
DROP TABLE IF EXISTS leave_balances CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS leave_types CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS designations CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked to auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'employee')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 2. DEPARTMENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL,
    head_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    monthly_budget NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    status TEXT DEFAULT 'Active' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 3. DESIGNATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE designations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    seniority_band TEXT NOT NULL,
    pay_range_min NUMERIC(12, 2) DEFAULT 0.00,
    pay_range_max NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 4. EMPLOYEES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    employee_code TEXT UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    designation_id UUID REFERENCES designations(id) ON DELETE SET NULL,
    manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    joining_date DATE NOT NULL,
    employment_type TEXT DEFAULT 'Full-time' NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'on_leave', 'terminated')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 5. ATTENDANCE TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    work_hours NUMERIC(4, 2) DEFAULT 0.00,
    overtime_hours NUMERIC(4, 2) DEFAULT 0.00,
    status TEXT DEFAULT 'present' CHECK (status IN ('present', 'late', 'half_day', 'absent', 'on_leave')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(employee_id, date)
);

-- ----------------------------------------------------------------------------
-- 6. LEAVE_TYPES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    default_days_per_year INT DEFAULT 12 NOT NULL,
    is_paid BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 7. LEAVE_REQUESTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL CHECK (total_days > 0),
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 8. LEAVE_BALANCES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
    allocated_days INT NOT NULL,
    used_days INT DEFAULT 0 NOT NULL,
    year INT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(employee_id, leave_type_id, year)
);

-- ----------------------------------------------------------------------------
-- 9. SALARY_STRUCTURES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE salary_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID UNIQUE NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    base_salary NUMERIC(12, 2) NOT NULL,
    pay_frequency TEXT DEFAULT 'Monthly' NOT NULL,
    effective_date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 10. SALARY_COMPONENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE salary_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salary_structure_id UUID NOT NULL REFERENCES salary_structures(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('allowance', 'deduction')),
    name TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    is_percentage BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 11. PAYROLL TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE payroll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_name TEXT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_gross NUMERIC(14, 2) DEFAULT 0.00 NOT NULL,
    total_net NUMERIC(14, 2) DEFAULT 0.00 NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'approved', 'completed')),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 12. PAYROLL_ITEMS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE payroll_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_id UUID NOT NULL REFERENCES payroll(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    gross_pay NUMERIC(12, 2) NOT NULL,
    deductions NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    net_pay NUMERIC(12, 2) NOT NULL,
    status TEXT DEFAULT 'calculated' CHECK (status IN ('calculated', 'approved', 'disbursed')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(payroll_id, employee_id)
);

-- ----------------------------------------------------------------------------
-- 13. PAYSLIPS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE payslips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_item_id UUID UNIQUE NOT NULL REFERENCES payroll_items(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    payslip_number TEXT UNIQUE NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE NOT NULL,
    file_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 14. NOTIFICATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT DEFAULT 'General' NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 15. AUDIT_LOGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    ip_address TEXT,
    security_level TEXT DEFAULT 'INFO' CHECK (security_level IN ('INFO', 'WARNING', 'CRITICAL')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_employees_profile ON employees(profile_id);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_attendance_employee_date ON attendance(employee_id, date);
CREATE INDEX idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_payroll_items_payroll ON payroll_items(payroll_id);
CREATE INDEX idx_payroll_items_employee ON payroll_items(employee_id);
CREATE INDEX idx_payslips_employee ON payslips(employee_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_audit_logs_user_created ON audit_logs(user_id, created_at);

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_departments_updated BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_designations_updated BEFORE UPDATE ON designations FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_employees_updated BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_attendance_updated BEFORE UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_leave_requests_updated BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_salary_structures_updated BEFORE UPDATE ON salary_structures FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_payroll_updated BEFORE UPDATE ON payroll FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) HELPER FUNCTIONS (SECURITY DEFINER)
-- ============================================================================

-- Function to get current user's role from profiles
CREATE OR REPLACE FUNCTION get_auth_role()
RETURNS TEXT AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Function to check if auth user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Function to check if auth user is manager
CREATE OR REPLACE FUNCTION is_manager()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'manager'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Function to get user's assigned employee ID
CREATE OR REPLACE FUNCTION get_auth_employee_id()
RETURNS UUID AS $$
    SELECT id FROM public.employees WHERE profile_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Function to get department ID for manager
CREATE OR REPLACE FUNCTION get_manager_department_id()
RETURNS UUID AS $$
    SELECT department_id FROM public.employees WHERE profile_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL 15 TABLES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES FOR 15 TABLES
-- ============================================================================

-- 1. PROFILES POLICIES
CREATE POLICY "Profiles - Admin full access" ON profiles FOR ALL USING (is_admin());
CREATE POLICY "Profiles - User read own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Profiles - Manager read department profiles" ON profiles FOR SELECT USING (
    is_manager() AND id IN (
        SELECT profile_id FROM employees WHERE department_id = get_manager_department_id()
    )
);
CREATE POLICY "Profiles - User update own profile" ON profiles FOR UPDATE USING (id = auth.uid());

-- 2. DEPARTMENTS POLICIES
CREATE POLICY "Departments - Admin full access" ON departments FOR ALL USING (is_admin());
CREATE POLICY "Departments - All authenticated users read" ON departments FOR SELECT USING (auth.role() = 'authenticated');

-- 3. DESIGNATIONS POLICIES
CREATE POLICY "Designations - Admin full access" ON designations FOR ALL USING (is_admin());
CREATE POLICY "Designations - All authenticated users read" ON designations FOR SELECT USING (auth.role() = 'authenticated');

-- 4. EMPLOYEES POLICIES
CREATE POLICY "Employees - Admin full access" ON employees FOR ALL USING (is_admin());
CREATE POLICY "Employees - Manager department read/update" ON employees FOR ALL USING (
    is_manager() AND department_id = get_manager_department_id()
);
CREATE POLICY "Employees - Employee self read" ON employees FOR SELECT USING (profile_id = auth.uid());

-- 5. ATTENDANCE POLICIES
CREATE POLICY "Attendance - Admin full access" ON attendance FOR ALL USING (is_admin());
CREATE POLICY "Attendance - Manager department access" ON attendance FOR ALL USING (
    is_manager() AND employee_id IN (
        SELECT id FROM employees WHERE department_id = get_manager_department_id()
    )
);
CREATE POLICY "Attendance - Employee self access" ON attendance FOR ALL USING (
    employee_id = get_auth_employee_id()
);

-- 6. LEAVE TYPES POLICIES
CREATE POLICY "LeaveTypes - Admin full access" ON leave_types FOR ALL USING (is_admin());
CREATE POLICY "LeaveTypes - All authenticated read" ON leave_types FOR SELECT USING (auth.role() = 'authenticated');

-- 7. LEAVE REQUESTS POLICIES
CREATE POLICY "LeaveRequests - Admin full access" ON leave_requests FOR ALL USING (is_admin());
CREATE POLICY "LeaveRequests - Manager department view/approve" ON leave_requests FOR ALL USING (
    is_manager() AND employee_id IN (
        SELECT id FROM employees WHERE department_id = get_manager_department_id()
    )
);
CREATE POLICY "LeaveRequests - Employee self view/create" ON leave_requests FOR ALL USING (
    employee_id = get_auth_employee_id()
);

-- 8. LEAVE BALANCES POLICIES
CREATE POLICY "LeaveBalances - Admin full access" ON leave_balances FOR ALL USING (is_admin());
CREATE POLICY "LeaveBalances - Manager department view" ON leave_balances FOR SELECT USING (
    is_manager() AND employee_id IN (
        SELECT id FROM employees WHERE department_id = get_manager_department_id()
    )
);
CREATE POLICY "LeaveBalances - Employee self view" ON leave_balances FOR SELECT USING (
    employee_id = get_auth_employee_id()
);

-- 9. SALARY STRUCTURES POLICIES
CREATE POLICY "SalaryStructures - Admin full access" ON salary_structures FOR ALL USING (is_admin());
CREATE POLICY "SalaryStructures - Employee self read" ON salary_structures FOR SELECT USING (
    employee_id = get_auth_employee_id()
);

-- 10. SALARY COMPONENTS POLICIES
CREATE POLICY "SalaryComponents - Admin full access" ON salary_components FOR ALL USING (is_admin());
CREATE POLICY "SalaryComponents - Employee self read" ON salary_components FOR SELECT USING (
    salary_structure_id IN (
        SELECT id FROM salary_structures WHERE employee_id = get_auth_employee_id()
    )
);

-- 11. PAYROLL POLICIES
CREATE POLICY "Payroll - Admin full access" ON payroll FOR ALL USING (is_admin());
CREATE POLICY "Payroll - Manager view approved cycles" ON payroll FOR SELECT USING (
    is_manager() AND status IN ('approved', 'completed')
);

-- 12. PAYROLL ITEMS POLICIES
CREATE POLICY "PayrollItems - Admin full access" ON payroll_items FOR ALL USING (is_admin());
CREATE POLICY "PayrollItems - Employee self view" ON payroll_items FOR SELECT USING (
    employee_id = get_auth_employee_id()
);

-- 13. PAYSLIPS POLICIES
CREATE POLICY "Payslips - Admin full access" ON payslips FOR ALL USING (is_admin());
CREATE POLICY "Payslips - Employee self view" ON payslips FOR SELECT USING (
    employee_id = get_auth_employee_id()
);

-- 14. NOTIFICATIONS POLICIES
CREATE POLICY "Notifications - User own access" ON notifications FOR ALL USING (user_id = auth.uid());

-- 15. AUDIT LOGS POLICIES
CREATE POLICY "AuditLogs - Admin full access" ON audit_logs FOR ALL USING (is_admin());
CREATE POLICY "AuditLogs - User write log entry" ON audit_logs FOR INSERT WITH CHECK (user_id = auth.uid());
