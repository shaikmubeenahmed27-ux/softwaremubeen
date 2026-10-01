import { supabase } from '../lib/supabase';

let MOCK_AUDIT_LOGS = [];

export async function getAuditLogs({ userRole = 'admin', search = '', moduleFilter = 'All' } = {}) {
  // Role Security Enforcement: Normal employees & managers cannot access or modify audit logs
  if (userRole !== 'admin') {
    return {
      restricted: true,
      message: 'Access Restricted: Audit Logs repository is restricted to Admin personnel under security RLS rules.'
    };
  }

  try {
    const { data: dbLogs, error } = await supabase
      .from('audit_logs')
      .select('*, profiles(*)')
      .order('created_at', { ascending: false });

    let records = [];

    if (!error && dbLogs && dbLogs.length > 0) {
      records = dbLogs.map((l) => ({
        id: l.id,
        user: l.profiles?.full_name || 'System User',
        action: l.action,
        module: 'System',
        timestamp: new Date(l.created_at || Date.now()).toLocaleString(),
        level: l.security_level || 'INFO',
        description: l.action
      }));
    } else {
      records = MOCK_AUDIT_LOGS;
    }

    if (search) {
      records = records.filter(
        (r) =>
          r.user.toLowerCase().includes(search.toLowerCase()) ||
          r.action.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (moduleFilter !== 'All') {
      records = records.filter((r) => r.module === moduleFilter);
    }

    return { restricted: false, data: records };
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return { restricted: false, data: MOCK_AUDIT_LOGS };
  }
}

export async function recordAuditAction({ user, action, module = 'System', level = 'INFO', description = '' }) {
  const newLog = {
    id: `aud-${Date.now()}`,
    user: user || 'Admin',
    action,
    module,
    timestamp: new Date().toLocaleString(),
    level,
    description: description || action
  };

  MOCK_AUDIT_LOGS = [newLog, ...MOCK_AUDIT_LOGS];
  return { success: true };
}
