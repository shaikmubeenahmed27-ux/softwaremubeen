import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Settings as SettingsIcon,
  Building,
  DollarSign,
  UserCheck,
  Save,
  CheckCircle,
  Shield,
  KeyRound,
  Bell,
  Moon,
  Sun,
  Lock,
  Eye,
  EyeOff,
  User,
  Smartphone,
  AlertCircle,
  Palette,
  ShieldCheck
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const SettingsView = () => {
  const { currentUser, currentRole, theme, toggleTheme, updatePassword } = useAuth();

  // Active tab: 'account' | 'company'
  const [activeTab, setActiveTab] = useState('account');

  // Company settings (for Admin)
  const [companySaved, setCompanySaved] = useState(false);
  const [companySettings, setCompanySettings] = useState({
    companyName: 'PayFlow HR Technologies Inc.',
    companyAddress: '100 SaaS Plaza, Suite 400, San Francisco, CA 94107',
    taxId: 'US-884920194',
    currency: 'USD ($)',
    defaultPfRate: 8.0,
    defaultTdsRate: 10.0,
    payCycleDay: 28,
    overtimeMultiplier: 1.5,
    adminName: currentUser?.name || 'Administrator',
    adminEmail: currentUser?.email || 'admin@company.com'
  });

  // Account / Contact settings (for All Roles)
  const [contactSaved, setContactSaved] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    phone: '+1 (555) 000-0000',
    personalEmail: currentUser?.email || '',
    address: 'City, State, Country',
    emergencyContact: 'Emergency Contact (+1 555-000-0000)'
  });

  // Notification / App Preferences
  const [prefSaved, setPrefSaved] = useState(false);
  const [preferences, setPreferences] = useState({
    emailLeaveAlerts: true,
    emailPayrollAlerts: true,
    systemAnnouncements: true,
    soundAlerts: false
  });

  // Security / Password Change
  const [passwordState, setPasswordState] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const getRoleVariant = (role) => {
    if (role === 'admin') return 'purple';
    if (role === 'manager') return 'info';
    return 'success';
  };

  const handleCompanySave = (e) => {
    e.preventDefault();
    setCompanySaved(true);
    setTimeout(() => setCompanySaved(false), 3000);
  };

  const handleContactSave = (e) => {
    e.preventDefault();
    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 3000);
  };

  const handlePrefSave = (e) => {
    e.preventDefault();
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 3000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordState.newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }
    if (passwordState.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      setPasswordLoading(true);
      const { error } = await updatePassword(passwordState.newPassword);
      if (error) {
        throw error;
      }
      setPasswordSuccess('Your password has been successfully updated!');
      setPasswordState({ newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 4000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const userName = currentUser?.name || 'User';
  const userEmail = currentUser?.email || '';
  const userAvatar = currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <SettingsIcon size={24} style={{ color: 'var(--primary-400)' }} /> Account & System Settings
          </h1>
          <p>Manage your account credentials, security preferences, and system settings.</p>
        </div>
      </div>

      {/* Modern Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem'
        }}
      >
        <button
          onClick={() => setActiveTab('account')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: activeTab === 'account' ? 'var(--primary-600)' : 'transparent',
            color: activeTab === 'account' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          <User size={17} />
          <span>My Account & Security</span>
        </button>

        {currentRole === 'admin' ? (
          <button
            onClick={() => setActiveTab('company')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'company' ? 'var(--primary-600)' : 'transparent',
              color: activeTab === 'company' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Building size={17} />
            <span>Company & Payroll Defaults</span>
            <Badge variant="purple" style={{ marginLeft: '4px', fontSize: '0.7rem' }}>Admin</Badge>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('company')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'company' ? 'var(--bg-surface-hover)' : 'transparent',
              color: 'var(--text-muted)',
              fontWeight: 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              opacity: 0.8
            }}
          >
            <Shield size={16} />
            <span>Organization Info</span>
          </button>
        )}
      </div>

      {/* TAB 1: MY ACCOUNT & SECURITY */}
      {activeTab === 'account' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* User Profile Overview Card */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <img
              src={userAvatar}
              alt={userName}
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--primary-500)'
              }}
            />
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  {userName}
                </h2>
                <Badge variant={getRoleVariant(currentRole)} dot>
                  {currentUser?.roleLabel || currentRole.toUpperCase()}
                </Badge>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <span><strong>Email:</strong> {userEmail}</span>
                {currentUser?.id && <span>&bull; <strong>ID:</strong> {currentUser.id}</span>}
                {currentUser?.department && <span>&bull; <strong>Department:</strong> {currentUser.department}</span>}
                {currentUser?.designation && <span>&bull; <strong>Title:</strong> {currentUser.designation}</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
            {/* Password & Security Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: 0 }}>
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <KeyRound size={18} style={{ color: 'var(--primary-400)' }} /> Change Password & Security
                </h2>
              </div>

              {passwordSuccess && (
                <div style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', color: '#10b981', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} /> {passwordSuccess}
                </div>
              )}

              {passwordError && (
                <div style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} /> {passwordError}
                </div>
              )}

              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordState.newPassword}
                      onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                      placeholder="Minimum 6 characters"
                      style={{
                        width: '100%',
                        padding: '0.55rem 2.25rem 0.55rem 0.875rem',
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
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordState.confirmPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                    placeholder="Repeat new password"
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

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <ShieldCheck size={14} style={{ color: '#10b981' }} />
                  <span>Passwords are securely encrypted with Supabase Authentication.</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="btn btn-primary"
                    style={{ padding: '0.55rem 1.25rem' }}
                  >
                    <Lock size={15} /> {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>

            {/* Appearance & Preferences Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: 0 }}>
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Palette size={18} style={{ color: '#f59e0b' }} /> Theme & Preferences
                </h2>
              </div>

              {prefSaved && (
                <div style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', color: '#10b981', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} /> Notification preferences updated successfully!
                </div>
              )}

              {/* Theme selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Application Interface Theme
                </label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => theme !== 'dark' && toggleTheme()}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: theme === 'dark' ? '2px solid var(--primary-500)' : '1px solid var(--border-color)',
                      background: theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-app)',
                      color: theme === 'dark' ? '#60a5fa' : 'var(--text-muted)',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Moon size={16} /> Dark Mode
                  </button>

                  <button
                    type="button"
                    onClick={() => theme !== 'light' && toggleTheme()}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: theme === 'light' ? '2px solid var(--primary-500)' : '1px solid var(--border-color)',
                      background: theme === 'light' ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-app)',
                      color: theme === 'light' ? 'var(--primary-600)' : 'var(--text-muted)',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Sun size={16} /> Light Mode
                  </button>
                </div>
              </div>

              {/* Notification Toggles */}
              <form onSubmit={handlePrefSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Bell size={14} /> Notification Preferences
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={preferences.emailLeaveAlerts}
                    onChange={(e) => setPreferences({ ...preferences, emailLeaveAlerts: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary-500)' }}
                  />
                  <span>Email alerts for leave application approvals and updates</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={preferences.emailPayrollAlerts}
                    onChange={(e) => setPreferences({ ...preferences, emailPayrollAlerts: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary-500)' }}
                  />
                  <span>Monthly payslip generation and salary notifications</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={preferences.systemAnnouncements}
                    onChange={(e) => setPreferences({ ...preferences, systemAnnouncements: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary-500)' }}
                  />
                  <span>Company-wide announcements and holiday alerts</span>
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.35rem' }}>
                  <button type="submit" className="btn btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}>
                    <Save size={14} /> Save Preferences
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Contact Details Card */}
          <form onSubmit={handleContactSave} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: 0 }}>
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Smartphone size={18} style={{ color: '#10b981' }} /> Personal Contact Details
              </h2>
            </div>

            {contactSaved && (
              <div style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', color: '#10b981', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} /> Contact details saved successfully!
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Primary Contact Phone
                </label>
                <input
                  type="text"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Emergency Contact (Name & Phone)
                </label>
                <input
                  type="text"
                  value={contactInfo.emergencyContact}
                  onChange={(e) => setContactInfo({ ...contactInfo, emergencyContact: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Residential Address
                </label>
                <input
                  type="text"
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.55rem 1.25rem' }}>
                <Save size={15} /> Save Contact Details
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: COMPANY & PAYROLL DEFAULTS (Admin Only / Informational for others) */}
      {activeTab === 'company' && (
        currentRole === 'admin' ? (
          <form onSubmit={handleCompanySave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {companySaved && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', color: '#10b981', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} /> Company settings and payroll defaults updated successfully!
              </div>
            )}

            {/* 1. Company Information */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: 0 }}>
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building size={18} style={{ color: 'var(--primary-400)' }} /> 1. Company Information
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Legal Company Name
                  </label>
                  <input
                    type="text"
                    value={companySettings.companyName}
                    onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Corporate Tax ID / EIN
                  </label>
                  <input
                    type="text"
                    value={companySettings.taxId}
                    onChange={(e) => setCompanySettings({ ...companySettings, taxId: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Headquarters Address
                  </label>
                  <input
                    type="text"
                    value={companySettings.companyAddress}
                    onChange={(e) => setCompanySettings({ ...companySettings, companyAddress: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Payroll Settings */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: 0 }}>
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <DollarSign size={18} style={{ color: '#10b981' }} /> 2. Payroll Settings
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Default PF Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={companySettings.defaultPfRate}
                    onChange={(e) => setCompanySettings({ ...companySettings, defaultPfRate: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Default TDS Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={companySettings.defaultTdsRate}
                    onChange={(e) => setCompanySettings({ ...companySettings, defaultTdsRate: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Monthly Pay Cycle Cutoff Day
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={companySettings.payCycleDay}
                    onChange={(e) => setCompanySettings({ ...companySettings, payCycleDay: parseInt(e.target.value) || 28 })}
                    style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Overtime Multiplier (x Hourly Rate)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={companySettings.overtimeMultiplier}
                    onChange={(e) => setCompanySettings({ ...companySettings, overtimeMultiplier: parseFloat(e.target.value) || 1.5 })}
                    style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* 3. Admin Profile */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: 0 }}>
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserCheck size={18} style={{ color: 'var(--primary-400)' }} /> 3. Administrator Contact
                </h2>
                <Badge variant="purple">Super Admin</Badge>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Administrator Name
                  </label>
                  <input
                    type="text"
                    value={companySettings.adminName}
                    onChange={(e) => setCompanySettings({ ...companySettings, adminName: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Administrator Email Address
                  </label>
                  <input
                    type="email"
                    value={companySettings.adminEmail}
                    onChange={(e) => setCompanySettings({ ...companySettings, adminEmail: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
                <Save size={16} /> Save Admin Settings
              </button>
            </div>
          </form>
        ) : (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: 0 }}>
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building size={18} style={{ color: 'var(--primary-400)' }} /> Organization Overview
              </h2>
              <Badge variant="neutral">Read Only</Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Company Legal Name</span>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>PayFlow HR Technologies Inc.</p>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Headquarters</span>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>San Francisco, CA</p>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Payroll Cycle</span>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>Monthly (28th of every month)</p>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Support & HR Admin Contact</span>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-400)', marginTop: '0.2rem' }}>support@payflowhr.com</p>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', background: 'var(--bg-app)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
              Corporate tax rules, default PF/TDS parameters, and company-level settings can only be altered by authorized System Administrators.
            </div>
          </div>
        )
      )}
    </div>
  );
};
