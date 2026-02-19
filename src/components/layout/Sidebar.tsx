// Sidebar Component

import { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { ViewType } from '../../types';
import HelpRequestModal from '../modals/HelpRequestModal';
import './Sidebar.css';

interface SidebarProps {
  onLogout: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ onLogout, isCollapsed, onToggle }: SidebarProps) {
  const { provider, currentView, setCurrentView } = useDashboard();
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  const getLogoUrl = (): string | null => {
    if (!provider) return null;
    
    const logo = provider.logo || provider.Logo;
    if (!logo) return null;
    
    if (Array.isArray(logo) && logo.length > 0) {
      return logo[0].url || logo[0].thumbnails?.large?.url || logo[0].thumbnails?.full?.url || null;
    }
    if (typeof logo === 'string') {
      return logo;
    }
    if (logo.url) {
      return logo.url;
    }
    return null;
  };

  const logoUrl = getLogoUrl();
  const providerInitial = provider?.name?.charAt(0).toUpperCase() || 'P';

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="logo">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${provider?.name || 'Provider'} Logo`}
                className="logo-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const logoContainer = (e.target as HTMLImageElement).parentElement;
                  if (logoContainer) {
                    const fallback = document.createElement('div');
                    fallback.className = 'logo-fallback';
                    fallback.innerHTML = `<span class="logo-icon">${providerInitial}</span>`;
                    logoContainer.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <div className="logo-fallback">
                <span className="logo-icon">{providerInitial}</span>
              </div>
            )}
          </div>
        )}
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggle}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {isCollapsed ? (
              /* >| expand: chevron right then vertical line */
              <>
                <polyline points="6 6 14 12 6 18" />
                <line x1="18" y1="4" x2="18" y2="20" />
              </>
            ) : (
              /* |< collapse: vertical line then chevron left */
              <>
                <line x1="6" y1="4" x2="6" y2="20" />
                <polyline points="18 6 10 12 18 18" />
              </>
            )}
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        <a 
          href="#" 
          className={`nav-item ${currentView === 'list' || currentView === 'cards' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleViewChange('list');
          }}
          title={isCollapsed ? "All Clients" : undefined}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          {!isCollapsed && <span>All Clients</span>}
        </a>
        <div className="nav-divider"></div>
        <a 
          href="#" 
          className={`nav-item ${currentView === 'archived' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleViewChange('archived');
          }}
          title={isCollapsed ? "Archived Clients" : undefined}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          {!isCollapsed && <span>Archived Clients</span>}
        </a>
        <div className="nav-divider"></div>
        <a 
          href="#" 
          className={`nav-item ${currentView === 'offers' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleViewChange('offers');
          }}
          title={isCollapsed ? "Offers" : undefined}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
          {!isCollapsed && <span>Offers</span>}
        </a>
      </nav>

      <div className="sidebar-footer">
        <a 
          href="#" 
          className="nav-item" 
          onClick={(e) => {
            e.preventDefault();
            setShowHelpModal(true);
          }}
          title={isCollapsed ? "Request Help" : "Request Help"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          {!isCollapsed && <span>Help</span>}
        </a>
        <a 
          href="#" 
          className="nav-item" 
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
          title={isCollapsed ? "Logout" : undefined}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          {!isCollapsed && <span>Logout</span>}
        </a>
      </div>
      
      {showHelpModal && (
        <HelpRequestModal onClose={() => setShowHelpModal(false)} />
      )}
    </aside>
  );
}
