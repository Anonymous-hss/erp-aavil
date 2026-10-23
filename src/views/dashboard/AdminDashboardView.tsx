import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  Check, 
  X, 
  Briefcase, 
  Clock,
  Sparkles,
  UserPlus
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const AdminDashboardView: React.FC = () => {
  const { 
    employees, 
    leaves, 
    reviewLeave, 
    projects, 
    setCurrentView, 
    setFigmaOverlayAsset 
  } = useERP();

  const [dashboardState, setDashboardState] = useState<'default' | 'empty' | 'loading'>('default');

  const pendingLeaves = leaves.filter(l => l.status === 'Pending');
  const activeProjects = projects.filter(p => p.status === 'Active' || p.status === 'In Progress');

  return (
    <div style={{ padding: '32px' }}>
      {/* Design State Switcher (Figma States) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        background: '#FFFFFF',
        padding: '12px 20px',
        borderRadius: '12px',
        border: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#0052FF" />
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Figma View Variations:</span>
          <div style={{ display: 'flex', gap: '4px', background: '#F1F3F5', padding: '3px', borderRadius: '6px' }}>
            <button
              onClick={() => setDashboardState('default')}
              style={{
                padding: '4px 10px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: dashboardState === 'default' ? '#0052FF' : 'transparent',
                color: dashboardState === 'default' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              Default
            </button>
            <button
              onClick={() => setDashboardState('empty')}
              style={{
                padding: '4px 10px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: dashboardState === 'empty' ? '#0052FF' : 'transparent',
                color: dashboardState === 'empty' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              Empty State
            </button>
            <button
              onClick={() => setDashboardState('loading')}
              style={{
                padding: '4px 10px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: dashboardState === 'loading' ? '#0052FF' : 'transparent',
                color: dashboardState === 'loading' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              Loading Skeleton
            </button>
          </div>
        </div>

        <button
          onClick={() => setFigmaOverlayAsset(
            dashboardState === 'empty'
              ? '/design-assets/Admin/Admin Dashboard — Empty.svg'
              : dashboardState === 'loading'
              ? '/design-assets/Admin/Admin Dashboard — Loading.svg'
              : '/design-assets/Admin/Admin Dashboard — Default.svg'
          )}
          className="btn btn-sm btn-secondary"
        >
          Compare Figma Spec ↗
        </button>
      </div>

      {dashboardState === 'loading' ? (
        /* Loading skeleton state matching Figma Admin Dashboard — Loading.svg */
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card" style={{ padding: '24px', height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: '80px', height: '12px', backgroundColor: '#EEF0F3', borderRadius: '4px' }} />
                  <div style={{ width: '32px', height: '32px', backgroundColor: '#E2E5EA', borderRadius: '8px' }} />
                </div>
                <div style={{ width: '100px', height: '32px', backgroundColor: '#E2E5EA', borderRadius: '6px' }} />
                <div style={{ width: '120px', height: '12px', backgroundColor: '#EEF0F3', borderRadius: '4px' }} />
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '60px 32px', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid #E2E5EA', borderTopColor: '#0052FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <div style={{ marginTop: '16px', fontWeight: '600', color: 'var(--text-main)' }}>Synchronizing enterprise workforce data...</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Querying personnel records and active cycles</div>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : dashboardState === 'empty' ? (
        /* Empty state matching Figma Admin Dashboard — Empty.svg */
        <div className="card" style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#F1F3F5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#8A8F98' }}>
            <Users size={32} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0A0B0D', margin: 0 }}>No Organization Data Found</h3>
          <p style={{ fontSize: '14px', color: '#5B616E', marginTop: '8px', lineHeight: '1.5' }}>
            Get started by inviting your first team members or importing historical payroll and attendance records.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
            <button onClick={() => setCurrentView('employees')} className="btn btn-primary">
              <UserPlus size={16} />
              <span>Add First Employee</span>
            </button>
            <button onClick={() => setDashboardState('default')} className="btn btn-secondary">
              Restore Sample Data
            </button>
          </div>
        </div>
      ) : (
        /* Default state matching Figma Admin Dashboard — Default.svg */
        <div>
          {/* KPI Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
            {/* Metric 1 */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>Total Employees</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#E5EDFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0052FF' }}>
                  <Users size={18} />
                </div>
              </div>
              <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px', letterSpacing: '-0.02em' }}>
                {employees.length + 142}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '12.5px', color: '#05B169' }}>
                <TrendingUp size={14} />
                <span style={{ fontWeight: '600' }}>+12%</span>
                <span style={{ color: 'var(--text-muted)' }}>vs previous quarter</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>Active Projects</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#E3F6EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#05B169' }}>
                  <Briefcase size={18} />
                </div>
              </div>
              <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px', letterSpacing: '-0.02em' }}>
                {activeProjects.length + 8}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '12.5px', color: '#05B169' }}>
                <ArrowUpRight size={14} />
                <span style={{ fontWeight: '600' }}>94%</span>
                <span style={{ color: 'var(--text-muted)' }}>on-track velocity</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>Pending Leaves</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FEF6E0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B45309' }}>
                  <Calendar size={18} />
                </div>
              </div>
              <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px', letterSpacing: '-0.02em' }}>
                {pendingLeaves.length}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '12.5px', color: '#B45309' }}>
                <Clock size={14} />
                <span style={{ fontWeight: '600' }}>Requires review</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>Monthly Payroll</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#E5EDFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0052FF' }}>
                  <CreditCard size={18} />
                </div>
              </div>
              <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px', letterSpacing: '-0.02em' }}>
                $1.42M
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                <span>Next cutoff: Oct 28, 2026</span>
              </div>
            </div>
          </div>

          {/* Main Grid: Pending Approvals & Project Velocity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', marginBottom: '32px' }}>
            {/* Pending Leave Requests */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                    Pending Leave Applications
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                    Employee time-off requests awaiting administrative action
                  </p>
                </div>
                <button 
                  onClick={() => setCurrentView('leaves')} 
                  style={{ fontSize: '12.5px', color: '#0052FF', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                >
                  View all ({leaves.length}) →
                </button>
              </div>

              {pendingLeaves.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13.5px' }}>
                  ✓ All leave applications have been reviewed.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pendingLeaves.map(leave => (
                    <div 
                      key={leave.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 16px',
                        borderRadius: '10px',
                        backgroundColor: '#F8F9FB',
                        border: '1px solid var(--border-light)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={leave.employeeAvatar} 
                          alt={leave.employeeName} 
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '13.5px', color: 'var(--text-main)' }}>
                            {leave.employeeName}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            <span style={{ fontWeight: '500', color: '#0052FF' }}>{leave.leaveType}</span> • {leave.days} day{leave.days > 1 ? 's' : ''} ({leave.startDate} to {leave.endDate})
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            "{leave.reason}"
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => reviewLeave(leave.id, 'Approved', 'Approved via Admin Quick Actions')}
                          className="btn btn-sm"
                          style={{ backgroundColor: '#E3F6EC', color: '#05B169', border: '1px solid #A3E6C5' }}
                          title="Approve leave"
                        >
                          <Check size={14} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => reviewLeave(leave.id, 'Rejected', 'Insufficient coverage')}
                          className="btn btn-sm"
                          style={{ backgroundColor: '#FEECEE', color: '#CF202F', border: '1px solid #F7BAC0' }}
                          title="Reject leave"
                        >
                          <X size={14} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Project Health / Budget Allocation */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                  Key Project Velocity
                </h3>
                <button 
                  onClick={() => setCurrentView('projects')} 
                  style={{ fontSize: '12.5px', color: '#0052FF', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                >
                  All Projects →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {projects.slice(0, 3).map(proj => (
                  <div key={proj.id} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600', fontSize: '13.5px', color: 'var(--text-main)' }}>{proj.name}</span>
                      <span className="badge badge-primary">{proj.progress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#EEF0F3', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${proj.progress}%`, height: '100%', backgroundColor: '#0052FF', borderRadius: '3px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
                      <span>Spent: ${proj.spent.toLocaleString()} / ${proj.budget.toLocaleString()}</span>
                      <span>Lead: {proj.leadName}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions Panel */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  Quick Administrative Actions
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button 
                    onClick={() => setCurrentView('employees')}
                    className="btn btn-sm btn-secondary"
                    style={{ justifyContent: 'flex-start', fontSize: '12px' }}
                  >
                    <UserPlus size={14} color="#0052FF" />
                    <span>+ Add Employee</span>
                  </button>
                  <button 
                    onClick={() => setCurrentView('payroll')}
                    className="btn btn-sm btn-secondary"
                    style={{ justifyContent: 'flex-start', fontSize: '12px' }}
                  >
                    <CreditCard size={14} color="#05B169" />
                    <span>Process Payroll</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
