import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  FileText, 
  Download, 
  Send, 
  TrendingUp, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { PayrollRecord } from '../../types/erp';
import { PayslipDetailModal } from '../../components/modals/PayslipDetailModal';

export const PayrollView: React.FC = () => {
  const { 
    payroll, 
    role, 
    currentUser, 
    runMonthlyPayroll, 
    setFigmaOverlayAsset 
  } = useERP();

  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [filterMonth, setFilterMonth] = useState('October 2026');

  const displayedPayroll = role === 'admin' 
    ? payroll 
    : payroll.filter(p => p.employeeId === currentUser.id || p.employeeName === currentUser.name);

  const totalDisbursed = payroll.reduce((acc, p) => acc + p.netPay, 0);
  const totalDeductions = payroll.reduce((acc, p) => acc + p.totalDeductions, 0);

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              {role === 'admin' ? 'Payroll Disbursements & Compensation' : 'My Historical Payslips'}
            </h2>
            <span className="badge badge-neutral">{filterMonth}</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {role === 'admin'
              ? 'Calculate gross pay, tax withholdings, retirement allocations, and direct deposit batches.'
              : 'View detailed paystubs, tax withholdings, and year-to-date earnings statements.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setFigmaOverlayAsset(
              role === 'admin' 
                ? '/design-assets/Payroll/Payroll — Overview.svg' 
                : '/design-assets/Payroll/Employee — My Payslips.svg'
            )}
            className="btn btn-secondary btn-sm"
          >
            <Sparkles size={14} color="#0052FF" />
            <span>Compare Figma Spec</span>
          </button>

          {role === 'admin' && (
            <button
              onClick={() => {
                runMonthlyPayroll();
                alert('Successfully processed direct deposits for all 148 employees for October 2026.');
              }}
              className="btn btn-primary"
            >
              <Send size={16} />
              <span>Run Monthly Payroll</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL NET DISBURSED</span>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0052FF', marginTop: '4px' }}>
            ${(totalDisbursed * 12).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#05B169', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} />
            <span>100% Direct Deposit</span>
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>TAXES & DEDUCTIONS</span>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#CF202F', marginTop: '4px' }}>
            ${(totalDeductions * 12).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Fed/State & 401(k) Match</div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>BATCH STATUS</span>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#05B169', marginTop: '4px' }}>
            Executed
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Cleared ACH Network</div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>NEXT PAY CYCLE</span>
          <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
            Oct 31, 2026
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Cutoff in 10 days</div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Basic Salary</th>
              <th>Gross Earnings</th>
              <th>Deductions</th>
              <th>Net Take-Home</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedPayroll.map(record => (
              <tr 
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                    {record.employeeName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {record.employeeCode} • {record.designation}
                  </div>
                </td>
                <td>
                  <span style={{ color: 'var(--text-secondary)' }}>{record.department}</span>
                </td>
                <td>
                  <span style={{ fontWeight: '500' }}>${record.basicSalary.toLocaleString()}</span>
                </td>
                <td>
                  <span style={{ fontWeight: '600', color: '#05B169' }}>+${record.totalEarnings.toLocaleString()}</span>
                </td>
                <td>
                  <span style={{ fontWeight: '600', color: '#CF202F' }}>-${record.totalDeductions.toLocaleString()}</span>
                </td>
                <td>
                  <strong style={{ fontSize: '15px', color: '#0052FF' }}>${record.netPay.toLocaleString()}</strong>
                </td>
                <td>
                  <span className={`badge ${record.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                    <span className="badge-dot" />
                    {record.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRecord(record);
                    }}
                    className="btn btn-sm btn-ghost"
                  >
                    <FileText size={14} color="#0052FF" />
                    <span>View Payslip</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payslip Detail Modal */}
      <PayslipDetailModal 
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
};
