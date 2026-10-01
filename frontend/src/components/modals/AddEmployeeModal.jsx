import React, { useState } from 'react';
import { X, UserPlus, Mail, Building2, Briefcase, Calendar, CheckCircle2, AlertCircle, Eye, EyeOff, Copy, Check, Key } from 'lucide-react';
import { createEmployee } from '../../services/employeeService';

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
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

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

      const res = await createEmployee({
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
        joiningDate: formData.joiningDate,
        employmentType: formData.employmentType
      });

      if (res?.credentials) {
        setCreatedCredentials(res.credentials);
        setSuccess(true);
        onSuccess && onSuccess();
      } else {
        throw new Error('Could not create employee account.');
      }
    } catch (err) {
      console.error('Employee add error:', err);
      setError(err.message || 'Failed to add employee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const text = `PayFlow HR Employee Login Credentials\n-----------------------------------\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}\nRole: Employee\nDepartment: ${createdCredentials.department}\nLogin URL: http://localhost:5173`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDone = () => {
    setSuccess(false);
    setCreatedCredentials(null);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      department: 'Engineering & Tech',
      designation: 'Senior Software Engineer',
      joiningDate: new Date().toISOString().split('T')[0],
      employmentType: 'Full-time'
    });
    onClose();
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
          <button onClick={handleDone} className="btn-icon"><X size={18} /></button>
        </div>

        {success && createdCredentials ? (
          <div style={{ padding: '1rem 0', textAlign: 'center' }}>
            <CheckCircle2 size={48} style={{ margin: '0 auto 1rem auto', color: '#10b981' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
              Employee Onboarded & Auth Account Created!
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              A valid Supabase Auth account and Employee database profile have been created.
            </p>

            {/* Generated Credentials Box */}
            <div style={{
              background: 'var(--bg-app)',
              border: '1px solid var(--primary-500)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              textAlign: 'left',
              marginBottom: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-400)', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Key size={14} /> Employee Direct Login Credentials
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email (Login ID):</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontFamily: 'monospace', wordBreak: 'break-all' }}>{createdCredentials.email}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Password:</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <div style={{ fontWeight: 700, color: '#10b981', fontFamily: 'monospace' }}>
                      {showPassword ? createdCredentials.password : '••••••••'}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-muted)' }}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered Role:</div>
                  <div style={{ fontWeight: 700, color: 'var(--primary-400)' }}>Employee</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Department:</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{createdCredentials.department}</div>
                </div>
              </div>

              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                &bull; Share these exact credentials with the employee so they can sign in directly on the Employee Login page without registering.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={handleCopyCredentials}>
                {copied ? <Check size={16} style={{ color: '#10b981' }} /> : <Copy size={16} />}
                {copied ? 'Credentials Copied!' : 'Copy Credentials'}
              </button>
              <button type="button" className="btn btn-primary" onClick={handleDone}>
                Done & Close
              </button>
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
