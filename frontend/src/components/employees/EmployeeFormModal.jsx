import React, { useState, useEffect, useRef } from 'react';
import { X, UserPlus, UserCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const EmployeeFormModal = ({ isOpen, initialData = null, onClose, onSubmit, lockedDepartment = null }) => {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    avatar: '',
    dateOfBirth: '1995-01-01',
    gender: 'Other',
    address: '',
    department: 'Engineering & Tech',
    designation: 'Senior Software Engineer',
    manager: 'Assigned Lead',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-time',
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || initialData.fullName?.split(' ')[0] || '',
        lastName: initialData.lastName || initialData.fullName?.split(' ')[1] || '',
        email: initialData.email || '',
        password: '',
        phone: initialData.phone || '',
        avatar: initialData.avatar || '',
        dateOfBirth: initialData.dateOfBirth || '1995-01-01',
        gender: initialData.gender || 'Other',
        address: initialData.address || '',
        department: initialData.department || 'Engineering & Tech',
        designation: initialData.designation || 'Senior Software Engineer',
        manager: initialData.manager || 'Assigned Lead',
        joiningDate: initialData.joiningDate || new Date().toISOString().split('T')[0],
        employmentType: initialData.employmentType || 'Full-time',
        status: initialData.status || 'active'
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        avatar: '',
        dateOfBirth: '1995-01-01',
        gender: 'Other',
        address: '',
        department: lockedDepartment || 'Engineering & Tech',
        designation: 'Team Member',
        manager: 'Assigned Lead',
        joiningDate: new Date().toISOString().split('T')[0],
        employmentType: 'Full-time',
        status: 'active'
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  // File upload → base64 preview
  const fileInputRef = useRef(null);

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Invalid email address format.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setErrors({ submit: err?.message || 'Failed to save employee profile.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent accidental Enter key submission from text inputs
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  if (!isOpen) return null;
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Get initials for placeholder
  const getInitials = () => {
    const first = formData.firstName?.charAt(0)?.toUpperCase() || '';
    const last = formData.lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || '?';
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-main)' }}>
            {isEdit ? <UserCheck size={22} style={{ color: 'var(--primary-400)' }} /> : <UserPlus size={22} style={{ color: 'var(--primary-400)' }} />}
            <span>{isEdit ? 'Edit Employee Profile' : 'Onboard New Employee'}</span>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {errors.submit && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <AlertCircle size={16} /> {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Section 1: Personal Info */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-400)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Personal Information
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  onKeyDown={handleKeyDown}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-app)',
                    border: '1px solid',
                    borderColor: errors.firstName ? '#ef4444' : 'var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
                {errors.firstName && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.firstName}</span>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sharma"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  onKeyDown={handleKeyDown}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-app)',
                    border: '1px solid',
                    borderColor: errors.lastName ? '#ef4444' : 'var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
                {errors.lastName && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.lastName}</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. employee@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onKeyDown={handleKeyDown}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-app)',
                    border: '1px solid',
                    borderColor: errors.email ? '#ef4444' : 'var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
                {errors.email && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.email}</span>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Account Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Leave empty for password123"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onKeyDown={handleKeyDown}
                    style={{
                      width: '100%',
                      padding: '0.55rem 2.2rem 0.55rem 0.875rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      outline: 'none'
                    }}
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

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Profile Photo
                </label>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  {/* Circular preview */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    title="Click to upload photo"
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px dashed var(--border-color)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: formData.avatar ? 'transparent' : 'var(--bg-surface-hover)',
                      transition: 'border-color 0.2s',
                      flexShrink: 0
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        userSelect: 'none'
                      }}>
                        {getInitials()}
                      </span>
                    )}
                  </div>

                  {/* Upload / Remove buttons */}
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        border: '1px solid #3b82f6',
                        background: 'transparent',
                        color: '#3b82f6',
                        cursor: 'pointer'
                      }}
                    >
                      Upload
                    </button>
                    {formData.avatar && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar: '' })}
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          border: '1px solid #ef4444',
                          background: 'transparent',
                          color: '#ef4444',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Job & Employment */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-400)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Job & Organization Information
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Department {lockedDepartment && <span style={{ color: 'var(--primary-400)', fontSize: '0.72rem', fontWeight: 700 }}>(Locked to your dept)</span>}
                </label>
                {lockedDepartment ? (
                  <div
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.875rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(59,130,246,0.08)',
                      border: '1px solid var(--primary-500)',
                      color: 'var(--primary-300)',
                      fontWeight: 700,
                      fontSize: '0.875rem'
                    }}
                  >
                    {lockedDepartment}
                  </div>
                ) : (
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.875rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      outline: 'none'
                    }}
                  >
                    <option value="Executive">Executive</option>
                    <option value="Engineering & Tech">Engineering & Tech</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Sales">Sales</option>
                  </select>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Designation
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Joining Date
                </label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Employment Type
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                >
                  <option value="active">Active</option>
                  <option value="on_leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Profile' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
