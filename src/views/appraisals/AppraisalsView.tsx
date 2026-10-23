import React, { useState } from 'react';
import { 
  Award, 
  Star, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { AppraisalReview } from '../../types/erp';
import { AppraisalDetailModal } from './AppraisalDetailModal';

export const AppraisalsView: React.FC = () => {
  const { 
    appraisals, 
    role, 
    setFigmaOverlayAsset 
  } = useERP();

  const [selectedAppraisal, setSelectedAppraisal] = useState<AppraisalReview | null>(null);

  const getStatusBadge = (status: AppraisalReview['status']) => {
    switch (status) {
      case 'Completed':
        return <span className="badge badge-success"><span className="badge-dot" />Completed</span>;
      case 'Manager Review':
        return <span className="badge badge-warning"><span className="badge-dot" />Manager Review</span>;
      case 'Self Assessment':
        return <span className="badge badge-primary"><span className="badge-dot" />Self Assessment</span>;
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Performance & Appraisals Cycle
            </h2>
            <span className="badge badge-primary">Q3 2026 Cycle Active</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Track competency evaluations, self assessments, management feedback, and OKR achievements.
          </p>
        </div>

        <button
          onClick={() => setFigmaOverlayAsset('/design-assets/Appraisals/Appraisals — Overview.svg')}
          className="btn btn-secondary btn-sm"
        >
          <Sparkles size={14} color="#0052FF" />
          <span>Compare Figma Spec</span>
        </button>
      </div>

      {/* Cycle Pipeline Progress Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL REVIEWS</span>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0A0B0D', marginTop: '4px' }}>
            {appraisals.length + 145}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Full organizational scope</div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>SELF ASSESSMENTS</span>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0052FF', marginTop: '4px' }}>
            94%
          </div>
          <div style={{ fontSize: '12px', color: '#05B169', marginTop: '4px' }}>139 of 148 submitted</div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>MANAGER SIGN-OFFS</span>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#F4B000', marginTop: '4px' }}>
            88%
          </div>
          <div style={{ fontSize: '12px', color: '#B45309', marginTop: '4px' }}>130 calibrated</div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>AVG ORG RATING</span>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#05B169', marginTop: '4px' }}>
            ★ 4.62
          </div>
          <div style={{ fontSize: '12px', color: '#05B169', marginTop: '4px' }}>High performance baseline</div>
        </div>
      </div>

      {/* Appraisals Table */}
      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department & Role</th>
              <th>Review Cycle</th>
              <th>Self Rating</th>
              <th>Manager Rating</th>
              <th>Overall Score</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Evaluation</th>
            </tr>
          </thead>
          <tbody>
            {appraisals.map(review => (
              <tr 
                key={review.id}
                onClick={() => setSelectedAppraisal(review)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img 
                      src={review.employeeAvatar} 
                      alt={review.employeeName} 
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                        {review.employeeName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {review.designation}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{review.department}</span>
                </td>
                <td>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>{review.cycle}</span>
                </td>
                <td>
                  <span style={{ fontWeight: '600', color: review.selfRating ? '#0052FF' : 'var(--text-muted)' }}>
                    {review.selfRating ? `★ ${review.selfRating}` : 'Pending'}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: '600', color: review.managerRating ? '#05B169' : 'var(--text-muted)' }}>
                    {review.managerRating ? `★ ${review.managerRating}` : 'Pending'}
                  </span>
                </td>
                <td>
                  {review.overallRating ? (
                    <strong style={{ fontSize: '14.5px', color: '#05B169' }}>
                      ★ {review.overallRating} / 5.0
                    </strong>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>In Progress</span>
                  )}
                </td>
                <td>
                  {getStatusBadge(review.status)}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAppraisal(review);
                    }}
                    className="btn btn-sm btn-ghost"
                  >
                    <span>{review.status === 'Completed' ? 'View Report' : 'Open Review'}</span>
                    <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Appraisal Detail / Review Form Modal */}
      <AppraisalDetailModal 
        appraisal={selectedAppraisal}
        onClose={() => setSelectedAppraisal(null)}
      />
    </div>
  );
};
