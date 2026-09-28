import React, { useRef } from 'react';
import { X, Printer, Download, Building2, Shield, CheckCircle2 } from 'lucide-react';
import { COMPANY_DETAILS } from '../../services/payslipService';

export const PayslipModal = ({ isOpen, payslip, onClose }) => {
  const printableRef = useRef();

  if (!isOpen || !payslip) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const fmt = (val) => {
    const num = parseFloat(val) || 0;
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const earnings = payslip.earnings || {};
  const deductions = payslip.deductions || {};

  const basic = earnings.basic || 0;
  const hra = earnings.hra || (earnings.allowances ? earnings.allowances * 0.4 : 0);
  const conveyance = earnings.conveyance || (earnings.allowances ? earnings.allowances * 0.2 : 0);
  const medical = earnings.medical || (earnings.allowances ? earnings.allowances * 0.15 : 0);
  const special = earnings.special || (earnings.allowances ? earnings.allowances * 0.25 : 0);
  const bonus = earnings.bonus || 0;
  const overtime = earnings.overtime || 0;

  const pf = deductions.pf || (deductions.standard ? deductions.standard * 0.4 : 0);
  const pt = deductions.pt || (deductions.standard ? deductions.standard * 0.15 : 0);
  const tds = deductions.tds || (deductions.standard ? deductions.standard * 0.45 : 0);
  const loan = deductions.loan || 0;
  const unpaidLeave = deductions.unpaidLeave || deductions.leave || 0;

  const grossSalary = payslip.grossSalary || (basic + hra + conveyance + medical + special + bonus + overtime);
  const totalDeductions = payslip.totalDeductions || (pf + pt + tds + loan + unpaidLeave);
  const netSalary = payslip.netSalary || (grossSalary - totalDeductions);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: '16px',
          background: '#ffffff',
          color: '#0f172a',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Toolbar (Screen Only) */}
        <div
          className="no-print"
          style={{
            padding: '1rem 1.5rem',
            background: '#f8fafc',
            color: '#0f172a',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem' }}>
            <Building2 size={20} style={{ color: '#2563eb' }} /> Payslip Statement Document — {payslip.id}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button className="btn btn-secondary" onClick={handlePrint} style={{ padding: '0.45rem 0.875rem', fontSize: '0.85rem' }}>
              <Printer size={16} /> Print Document (A4)
            </button>
            <button className="btn btn-primary" onClick={handleDownloadPDF} style={{ padding: '0.45rem 0.875rem', fontSize: '0.85rem' }}>
              <Download size={16} /> Download PDF
            </button>
            <button onClick={onClose} className="btn-icon" style={{ marginLeft: '0.5rem' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable A4 Document Shell */}
        <div
          ref={printableRef}
          className="printable-payslip"
          style={{
            padding: '2.5rem',
            fontFamily: "'Inter', sans-serif",
            color: '#1e293b',
            background: '#ffffff',
            fontSize: '0.875rem',
            lineHeight: 1.5
          }}
        >
          {/* Company Branding & Statement Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.025em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={28} style={{ color: '#2563eb' }} /> {COMPANY_DETAILS.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>{COMPANY_DETAILS.tagline}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>{COMPANY_DETAILS.address}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Email: {COMPANY_DETAILS.email} &bull; Phone: {COMPANY_DETAILS.phone}</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                PAYSLIP STATEMENT
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>
                Statement ID: {payslip.id}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Payment Date: {payslip.paymentDate || 'Current Cycle'}
              </div>
            </div>
          </div>

          {/* Employee Metadata Box */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.35rem', fontSize: '0.825rem' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Employee Name:</span>
                <strong style={{ color: '#0f172a' }}>{payslip.empName}</strong>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Employee ID:</span>
                <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{payslip.empId}</strong>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Department:</span>
                <span>{payslip.department}</span>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Designation:</span>
                <span>{payslip.designation}</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.35rem', fontSize: '0.825rem' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Pay Period:</span>
                <span>{payslip.payPeriod}</span>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Payment Mode:</span>
                <span>{payslip.paymentMode || 'Direct Bank Transfer'}</span>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Bank Name:</span>
                <span>{payslip.bankName || 'Federal Trust Bank'}</span>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Account No:</span>
                <span style={{ fontFamily: 'monospace' }}>{payslip.accountNumber || '**** **** 8888'}</span>
              </div>
            </div>
          </div>

          {/* Itemized Earnings vs Deductions Table */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '1.5rem',
              border: '1px solid #cbd5e1'
            }}
          >
            <thead>
              <tr style={{ background: '#0f172a', color: '#ffffff', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.65rem 1rem', textAlign: 'left', width: '50%', borderRight: '1px solid #334155' }}>Itemized Earnings</th>
                <th style={{ padding: '0.65rem 1rem', textAlign: 'left', width: '50%' }}>Itemized Deductions</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.825rem' }}>
              <tr>
                {/* Earnings Column */}
                <td style={{ verticalAlign: 'top', padding: 0, borderRight: '1px solid #cbd5e1' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 1rem', color: '#334155' }}>Basic Salary</td>
                        <td style={{ padding: '0.5rem 1rem', textAlign: 'right', fontWeight: 600 }}>{fmt(basic)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 1rem', color: '#334155' }}>HRA Allowance</td>
                        <td style={{ padding: '0.5rem 1rem', textAlign: 'right', fontWeight: 600 }}>{fmt(hra)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 1rem', color: '#334155' }}>Conveyance / Travel</td>
                        <td style={{ padding: '0.5rem 1rem', textAlign: 'right', fontWeight: 600 }}>{fmt(conveyance)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 1rem', color: '#334155' }}>Medical Allowance</td>
                        <td style={{ padding: '0.5rem 1rem', textAlign: 'right', fontWeight: 600 }}>{fmt(medical)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 1rem', color: '#334155' }}>Special Allowance</td>
                        <td style={{ padding: '0.5rem 1rem', textAlign: 'right', fontWeight: 600 }}>{fmt(special)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 1rem', color: '#334155' }}>Overtime & Bonuses</td>
                        <td style={{ padding: '0.5rem 1rem', textAlign: 'right', fontWeight: 600 }}>{fmt(bonus + overtime)}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>

                {/* Deductions Column */}
                <td style={{ verticalAlign: 'top', padding: 0 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 1rem', color: '#334155' }}>Provident Fund (PF)</td>
                        <td style={{ padding: '0.5rem 1rem', textAlign: 'right', fontWeight: 600, color: '#dc2626' }}>-{fmt(pf)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 1rem', color: '#334155' }}>Professional Tax (PT)</td>
                        <td style={{ padding: '0.5rem 1rem', textAlign: 'right', fontWeight: 600, color: '#dc2626' }}>-{fmt(pt)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 1rem', color: '#334155' }}>TDS / Income Tax</td>
                        <td style={{ padding: '0.5rem 1rem', textAlign: 'right', fontWeight: 600, color: '#dc2626' }}>-{fmt(tds)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 1rem', color: '#334155' }}>Loan Repayment</td>
                        <td style={{ padding: '0.5rem 1rem', textAlign: 'right', fontWeight: 600, color: '#dc2626' }}>-{fmt(loan)}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.5rem 1rem', color: '#334155' }}>Unpaid Leave Deduction</td>
                        <td style={{ padding: '0.5rem 1rem', textAlign: 'right', fontWeight: 600, color: '#dc2626' }}>-{fmt(unpaidLeave)}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* Totals Summary Row */}
              <tr style={{ background: '#f8fafc', fontWeight: 700, borderTop: '2px solid #cbd5e1' }}>
                <td style={{ padding: '0.75rem 1rem', borderRight: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Gross Salary (A):</span>
                    <span style={{ color: '#0f172a', fontSize: '0.95rem' }}>{fmt(grossSalary)}</span>
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Deductions (B):</span>
                    <span style={{ color: '#dc2626', fontSize: '0.95rem' }}>-{fmt(totalDeductions)}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Net Salary Take-Home Banner */}
          <div
            style={{
              padding: '1rem 1.5rem',
              background: '#ecfdf5',
              border: '2px solid #10b981',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Net Disbursed Take-Home Pay (A - B)
              </div>
              <div style={{ fontSize: '0.8rem', color: '#065f46', marginTop: '0.15rem' }}>
                Direct electronic credit transfer completed to registered bank account.
              </div>
            </div>

            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#047857' }}>
              {fmt(netSalary)}
            </div>
          </div>

          {/* Signatures & Footer Note */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px dashed #cbd5e1' }}>
            <div>
              <div style={{ width: '180px', borderBottom: '1px solid #0f172a', marginBottom: '0.35rem' }}></div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Employee Signature</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                <CheckCircle2 size={15} /> Digitally Certified by HR
              </div>
              <div style={{ width: '180px', borderBottom: '1px solid #0f172a', marginBottom: '0.35rem', marginLeft: 'auto' }}></div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Authorized Payroll Officer</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
