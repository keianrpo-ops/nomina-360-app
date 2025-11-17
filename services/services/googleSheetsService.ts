const API_BASE = "https://script.google.com/macros/s/AKfycbzmipMDoUXfXvPzyDWOYGHHv4t6hHd3xGOgE6m40SEzLoZ7dgNW3dJtGuIKDGOi4fCY7A/exec"; 
// Ejemplo: "https://script.google.com/macros/s/AKfxxxx/exec"

// services/sheets.ts (o donde tengas fetchSheet/addToSheet)

export const SHEET_EMPLOYEES = "Empleados";
export const SHEET_PARAMETERS = "Parametros";
export const SHEET_PAYROLL = "Nominas";
export const SHEET_SETTLEMENTS = "Liquidaciones";



export async function fetchSheet(sheet: string) {
  const res = await fetch(`${API_BASE}?sheet=${sheet}`);
  if (!res.ok) {
    throw new Error("Error al leer datos de Google Sheets");
  }
  return res.json();
}

export async function addToSheet(sheet: string, data: any) {
  const res = await fetch(`${API_BASE}?sheet=${sheet}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error al guardar datos en Google Sheets");
  }

  return res.json();
}
