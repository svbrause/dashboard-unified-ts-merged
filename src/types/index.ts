// Type definitions for the Unified Dashboard

export interface Provider {
  id: string;
  name: string;
  code: string;
  logo?:
    | string
    | Array<{
        url: string;
        thumbnails?: { large?: { url: string }; full?: { url: string } };
      }>;
  "Form Link"?: string;
  FormLink?: string;
  "Web Link"?: string;
  WebLink?: string;
  JotformURL?: string;
  SCAN_FORM_URL?: string;
  [key: string]: any; // Allow additional fields from Airtable
}

export interface ContactHistoryEntry {
  id: string;
  leadId: string;
  type: "call" | "email" | "text" | "meeting";
  outcome:
    | "reached"
    | "voicemail"
    | "no-answer"
    | "scheduled"
    | "sent"
    | "replied"
    | "attended"
    | "no-show"
    | "cancelled";
  notes: string;
  date: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  zipCode: string | null;
  age: number | null;
  ageRange: string | null;
  dateOfBirth: string | null;
  goals: string[];
  concerns: string | string[];
  areas: string[] | null;
  aestheticGoals: string;
  skinType: string | null;
  skinTone: string | null;
  ethnicBackground: string | null;
  engagementLevel: string | null;
  casesViewedCount: number | null;
  totalCasesAvailable: number | null;
  concernsExplored: string[] | null;
  photosLiked: number;
  photosViewed: number;
  treatmentsViewed: string[];
  source: string;
  status: "new" | "contacted" | "scheduled" | "converted";
  priority: "high" | "medium" | "low";
  createdAt: string;
  notes: string;
  appointmentDate: string | null;
  treatmentReceived: string | null;
  revenue: number | null;
  lastContact: string | null;
  isReal: boolean;
  tableSource: "Web Popup Leads" | "Patients";
  facialAnalysisStatus: string | null;
  frontPhoto: string | null;
  frontPhotoLoaded: boolean;
  allIssues: string;
  interestedIssues: string;
  whichRegions: string;
  skinComplaints: string;
  processedAreasOfInterest: string;
  areasOfInterestFromForm: string;
  archived: boolean;
  offerEarned: boolean;
  offerClaimed: boolean;
  contactHistory: ContactHistoryEntry[];
}

export interface Offer {
  id: string;
  name: string;
  heading: string;
  details: string;
  availableUntil: string;
  redemptionPeriod: string;
  treatmentFilter: string;
  createdTime?: string;
}

export type ViewType =
  | "list"
  | "cards"
  | "kanban"
  | "facial-analysis"
  | "archived"
  | "offers";

export interface FilterState {
  source: string;
  ageMin: number | null;
  ageMax: number | null;
  analysisStatus: string;
  leadStage: string;
}

export interface SortState {
  field:
    | "lastContact"
    | "name"
    | "age"
    | "status"
    | "facialAnalysisStatus"
    | "photosLiked"
    | "photosViewed"
    | "createdAt";
  order: "asc" | "desc";
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  total: number;
}

export interface DashboardState {
  clients: Client[];
  filteredClients: Client[];
  currentView: ViewType;
  searchQuery: string;
  filters: FilterState;
  sort: SortState;
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
}

export interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime?: string;
}

export interface AirtableResponse {
  success: boolean;
  records: AirtableRecord[];
  count?: number;
}
