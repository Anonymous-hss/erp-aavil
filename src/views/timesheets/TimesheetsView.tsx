import React, { useState } from 'react';
import { 
  Clock, 
  Send, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Timesheet } from '../../types/erp';

export const TimesheetsView: React.FC = () => {
  const { 
    timesheets, 
    role, 
    currentUser, 
    updateTimesheetHours, 
    submitTimesheet, 
    reviewTimesheet, 
    setFigmaOverlayAsset 
  } = useERP();

  const [viewMode, setViewMode] = useState<'weekly' | 'approval' | 'empty'>('weekly');

  const myTimesheet = timesheets.find(t => t.employeeId === currentUser.id) || timesheets[0];
  const pendingTimesheets = timesheets.filter(t => t.status === 'Submitted');

  const days: Array<{ key: keyof Timesheet['entries'][0]['hours']; label: string; date: string }> = [
    { key: 'mon', label: 'Mon', date: 'Oct 12' },
    { key: 'tue', label: 'Tue', date: 'Oct 13' },
    { key: 'wed', label: 'Wed', date: 'Oct 14' },
    { key: 'thu', label: 'Thu', date: 'Oct 15' },
    { key: 'fri', label: 'Fri', date: 'Oct 16' },
    { key: 'sat', label: 'Sat', date: 'Oct 17' },
    { key: 'sun', label: 'Sun', date: 'Oct 18' }
  ];

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              {viewMode === 'approval' ? 'Timesheet Approvals Queue' : 'Weekly Timesheet Logger'}
            </h2>
            <span className={`badge ${myTimesheet.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
              <span className="badge-dot" />
              {myTimesheet.status}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Log billable hours against active initiatives and submit for manager approval before payroll cutoff.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {/* View Mode Pills (Matching Figma variations) */}
          <div style={{ display: 'flex', gap: '4px', background: '#F1F3F5', padding: '3px', borderRadius: '6px' }}>
            <button
              onClick={() => setViewMode('weekly')}
              style={{
                padding: '4px 10px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: viewMode === 'weekly' ? '#0052FF' : 'transparent',
                color: viewMode === 'weekly' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              Weekly View
            </button>
            <button
              onClick={() => setViewMode('approval')}
              style={{
                padding: '4px 10px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: viewMode === 'approval' ? '#0052FF' : 'transparent',
                color: viewMode === 'approval' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              Admin Approval ({pendingTimesheets.length})
            </button>
            <button
              onClick={() => setViewMode('empty')}
              style={{
                padding: '4px 10px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: viewMode === 'empty' ? '#0052FF' : 'transparent',
                color: viewMode === 'empty' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              Empty State Spec
            </button>
          </div>

          <button
            onClick={() => setFigmaOverlayAsset(
              viewMode === 'approval'
                ? '/design-assets/Timesheets/Timesheets — Admin Approval.svg'
                : viewMode === 'empty'
                ? '/design-assets/Timesheets/Timesheets — Empty State.svg'
                : '/design-assets/Timesheets/Timesheets — Weekly View.svg'
            )}
            className="btn btn-secondary btn-sm"
          >
            <Sparkles size={14} color="#0052FF" />
            <span>Compare Figma Spec</span>
          </button>
        </div>
      </div>

      {/* Empty State View matching Timesheets — Empty State.svg */}
      {viewMode === 'empty' ? (
        <div className="card" style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#F1F3F5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#8A8F98' }}>
            <Clock size={32} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0A0B0D', margin: 0 }}>No Hours Logged This Week</h3>
          <p style={{ fontSize: '14px', color: '#5B616E', marginTop: '8px', lineHeight: '1.5' }}>
            You have not recorded time entries for the current sprint period. Start by selecting your assigned project and entering daily hours.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
            <button onClick={() => setViewMode('weekly')} className="btn btn-primary">
              <Plus size={16} />
              <span>Record Hours</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'approval' ? (
        /* Admin Approvals Queue */
        <div>
          <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                Submitted Timesheets Pending Verification
              </h3>
              <span className="badge badge-warning">{pendingTimesheets.length} Pending</span>
            </div>

            {pendingTimesheets.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                ✓ All submitted timesheets for this cycle have been reviewed and approved!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {pendingTimesheets.map(ts => (
                  <div key={ts.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '10px', backgroundColor: '#F8F9FA', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={ts.employeeAvatar} alt={ts.employeeName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px' }}>{ts.employeeName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {ts.department} • Period: {ts.weekStart} to {ts.weekEnd} • Submitted on {ts.submittedOn}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: '800', color: '#0052FF' }}>{ts.totalHours} hrs</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ts.entries.length} project task(s)</div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => reviewTimesheet(ts.id, 'Approved')}
                          className="btn btn-sm"
                          style={{ backgroundColor: '#E3F6EC', color: '#05B169', border: '1px solid #A3E6C5' }}
                        >
                          <Check size={14} />
                          <span>Approve</span>
                        </button>
                        <button 
                          onClick={() => reviewTimesheet(ts.id, 'Rejected')}
                          className="btn btn-sm"
                          style={{ backgroundColor: '#FEECEE', color: '#CF202F', border: '1px solid #F7BAC0' }}
                        >
                          <X size={14} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Weekly Grid Logger View matching Timesheets — Weekly View.svg */
        <div>
          {/* Week Selector Bar */}
          <div className="card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="btn btn-sm btn-secondary">
                <ChevronLeft size={14} />
              </button>
              <div style={{ fontWeight: '700', fontSize: '14.5px', color: 'var(--text-main)' }}>
                Week 42: October 12, 2026 — October 18, 2026
              </div>
              <button className="btn btn-sm btn-secondary">
                <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Total Recorded: <strong style={{ color: '#0052FF', fontSize: '15px' }}>{myTimesheet.totalHours} / 40.0 hrs</strong>
              </div>
              {myTimesheet.status !== 'Submitted' && myTimesheet.status !== 'Approved' && (
                <button 
                  onClick={() => submitTimesheet(myTimesheet.id)}
                  className="btn btn-primary btn-sm"
                >
                  <Send size={14} />
                  <span>Submit Timesheet</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Hours Grid Table */}
          <div className="table-container">
            <table className="erp-table">
              <thead>
                <tr>
                  <th style={{ width: '320px' }}>Project & Task</th>
                  {days.map(d => (
                    <th key={d.key} style={{ textAlign: 'center', minWidth: '70px' }}>
                      <div>{d.label}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{d.date}</div>
                    </th>
                  ))}
                  <th style={{ textAlign: 'center', width: '90px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {myTimesheet.entries.map(entry => {
                  const rowSum = Object.values(entry.hours).reduce((a, b) => a + b, 0);
                  return (
                    <tr key={entry.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '13.5px' }}>
                          {entry.projectName}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {entry.taskDescription}
                        </div>
                      </td>

                      {days.map(d => (
                        <td key={d.key} style={{ textAlign: 'center' }}>
                          <input 
                            type="number"
                            min="0"
                            max="24"
                            step="0.5"
                            value={entry.hours[d.key] || ''}
                            onChange={e => updateTimesheetHours(myTimesheet.id, entry.id, d.key, Number(e.target.value))}
                            style={{
                              width: '54px',
                              height: '36px',
                              textAlign: 'center',
                              borderRadius: '6px',
                              border: '1px solid var(--border-default)',
                              fontSize: '13.5px',
                              fontWeight: '600',
                              outline: 'none',
                              color: entry.hours[d.key] > 0 ? '#0052FF' : 'var(--text-muted)'
                            }}
                          />
                        </td>
                      ))}

                      <td style={{ textAlign: 'center' }}>
                        <strong style={{ color: 'var(--text-main)', fontSize: '14px' }}>
                          {rowSum.toFixed(1)}h
                        </strong>
                      </td>
                    </tr>
                  );
                })}

                {/* Summary Row */}
                <tr style={{ backgroundColor: '#F8F9FA', fontWeight: '700' }}>
                  <td>
                    <span>Daily Aggregate</span>
                  </td>
                  {days.map(d => {
                    const colSum = myTimesheet.entries.reduce((acc, entry) => acc + (entry.hours[d.key] || 0), 0);
                    return (
                      <td key={d.key} style={{ textAlign: 'center', color: colSum >= 8 ? '#05B169' : '#0052FF' }}>
                        {colSum.toFixed(1)}h
                      </td>
                    );
                  })}
                  <td style={{ textAlign: 'center', fontSize: '15px', color: '#0052FF' }}>
                    {myTimesheet.totalHours.toFixed(1)}h
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
