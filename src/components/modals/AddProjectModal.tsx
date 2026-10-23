import React, { useState } from 'react';
import { X, Briefcase, Sparkles } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProjectModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addProject, setFigmaOverlayAsset } = useERP();

  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [budget, setBudget] = useState(150000);
  const [deadline, setDeadline] = useState('2026-12-31');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProject({
      name,
      client,
      budget: Number(budget),
      deadline,
      description,
      status: 'Active',
      progress: 0
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '560px' }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
              Add New Project
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Initialize an enterprise project container, assign budgets, and define milestones.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input 
              type="text"
              required
              placeholder="e.g. Apollo Financial Gateway 2.0"
              className="form-control"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Client / Division *</label>
              <input 
                type="text"
                required
                placeholder="e.g. Vanguard Partners"
                className="form-control"
                value={client}
                onChange={e => setClient(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Approved Budget ($)</label>
              <input 
                type="number"
                required
                className="form-control"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Completion Deadline</label>
            <input 
              type="date"
              required
              className="form-control"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Scope & Architectural Objective</label>
            <textarea 
              rows={3}
              placeholder="Describe deliverables, sprint rhythm, and resource dependencies..."
              className="form-control"
              value={description}
              onChange={e => setDescription(e.target.value)}
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
              onClick={() => setFigmaOverlayAsset('/design-assets/Projects/Projects — Add Project.svg')}
              style={{ background: 'none', border: 'none', color: '#0052FF', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              Compare Figma Spec ↗
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Briefcase size={16} />
                <span>Create Project</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
