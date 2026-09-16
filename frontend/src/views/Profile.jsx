import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Building, Briefcase, Calendar, Shield, Save, Phone, MapPin, CheckCircle } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const ProfileView = () => {
  const { currentUser } = useAuth();
  const [saved, setSaved] = useState(false);

  // Editable personal info state
  const [personalInfo, setPersonalInfo] = useState({
    phone: '+1 (555) 234-5678',
    personalEmail: currentUser.email || 'elena.rostova@personalmail.com',
    address: '742 Evergreen Terrace, San Francisco, CA 94107',
    emergencyContact: 'Michael Rostova (+1 555-987-6543)'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <User size={24} style={{ color: 'var(--primary-400)' }} /> My Employee Profile
          </h1>
          <p>Personal profile details, department assignments, and contact preferences.</p>
        </div>
      </div>

      {saved && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', color: '#10b981', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={16} /> Personal contact information saved successfully!
        </div>
      )}

      {/* Main Profile Summary Header Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <img
          src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
          alt={currentUser.name}
          style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-500)' }}
        />
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{currentUser.name}</h2>
            <Badge variant="success" dot>Active Employee</Badge>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
            <span><strong style={{ color: 'var(--primary-400)', fontFamily: 'monospace' }}>ID: {currentUser.id || 'EMP-103'}</strong></span>
            <span>&bull; {currentUser.designation || 'Senior Frontend Engineer'}</span>
            <span>&bull; {currentUser.department || 'Engineering'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
        {/* Read-Only Organizational Information Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: 0 }}>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} style={{ color: 'var(--primary-400)' }} /> Official Employment Details
            </h2>
            <Badge variant="neutral">Read Only</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={13} /> Full Name
              </label>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {currentUser.name}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Employee ID
                </label>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary-400)', fontFamily: 'monospace', marginTop: '0.2rem' }}>
                  {currentUser.id || 'EMP-103'}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={13} /> Official Email
                </label>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {currentUser.email}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building size={13} /> Assigned Department
                </label>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {currentUser.department || 'Engineering'}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Briefcase size={13} /> Designation / Role
                </label>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {currentUser.designation || 'Senior Frontend Engineer'}
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={13} /> Date of Joining
              </label>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                January 15, 2024
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)', fontStyle: 'italic', marginTop: '0.5rem', background: 'var(--bg-app)', padding: '0.65rem 0.875rem', borderRadius: 'var(--radius-md)' }}>
              Note: Salary, Department, Designation, Employee ID, and Payroll settings can only be altered by HR System Administrators.
            </div>
          </div>
        </div>

        {/* Editable Personal Contact Information Card */}
        <form onSubmit={handleSave} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: 0 }}>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={18} style={{ color: '#10b981' }} /> Personal Contact Details
            </h2>
            <Badge variant="info">Editable</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Phone Number
              </label>
              <input
                type="text"
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
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
                Personal Email Address
              </label>
              <input
                type="email"
                value={personalInfo.personalEmail}
                onChange={(e) => setPersonalInfo({ ...personalInfo, personalEmail: e.target.value })}
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
                Residential Address
              </label>
              <textarea
                rows={2}
                value={personalInfo.address}
                onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Emergency Contact Person & Phone
              </label>
              <input
                type="text"
                value={personalInfo.emergencyContact}
                onChange={(e) => setPersonalInfo({ ...personalInfo, emergencyContact: e.target.value })}
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
                <Save size={16} /> Save Contact Details
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
