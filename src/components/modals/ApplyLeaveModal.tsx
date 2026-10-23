import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { LeaveType } from '../../types/erp';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyLeaveModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { applyLeave, setFigmaOverlayAsset } = useERP();

  const [leaveType, setLeaveType] = useState<LeaveType>('Annual Leave');
  const [startDate, setStartDate] = useState('2026-10-26');
  const [endDate, setEndDate] = useState('2026-10-28');
  const [days, setDays] = useState(3);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyLeave({
      leaveType,
      startDate,
      endDate,
      days: Number(days),
      reason: reason || 'Personal time off requested.'
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
              Apply for Leave
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Submit a formal time-off request to your reporting manager.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div className="form-group">
            <label className="form-label">Leave Category *</label>
            <select 
              className="form-control"
              value={leaveType}
              onChange={e => setLeaveType(e.target.value as LeaveType)}
            >
              <option value="Annual Leave">Annual Leave (14 days left)</option>
              <option value="Sick Leave">Sick Leave (8 days left)</option>
              <option value="Casual Leave">Casual Leave (4 days left)</option>
              <option value="Maternity/Paternity">Maternity/Paternity</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input 
                type="date"
                required
                className="form-control"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input 
                type="date"
                required
                className="form-control"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Total Business Days</label>
            <input 
              type="number"
              min={1}
              max={30}
              required
              className="form-control"
              value={days}
              onChange={e => setDays(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reason / Justification *</label>
            <textarea 
              rows={3}
              required
              placeholder="Provide context for coverage and handoff..."
              className="form-control"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-light)'
          }}>
            <button
              type="button"
              onClick={() => setFigmaOverlayAsset('/design-assets/Leaves/Leaves — Apply Leave.svg')}
              style={{ background: 'none', border: 'none', color: '#0052FF', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              Compare Figma Spec ↗
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <CalendarIcon size={16} />
                <span>Submit Request</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
