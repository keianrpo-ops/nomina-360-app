import React, { useState, useEffect } from 'react';
import { PayrollEntry, SettlementEntry, Employee } from '../types';
import { formatCurrency } from '../constants';

interface HistoryViewProps {
  payrolls: PayrollEntry[];
  settlements: SettlementEntry[];
  employees: Employee[];
  onDeletePayrolls: (ids: number[]) => void;
  onDeleteSettlements: (ids: number[]) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({
  payrolls,
  settlements,
  employees,
  onDeletePayrolls,
  onDeleteSettlements,
}) => {
  const [activeTab, setActiveTab] = useState<'payroll' | 'settlement'>(
    'payroll',
  );

  const [selectedPayrollIds, setSelectedPayrollIds] = useState<number[]>([]);
  const [selectedSettlementIds, setSelectedSettlementIds] = useState<number[]>(
    [],
  );

  // Limpiar selecciones si cambia la data
  useEffect(() => {
    setSelectedPayrollIds(prev =>
      prev.filter(id => payrolls.some(p => p.ID_Mov === id)),
    );
  }, [payrolls]);

  useEffect(() => {
    setSelectedSettlementIds(prev =>
      prev.filter(id => settlements.some(s => s.ID_Liq === id)),
    );
  }, [settlements]);

  const getEmployeeName = (id: number) => {
    const emp = employees.find(e => e.ID === id);
    return emp ? `${emp.Nombres} ${emp.Apellidos}` : '—';
  };

  // --------- NÓMINAS ---------
  const toggleSelectPayroll = (id: number) => {
    setSelectedPayrollIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAllPayrolls = () => {
    if (selectedPayrollIds.length === payrolls.length) {
      setSelectedPayrollIds([]);
    } else {
      setSelectedPayrollIds(payrolls.map(p => p.ID_Mov));
    }
  };

  const handleDeleteSelectedPayrolls = () => {
    if (selectedPayrollIds.length === 0) return;
    if (
      !window.confirm(
        `¿Seguro que deseas eliminar ${selectedPayrollIds.length} nómina(s)?`,
      )
    ) {
      return;
    }
    onDeletePayrolls(selectedPayrollIds);
    setSelectedPayrollIds([]);
  };

  const handleDeleteSinglePayroll = (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta nómina?')) return;
    onDeletePayrolls([id]);
    setSelectedPayrollIds(prev => prev.filter(x => x !== id));
  };

  // --------- LIQUIDACIONES ---------
  const toggleSelectSettlement = (id: number) => {
    setSelectedSettlementIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAllSettlements = () => {
    if (selectedSettlementIds.length === settlements.length) {
      setSelectedSettlementIds([]);
    } else {
      setSelectedSettlementIds(settlements.map(s => s.ID_Liq));
    }
  };

  const handleDeleteSelectedSettlements = () => {
    if (selectedSettlementIds.length === 0) return;
    if (
      !window.confirm(
        `¿Seguro que deseas eliminar ${selectedSettlementIds.length} liquidación(es)?`,
      )
    ) {
      return;
    }
    onDeleteSettlements(selectedSettlementIds);
    setSelectedSettlementIds([]);
  };

  const handleDeleteSingleSettlement = (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta liquidación?')) return;
    onDeleteSettlements([id]);
    setSelectedSettlementIds(prev => prev.filter(x => x !== id));
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="border-b border-gray-200 flex space-x-4">
        <button
          className={`pb-2 px-2 text-sm font-semibold ${
            activeTab === 'payroll'
              ? 'text-sky-700 border-b-2 border-sky-700'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('payroll')}
        >
          Nóminas
        </button>
        <button
          className={`pb-2 px-2 text-sm font-semibold ${
            activeTab === 'settlement'
              ? 'text-sky-700 border-b-2 border-sky-700'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('settlement')}
        >
          Liquidaciones
        </button>
      </div>

      {/* BOTÓN ELIMINAR MASIVO */}
      {activeTab === 'payroll' ? (
        <div className="flex justify-end mb-2">
          <button
            onClick={handleDeleteSelectedPayrolls}
            disabled={selectedPayrollIds.length === 0}
            className={`font-bold py-2 px-4 rounded-lg border text-sm ${
              selectedPayrollIds.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
                : 'bg-red-600 hover:bg-red-700 text-white border-red-700'
            }`}
          >
            Eliminar seleccionadas ({selectedPayrollIds.length})
          </button>
        </div>
      ) : (
        <div className="flex justify-end mb-2">
          <button
            onClick={handleDeleteSelectedSettlements}
            disabled={selectedSettlementIds.length === 0}
            className={`font-bold py-2 px-4 rounded-lg border text-sm ${
              selectedSettlementIds.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
                : 'bg-red-600 hover:bg-red-700 text-white border-red-700'
            }`}
          >
            Eliminar seleccionadas ({selectedSettlementIds.length})
          </button>
        </div>
      )}

      {/* TABLAS */}
      {activeTab === 'payroll' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={
                      payrolls.length > 0 &&
                      selectedPayrollIds.length === payrolls.length
                    }
                    onChange={toggleSelectAllPayrolls}
                  />
                </th>
                <th className="px-6 py-3">Fecha registro</th>
                <th className="px-6 py-3">Empleado</th>
                <th className="px-6 py-3">Periodo</th>
                <th className="px-6 py-3">Neto a pagar</th>
                <th className="px-6 py-3">Observaciones</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map(p => {
                const isSelected = selectedPayrollIds.includes(p.ID_Mov);
                return (
                  <tr
                    key={p.ID_Mov}
                    className={`border-b border-gray-200 ${
                      isSelected ? 'bg-blue-50' : 'bg-white'
                    } hover:bg-blue-100`}
                  >
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectPayroll(p.ID_Mov)}
                      />
                    </td>
                    <td className="px-6 py-3">{p.Fecha_Registro}</td>
                    <td className="px-6 py-3">
                      {getEmployeeName(p.Empleado_ID)}
                    </td>
                    <td className="px-6 py-3">
                      {p.Periodo_Desde} – {p.Periodo_Hasta}
                    </td>
                    <td className="px-6 py-3">
                      {formatCurrency(p.Neto_Pagar)}
                    </td>
                    <td className="px-6 py-3">{p.Observaciones}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDeleteSinglePayroll(p.ID_Mov)}
                        className="text-red-600 hover:underline text-sm font-semibold"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
              {payrolls.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No hay nóminas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'settlement' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={
                      settlements.length > 0 &&
                      selectedSettlementIds.length === settlements.length
                    }
                    onChange={toggleSelectAllSettlements}
                  />
                </th>
                <th className="px-6 py-3">Fecha registro</th>
                <th className="px-6 py-3">Empleado</th>
                <th className="px-6 py-3">Fecha retiro</th>
                <th className="px-6 py-3">Total liquidado</th>
                <th className="px-6 py-3">Observaciones</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map(s => {
                const isSelected = selectedSettlementIds.includes(s.ID_Liq);
                return (
                  <tr
                    key={s.ID_Liq}
                    className={`border-b border-gray-200 ${
                      isSelected ? 'bg-blue-50' : 'bg-white'
                    } hover:bg-blue-100`}
                  >
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectSettlement(s.ID_Liq)}
                      />
                    </td>
                    <td className="px-6 py-3">{s.Fecha_Registro}</td>
                    <td className="px-6 py-3">
                      {getEmployeeName(s.Empleado_ID)}
                    </td>
                    <td className="px-6 py-3">{s.Fecha_Retiro}</td>
                    <td className="px-6 py-3">
                      {formatCurrency(s.Total_Liquidacion)}
                    </td>
                    <td className="px-6 py-3">{s.Observaciones}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDeleteSingleSettlement(s.ID_Liq)}
                        className="text-red-600 hover:underline text-sm font-semibold"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
              {settlements.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No hay liquidaciones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
