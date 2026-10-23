import React, { useState } from 'react';
import { X, Star, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { AppraisalReview } from '../../types/erp';

interface Props {
  appraisal: AppraisalReview | null;
  onClose: () => void;
}

export const AppraisalDetailModal: React.FC<Props> = ({ appraisal, onClose }) => {
  const { 
    role, 
    submitSelfAssessment, 
    completeManagerReview, 
    setFigmaOverlayAsset 
  } = useERP();

  const [rating, setRating] = useState(appraisal?.selfRating || 4.5);
  const [comments, setComments] = useState(appraisal?.selfComments || '');
  const [goals, setGoals] = useState(appraisal?.goalsAchieved || '');

  if (!appraisal) return null;

  const isCompleted = appraisal.status === 'Completed';

  const handleSelfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSelfAssessment(appraisal.id, Number(rating), comments, goals);
    onClose();
  };

  const handleManagerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeManagerReview(appraisal.id, Number(rating), comments);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F8F9FA'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-primary">{appraisal.cycle}</span>
              <span className={`badge ${isCompleted ? 'badge-success' : 'badge-warning'}`}>
                {appraisal.status}
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginTop: '6px' }}>
              Performance Evaluation: {appraisal.employeeName}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {isCompleted ? (
            /* Completed Review View matching Appraisals — Completed Review.svg */
            <div>
              <div style={{
                padding: '20px',
                backgroundColor: '#E3F6EC',
                borderRadius: '12px',
                border: '1px solid #A3E6C5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#166534', textTransform: 'uppercase' }}>
                    Final Performance Assessment
                  </div>
                  <div style={{ fontSize: '14px', color: '#14532D', marginTop: '2px' }}>
                    Exceeds High Expectations • Completed on {appraisal.completedDate}
                  </div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#05B169' }}>
                  ★ {appraisal.overallRating} <span style={{ fontSize: '14px', fontWeight: '600', color: '#166534' }}>/ 5.0</span>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>EMPLOYEE SELF REFLECTION</span>
                <p style={{ fontSize: '13.5px', color: 'var(--text-main)', marginTop: '4px', backgroundColor: '#F8F9FA', padding: '12px', borderRadius: '8px' }}>
                  "{appraisal.selfComments}"
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>EXECUTIVE MANAGER EVALUATION</span>
                <p style={{ fontSize: '13.5px', color: 'var(--text-main)', marginTop: '4px', backgroundColor: '#F8F9FA', padding: '12px', borderRadius: '8px' }}>
                  "{appraisal.managerComments}"
                </p>
              </div>
            </div>
          ) : role === 'admin' ? (
            /* Manager Review Form matching Appraisals — Review Detail.svg */
            <form onSubmit={handleManagerSubmit}>
              <div className="form-group">
                <label className="form-label">Manager Rating (1.0 to 5.0 Stars) *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input 
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                    style={{ flex: 1, accentColor: '#0052FF' }}
                  />
                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#0052FF', minWidth: '40px' }}>
                    ★ {rating}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Manager Assessment & Growth Directives *</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Summarize accomplishments, leadership contributions, and next quarter OKRs..."
                  className="form-control"
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                <CheckCircle2 size={16} />
                <span>Complete Performance Review</span>
              </button>
            </form>
          ) : (
            /* Employee Self Assessment matching Employee — Self Assessment.svg */
            <form onSubmit={handleSelfSubmit}>
              <div className="form-group">
                <label className="form-label">Self Rating (1.0 to 5.0) *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input 
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                    style={{ flex: 1, accentColor: '#0052FF' }}
                  />
                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#0052FF', minWidth: '40px' }}>
                    ★ {rating}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Core Achievements & Milestones Delivered</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="List your delivered project deliverables, mentorship, or operational optimizations..."
                  className="form-control"
                  value={goals}
                  onChange={e => setGoals(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Self Reflection & Career Objectives</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Where do you feel you excelled, and which skills would you like to level up next?"
                  className="form-control"
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                <Award size={16} />
                <span>Submit Self Assessment</span>
              </button>
            </form>
          )}

          {/* Figma Spec link */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setFigmaOverlayAsset(
                isCompleted 
                  ? '/design-assets/Appraisals/Appraisals — Completed Review.svg'
                  : role === 'admin'
                  ? '/design-assets/Appraisals/Appraisals — Review Detail.svg'
                  : '/design-assets/Appraisals/Employee — Self Assessment.svg'
              )}
              style={{ background: 'none', border: 'none', color: '#0052FF', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              Compare Figma Spec ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
