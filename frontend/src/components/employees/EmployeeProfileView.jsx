import React, { useState, useEffect } from 'react';
import { getEmployeeTabDetails } from '../../services/employeeService';
import { Badge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import {
  User,
  Briefcase,
  Clock,
  CalendarDays,
  DollarSign,
  CreditCard,
  FileText,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Download
} from 'lucide-react';

export const EmployeeProfileView = ({ employee, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [tabData, setTabData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employee && isOpen) {
      setLoading(true);
      getEmployeeTabDetails(employee.id).then((res) => {
        setTabData(res);
        setLoading(false);
      });
    }
  }, [employee, isOpen]);

  if (!isOpen || !employee) return null;

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'employment', label: 'Employment Details', icon: Briefcase },
    { id: 'attendance', label: 'Attendance Logs', icon: Clock },
    { id: 'leave', label: 'Leave Balances', icon: CalendarDays },
    { id: 'salary', label: 'Salary Structure', icon: DollarSign },
    { id: 'payroll', label: 'Payroll History', icon: CreditCard },
    { id: 'payslips', label: 'Payslips', icon: FileText },
  ];

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
        className="glass"
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Header Profile Summary Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <img
              src={employee.avatar && !employee.avatar.includes('photo-1494790108377')
                ? employee.avatar
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.fullName || 'Staff')}&background=3b82f6&color=fff&bold=true`}
              alt={employee.fullName}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--primary-500)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{employee.fullName}</h2>
                <Badge variant={employee.status === 'active' ? 'success' : 'warning'} dot>
                  {employee.status}
                </Badge>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.15rem 0' }}>
                {employee.designation} &bull; <strong style={{ color: 'var(--primary-400)' }}>{employee.department}</strong>
              </p>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontFamily: 'monospace' }}>
                Employee ID: {employee.id}
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        {/* 7 Tab Headers */}
        <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--primary-600)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 600 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={15} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        {loading ? (
          <LoadingSpinner size={32} label="Loading profile records..." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Tab 1: Personal Information */}
            {activeTab === 'personal' && (
              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Full Name</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.fullName}</div>
                </div>

                <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Work Email</div>
                  <div style={{ fontWeight: 600, color: 'var(--primary-400)' }}>{employee.email}</div>
                </div>

                <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Phone Number</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.phone}</div>
                </div>

                <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Date of Birth</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.dateOfBirth}</div>
                </div>

                <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Gender</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.gender}</div>
                </div>

                <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Residential Address</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.address}</div>
                </div>
              </div>
            )}

            {/* Tab 2: Employment Details */}
            {activeTab === 'employment' && (
              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Employee ID</div>
                  <div style={{ fontWeight: 600, color: 'var(--primary-400)', fontFamily: 'monospace' }}>{employee.id}</div>
                </div>

                <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Department</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.department}</div>
                </div>

                <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Designation Title</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.designation}</div>
                </div>

                <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Reporting Manager</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.manager}</div>
                </div>

                <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Joining Date</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.joiningDate}</div>
                </div>

                <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Employment Type</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{employee.employmentType}</div>
                </div>
              </div>
            )}

            {/* Tab 3: Attendance Logs */}
            {activeTab === 'attendance' && (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Logged Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.attendance.map((att, idx) => (
                      <tr key={idx}>
                        <td>{att.date}</td>
                        <td>{att.checkIn}</td>
                        <td>{att.checkOut}</td>
                        <td>{att.hours}</td>
                        <td>
                          <Badge variant={att.status === 'present' ? 'success' : 'warning'} dot>
                            {att.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 4: Leave Balances */}
            {activeTab === 'leave' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="grid grid-cols-3">
                  {tabData.leave.balances.map((lb, idx) => (
                    <div key={idx} className="card" style={{ padding: '0.875rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lb.type}</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-400)', margin: '0.2rem 0' }}>
                        {lb.remaining} / {lb.allocated} Days
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>{lb.used} days used</div>
                    </div>
                  ))}
                </div>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Request ID</th>
                        <th>Leave Type</th>
                        <th>Dates</th>
                        <th>Total Days</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tabData.leave.history.map((l, idx) => (
                        <tr key={idx}>
                          <td style={{ fontFamily: 'monospace', color: 'var(--primary-400)' }}>{l.id}</td>
                          <td>{l.type}</td>
                          <td>{l.dates}</td>
                          <td>{l.days} Days</td>
                          <td><Badge variant="success" dot>{l.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 5: Salary Structure */}
            {activeTab === 'salary' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary-500)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Base Monthly Pay</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{tabData.salary.basePay}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Net Monthly</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{tabData.salary.netMonthly}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                  <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#10b981', marginBottom: '0.5rem' }}>Allowances</div>
                    {tabData.salary.allowances.map((a, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.25rem 0' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{a.name}</span>
                        <span style={{ fontWeight: 600 }}>+{a.amount}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ef4444', marginBottom: '0.5rem' }}>Deductions</div>
                    {tabData.salary.deductions.map((d, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.25rem 0' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{d.name}</span>
                        <span style={{ fontWeight: 600, color: '#ef4444' }}>-{d.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 6: Payroll History */}
            {activeTab === 'payroll' && (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Cycle</th>
                      <th>Gross Pay</th>
                      <th>Total Deductions</th>
                      <th>Net Disbursed</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.payroll.map((p, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{p.cycle}</td>
                        <td>{p.gross}</td>
                        <td style={{ color: '#ef4444' }}>-{p.deductions}</td>
                        <td style={{ fontWeight: 700, color: '#10b981' }}>{p.net}</td>
                        <td><Badge variant="success" dot>{p.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 7: Payslips Repository */}
            {activeTab === 'payslips' && (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Payslip Code</th>
                      <th>Month</th>
                      <th>Issue Date</th>
                      <th>Net Pay</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.payslips.map((ps, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'monospace', color: 'var(--primary-400)' }}>{ps.id}</td>
                        <td style={{ fontWeight: 600 }}>{ps.month}</td>
                        <td>{ps.issueDate}</td>
                        <td style={{ fontWeight: 700, color: '#10b981' }}>{ps.netPay}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }} onClick={() => alert(`Downloading Payslip ${ps.id}...`)}>
                            <Download size={14} /> Download PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
