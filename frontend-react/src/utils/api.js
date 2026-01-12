
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchReports() {
  const res = await fetch(`${API_BASE_URL}/api/reports`);
  if (!res.ok) throw new Error('Failed to fetch reports');
  return res.json();
}

export async function createReport(payload) {
  const res = await fetch(`${API_BASE_URL}/api/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create report');
  return res.json();
}

export async function updateStatus(id, status) {
  const res = await fetch(`${API_BASE_URL}/api/update-status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}
