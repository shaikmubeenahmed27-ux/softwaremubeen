# PayFlow HR - Backend Service & Database Architecture

This directory contains the **Backend Database Engine**, **Supabase Configurations**, **DDL Migrations**, and **Seed Files** for PayFlow HR.

---

## Folder Structure

```
backend/
├── supabase/
│   ├── migrations/
│   │   └── 01_schema_and_rls.sql   # Complete DDL Schema (15 Tables, Indexes, RLS Policies)
│   └── seed.sql                     # Initial Data Seed (Departments & Leave Types)
├── .env                             # Live Supabase Connection URL & Anon API Key
├── .env.example                     # Environment Template
└── package.json                     # Backend project configuration
```

---

## 15 PostgreSQL Database Tables

1. `profiles`: Linked to Supabase Auth users (Admin, Manager, Employee roles)
2. `departments`: Corporate departments & budget tracking
3. `designations`: Job titles linked to departments
4. `employees`: Employee master lifecycle directory
5. `attendance`: Timecard logs, check-in/out, work hours, overtime calculation
6. `leave_types`: 5 Leave categories (Casual, Sick, Earned, Unpaid, Other)
7. `leave_requests`: Leave application workflow (Pending, Approved, Rejected, Cancelled)
8. `leave_balances`: Automated leave balance tracking
9. `salary_structures`: Base pay & compensation structures
10. `payroll`: Monthly payroll batch runs (Draft -> Calculated -> Approved -> Processed)
11. `payroll_items`: Itemized payroll line items per employee
12. `payslips`: Official A4 printable payslip records
13. `notifications`: Event-driven user notifications
14. `audit_logs`: Enterprise security audit logging
15. `salary_components`: Modular earnings & deductions components

---

## Supabase Connection Details

- **Project URL**: `https://fqjzhxjnawuhfyaivegk.supabase.co`
- **Publishable Key**: `sb_publishable_pTq8Z69iLGGMcGdF5YZn_w_mwkvWubA`
