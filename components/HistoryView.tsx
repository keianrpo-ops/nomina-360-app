import React, { useState } from 'react';
import {
  PayrollEntry,
  SettlementEntry,
  Employee,
  PayrollCalculationResult,
  SettlementCalculationResult,
} from '../types';
import { formatCurrency } from '../constants';
import {
  generatePayrollPdf,
  generateSettlementPdf,
} from '../services/pdfService';

interface HistoryViewProps {
  payrolls: PayrollEntry[];
  settlements: SettlementEntry[];
  employees: Employee[];

  // 🔹 Nuevos callbacks para borrado masivo
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

  // ✅ Estados de selección masiva
  const [selectedPayrollIds, setSelectedPayrollIds] = useState<Set<number>>(
    new Set(),
  );
  const [selectedSettlementIds, setSelectedSettlementIds] = useState<
    Set<number>
  >(new Set());

  const getEmployee = (id: number) =>
    employees.find((e) => e.ID === id) || null;

  const getEmployeeName = (id: number) => {
    const emp = getEmployee(id);
    return emp ? `${emp.Nombres} ${emp.Apellidos}` : 'Empleado no encontrado';
  };

  const handleViewPayrollPdf = (p: PayrollEntry) => {
    const employee = getEmployee(p.Empleado_ID);
    if (!employee) {
      alert('Empleado no encontrado para esta nómina.');
      return;
    }

    const calc: PayrollCalculationResult = {
      employee,
      diasLaborados: p.Dias_Laborados,
      devengadoSalario: p.Devengado_Salario,
      devengadoAuxilio: p.Devengado_Auxilio,
      devengadoOtros: p.Devengado_Otros,
      baseIBC: p.Devengado_Salario + p.Devengado_Otros,
      deduccionSalud: p.Deduccion_Salud,
      deduccionPension: p.Deduccion_Pension,
      deduccionFSP: p.Deduccion_FSP,
      deduccionOtros: p.Deduccion_Otros,
      netoPagar: p.Neto_Pagar,
    };

    generatePayrollPdf(calc, {
      from: p.Periodo_Desde,
      to: p.Periodo_Hasta,
    });
  };

  const handleViewSettlementPdf = (s: SettlementEntry) => {
    const employee = getEmployee(s.Empleado_ID);
    if (!employee) {
      alert('Empleado no encontrado para esta liquidación.');
      return;
    }

    const calc: SettlementCalculationResult = {
      employee,
      fechaRetiro: s.Fecha_Retiro,
      diasAntiguedad: s.Dias_Antiguedad,
      salarioBasePromedio: employee.Salario_Base + employee.Aux_Transporte,
      cesantias: s.Cesantias,
      interesesCesantias: s.Intereses_Cesantias,
      prima: s.Prima,
      vacaciones: s.Vacaciones,
      otrosConceptos: s.Otros_Conceptos,
      deducciones: s.Deducciones,
      totalLiquidacion: s.Total_Liquidacion,
    };

    generateSettlementPdf(calc);
  };

  // ========= Helpers de selección masiva (nóminas) =========
  const sortedPayrolls = payrolls.slice().sort((a, b) => b.ID_Mov - a.ID_Mov);

  const togglePayrollSelection = (id: number) => {
    setSelectedPayrollIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAllPayroll = () => {
    if (sortedPayrolls.length === 0) return;

    const allSelected =
      sortedPayrolls.length > 0 &&
      sortedPayrolls.every((p) => selectedPayrollIds.has(p.ID_Mov));

    if (allSelected) {
      // desmarcar todo
      setSelectedPayrollIds(new Set());
    } else {
      // seleccionar todas las nóminas visibles
      const allIds = new Set(sortedPayrolls.map((p) => p.ID_Mov));
      setSelectedPayrollIds(allIds);
    }
  };

  const handleDeleteSelectedPayrolls = () => {
    if (selectedPayrollIds.size === 0) return;
    if (
      !window.confirm(
        `¿Seguro que deseas eliminar ${selectedPayrollIds.size} nómina(s) seleccionada(s)?`,
      )
    ) {
      return;
    }
    onDeletePayrolls(Array.from(selectedPayrollIds));
    setSelectedPayrollIds(new Set());
  };

  const allPayrollSelected =
    sortedPayrolls.length > 0 &&
    sortedPayrolls.every((p) => selectedPayrollIds.has(p.ID_Mov));

  // ========= Helpers de selección masiva (liquidaciones) =========
  const sortedSettlements = settlements
    .slice()
    .sort((a, b) => b.ID_Liq - a.ID_Liq);

  const toggleSettlementSelection = (id: number) => {
    setSelectedSettlementIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAllSettlements = () => {
    if (sortedSettlements.length === 0) return;

    const allSelected =
      sortedSettlements.length > 0 &&
      sortedSettlements.every((s) => selectedSettlementIds.has(s.ID_Liq));

    if (allSelected) {
      setSelectedSettlementIds(new Set());
    } else {
      const allIds = new Set(sortedSettlements.map((s) => s.ID_Liq));
      setSelectedSettlementIds(allIds);
    }
  };

  const handleDeleteSelectedSettlements = () => {
    if (selectedSettlementIds.size === 0) return;
    if (
      !window.confirm(
        `¿Seguro que deseas eliminar ${selectedSettlementIds.size} liquidación(es) seleccionada(s)?`,
      )
    ) {
      return;
    }
    onDeleteSettlements(Array.from(selectedSettlementIds));
    setSelectedSettlementIds(new Set());
  };

  const allSettlementsSelected =
    sortedSettlements.length > 0 &&
    sortedSettlements.every((s) => selectedSettlementIds.has(s.ID_Liq));

  // ========= Cambio de pestaña: limpiamos selecciones de la otra =========
  const switchToPayroll = () => {
    setActiveTab('payroll');
    setSelectedSettlementIds(new Set());
  };

  const switchToSettlement = () => {
    setActiveTab('settlement');
    setSelectedPayrollIds(new Set());
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`px-4 py-2 text-sm font-semibold ${
            activeTab === 'payroll'
              ? 'border-b-2 border-sky-500 text-sky-600'
              : 'text-gray-500'
          }`}
          onClick={switchToPayroll}
        >
          Nóminas
        </button>
        <button
          className={`px-4 py-2 text-sm font-semibold ${
            activeTab === 'settlement'
              ? 'border-b-2 border-sky-500 text-sky-600'
              : 'text-gray-500'
          }`}
          onClick={switchToSettlement}
        >
          Liquidaciones
        </button>
      </div>

      <div className="overflow-x-auto">
        {/* ========== TAB NÓMINAS ========== */}
        {activeTab === 'payroll' && (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">
                {selectedPayrollIds.size} nómina(s) seleccionada(s)
              </span>
              <button
                onClick={handleDeleteSelectedPayrolls}
                disabled={selectedPayrollIds.size === 0}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  selectedPayrollIds.size === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                Eliminar seleccionadas
              </button>
            </div>

            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-4 py-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={allPayrollSelected}
                      onChange={toggleSelectAllPayroll}
                    />
                  </th>
                  <th className="px-6 py-3">Fecha Registro</th>
                  <th className="px-6 py-3">Período</th>
                  <th className="px-6 py-3">Empleado</th>
                  <th className="px-6 py-3">Neto Pagado</th>
                  <th className="px-6 py-3">Observaciones</th>
                  <th className="px-6 py-3">PDF</th>
                  <th className="px-6 py-3">Recibo PDF</th>
                </tr>
              </thead>
              <tbody>
                {sortedPayrolls.map((p) => (
                  <tr
                    key={p.ID_Mov}
                    className="bg-white border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedPayrollIds.has(p.ID_Mov)}
                        onChange={() => togglePayrollSelection(p.ID_Mov)}
                      />
                    </td>
                    <td className="px-6 py-4">{p.Fecha_Registro}</td>
                    <td className="px-6 py-4">
                      {p.Periodo_Desde} al {p.Periodo_Hasta}
                    </td>
                    <td className="px-6 py-4">
                      {getEmployeeName(p.Empleado_ID)}
                    </td>
                    <td className="px-6 py-4">
                      {formatCurrency(p.Neto_Pagar)}
                    </td>
                    <td className="px-6 py-4">{p.Observaciones}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewPayrollPdf(p)}
                        className="text-sky-600 hover:underline"
                      >
                        Ver PDF
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {p.PDF_URL ? (
                        <a
                          href={p.PDF_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:underline"
                        >
                          Ver / Descargar
                        </a>
                      ) : (
                        <span className="text-gray-400">Sin PDF</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ========== TAB LIQUIDACIONES ========== */}
        {activeTab === 'settlement' && (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">
                {selectedSettlementIds.size} liquidación(es) seleccionada(s)
              </span>
              <button
                onClick={handleDeleteSelectedSettlements}
                disabled={selectedSettlementIds.size === 0}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  selectedSettlementIds.size === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                Eliminar seleccionadas
              </button>
            </div>

            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-4 py-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={allSettlementsSelected}
                      onChange={toggleSelectAllSettlements}
                    />
                  </th>
                  <th className="px-6 py-3">Fecha Registro</th>
                  <th className="px-6 py-3">Empleado</th>
                  <th className="px-6 py-3">Fecha Retiro</th>
                  <th className="px-6 py-3">Total Liquidado</th>
                  <th className="px-6 py-3">Observaciones</th>
                  <th className="px-6 py-3">PDF</th>
                  <th className="px-6 py-3">Recibo PDF</th>
                </tr>
              </thead>
              <tbody>
                {sortedSettlements.map((s) => (
                  <tr
                    key={s.ID_Liq}
                    className="bg-white border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedSettlementIds.has(s.ID_Liq)}
                        onChange={() => toggleSettlementSelection(s.ID_Liq)}
                      />
                    </td>
                    <td className="px-6 py-4">{s.Fecha_Registro}</td>
                    <td className="px-6 py-4">
                      {getEmployeeName(s.Empleado_ID)}
                    </td>
                    <td className="px-6 py-4">{s.Fecha_Retiro}</td>
                    <td className="px-6 py-4">
                      {formatCurrency(s.Total_Liquidacion)}
                    </td>
                    <td className="px-6 py-4">{s.Observaciones}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewSettlementPdf(s)}
                        className="text-sky-600 hover:underline"
                      >
                        Ver PDF
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {s.PDF_URL ? (
                        <a
                          href={s.PDF_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:underline"
                        >
                          Ver / Descargar
                        </a>
                      ) : (
                        <span className="text-gray-400">Sin PDF</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
