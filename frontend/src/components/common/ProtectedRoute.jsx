import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ErrorState } from './ErrorState';
import { ShieldAlert } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, currentRole, navigateTo } = useAuth();

  if (!isAuthenticated) {
    // If not authenticated, prompt to login
    return (
      <div style={{ padding: '2rem' }}>
        <ErrorState
          title="Authentication Required"
          message="You must be signed in to access this section of PayFlow HR."
          onRetry={() => navigateTo('login')}
        />
      </div>
    );
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    // Role-based Access Control Violation: Enforce database-level role restrictions
    return (
      <div style={{ padding: '2rem' }}>
        <ErrorState
          title="Access Denied (403 Forbidden)"
          message={`Your account role (${currentRole.toUpperCase()}) does not have permission to view this resource. Database Row Level Security (RLS) policies prevent access.`}
          onRetry={() => navigateTo('dashboard')}
        />
      </div>
    );
  }

  return children;
};
