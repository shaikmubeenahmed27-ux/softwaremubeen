import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAuditLogs } from '../services/auditLogService';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';

// Icons
import {
  ShieldAlert,
  Search,
  Filter,
  Lock,
  Calendar,
  User,
  Activity
} from 'lucide-react';

export const AuditLogsView = () => {
  const { currentRole, navigateTo } = useAuth();

  const [logs, setLogs] = useState([]);
  const [isRestricted, setIsRestricted] = useState(false);
  const [restrictedMsg, setRestrictedMsg] = useState('');
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const res = await getAuditLogs({ userRole: currentRole, search, moduleFilter });
    if (res.restricted) {
      setIsRestricted(true);
      setRestrictedMsg(res.message);
    } else {
      setIsRestricted(false);
      setLogs(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [currentRole, search, moduleFilter]);

  if (isRestricted) {
    return (
      <div style={{ padding: '2rem 0' }}>
        <ErrorState
          title="Security Access Restricted (403 Forbidden)"
          message={restrictedMsg}
          onRetry={() => navigateTo('dashboard')}
        />
      </div>
    );
  }

  const getLevelBadge = (level) => {
    switch (level) {
      case 'CRITICAL': return <Badge variant="danger" dot>CRITICAL</Badge>;
      case 'WARNING': return <Badge variant="warning" dot>WARNING</Badge>;
      default: return <Badge variant="info" dot>INFO</Badge>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <ShieldAlert size={24} style={{ color: 'var(--primary-400)' }} /> System Audit Logs Repository
          </h1>
          <p>
            Immutable audit logging tracking user authentication, employee CRUD, salary edits, leave approvals, and payroll runs.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: '280px', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--slate-400)' }} />
          <input
            type="text"
            placeholder="Search audit actions, user names, or descriptions..."
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Filter size={15} style={{ color: 'var(--text-muted)' }} />
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.825rem',
              outline: 'none'
            }}
          >
            <option value="All">All Modules</option>
            <option value="Authentication">Authentication</option>
            <option value="Employee Management">Employee Management</option>
            <option value="Salary Management">Salary Management</option>
            <option value="Leave Management">Leave Management</option>
            <option value="Payroll Processing">Payroll Processing</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <LoadingSpinner size={36} label="Fetching system audit log entries..." />
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>Timestamp</th>
                <th>User / Identity</th>
                <th>Module</th>
                <th>Action Performed</th>
                <th>Security Level</th>
                <th>Details / Description</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 600, color: 'var(--primary-400)', fontFamily: 'monospace' }}>{log.id}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.timestamp}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{log.user}</td>
                  <td><Badge variant="purple">{log.module}</Badge></td>
                  <td style={{ fontWeight: 600 }}>{log.action}</td>
                  <td>{getLevelBadge(log.level)}</td>
                  <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
