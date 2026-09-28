import React from 'react';
import { X, Calendar, User, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Badge } from '../common/Badge';

export const LeaveDetailModal = ({ isOpen, request, onClose, onApprove, onReject, currentRole }) => {
  if (!isOpen || !request) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <Badge variant="warning">Pending Review</Badge>;
      case 'Approved': return <Badge variant="success">Approved</Badge>;
      case 'Rejected': return <Badge variant="danger">Rejected</Badge>;
      case 'Cancelled': return <Badge variant="neutral">Cancelled</Badge>;
      default: return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1050 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', width: '100%', borderRadius: '16px', padding: '1.75rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Leave Application Details
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ID: {request.id}
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Employee Info card */}
          <div style={{
            background: 'var(--bg-app, #f8fafc)',
            padding: '1rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: request.avatarBg || '#3b82f6',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {request.initials || (request.empName ? request.empName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'EM')}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                {request.empName}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {request.department}
              </div>
            </div>
            <div>
              {getStatusBadge(request.status)}
            </div>
          </div>

          {/* Leave Meta Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.85rem',
            background: 'var(--bg-surface, #ffffff)',
            border: '1px solid var(--border-color)',
            padding: '1rem',
            borderRadius: '12px'
          }}>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Leave Type
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {request.leaveType}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Total Duration
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#2563eb', marginTop: '0.2rem' }}>
                {request.totalDays} {request.totalDays === 1 ? 'Day' : 'Days'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                From Date
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {request.startDate}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                To Date
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {request.endDate}
              </div>
            </div>
          </div>

          {/* Reason Section */}
          <div style={{
            background: 'var(--bg-app, #f8fafc)',
            padding: '1rem',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.35rem' }}>
              Reason for Leave
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              {request.reason || 'No detailed reason provided.'}
            </div>
            {request.rejectionReason && (
              <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#fef2f2', borderRadius: '8px', color: '#b91c1c', fontSize: '0.8rem' }}>
                <strong>Rejection Rationale:</strong> {request.rejectionReason}
              </div>
            )}
          </div>

          {/* Applied Date & Approver */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', color: 'var(--text-muted)', padding: '0 0.25rem' }}>
            <span>Applied On: <strong>{request.appliedOn || request.startDate}</strong></span>
            {request.approvedBy && <span>Processed By: <strong>{request.approvedBy}</strong></span>}
          </div>
        </div>

        {/* Action Buttons in Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {request.status === 'Pending' && (currentRole === 'admin' || currentRole === 'manager') && (
            <>
              <button
                className="btn btn-secondary"
                style={{ color: '#ef4444', borderColor: '#ef4444' }}
                onClick={() => {
                  onClose();
                  onReject(request);
                }}
              >
                <XCircle size={15} /> Reject
              </button>
              <button
                className="btn btn-primary"
                style={{ background: '#10b981', borderColor: '#10b981' }}
                onClick={() => {
                  onClose();
                  onApprove(request.id);
                }}
              >
                <CheckCircle2 size={15} /> Approve Request
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
