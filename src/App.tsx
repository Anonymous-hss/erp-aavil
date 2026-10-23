import React from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { FigmaCompareModal } from './components/modals/FigmaCompareModal';

// Auth Views
import { LoginView } from './views/auth/LoginView';
import { ForgotPasswordView } from './views/auth/ForgotPasswordView';
import { TwoFactorAuthView } from './views/auth/TwoFactorAuthView';

// App Views
import { AdminDashboardView } from './views/dashboard/AdminDashboardView';
import { EmployeeDashboardView } from './views/dashboard/EmployeeDashboardView';
import { EmployeesView } from './views/employees/EmployeesView';
import { EmployeeProfileView } from './views/employees/EmployeeProfileView';
import { LeavesView } from './views/leaves/LeavesView';
import { PayrollView } from './views/payroll/PayrollView';
import { ProjectsView } from './views/projects/ProjectsView';
import { ProjectDetailView } from './views/projects/ProjectDetailView';
import { TimesheetsView } from './views/timesheets/TimesheetsView';
import { AppraisalsView } from './views/appraisals/AppraisalsView';

const AppContent: React.FC = () => {
  const { isAuthenticated, currentView, role } = useERP();

  // If user is not authenticated or explicitly viewing auth flows
  if (!isAuthenticated) {
    if (currentView === 'forgot-password') {
      return <ForgotPasswordView />;
    }
    if (currentView === 'two-factor') {
      return <TwoFactorAuthView />;
    }
    return <LoginView />;
  }

  // Active Main View Router
  const renderMainView = () => {
    switch (currentView) {
      case 'dashboard':
        return role === 'admin' ? <AdminDashboardView /> : <EmployeeDashboardView />;
      case 'employees':
        return <EmployeesView />;
      case 'employee-profile':
        return <EmployeeProfileView />;
      case 'leaves':
        return <LeavesView />;
      case 'payroll':
        return <PayrollView />;
      case 'projects':
        return <ProjectsView />;
      case 'project-detail':
        return <ProjectDetailView />;
      case 'timesheets':
        return <TimesheetsView />;
      case 'appraisals':
        return <AppraisalsView />;
      default:
        return role === 'admin' ? <AdminDashboardView /> : <EmployeeDashboardView />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      {/* Dark Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: 'var(--bg-canvas)' }}>
        <Header />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {renderMainView()}
        </main>
      </div>

      {/* Global Figma Spec Comparison Modal */}
      <FigmaCompareModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ERPProvider>
      <AppContent />
    </ERPProvider>
  );
};

export default App;
