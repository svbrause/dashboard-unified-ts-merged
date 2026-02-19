// Contact history API service – all requests go to the backend (no localhost/airtable fallback)

import { Client } from '../types';

const BACKEND_API_URL =
  import.meta.env.VITE_BACKEND_API_URL || 'https://ponce-patient-backend.vercel.app';

interface ContactLogEntry {
  type: 'call' | 'email' | 'text' | 'meeting';
  outcome: 'reached' | 'voicemail' | 'no-answer' | 'scheduled' | 'sent' | 'replied' | 'attended' | 'no-show' | 'cancelled';
  notes: string;
}

export async function saveContactLog(
  client: Client,
  entry: ContactLogEntry
): Promise<{ recordId: string }> {
  const contactTypeMap: Record<string, string> = {
    'call': 'Phone Call',
    'email': 'Email',
    'text': 'Text Message',
    'meeting': 'In-Person'
  };
  
  const outcomeMap: Record<string, string> = {
    'reached': 'Reached',
    'voicemail': 'Left Voicemail',
    'no-answer': 'No Answer',
    'scheduled': 'Scheduled Appointment',
    'sent': 'Sent',
    'replied': 'Replied',
    'attended': 'Attended',
    'no-show': 'No-Show',
    'cancelled': 'Cancelled'
  };
  
  const linkField = client.tableSource === 'Patients' ? 'Patient' : 'Web Popup Lead';
  const contactHistoryFields = {
    [linkField]: [client.id],
    'Contact Type': contactTypeMap[entry.type] || 'Phone Call',
    'Outcome': outcomeMap[entry.outcome] || 'Reached',
    'Notes': entry.notes,
    'Date': new Date().toISOString()
  };
  
  const apiUrl = `${BACKEND_API_URL}/api/dashboard/contact-history`;
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields: contactHistoryFields }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || error.message || 'Failed to create contact history record');
  }
  
  const result = await response.json();
  return { recordId: result.record?.id || result.id };
}

export async function updateClientStatus(
  client: Client,
  newStatus: 'new' | 'contacted' | 'scheduled' | 'converted'
): Promise<void> {
  const tableName = client.tableSource || 'Web Popup Leads';
  const updateFields: Record<string, any> = {};
  
  // Map status to Airtable format
  const statusMap: Record<string, string> = {
    'new': 'New',
    'contacted': 'Contacted',
    'scheduled': 'Scheduled',
    'converted': 'Converted'
  };
  
  updateFields['Status'] = statusMap[newStatus] || newStatus;
  updateFields['Contacted'] = newStatus !== 'new';
  
  const apiUrl = `${BACKEND_API_URL}/api/dashboard/records/${encodeURIComponent(tableName)}/${client.id}`;
  const response = await fetch(apiUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields: updateFields }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || error.message || 'Failed to update client status');
  }
}

export async function archiveClient(
  client: Client,
  archived: boolean
): Promise<void> {
  const tableName = client.tableSource || 'Web Popup Leads';
  const fields = { Archived: archived };
  
  const apiUrl = `${BACKEND_API_URL}/api/dashboard/records/${encodeURIComponent(tableName)}/${client.id}`;
  const response = await fetch(apiUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || error.message || `Failed to ${archived ? 'archive' : 'unarchive'} client`);
  }
}
