// Main Dashboard Layout Component

// import React from 'react';
import { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import Sidebar from './Sidebar';
import Header from './Header';
import ViewControls from './ViewControls';
import ListView from '../views/ListView';
import KanbanView from '../views/KanbanView';
import ArchivedView from '../views/ArchivedView';
import FacialAnalysisView from '../views/FacialAnalysisView';
import OffersView from '../views/OffersView';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  onLogout: () => void;
}

function DashboardViews() {
  const { currentView } = useDashboard();
  
  switch (currentView) {
    case 'kanban':
      return <KanbanView />;
    case 'archived':
      return <ArchivedView />;
    case 'facial-analysis':
    case 'cards':
      return <FacialAnalysisView />;
    case 'offers':
      return <OffersView />;
    case 'list':
    default:
      return <ListView />;
  }
}

export default function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="dashboard-wrapper">
      <Sidebar 
        onLogout={onLogout} 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header />
        <ViewControls />
        <DashboardViews />
      </main>
    </div>
  );
}
