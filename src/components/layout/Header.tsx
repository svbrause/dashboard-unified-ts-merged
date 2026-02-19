// Header Component

import { useState, useEffect, useRef } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import AddClientModal from '../modals/AddClientModal';
import NewClientSMSModal from '../modals/NewClientSMSModal';
import { getJotformUrl } from '../../utils/providerHelpers';
import { showToast } from '../../utils/toast';
import './Header.css';

export default function Header() {
  const { provider, refreshClients } = useDashboard();
  const [showAddClient, setShowAddClient] = useState(false);
  const [showScanDropdown, setShowScanDropdown] = useState(false);
  const [showNewClientSMS, setShowNewClientSMS] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pageTitle = provider ? `${provider.name} Provider Dashboard` : 'All Clients';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowScanDropdown(false);
      }
    };

    if (showScanDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showScanDropdown]);

  const handleScanInClinic = () => {
    setShowScanDropdown(false);
    if (!provider) {
      showToast('Provider information not available');
      return;
    }
    
    const providerName = provider.name || 'We';
    const formUrl = `${getJotformUrl(provider)}?provider=${encodeURIComponent(providerName)}&source=${encodeURIComponent('Provider Dashboard - In-Clinic Scan')}`;
    window.open(formUrl, '_blank');
    showToast('Opening scan form for in-clinic scan');
  };

  return (
    <>
      <header className="main-header">
        <div className="header-left">
          <h2 className="page-title">{pageTitle}</h2>
          <p className="page-subtitle">
            Manage your prospective patients from first touch to booked appointment
          </p>
        </div>
        <div className="header-right">
          <div className="scan-client-dropdown" ref={dropdownRef}>
            <button 
              className="btn-secondary scan-client-btn"
              onClick={() => setShowScanDropdown(!showScanDropdown)}
            >
              New Scan
            </button>
            {showScanDropdown && (
              <div className="scan-client-dropdown-menu">
                <button
                  className="scan-client-option"
                  onClick={handleScanInClinic}
                >
                  Scan In-Clinic
                </button>
                <button
                  className="scan-client-option"
                  onClick={() => {
                    setShowScanDropdown(false);
                    setShowNewClientSMS(true);
                  }}
                >
                  Scan At Home
                </button>
              </div>
            )}
          </div>
          <button 
            className="btn-secondary"
            onClick={() => setShowAddClient(true)}
          >
            Add Client
          </button>
        </div>
      </header>
      
      {showAddClient && provider && (
        <AddClientModal
          onClose={() => setShowAddClient(false)}
          onSuccess={refreshClients}
          providerId={provider.id}
        />
      )}
      
      {showNewClientSMS && (
        <NewClientSMSModal
          onClose={() => setShowNewClientSMS(false)}
          onSuccess={refreshClients}
        />
      )}
    </>
  );
}
