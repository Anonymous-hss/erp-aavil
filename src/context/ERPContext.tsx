import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Employee, 
  LeaveRequest, 
  Timesheet, 
  PayrollRecord, 
  Project, 
  AppraisalReview, 
  AppView 
} from '../types/erp';
import { 
  ADMIN_USER, 
  EMPLOYEE_USER, 
  INITIAL_EMPLOYEES, 
  INITIAL_LEAVES, 
  INITIAL_PROJECTS, 
  INITIAL_TIMESHEETS, 
  INITIAL_PAYROLL, 
  INITIAL_APPRAISALS 
} from '../data/mockData';

interface ERPContextType {
  currentUser: User;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  requires2FA: boolean;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  
  // Auth methods
  login: (email: string, pass: string) => { success: boolean; error?: string; requires2FA?: boolean };
  verify2FA: (code: string) => boolean;
  logout: () => void;

  // Data Stores & CRUD
  employees: Employee[];
  addEmployee: (emp: Partial<Employee>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;

  leaves: LeaveRequest[];
  applyLeave: (data: { leaveType: LeaveRequest['leaveType']; startDate: string; endDate: string; days: number; reason: string }) => void;
  reviewLeave: (id: string, status: 'Approved' | 'Rejected', note?: string) => void;

  timesheets: Timesheet[];
  updateTimesheetHours: (timesheetId: string, entryId: string, day: keyof Timesheet['entries'][0]['hours'], hours: number) => void;
  submitTimesheet: (timesheetId: string) => void;
  reviewTimesheet: (id: string, status: 'Approved' | 'Rejected') => void;

  payroll: PayrollRecord[];
  runMonthlyPayroll: () => void;

  projects: Project[];
  addProject: (proj: Partial<Project>) => void;
  updateProjectProgress: (id: string, progress: number) => void;

  appraisals: AppraisalReview[];
  submitSelfAssessment: (id: string, rating: number, comments: string, goals: string) => void;
  completeManagerReview: (id: string, rating: number, comments: string) => void;

  // Design inspection helper
  figmaOverlayAsset: string | null;
  setFigmaOverlayAsset: (path: string | null) => void;
  
  // Notifications
  notifications: Array<{ id: string; title: string; time: string; read: boolean }>;
  markNotificationsRead: () => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('admin');
  const [currentUser, setCurrentUser] = useState<User>(ADMIN_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [requires2FA, setRequires2FA] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>('emp-101');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('proj-001');
  const [figmaOverlayAsset, setFigmaOverlayAsset] = useState<string | null>(null);

  // Initial stores with LocalStorage hydration
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('aavil_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('aavil_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [timesheets, setTimesheets] = useState<Timesheet[]>(() => {
    const saved = localStorage.getItem('aavil_timesheets');
    return saved ? JSON.parse(saved) : INITIAL_TIMESHEETS;
  });

  const [payroll, setPayroll] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem('aavil_payroll');
    return saved ? JSON.parse(saved) : INITIAL_PAYROLL;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('aavil_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [appraisals, setAppraisals] = useState<AppraisalReview[]>(() => {
    const saved = localStorage.getItem('aavil_appraisals');
    return saved ? JSON.parse(saved) : INITIAL_APPRAISALS;
  });

  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Marcus Vance submitted Timesheet for Week 42', time: '10m ago', read: false },
    { id: '2', title: 'Amara Okafor leave request approved', time: '1h ago', read: false },
    { id: '3', title: 'Q3 Appraisal Review cycle initiated', time: '1d ago', read: true }
  ]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('aavil_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('aavil_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('aavil_timesheets', JSON.stringify(timesheets));
  }, [timesheets]);

  useEffect(() => {
    localStorage.setItem('aavil_payroll', JSON.stringify(payroll));
  }, [payroll]);

  useEffect(() => {
    localStorage.setItem('aavil_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('aavil_appraisals', JSON.stringify(appraisals));
  }, [appraisals]);

  // Handle Role Switch
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'admin') {
      setCurrentUser(ADMIN_USER);
    } else {
      setCurrentUser(EMPLOYEE_USER);
    }
  };

  // Auth
  const login = (email: string, pass: string) => {
    if (pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }
    if (email.toLowerCase().includes('error')) {
      return { success: false, error: 'Invalid credentials. Please verify your email and password.' };
    }
    if (email.toLowerCase().includes('2fa') || email.toLowerCase().includes('admin')) {
      setRequires2FA(true);
      setCurrentView('two-factor');
      return { success: true, requires2FA: true };
    }
    setIsAuthenticated(true);
    setRequires2FA(false);
    setCurrentView('dashboard');
    return { success: true };
  };

  const verify2FA = (code: string) => {
    if (code.trim().length === 6) {
      setIsAuthenticated(true);
      setRequires2FA(false);
      setCurrentView('dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  // Employee Methods
  const addEmployee = (empData: Partial<Employee>) => {
    const nextCode = `EMP-0${employees.length + 101}`;
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employeeCode: nextCode,
      firstName: empData.firstName || 'New',
      lastName: empData.lastName || 'Colleague',
      email: empData.email || `${empData.firstName?.toLowerCase() || 'employee'}@aavil.inc`,
      phone: empData.phone || '+1 (555) 000-0000',
      avatar: empData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      role: 'employee',
      department: empData.department || 'Engineering',
      designation: empData.designation || 'Software Engineer',
      joinDate: new Date().toISOString().split('T')[0],
      status: empData.status || 'Active',
      salary: empData.salary || 95000,
      location: empData.location || 'Remote',
      manager: 'Alexander Wright',
      skills: empData.skills || ['React', 'TypeScript'],
      leaveBalance: {
        annual: 20,
        annualTotal: 20,
        sick: 10,
        sickTotal: 10,
        casual: 6,
        casualTotal: 6
      }
    };
    setEmployees(prev => [newEmp, ...prev]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  // Leave Methods
  const applyLeave = (data: { leaveType: LeaveRequest['leaveType']; startDate: string; endDate: string; days: number; reason: string }) => {
    const newLeave: LeaveRequest = {
      id: `lev-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      employeeAvatar: currentUser.avatar,
      department: currentUser.department,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      days: data.days,
      reason: data.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };
    setLeaves(prev => [newLeave, ...prev]);
  };

  const reviewLeave = (id: string, status: 'Approved' | 'Rejected', note?: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? {
      ...l,
      status,
      reviewedBy: currentUser.name,
      reviewNote: note
    } : l));
  };

  // Timesheet Methods
  const updateTimesheetHours = (timesheetId: string, entryId: string, day: keyof Timesheet['entries'][0]['hours'], hours: number) => {
    setTimesheets(prev => prev.map(ts => {
      if (ts.id !== timesheetId) return ts;
      const updatedEntries = ts.entries.map(e => {
        if (e.id !== entryId) return e;
        return {
          ...e,
          hours: { ...e.hours, [day]: Number(hours) || 0 }
        };
      });
      const total = updatedEntries.reduce((acc, entry) => {
        const rowSum = Object.values(entry.hours).reduce((s, h) => s + h, 0);
        return acc + rowSum;
      }, 0);
      return { ...ts, entries: updatedEntries, totalHours: total };
    }));
  };

  const submitTimesheet = (timesheetId: string) => {
    setTimesheets(prev => prev.map(ts => ts.id === timesheetId ? {
      ...ts,
      status: 'Submitted',
      submittedOn: new Date().toISOString().split('T')[0]
    } : ts));
  };

  const reviewTimesheet = (id: string, status: 'Approved' | 'Rejected') => {
    setTimesheets(prev => prev.map(ts => ts.id === id ? {
      ...ts,
      status,
      reviewedBy: currentUser.name
    } : ts));
  };

  // Payroll Methods
  const runMonthlyPayroll = () => {
    setPayroll(prev => prev.map(p => ({ ...p, status: 'Paid', paymentDate: new Date().toISOString().split('T')[0] })));
  };

  // Project Methods
  const addProject = (proj: Partial<Project>) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: proj.name || 'Untitled Project',
      code: `AAV-${Math.floor(100 + Math.random() * 900)}`,
      client: proj.client || 'Enterprise Client',
      status: proj.status || 'Active',
      progress: proj.progress || 10,
      budget: proj.budget || 100000,
      spent: proj.spent || 5000,
      startDate: new Date().toISOString().split('T')[0],
      deadline: proj.deadline || '2026-12-31',
      leadId: currentUser.id,
      leadName: currentUser.name,
      leadAvatar: currentUser.avatar,
      team: [
        { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, role: 'Lead' }
      ],
      description: proj.description || 'Project initiated through AAVIL ERP.',
      tasksCompleted: 0,
      totalTasks: 20
    };
    setProjects(prev => [newProj, ...prev]);
  };

  const updateProjectProgress = (id: string, progress: number) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, progress } : p));
  };

  // Appraisal Methods
  const submitSelfAssessment = (id: string, rating: number, comments: string, goals: string) => {
    setAppraisals(prev => prev.map(a => a.id === id ? {
      ...a,
      selfRating: rating,
      selfComments: comments,
      goalsAchieved: goals,
      status: 'Manager Review'
    } : a));
  };

  const completeManagerReview = (id: string, rating: number, comments: string) => {
    setAppraisals(prev => prev.map(a => a.id === id ? {
      ...a,
      managerRating: rating,
      managerComments: comments,
      overallRating: Number(((a.selfRating || rating) + rating) / 2).toFixed(1) as unknown as number,
      status: 'Completed',
      completedDate: new Date().toISOString().split('T')[0]
    } : a));
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <ERPContext.Provider value={{
      currentUser,
      role,
      setRole,
      isAuthenticated,
      requires2FA,
      currentView,
      setCurrentView,
      selectedEmployeeId,
      setSelectedEmployeeId,
      selectedProjectId,
      setSelectedProjectId,
      login,
      verify2FA,
      logout,
      employees,
      addEmployee,
      updateEmployee,
      leaves,
      applyLeave,
      reviewLeave,
      timesheets,
      updateTimesheetHours,
      submitTimesheet,
      reviewTimesheet,
      payroll,
      runMonthlyPayroll,
      projects,
      addProject,
      updateProjectProgress,
      appraisals,
      submitSelfAssessment,
      completeManagerReview,
      figmaOverlayAsset,
      setFigmaOverlayAsset,
      notifications,
      markNotificationsRead
    }}>
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) throw new Error('useERP must be used within an ERPProvider');
  return context;
};
