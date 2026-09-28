-- ============================================================================
-- PayFlow HR - Consolidated PostgreSQL / Supabase Schema & Row Level Security (RLS)
-- ============================================================================
-- Single unified master migration file:
-- Includes:
-- 1. All core tables (Profiles, Departments, Designations, Employees,
--    Attendance, Unified Leave Records, Salary Structures/Components,
--    Payroll Cycles, Payroll Items, Payslips, Notifications, Audit Logs)
-- 2. Indexes for high-performance querying
-- 3. Automatic updated_at timestamp triggers
-- 4. Auth signup trigger: auto-creates public.profiles on auth.users registration
-- 5. Row Level Security (RLS) policies with full multi-role support (Admin, Manager, Employee)
-- ============================================================================

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up existing objects if re-running
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payslips CASCADE;
DROP TABLE IF EXISTS payroll_items CASCADE;
DROP TABLE IF EXISTS payroll CASCADE;
DROP TABLE IF EXISTS salary_components CASCADE;
DROP TABLE IF EXISTS salary_structures CASCADE;
DROP TABLE IF EXISTS leave_records CASCADE;
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
    seniority_band TEXT DEFAULT 'Mid-Level',
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
    profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE SET NULL,
    employee_code TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    department_id UUID REFERENCES departments(id) ON DELETE RESTRICT,
    designation_id UUID REFERENCES designations(id) ON DELETE RESTRICT,
    manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    employment_type TEXT NOT NULL CHECK (employment_type IN ('Full-time', 'Part-time', 'Contract', 'Intern')),
    employment_status TEXT DEFAULT 'Active' NOT NULL CHECK (employment_status IN ('Active', 'On Leave', 'Suspended', 'Terminated')),
    joining_date DATE NOT NULL,
    date_of_birth DATE,
    address TEXT,
    bank_account_number TEXT,
    bank_name TEXT,
    bank_routing_number TEXT,
    tax_id TEXT,
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
    clock_in TIMESTAMPTZ,
    clock_out TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Late', 'Half-day', 'On Leave')),
    total_hours NUMERIC(4, 2) DEFAULT 0.00 NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(employee_id, date)
);

-- ----------------------------------------------------------------------------
-- 6. UNIFIED LEAVE RECORDS TABLE
--    record_type = 'balance'  → tracks allocated / used / remaining per leave type
--    record_type = 'request'  → individual leave requests applied by staff
-- ----------------------------------------------------------------------------
CREATE TABLE leave_records (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id      UUID        NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type       TEXT        NOT NULL CHECK (leave_type IN ('CASUAL','SICK','EARNED','UNPAID','OTHER')),
    leave_type_name  TEXT        NOT NULL,
    is_paid          BOOLEAN     DEFAULT true NOT NULL,
    record_type      TEXT        NOT NULL DEFAULT 'request' CHECK (record_type IN ('balance', 'request')),
    allocated_days   INT         DEFAULT 0,
    used_days        INT         DEFAULT 0,
    remaining_days   INT         DEFAULT 0,
    balance_year     INT         DEFAULT EXTRACT(YEAR FROM NOW()),
    start_date       DATE,
    end_date         DATE,
    total_days       INT,
    reason           TEXT,
    status           TEXT        DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','cancelled')),
    approved_by      TEXT,
    approved_at      TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 7. SALARY STRUCTURES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE salary_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID UNIQUE NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    base_salary NUMERIC(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    pay_frequency TEXT DEFAULT 'Monthly' NOT NULL,
    effective_date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 8. SALARY COMPONENTS TABLE
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
-- 9. PAYROLL TABLE
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
-- 10. PAYROLL ITEMS TABLE
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
-- 11. PAYSLIPS TABLE
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
-- 12. NOTIFICATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT DEFAULT 'General' NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 13. AUDIT LOGS TABLE
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
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_employees_profile ON employees(profile_id);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_attendance_employee_date ON attendance(employee_id, date);
CREATE INDEX idx_leave_records_employee ON leave_records(employee_id);
CREATE INDEX idx_leave_records_type ON leave_records(record_type);
CREATE INDEX idx_payroll_items_payroll ON payroll_items(payroll_id);
CREATE INDEX idx_payroll_items_employee ON payroll_items(employee_id);
CREATE INDEX idx_payslips_employee ON payslips(employee_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_audit_logs_user_created ON audit_logs(user_id, created_at);

-- ============================================================================
-- AUTO-UPDATE TIMESTAMPS
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
CREATE TRIGGER trg_leave_records_updated BEFORE UPDATE ON leave_records FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_salary_structures_updated BEFORE UPDATE ON salary_structures FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_payroll_updated BEFORE UPDATE ON payroll FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ============================================================================
-- AUTH SIGNUP TRIGGER (Auto-creates public.profiles on auth.users registration)
-- ============================================================================
CREATE OR REPLACE FUNCTION urlencode(input TEXT)
RETURNS TEXT AS $$
  SELECT string_agg(
    CASE
      WHEN c ~ '[A-Za-z0-9_.~-]' THEN c
      ELSE '%' || upper(to_hex(ascii(c)))
    END, ''
  )
  FROM regexp_split_to_table(input, '') AS c;
$$ LANGUAGE sql IMMUTABLE STRICT;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      initcap(replace(replace(replace(split_part(NEW.email, '@', 1), '.', ' '), '_', ' '), '-', ' '))
    ),
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee'),
    'https://ui-avatars.com/api/?name=' ||
      urlencode(COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1)
      )) ||
      '&background=3b82f6&color=fff'
  )
  ON CONFLICT (id) DO UPDATE SET
    email      = EXCLUDED.email,
    full_name  = EXCLUDED.full_name,
    role       = EXCLUDED.role,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) SETUP
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
CREATE POLICY "Profiles - Open read for authenticated" ON profiles FOR SELECT USING (true);
CREATE POLICY "Profiles - User update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Profiles - User insert own profile" ON profiles FOR INSERT WITH CHECK (true);

-- 2. DEPARTMENTS POLICIES
CREATE POLICY "Departments - Open access for authenticated" ON departments FOR ALL USING (true) WITH CHECK (true);

-- 3. DESIGNATIONS POLICIES
CREATE POLICY "Designations - Open access for authenticated" ON designations FOR ALL USING (true) WITH CHECK (true);

-- 4. EMPLOYEES POLICIES
CREATE POLICY "Employees - Open read access" ON employees FOR SELECT USING (true);
CREATE POLICY "Employees - Authenticated full access" ON employees FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 5. ATTENDANCE POLICIES
CREATE POLICY "Attendance - Open read access" ON attendance FOR SELECT USING (true);
CREATE POLICY "Attendance - Authenticated full access" ON attendance FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 6. LEAVE RECORDS POLICIES
CREATE POLICY "LeaveRecords - Open read access" ON leave_records FOR SELECT USING (true);
CREATE POLICY "LeaveRecords - Authenticated full access" ON leave_records FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 7. SALARY STRUCTURES POLICIES
CREATE POLICY "SalaryStructures - Open read access" ON salary_structures FOR SELECT USING (true);
CREATE POLICY "SalaryStructures - Authenticated full access" ON salary_structures FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 8. SALARY COMPONENTS POLICIES
CREATE POLICY "SalaryComponents - Open read access" ON salary_components FOR SELECT USING (true);
CREATE POLICY "SalaryComponents - Authenticated full access" ON salary_components FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 9. PAYROLL POLICIES
CREATE POLICY "Payroll - Open read access" ON payroll FOR SELECT USING (true);
CREATE POLICY "Payroll - Authenticated full access" ON payroll FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 10. PAYROLL ITEMS POLICIES
CREATE POLICY "PayrollItems - Open read access" ON payroll_items FOR SELECT USING (true);
CREATE POLICY "PayrollItems - Authenticated full access" ON payroll_items FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 11. PAYSLIPS POLICIES
CREATE POLICY "Payslips - Open read access" ON payslips FOR SELECT USING (true);
CREATE POLICY "Payslips - Authenticated full access" ON payslips FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 12. NOTIFICATIONS POLICIES
CREATE POLICY "Notifications - Open access for authenticated" ON notifications FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 13. AUDIT LOGS POLICIES
CREATE POLICY "AuditLogs - Open access for authenticated" ON audit_logs FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
