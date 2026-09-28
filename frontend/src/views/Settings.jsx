import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Building, DollarSign, UserCheck, Save, CheckCircle } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const SettingsView = () => {
  const { currentUser } = useAuth();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    // 1. Company Information
    companyName: 'PayFlow HR Technologies Inc.',
    companyAddress: '100 SaaS Plaza, Suite 400, San Francisco, CA 94107',
    taxId: 'US-884920194',
    currency: 'USD ($)',

    // 2. Payroll Settings
    defaultPfRate: 8.0,
    defaultTdsRate: 10.0,
    payCycleDay: 28,
    overtimeMultiplier: 1.5,

    // 3. Admin Profile (Read-only / Editable Contact)
    adminName: currentUser?.name || 'Administrator',
    adminEmail: currentUser?.email || 'admin@company.com'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <SettingsIcon size={24} style={{ color: 'var(--primary-400)' }} /> Admin Settings & Configurations
          </h1>
          <p>Manage company details, payroll default parameters, and admin profile settings.</p>
        </div>
      </div>

      {saved && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', color: '#10b981', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={16} /> Company settings and payroll defaults updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Corporate Tax ID / EIN
              </label>
              <input
                type="text"
                value={settings.taxId}
                onChange={(e) => setSettings({ ...settings, taxId: e.target.value })}
                style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Headquarters Address
              </label>
              <input
                type="text"
                value={settings.companyAddress}
                onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
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
                value={settings.defaultPfRate}
                onChange={(e) => setSettings({ ...settings, defaultPfRate: parseFloat(e.target.value) || 0 })}
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
                value={settings.defaultTdsRate}
                onChange={(e) => setSettings({ ...settings, defaultTdsRate: parseFloat(e.target.value) || 0 })}
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
                value={settings.payCycleDay}
                onChange={(e) => setSettings({ ...settings, payCycleDay: parseInt(e.target.value) || 28 })}
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
                value={settings.overtimeMultiplier}
                onChange={(e) => setSettings({ ...settings, overtimeMultiplier: parseFloat(e.target.value) || 1.5 })}
                style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* 3. Admin Profile */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: 0 }}>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={18} style={{ color: 'var(--primary-400)' }} /> 3. Admin Profile
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
                value={settings.adminName}
                onChange={(e) => setSettings({ ...settings, adminName: e.target.value })}
                style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Administrator Email Address
              </label>
              <input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
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
    </div>
  );
};
