// services/googleSheets.ts (o el nombre que uses)
const API_BASE =
  "https://script.google.com/macros/s/AKfycbzmipMDoUXfXvPzyDWOYGHHv4t6hHd3xGOgE6m40SEzLoZ7dgNW3dJtGuIKDGOi4fCY7A/exec";

// Nombres EXACTOS de las pestañas en tu Google Sheets
export const SHEET_EMPLOYEES   = "Empleados";
export const SHEET_PARAMETERS  = "Parametros";
export const SHEET_PAYROLL     = "Nominas";
export const SHEET_SETTLEMENTS = "Liquidaciones";

export async function fetchSheet(sheet: string) {
  const url = `${API_BASE}?sheet=${encodeURIComponent(sheet)}`;
  const res = await fetch(url);

  const text = await res.text();
  console.log("[fetchSheet] respuesta Google:", text);

  if (!res.ok) {
    throw new Error(`Error HTTP ${res.status}: ${text}`);
  }

  try {
    const json = JSON.parse(text);
    return json;
  } catch (e) {
    console.error("Error parseando JSON de Google Sheets:", e);
    throw e;
  }
}

export async function addToSheet(sheet: string, data: any) {
  const url = `${API_BASE}?sheet=${encodeURIComponent(sheet)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  console.log("[addToSheet] respuesta Google:", text);

  if (!res.ok) {
    throw new Error(`Error HTTP ${res.status}: ${text}`);
  }

  const json = JSON.parse(text);

  if (json.status !== "OK") {
    throw new Error(`Error en Apps Script: ${json.message || "Desconocido"}`);
  }

  return json;
}
