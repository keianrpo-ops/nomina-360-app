// services/googleSheets.ts

// 👇 URL del deployment de tu Apps Script (ya con tu ID correcto)
const API_BASE =
  "https://script.google.com/macros/s/AKfycbwatoauddpZmUzcWXTefgJ2kPd-1W-QMZNkPpQpIeRsVk1GqSDfGUDbcnxfpLyLnU0lAg/exec";

// 👇 NOMBRES EXACTOS de las pestañas en tu archivo de Google Sheets
export const SHEET_EMPLOYEES   = "Empleados";
export const SHEET_PARAMETERS  = "Parametros";
export const SHEET_PAYROLL     = "Nominas";
export const SHEET_SETTLEMENTS = "Liquidaciones";

/**
 * Lee datos de una hoja de Google Sheets
 */
export async function fetchSheet(sheet: string) {
  const url = `${API_BASE}?sheet=${encodeURIComponent(sheet)}`;

  console.log("[fetchSheet] URL:", url);

  const res = await fetch(url);
  const text = await res.text();

  console.log("[fetchSheet] respuesta Google (raw):", text);

  if (!res.ok) {
    throw new Error(`Error HTTP ${res.status}: ${text}`);
  }

  try {
    const json = JSON.parse(text);
    return json;
  } catch (e) {
    console.error("Error parseando JSON de Google Sheets en fetchSheet:", e);
    throw new Error("Respuesta no válida de Google Sheets (fetchSheet)");
  }
}

/**
 * Agrega un registro a una hoja de Google Sheets
 * IMPORTANTE: sin headers personalizados para evitar preflight CORS
 */
export async function addToSheet(sheet: string, data: any) {
  const url = `${API_BASE}?sheet=${encodeURIComponent(sheet)}`;

  console.log("[addToSheet] URL:", url);
  console.log("[addToSheet] payload:", data);

  const res = await fetch(url, {
    method: "POST",
    // 👇 Sin headers para que sea un "simple request" y evitar problemas de CORS
    body: JSON.stringify(data),
  });

  const text = await res.text();
  console.log("[addToSheet] respuesta Google (raw):", text);

  if (!res.ok) {
    throw new Error(`Error HTTP ${res.status}: ${text}`);
  }

  let json: any;
  try {
    json = JSON.parse(text);
  } catch (e) {
    console.error("Error parseando JSON de Google Sheets en addToSheet:", e);
    throw new Error("Respuesta no válida de Google Sheets (addToSheet)");
  }

  if (json.status !== "OK") {
    throw new Error(`Error en Apps Script: ${json.message || "Desconocido"}`);
  }

  return json;
}
