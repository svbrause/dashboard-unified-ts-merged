// API service – all calls go to the backend (https://ponce-patient-backend.vercel.app/api/...)
// No localhost or deprecated /api/airtable-* routes.

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL ||
  "https://ponce-patient-backend.vercel.app";

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
  [key: string]: any;
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

/**
 * Fetch provider by provider code
 */
// Helper function to safely parse JSON responses
async function safeJsonParse(response: Response): Promise<any> {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(
      `Expected JSON but got ${contentType}. Response: ${text.substring(
        0,
        100
      )}`
    );
  }
  return response.json();
}

export async function fetchProviderByCode(
  providerCode: string
): Promise<Provider> {
  const apiUrl = `${API_BASE_URL}/api/dashboard/provider?providerCode=${encodeURIComponent(providerCode)}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    const errorData = await safeJsonParse(response).catch(() => ({}));
    throw new Error(errorData.message || `Provider not found: ${providerCode}`);
  }

  const data = await safeJsonParse(response);
  return data.provider;
}

/**
 * Fetch records from an Airtable table with optional filtering
 */
export async function fetchTableRecords(
  tableName: string,
  options: {
    filterFormula?: string;
    providerId?: string;
    fields?: string[];
  } = {}
): Promise<AirtableRecord[]> {
  const { filterFormula, providerId, fields } = options;

  const params = new URLSearchParams();
  params.append("tableName", tableName);

  if (filterFormula) {
    params.append("filterFormula", filterFormula);
  }

  if (providerId) {
    params.append("providerId", providerId);
  }

  if (fields) {
    fields.forEach((field) => {
      params.append("fields[]", field);
    });
  }

  const apiUrl = `${API_BASE_URL}/api/dashboard/leads?${params.toString()}`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await safeJsonParse(response).catch(() => ({}));
    throw new Error(
      `API error for ${tableName}: ${response.status} ${
        errorData.message || response.statusText
      }`
    );
  }

  const data: AirtableResponse = await safeJsonParse(response);

  if (!data.records || !Array.isArray(data.records)) {
    return [];
  }

  return data.records;
}

/**
 * Fetch contact history for clients
 */
export async function fetchContactHistory(
  tableSource: "Web Popup Leads" | "Patients",
  options: {
    providerId?: string;
    leadIds?: string[];
  } = {}
): Promise<any[]> {
  const { providerId, leadIds } = options;

  const params = new URLSearchParams();
  params.append("tableSource", tableSource);

  if (providerId) {
    params.append("providerId", providerId);
  } else if (leadIds && leadIds.length > 0) {
    params.append("leadIds", leadIds.join(","));
  } else {
    return [];
  }

  const apiUrl = `${API_BASE_URL}/api/dashboard/contact-history?${params.toString()}`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 414) {
      console.warn(
        "URI too long error (414) - Contact history temporarily unavailable"
      );
      return [];
    }
    const errorData = await safeJsonParse(response).catch(() => ({}));
    console.error(`Failed to fetch contact history:`, errorData);
    return [];
  }

  const data = await safeJsonParse(response);
  const allRecords = data.records || [];

  const linkField = tableSource === "Patients" ? "Patient" : "Web Popup Lead";

  return allRecords
    .map((record: AirtableRecord) => {
      const fields = record.fields || {};
      const linkedRecordArray = fields[linkField] || [];
      const leadId =
        Array.isArray(linkedRecordArray) && linkedRecordArray.length > 0
          ? linkedRecordArray[0]
          : null;

      const contactType = (fields["Contact Type"] || "").toLowerCase();
      let normalizedType = "call";
      if (contactType.includes("email")) normalizedType = "email";
      else if (contactType.includes("text")) normalizedType = "text";
      else if (
        contactType.includes("person") ||
        contactType.includes("meeting")
      )
        normalizedType = "meeting";

      const outcome = (fields["Outcome"] || "").toLowerCase();
      let normalizedOutcome = "reached";
      if (outcome.includes("voicemail")) normalizedOutcome = "voicemail";
      else if (outcome.includes("no-show") || outcome.includes("no show"))
        normalizedOutcome = "no-show";
      else if (outcome.includes("no answer") || outcome.includes("no-answer"))
        normalizedOutcome = "no-answer";
      else if (outcome.includes("scheduled")) normalizedOutcome = "scheduled";
      else if (outcome.includes("replied")) normalizedOutcome = "replied";
      else if (outcome.includes("sent")) normalizedOutcome = "sent";
      else if (outcome.includes("attended")) normalizedOutcome = "attended";
      else if (outcome.includes("cancelled") || outcome.includes("canceled"))
        normalizedOutcome = "cancelled";

      return {
        id: record.id,
        leadId: leadId,
        type: normalizedType,
        outcome: normalizedOutcome,
        notes: fields["Notes"] || "",
        date: fields["Date"] || record.createdTime || new Date().toISOString(),
      };
    })
    .filter((entry: any) => entry.leadId !== null);
}

/**
 * Update Web Popup Lead coupon claimed state (stored in Airtable "Coupons Claimed" checkbox).
 * All Web Popup Leads earn a coupon by default; this updates whether they have claimed it.
 * Routes through backend PATCH /api/dashboard/leads/:recordId/coupon-claimed.
 *
 * IMPORTANT: Only the provider (dashboard user) should set claimed = true. The patient-facing
 * flow (e.g. "Request consultation" or "Redeem offer" buttons) must NOT set "Coupons Claimed"
 * in Airtable — only the provider marks it claimed when the client has actually redeemed (e.g. in-office).
 */
export async function updateWebPopupLeadCouponClaimed(
  recordId: string,
  claimed: boolean
): Promise<boolean> {
  const apiUrl = `${API_BASE_URL}/api/dashboard/leads/${encodeURIComponent(
    recordId
  )}/coupon-claimed`;

  const response = await fetch(apiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ claimed }),
  });

  if (!response.ok) {
    const errorData = await safeJsonParse(response).catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.error ||
        `Failed to update coupon claimed: ${response.statusText}`
    );
  }

  return true;
}

/**
 * Update lead/patient record in Airtable
 */
export async function updateLeadRecord(
  recordId: string,
  tableName: string,
  fields: Record<string, any>
): Promise<boolean> {
  const params = new URLSearchParams();
  params.append("recordId", recordId);
  params.append("tableName", tableName);

  const apiUrl = `${API_BASE_URL}/api/dashboard/update-record`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recordId,
      tableName,
      fields,
    }),
  });

  return response.ok;
}

/**
 * Send SMS notification
 */
export async function sendSMSNotification(
  phone: string,
  message: string,
  leadId: string,
  tableSource: string
): Promise<boolean> {
  const apiUrl = `${API_BASE_URL}/api/dashboard/sms`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone,
      message,
      leadId,
      tableSource,
    }),
  });

  return response.ok;
}

/**
 * Create a new lead/patient record
 */
export async function createLeadRecord(
  _tableName: string,
  fields: Record<string, any>
): Promise<AirtableRecord> {
  const apiUrl = `${API_BASE_URL}/api/dashboard/leads`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const errorData = await safeJsonParse(response).catch(() => ({}));
    throw new Error(
      errorData.error?.message || errorData.message || "Failed to create lead"
    );
  }

  const data = await safeJsonParse(response);
  return data.record || data;
}

/**
 * Submit help request (creates a record in the Help Requests Airtable table)
 */
export async function submitHelpRequest(
  name: string,
  email: string,
  message: string,
  providerId: string
): Promise<boolean> {
  const apiUrl = `${API_BASE_URL}/api/dashboard/help-requests`;

  const fields: Record<string, string> = {
    Name: name,
    Email: email,
    Message: message,
    "Provider Id": providerId,
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  return response.ok;
}

/**
 * Update facial analysis status for a patient
 */
export async function updateFacialAnalysisStatus(
  clientId: string,
  newStatus: string
): Promise<void> {
  // Handle "not-started" - send empty string to Airtable
  const airtableStatus =
    newStatus === "not-started" || !newStatus ? "" : newStatus;

  const fields = {
    "Pending/Opened": airtableStatus,
  };

  const apiUrl = `${API_BASE_URL}/api/dashboard/records/Patients/${clientId}`;
  const response = await fetch(apiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const error = await safeJsonParse(response).catch(() => ({}));
    throw new Error(
      error.error?.message ||
        error.message ||
        "Failed to update facial analysis status"
    );
  }
}

/**
 * Fetch offers from Airtable
 */
export async function fetchOffers(): Promise<any[]> {
  const apiPath = `/api/dashboard/offers`;
  const apiUrl = API_BASE_URL + apiPath;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    const errorData = await safeJsonParse(response).catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch offers");
  }

  const data = await safeJsonParse(response);
  return data.records || [];
}
