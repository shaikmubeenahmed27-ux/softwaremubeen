import React, { useState } from 'react';
import { Award, Search, Building2 } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const DesignationsView = () => {
  const [search, setSearch] = useState('');
  const [designations] = useState([
    { id: 'DES-01', title: 'VP of HR Operations', level: 'L8 - Executive', department: 'Executive', count: 2 },
    { id: 'DES-02', title: 'Engineering Lead Manager', level: 'L6 - Management', department: 'Engineering & Tech', count: 8 },
    { id: 'DES-03', title: 'Senior Software Engineer', level: 'L5 - Senior IC', department: 'Engineering & Tech', count: 24 },
    { id: 'DES-04', title: 'Financial Analyst', level: 'L4 - Mid Level', department: 'Finance & Accounting', count: 12 },
    { id: 'DES-05', title: 'UX Specialist', level: 'L4 - Mid Level', department: 'Product & Design', count: 10 }
  ]);

  const filtered = designations.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.department.toLowerCase().includes(search.toLowerCase()) ||
      d.level.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Award size={24} style={{ color: 'var(--primary-400)' }} /> Job Designations & Titles
          </h1>
          <p>Organizational job hierarchy, seniority levels, and title classifications.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--slate-400)' }} />
          <input
            type="text"
            placeholder="Search job titles or levels..."
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
              <th>ID</th>
              <th>Designation Title</th>
              <th>Seniority Level</th>
              <th>Department</th>
              <th>Assigned Staff</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id}>
                <td style={{ fontWeight: 600, color: 'var(--primary-400)', fontFamily: 'monospace' }}>{d.id}</td>
                <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{d.title}</td>
                <td><Badge variant="purple">{d.level}</Badge></td>
                <td><Badge variant="info">{d.department}</Badge></td>
                <td>{d.count} Staff</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
