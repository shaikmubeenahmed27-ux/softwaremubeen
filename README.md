# PayFlow HR - Enterprise Employee Payroll Management System

Welcome to **PayFlow HR**, an enterprise-grade HR & Payroll management platform connected to PostgreSQL / Supabase cloud backend.

---

## 📁 Mono-Repo Folder Structure

```
SE PROJECT/
├── 🎨 frontend/                # Vite + React SaaS Application
│   ├── src/                    # Components, Views, Context, Services
│   ├── public/                 # Favicons & static assets
│   ├── index.html              # HTML entry point
│   ├── vite.config.js          # Vite bundler configuration
│   ├── .env                    # Supabase Client API credentials
│   └── package.json            # Frontend dependencies & scripts
│
└── ⚡ backend/                 # Supabase Database & Migrations Engine
    ├── supabase/
    │   ├── migrations/
    │   │   └── 01_schema_and_rls.sql  # 15 PostgreSQL tables & RLS policies
    │   └── seed.sql            # Initial department & leave seed data
    ├── .env                    # Supabase environment variables
    ├── README.md               # Backend documentation
    └── package.json            # Backend scripts
```

---

## 🚀 Running the Project

### Frontend UI (React + Vite)
```bash
cd frontend
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### Backend Database (Supabase)
- **Supabase Dashboard**: [https://supabase.com/dashboard/project/fqjzhxjnawuhfyaivegk](https://supabase.com/dashboard/project/fqjzhxjnawuhfyaivegk)
- **SQL Schema File**: [backend/supabase/migrations/01_schema_and_rls.sql](file:///c:/Users/SHAIK%20MUBEEN%20AHEMAD/OneDrive/Desktop/SE%20PROJECT/backend/supabase/migrations/01_schema_and_rls.sql)
- **Seed Data File**: [backend/supabase/seed.sql](file:///c:/Users/SHAIK%20MUBEEN%20AHEMAD/OneDrive/Desktop/SE%20PROJECT/backend/supabase/seed.sql)
