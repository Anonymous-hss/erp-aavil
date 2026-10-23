import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  Filter, 
  ChevronRight, 
  MoreHorizontal, 
  Download, 
  MapPin, 
  Briefcase,
  Sparkles
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { AddEmployeeModal } from '../../components/modals/AddEmployeeModal';

export const EmployeesView: React.FC = () => {
  const { 
    employees, 
    setCurrentView, 
    setSelectedEmployeeId, 
    setFigmaOverlayAsset 
  } = useERP();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const departments = ['All', 'Engineering', 'Design', 'Product', 'Sales', 'Marketing'];

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase()) || 
                          emp.designation.toLowerCase().includes(search.toLowerCase()) ||
                          emp.employeeCode.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="badge badge-success"><span className="badge-dot" />Active</span>;
      case 'On Leave':
        return <span className="badge badge-warning"><span className="badge-dot" />On Leave</span>;
      case 'Probation':
        return <span className="badge badge-primary"><span className="badge-dot" />Probation</span>;
      default:
        return <span className="badge badge-neutral"><span className="badge-dot" />{status}</span>;
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Staff Directory
            </h2>
            <span className="badge badge-neutral">{filteredEmployees.length} Personnel</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Browse enterprise organizational charts, skill profiles, and contact details.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setFigmaOverlayAsset('/design-assets/Employees/Employees — Directory.svg')}
            className="btn btn-secondary btn-sm"
          >
            <Sparkles size={14} color="#0052FF" />
            <span>Compare Figma Directory</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
          >
            <UserPlus size={16} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Search Field */}
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Search by name, role, code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '38px', height: '38px' }}
            />
          </div>

          {/* Department Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '2px 0' }}>
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: selectedDept === dept ? 'var(--primary)' : 'var(--border-default)',
                  backgroundColor: selectedDept === dept ? 'var(--primary-light)' : '#FFFFFF',
                  color: selectedDept === dept ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: selectedDept === dept ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Status Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Status:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-default)',
                fontSize: '12.5px',
                color: 'var(--text-main)',
                backgroundColor: '#FFFFFF',
                outline: 'none'
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Probation">Probation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Table matching Figma spec */}
      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input type="checkbox" style={{ accentColor: '#0052FF' }} />
              </th>
              <th>Employee</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Location</th>
              <th>Join Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                  No employees matched your current search filters.
                </td>
              </tr>
            ) : (
              filteredEmployees.map(emp => (
                <tr 
                  key={emp.id}
                  onClick={() => {
                    setSelectedEmployeeId(emp.id);
                    setCurrentView('employee-profile');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <td onClick={e => e.stopPropagation()}>
                    <input type="checkbox" style={{ accentColor: '#0052FF' }} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={emp.avatar} 
                        alt={emp.firstName} 
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          {emp.employeeCode} • {emp.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{emp.department}</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)' }}>{emp.designation}</span>
                  </td>
                  <td>
                    {getStatusBadge(emp.status)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '12.5px' }}>
                      <MapPin size={13} color="var(--text-muted)" />
                      <span>{emp.location}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>{emp.joinDate}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmployeeId(emp.id);
                        setCurrentView('employee-profile');
                      }}
                      className="btn btn-ghost btn-sm"
                    >
                      <span>View Profile</span>
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
