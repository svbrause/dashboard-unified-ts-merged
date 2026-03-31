/**
 * Source value stored in Airtable when a lead is added via the dashboard "Add Client" button.
 * Dashboard list includes all non-archived patients and web popup leads (including Add Client source).
 */
export const SOURCE_ADD_CLIENT = "Add Client";

/** Client type is from types/index.ts; we only need tableSource and source here. */
function isAddClientLead(client: {
  tableSource: string;
  source?: string | null;
}): boolean {
  if (client.tableSource !== "Web Popup Leads") return false;
  const src = (client.source ?? "").trim().toLowerCase();
  return src === SOURCE_ADD_CLIENT.toLowerCase();
}

export { isAddClientLead };
