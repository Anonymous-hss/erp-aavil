import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  Briefcase, 
  Award, 
  ArrowRight, 
  Sparkles, 
  CheckCircle,
  Plus
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const EmployeeDashboardView: React.FC = () => {
  const { 
    currentUser, 
    setCurrentView, 
    projects, 
    timesheets, 
    setFigmaOverlayAsset 
  } = useERP();

  const [dashboardState, setDashboardState] = useState<'default' | 'enriched'>('default');

  const myProjects = projects.filter(p => p.team.some(m => m.id === currentUser.id));
  const myCurrentTimesheet = timesheets.find(t => t.employeeId === currentUser.id) || timesheets[0];

  return (
    <div style={{ padding: '32px' }}>
      {/* Figma State Switcher */}
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
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Figma View:</span>
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
              onClick={() => setDashboardState('enriched')}
              style={{
                padding: '4px 10px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: dashboardState === 'enriched' ? '#0052FF' : 'transparent',
                color: dashboardState === 'enriched' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              Enriched (With Goals & Badges)
            </button>
          </div>
        </div>

        <button
          onClick={() => setFigmaOverlayAsset(
            dashboardState === 'default' 
              ? '/design-assets/Dashboard/Employee Dashboard — Default.svg' 
              : '/design-assets/Dashboard/Employee Dashboard — Enriched.svg'
          )}
          className="btn btn-sm btn-secondary"
        >
          Compare Figma Spec ↗
        </button>
      </div>

      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0A0B0D 0%, #16181C 100%)',
        color: '#FFFFFF',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ zIndex: 2 }}>
          <div style={{ fontSize: '13px', color: '#8A8F98', fontWeight: '500' }}>
            Wednesday, October 21, 2026 • Work Day 19 of 22
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginTop: '6px', letterSpacing: '-0.02em' }}>
            Good afternoon, {currentUser.name.split(' ')[0]} 👋
          </h2>
          <p style={{ fontSize: '14px', color: '#B5BAC2', marginTop: '6px', maxWidth: '520px' }}>
            You're currently assigned to <strong>{myProjects.length} active initiatives</strong>. Next payroll disbursement is scheduled in 7 days.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', zIndex: 2 }}>
          <button 
            onClick={() => setCurrentView('leaves')} 
            className="btn btn-primary"
            style={{ padding: '10px 18px' }}
          >
            <Plus size={16} />
            <span>Apply for Leave</span>
          </button>
          <button 
            onClick={() => setCurrentView('timesheets')} 
            className="btn btn-secondary"
            style={{ padding: '10px 18px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFF', border: '1px solid rgba(255, 255, 255, 0.2)' }}
          >
            <Clock size={16} />
            <span>Log Timesheet</span>
          </button>
        </div>
      </div>

      {/* Leave Balance Quotas */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
            Time-Off Allowances & Quota
          </h3>
          <button 
            onClick={() => setCurrentView('leaves')} 
            style={{ fontSize: '12.5px', color: '#0052FF', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}
          >
            Leave History & Rules →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {/* Annual Leave */}
          <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '4px solid #E5EDFF',
              borderTopColor: '#0052FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '18px',
              color: '#0052FF',
              flexShrink: 0
            }}>
              14
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-main)' }}>Annual Leave</div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>14 of 20 days remaining</div>
              <div style={{ fontSize: '11px', color: '#05B169', fontWeight: '600', marginTop: '4px' }}>Accruing +1.6 days/mo</div>
            </div>
          </div>

          {/* Sick Leave */}
          <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '4px solid #E3F6EC',
              borderTopColor: '#05B169',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '18px',
              color: '#05B169',
              flexShrink: 0
            }}>
              8
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-main)' }}>Sick Leave</div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>8 of 10 days remaining</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Medical certificate required &gt; 3 days</div>
            </div>
          </div>

          {/* Casual Leave */}
          <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '4px solid #FEF6E0',
              borderTopColor: '#F4B000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '18px',
              color: '#B45309',
              flexShrink: 0
            }}>
              4
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-main)' }}>Casual / Personal</div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>4 of 6 days remaining</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Non-cumulative annual reset</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Timesheets & Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
        {/* Weekly Timesheet Status */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
              Current Timesheet
            </h3>
            <span className="badge badge-success">
              <span className="badge-dot" />
              {myCurrentTimesheet.status}
            </span>
          </div>

          <div style={{ backgroundColor: '#F8F9FA', padding: '16px', borderRadius: '10px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <span>Period:</span>
              <strong style={{ color: 'var(--text-main)' }}>{myCurrentTimesheet.weekStart} — {myCurrentTimesheet.weekEnd}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <span>Total Hours:</span>
              <strong style={{ color: '#0052FF', fontSize: '16px' }}>{myCurrentTimesheet.totalHours} hrs</strong>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {myCurrentTimesheet.entries.map(e => (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{e.projectName}</span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
                  {Object.values(e.hours).reduce((a, b) => a + b, 0)} hrs
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentView('timesheets')}
            className="btn btn-outline-primary"
            style={{ width: '100%', fontSize: '13px' }}
          >
            <span>Edit Weekly Hours</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Assigned Projects */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
              My Active Projects
            </h3>
            <button 
              onClick={() => setCurrentView('projects')} 
              style={{ fontSize: '12.5px', color: '#0052FF', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}
            >
              All Projects →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {myProjects.map(proj => (
              <div key={proj.id} style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#F8F9FA', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>{proj.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>{proj.code}</span>
                  </div>
                  <span className="badge badge-primary">{proj.progress}%</span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '4px 0 10px 0' }}>
                  {proj.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>Tasks: <strong>{proj.tasksCompleted} / {proj.totalTasks}</strong></span>
                  <span>Deadline: <strong>{proj.deadline}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
