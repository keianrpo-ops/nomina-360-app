import React from 'react';
// This is a placeholder component to resolve a build error from an old, unused file.
// The main functionality is now handled by HistoryTable.tsx.
const HistoryView: React.FC = () => {
return null; // Render nothing
};
export default HistoryView;
import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PayrollEntry, SettlementEntry, Employee } from '../types';
import { formatCurrency } from '../constants';
import PayrollReceipt from './common/pdf/PayrollReceipt';
import SettlementReceipt from './common/pdf/SettlementReceipt';
interface HistoryViewProps {
payrolls: PayrollEntry[];
settlements: SettlementEntry[];
employees: Employee[];
}
const HistoryView: React.FC<HistoryViewProps> = ({ payrolls, settlements, employees }) => {
const [activeTab, setActiveTab] = useState<'payroll' | 'settlement'>('payroll');
const getEmployee = (id: number) => employees.find(e => e.ID === id);
return (
<div>
<div className="flex border-b border-gray-700 mb-4">
<button
onClick={() => setActiveTab('payroll')}
className={py-2 px-4 font-medium ${ activeTab === 'payroll' ? 'text-accent border-b-2 border-accent' : 'text-gray-400' }}
>
Nóminas
</button>
<button
onClick={() => setActiveTab('settlement')}
className={py-2 px-4 font-medium ${ activeTab === 'settlement' ? 'text-accent border-b-2 border-accent' : 'text-gray-400' }}
>
Liquidaciones
</button>
</div>
code
Code
<div className="overflow-x-auto">
    {activeTab === 'payroll' && (
      <table className="w-full text-sm text-left text-gray-400">
        <thead className="text-xs text-gray-200 uppercase bg-gray-700">
          <tr>
            <th className="px-6 py-3">Fecha Registro</th>
            <th className="px-6 py-3">Período</th>
            <th className="px-6 py-3">Empleado</th>
            <th className="px-6 py-3">Neto Pagado</th>
            <th className="px-6 py-3">Observaciones</th>
            <th className="px-6 py-3">Recibo PDF</th>
          </tr>
        </thead>
        <tbody>
          {payrolls
            .sort((a, b) => b.ID_Mov - a.ID_Mov)
            .map(p => {
              const emp = getEmployee(p.Empleado_ID);
              return (
                <tr
                  key={p.ID_Mov}
                  className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600"
                >
                  <td className="px-6 py-4">{p.Fecha_Registro}</td>
                  <td className="px-6 py-4">
                    {p.Periodo_Desde} al {p.Periodo_Hasta}
                  </td>
                  <td className="px-6 py-4">
                    {emp ? `${emp.Nombres} ${emp.Apellidos}` : 'Empleado no encontrado'}
                  </td>
                  <td className="px-6 py-4">{formatCurrency(p.Neto_Pagar)}</td>
                  <td className="px-6 py-4">{p.Observaciones}</td>
                  <td className="px-6 py-4">
                    {emp ? (
                      <PDFDownloadLink
                        document={<PayrollReceipt employee={emp} payroll={p} />}
                        fileName={`nomina-${emp.Cedula}-${p.Periodo_Hasta}.pdf`}
                        className="text-accent hover:underline"
                      >
                        {({ loading }) => (loading ? 'Generando…' : 'Ver / Descargar')}
                      </PDFDownloadLink>
                    ) : (
                      <span className="text-gray-500">Sin datos</span>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    )}

    {activeTab === 'settlement' && (
      <table className="w-full text-sm text-left text-gray-400">
        <thead className="text-xs text-gray-200 uppercase bg-gray-700">
          <tr>
            <th className="px-6 py-3">Fecha Registro</th>
            <th className="px-6 py-3">Empleado</th>
            <th className="px-6 py-3">Fecha Retiro</th>
            <th className="px-6 py-3">Total Liquidado</th>
            <th className="px-6 py-3">Observaciones</th>
            <th className="px-6 py-3">Recibo PDF</th>
          </tr>
        </thead>
        <tbody>
          {settlements
            .sort((a, b) => b.ID_Liq - a.ID_Liq)
            .map(s => {
              const emp = getEmployee(s.Empleado_ID);
              return (
                <tr
                  key={s.ID_Liq}
                  className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600"
                >
                  <td className="px-6 py-4">{s.Fecha_Registro}</td>
                  <td className="px-6 py-4">
                    {emp ? `${emp.Nombres} ${emp.Apellidos}` : 'Empleado no encontrado'}
                  </td>
                  <td className="px-6 py-4">{s.Fecha_Retiro}</td>
                  <td className="px-6 py-4">
                    {formatCurrency(s.Total_Liquidacion)}
                  </td>
                  <td className="px-6 py-4">{s.Observaciones}</td>
                  <td className="px-6 py-4">
                    {emp ? (
                      <PDFDownloadLink
                        document={<SettlementReceipt employee={emp} settlement={s} />}
                        fileName={`liquidacion-${emp.Cedula}-${s.Fecha_Retiro}.pdf`}
                        className="text-accent hover:underline"
                      >
                        {({ loading }) => (loading ? 'Generando…' : 'Ver / Descargar')}
                      </PDFDownloadLink>
                    ) : (
                      <span className="text-gray-500">Sin datos</span>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    )}
  </div>
</div>
);
};
export default HistoryView;
