import React, { useState } from 'react';
import { Settings as SettingsIcon, Building, Clock, DollarSign, Shield, Save } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const SettingsView = () => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    companyName: 'PayFlow HR Technologies Inc.',
    companyAddress: '100 SaaS Plaza, Suite 400, San Francisco, CA 94107',
    standardShiftHours: 8.0,
    overtimeMultiplier: 1.5,
    defaultPfRate: 8.0,
    defaultTdsRate: 10.0,
    allowEmployeeSelfEdit: false,
    enforceMfa: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <SettingsIcon size={24} style={{ color: 'var(--primary-400)' }} /> System Settings & Configurations
          </h1>
          <p>Global company profile, attendance shift parameters, default tax rates, and security policies.</p>
        </div>
      </div>

      {saved && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', color: '#10b981', fontSize: '0.85rem' }}>
          System settings updated and saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Company Profile Settings */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card-header" style={{ marginBottom: 0 }}>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={18} style={{ color: 'var(--primary-400)' }} /> Organization Profile
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Legal Entity Name
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
                Corporate Address
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

        {/* Attendance & Payroll Configurations */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card-header" style={{ marginBottom: 0 }}>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} style={{ color: '#10b981' }} /> Shift & Overtime Parameters
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Standard Daily Work Shift (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                value={settings.standardShiftHours}
                onChange={(e) => setSettings({ ...settings, standardShiftHours: parseFloat(e.target.value) || 8.0 })}
                style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Overtime Rate Multiplier (x Base Rate)
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

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
            <Save size={16} /> Save Configuration Settings
          </button>
        </div>
      </form>
    </div>
  );
};
