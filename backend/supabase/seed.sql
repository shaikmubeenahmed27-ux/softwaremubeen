-- ============================================================================
-- PayFlow HR - Phase 2: Seed / Demo Data
-- ============================================================================

-- 1. Insert Leave Types
INSERT INTO leave_types (name, code, default_days_per_year, is_paid) VALUES
('Annual Paid Leave', 'ANNUAL', 20, true),
('Sick Leave', 'SICK', 12, true),
('Casual Leave', 'CASUAL', 10, true),
('Unpaid Leave', 'UNPAID', 30, false)
ON CONFLICT (code) DO NOTHING;

-- 2. Insert Departments
INSERT INTO departments (id, name, code, monthly_budget, status) VALUES
('d1000000-0000-0000-0000-000000000001', 'Executive', 'EXEC', 180000.00, 'Active'),
('d1000000-0000-0000-0000-000000000002', 'Engineering & Tech', 'ENG', 145000.00, 'Active'),
('d1000000-0000-0000-0000-000000000003', 'Human Resources', 'HR', 48000.00, 'Active'),
('d1000000-0000-0000-0000-000000000004', 'Finance & Accounting', 'FIN', 62000.00, 'Active')
ON CONFLICT (code) DO NOTHING;

-- 3. Insert Designations
INSERT INTO designations (id, title, department_id, seniority_band, pay_range_min, pay_range_max) VALUES
('e1000000-0000-0000-0000-000000000001', 'VP of HR Operations', 'd1000000-0000-0000-0000-000000000003', 'Exec-L8', 140000.00, 180000.00),
('e1000000-0000-0000-0000-000000000002', 'Engineering Manager', 'd1000000-0000-0000-0000-000000000002', 'M2', 120000.00, 160000.00),
('e1000000-0000-0000-0000-000000000003', 'Senior Software Engineer', 'd1000000-0000-0000-0000-000000000002', 'L5', 95000.00, 130000.00)
ON CONFLICT DO NOTHING;
