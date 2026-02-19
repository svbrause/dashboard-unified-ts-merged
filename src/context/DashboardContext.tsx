// Context for managing dashboard state

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Client, Provider, ViewType, FilterState, SortState, ContactHistoryEntry } from '../types';
import { fetchTableRecords, fetchContactHistory } from '../services/api';
import { mapRecordToClient } from '../utils/clientMapper';

interface DashboardContextType {
  provider: Provider | null;
  setProvider: (provider: Provider | null) => void;
  clients: Client[];
  setClients: (clients: Client[]) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterState;
  setFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
  sort: SortState;
  setSort: (sort: SortState | ((prev: SortState) => SortState)) => void;
  pagination: { currentPage: number; itemsPerPage: number };
  setPagination: (pagination: { currentPage: number; itemsPerPage: number }) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  refreshClients: () => Promise<Client[]>;
  /** Update one client in the cache (no refetch, no loading). Use for optimistic UI e.g. coupon claimed. */
  updateClient: (clientId: string, patch: Partial<Client>) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    source: '',
    ageMin: null,
    ageMax: null,
    analysisStatus: '',
    leadStage: '',
  });
  const [sort, setSort] = useState<SortState>({
    field: 'lastContact',
    order: 'desc',
  });
  const [pagination, setPagination] = useState({ currentPage: 1, itemsPerPage: 25 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshClients = useCallback(async (): Promise<Client[]> => {
    if (!provider || !provider.id) {
      setClients([]);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch from both 'Web Popup Leads' and 'Patients' tables
      const [leadsRecords, patientsRecords] = await Promise.all([
        fetchTableRecords('Web Popup Leads', { providerId: provider.id }),
        fetchTableRecords('Patients', { providerId: provider.id }),
      ]);

      // Map records to clients
      const leadsClients = leadsRecords.map(record => mapRecordToClient(record, 'Web Popup Leads'));
      const patientsClients = patientsRecords.map(record => mapRecordToClient(record, 'Patients'));

      // Combine all clients
      let allClients = [...leadsClients, ...patientsClients];

      // Fetch contact history for all clients
      // Fetch contact history using providerId filter (avoids 414 URI too long errors)
      // This uses the "Record ID (from Providers)" lookup fields instead of individual client IDs
      if (provider && provider.id) {
        try {
          // Fetch contact history for both table sources using providerId
          const [leadsHistory, patientsHistory] = await Promise.all([
            fetchContactHistory('Web Popup Leads', { providerId: provider.id }),
            fetchContactHistory('Patients', { providerId: provider.id }),
          ]);

          // Combine all contact history
          const allContactHistory = [...leadsHistory, ...patientsHistory];

          // Group contact history by lead ID
          const contactHistoryByLeadId = allContactHistory.reduce((acc, entry) => {
            if (!acc[entry.leadId]) {
              acc[entry.leadId] = [];
            }
            acc[entry.leadId].push(entry);
            return acc;
          }, {} as Record<string, any[]>);

          // Attach contact history to clients and set lastContact
          allClients = allClients.map(client => {
            const history = contactHistoryByLeadId[client.id] || [];
            const sortedHistory = history.sort((a: ContactHistoryEntry, b: ContactHistoryEntry) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            const lastContact = sortedHistory.length > 0 ? sortedHistory[0].date : null;

            return {
              ...client,
              contactHistory: sortedHistory,
              lastContact,
            };
          });
        } catch (contactError) {
          console.warn('Failed to fetch contact history:', contactError);
          // Continue without contact history
        }
      }

      setClients(allClients);
      return allClients;
    } catch (err: any) {
      console.error('Failed to fetch clients:', err);
      setError(err.message || 'Failed to load clients');
      setClients([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [provider]);

  const updateClient = useCallback((clientId: string, patch: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, ...patch } : c))
    );
  }, []);

  // Load clients when provider changes
  useEffect(() => {
    if (provider) {
      refreshClients();
    } else {
      setClients([]);
    }
  }, [provider, refreshClients]);

  return (
    <DashboardContext.Provider
      value={{
        provider,
        setProvider,
        clients,
        setClients,
        currentView,
        setCurrentView,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        sort,
        setSort,
        pagination,
        setPagination,
        loading,
        setLoading,
        error,
        setError,
        refreshClients,
        updateClient,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
