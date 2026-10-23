import React, { useState } from 'react';
import { X, UserPlus, Sparkles } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Employee } from '../../types/erp';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddEmployeeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addEmployee, setFigmaOverlayAsset } = useERP();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: '',
    salary: 110000,
    location: 'San Francisco, CA',
    status: 'Active' as Employee['status'],
    skills: 'React, TypeScript'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email || `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@aavil.inc`,
      phone: formData.phone,
      department: formData.department,
      designation: formData.designation,
      salary: Number(formData.salary),
      location: formData.location,
      status: formData.status,
      skills: formData.skills.split(',').map(s => s.trim())
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px' }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
              Add New Employee
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Create an organizational personnel record and assign system permissions.
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input 
                type="text" 
                required
                className="form-control"
                placeholder="e.g. Liam"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input 
                type="text" 
                required
                className="form-control"
                placeholder="e.g. O'Connor"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Corporate Email</label>
              <input 
                type="email" 
                className="form-control"
                placeholder="name@aavil.inc"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                className="form-control"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Designation *</label>
              <input 
                type="text" 
                required
                className="form-control"
                placeholder="e.g. Senior Cloud Architect"
                value={formData.designation}
                onChange={e => setFormData({ ...formData, designation: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Base Salary ($)</label>
              <input 
                type="number" 
                className="form-control"
                value={formData.salary}
                onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as Employee['status'] })}
              >
                <option value="Active">Active</option>
                <option value="Probation">Probation</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skills (comma separated)</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="React, Node.js, GraphQL, Docker"
              value={formData.skills}
              onChange={e => setFormData({ ...formData, skills: e.target.value })}
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
              onClick={() => setFigmaOverlayAsset('/design-assets/Employees/Employees — Add Employee Form.svg')}
              style={{ background: 'none', border: 'none', color: '#0052FF', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              Compare Figma Spec ↗
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <UserPlus size={16} />
                <span>Save Employee</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
