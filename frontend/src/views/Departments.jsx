import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Building2, Search, Plus, Users, Shield } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const DepartmentsView = () => {
  const [search, setSearch] = useState('');
  const [departments, setDepartments] = useState([
    { id: 'DEPT-01', name: 'Executive', code: 'EXEC', manager: 'Department Lead', headCount: 0, status: 'Active' },
    { id: 'DEPT-02', name: 'Engineering & Tech', code: 'ENG', manager: 'Engineering Manager', headCount: 0, status: 'Active' },
    { id: 'DEPT-03', name: 'Human Resources', code: 'HR', manager: 'HR Manager', headCount: 0, status: 'Active' },
    { id: 'DEPT-04', name: 'Finance & Accounting', code: 'FIN', manager: 'Finance Lead', headCount: 0, status: 'Active' },
    { id: 'DEPT-05', name: 'Product & Design', code: 'PROD', manager: 'Product Lead', headCount: 0, status: 'Active' },
    { id: 'DEPT-06', name: 'Sales & Marketing', code: 'SALES', manager: 'Sales Director', headCount: 0, status: 'Active' }
  ]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data, error } = await supabase.from('departments').select('*, employees(count)');
        if (!error && data && data.length > 0) {
          setDepartments(data.map((d) => ({
            id: d.id,
            name: d.name,
            code: d.code,
            manager: d.manager_name || 'Assigned Lead',
            headCount: Array.isArray(d.employees) ? d.employees.length : (d.employees?.[0]?.count || 0),
            status: d.status || 'Active'
          })));
        }
      } catch (err) {
        console.warn('Using standard department definitions.');
      }
    };
    fetchDepartments();
  }, []);

  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.manager.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Building2 size={24} style={{ color: 'var(--primary-400)' }} /> Department Directory
          </h1>
          <p>Organizational department structure, department leads, and headcount allocation.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--slate-400)' }} />
          <input
            type="text"
            placeholder="Search departments or managers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.875rem 0.5rem 2.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Department Code</th>
              <th>Department Name</th>
              <th>Department Manager / Lead</th>
              <th>Active Headcount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id}>
                <td style={{ fontWeight: 600, color: 'var(--primary-400)', fontFamily: 'monospace' }}>{d.code}</td>
                <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{d.name}</td>
                <td>{d.manager}</td>
                <td><Badge variant="purple">{d.headCount} Employees</Badge></td>
                <td><Badge variant="success" dot>Active</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
