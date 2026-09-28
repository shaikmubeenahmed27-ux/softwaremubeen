import React, { useState } from 'react';
import { X, UserPlus, Mail, Building2, Briefcase, Calendar, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const DEPARTMENTS = [
  'Engineering & Tech',
  'Human Resources',
  'Finance & Accounting',
  'Sales & Marketing',
  'Product & Design',
  'Executive'
];

const DESIGNATIONS_BY_DEPT = {
  'Engineering & Tech': ['Senior Software Engineer', 'Software Engineer', 'QA Engineer', 'DevOps Engineer', 'Tech Lead'],
  'Human Resources': ['HR Manager', 'HR Executive', 'Recruiter', 'HR Business Partner'],
  'Finance & Accounting': ['Finance Manager', 'Accountant', 'Financial Analyst', 'Payroll Specialist'],
  'Sales & Marketing': ['Sales Manager', 'Marketing Executive', 'Business Development Executive', 'Account Manager'],
  'Product & Design': ['Product Manager', 'UI/UX Designer', 'Product Designer', 'Research Analyst'],
  'Executive': ['CEO', 'CTO', 'CFO', 'COO', 'VP Engineering']
};

export const AddEmployeeModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    department: 'Engineering & Tech',
    designation: 'Senior Software Engineer',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-time'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDeptChange = (dept) => {
    setFormData({
      ...formData,
      department: dept,
      designation: DESIGNATIONS_BY_DEPT[dept]?.[0] || 'Team Member'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Generate employee code
      const { count } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true });
      const empCode = `EMP-${String((count || 0) + 101).padStart(3, '0')}`;

      // Step 1: Get or create department record
      let deptId = null;
      const { data: deptData } = await supabase
        .from('departments')
        .select('id')
        .ilike('name', `%${formData.department.split('&')[0].trim()}%`)
        .single();

      if (deptData?.id) {
        deptId = deptData.id;
      } else {
        // Create department if it doesn't exist
        const deptCode = formData.department.replace(/[^A-Z]/gi, '').toUpperCase().slice(0, 5);
        const { data: newDept } = await supabase
          .from('departments')
          .insert({ name: formData.department, code: deptCode })
          .select('id')
          .single();
        deptId = newDept?.id;
      }

      // Step 2: Get or create designation record
      let desigId = null;
      if (deptId) {
        const { data: desigData } = await supabase
          .from('designations')
          .select('id')
          .ilike('title', `%${formData.designation}%`)
          .eq('department_id', deptId)
          .single();

        if (desigData?.id) {
          desigId = desigData.id;
        } else {
          const { data: newDesig } = await supabase
            .from('designations')
            .insert({
              title: formData.designation,
              department_id: deptId,
              seniority_band: 'Mid'
            })
            .select('id')
            .single();
          desigId = newDesig?.id;
        }
      }

      // Step 3: Create a profile entry for the new employee
      // We'll use a placeholder UUID linked to email
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .single();

      let profileId = existingProfile?.id || null;

      // Step 4: Insert into employees table
      const { data: empData, error: empError } = await supabase
        .from('employees')
        .insert({
          employee_code: empCode,
          profile_id: profileId,
          first_name: firstName,
          last_name: lastName,
          email: formData.email,
          phone: formData.phone || '',
          department_id: deptId,
          designation_id: desigId,
          joining_date: formData.joiningDate,
          employment_type: formData.employmentType,
          status: 'active'
        })
        .select()
        .single();

      if (empError) {
        // If profile_id unique constraint fails, try without profile_id
        if (empError.code === '23505') {
          const { error: retryError } = await supabase
            .from('employees')
            .insert({
              employee_code: empCode,
              profile_id: null,
              first_name: firstName,
              last_name: lastName,
              email: formData.email,
              phone: formData.phone || '',
              department_id: deptId,
              designation_id: desigId,
              joining_date: formData.joiningDate,
              employment_type: formData.employmentType,
              status: 'active'
            });
          if (retryError) throw retryError;
        } else {
          throw empError;
        }
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess && onSuccess();
        onClose();
      }, 1500);

    } catch (err) {
      console.error('Employee add error:', err);
      setError(err.message || 'Failed to add employee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.55rem 0.875rem',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-app)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-main)',
    outline: 'none',
    fontSize: '0.875rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: '0.35rem'
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(2, 6, 23, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%', maxWidth: '560px',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
            <UserPlus size={20} style={{ color: 'var(--primary-400)' }} /> Onboard New Employee
          </div>
          <button onClick={onClose} className="btn-icon"><X size={18} /></button>
        </div>

        {success ? (
          <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
            <CheckCircle2 size={52} style={{ margin: '0 auto 1.25rem auto', color: '#10b981' }} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Employee Onboarded Successfully
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--text-main)' }}>{formData.fullName}</strong> has been added to <strong style={{ color: 'var(--text-main)' }}>{formData.department}</strong>.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: '#10b981', fontWeight: 600, marginTop: '1rem', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.1)' }}>
              Saved to Supabase employees database
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Error Banner */}
            {error && (
              <div style={{
                padding: '0.75rem 1rem', borderRadius: '8px',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444', fontSize: '0.825rem', display: 'flex', gap: '0.5rem'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input
                type="text" required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Priya Sharma"
                style={inputStyle}
              />
            </div>

            {/* Email & Password & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input
                  type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="priya@gmail.com"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Account Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Leave blank for password123"
                    style={{ ...inputStyle, paddingRight: '2.2rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Department & Designation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Department *</label>
                <select
                  value={formData.department}
                  onChange={(e) => handleDeptChange(e.target.value)}
                  style={inputStyle}
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Designation *</label>
                <select
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  style={inputStyle}
                >
                  {(DESIGNATIONS_BY_DEPT[formData.department] || ['Team Member']).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Joining Date & Employment Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Joining Date *</label>
                <input
                  type="date" required
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Employment Type</label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  style={inputStyle}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Intern</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Add Employee'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
