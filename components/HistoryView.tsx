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

  // ids seleccionados
  const [selectedPayrollIds, setSelectedPayrollIds] = useState<number[]>([]);
  const [selectedSettlementIds, setSelectedSettlementIds] = useState<number[]>(
    [],
  );

  const getEmployee = (id: number) =>
    employees.find(e => e.ID === id) || null;

  const getEmployeeName = (id: number) => {
    const emp = getEmployee(id);
    return emp ? `${emp.Nombres} ${emp.Apellidos}` : 'Empleado no encontrado';
  };

  // ========= PDFs =========
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

  // ========= selección masiva =========
  const togglePayrollSelection = (id: number) => {
    setSelectedPayrollIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const toggleAllPayrolls = (checked: boolean) => {
    if (checked) {
      const ids = payrolls.map(p => p.ID_Mov);
      setSelectedPayrollIds(ids);
    } else {
      setSelectedPayrollIds([]);
    }
  };

  const handleDeleteSelectedPayrolls = () => {
    if (selectedPayrollIds.length === 0) return;
    const ok = window.confirm(
      `¿Seguro que deseas eliminar ${selectedPayrollIds.length} nómina(s)?`,
    );
    if (!ok) return;
    onDeletePayrolls(selectedPayrollIds);
    setSelectedPayrollIds([]);
  };

  const deleteSinglePayroll = (id: number) => {
    const ok = window.confirm('¿Seguro que deseas eliminar esta nómina?');
    if (!ok) return;
    onDeletePayrolls([id]);
    setSelectedPayrollIds(prev => prev.filter(x => x !== id));
  };

  // ---- liquidaciones ----
  const toggleSettlementSelection = (id: number) => {
    setSelectedSettlementIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const toggleAllSettlements = (checked: boolean) => {
    if (checked) {
      const ids = settlements.map(s => s.ID_Liq);
      setSelectedSettlementIds(ids);
    } else {
      setSelectedSettlementIds([]);
    }
  };

  const handleDeleteSelectedSettlements = () => {
    if (selectedSettlementIds.length === 0) return;
    const ok = window.confirm(
      `¿Seguro que deseas eliminar ${selectedSettlementIds.length} liquidación(es)?`,
    );
    if (!ok) return;
    onDeleteSettlements(selectedSettlementIds);
    setSelectedSettlementIds([]);
  };

  const deleteSingleSettlement = (id: number) => {
    const ok = window.confirm('¿Seguro que deseas eliminar esta liquidación?');
    if (!ok) return;
    onDeleteSettlements([id]);
    setSelectedSettlementIds(prev => prev.filter(x => x !== id));
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-200">
        <div className="flex">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'payroll'
                ? 'border-b-2 border-sky-600 text-sky-700'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('payroll')}
          >
            Nóminas
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'settlement'
                ? 'border-b-2 border-sky-600 text-sky-700'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('settlement')}
          >
            Liquidaciones
          </button>
        </div>

        {/* Botón eliminar masivo */}
        {activeTab === 'payroll' && (
          <div className="flex items-center space-x-4 text-xs text-gray-600">
            <span>
              {selectedPayrollIds.length} nómina(s) seleccionada(s)
            </span>
            <button
              onClick={handleDeleteSelectedPayrolls}
              disabled={selectedPayrollIds.length === 0}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                selectedPayrollIds.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              Eliminar seleccionadas
            </button>
          </div>
        )}

        {activeTab === 'settlement' && (
          <div className="flex items-center space-x-4 text-xs text-gray-600">
            <span>
              {selectedSettlementIds.length} liquidación(es) seleccionada(s)
            </span>
            <button
              onClick={handleDeleteSelectedSettlements}
              disabled={selectedSettlementIds.length === 0}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                selectedSettlementIds.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              Eliminar seleccionadas
            </button>
          </div>
        )}
      </div>

      {/* TABLA NÓMINAS */}
      <div className="overflow-x-auto">
        {activeTab === 'payroll' && (
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-sky-50 text-sky-900">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      payrolls.length > 0 &&
                      selectedPayrollIds.length === payrolls.length
                    }
                    onChange={e => toggleAllPayrolls(e.target.checked)}
                  />
                </th>
                <th className="px-4 py-3">Fecha registro</th>
                <th className="px-4 py-3">Período</th>
                <th className="px-4 py-3">Empleado</th>
                <th className="px-4 py-3">Neto pagado</th>
                <th className="px-4 py-3">Observaciones</th>
                <th className="px-4 py-3">PDF</th>
                <th className="px-4 py-3">Recibo PDF</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {payrolls
                .slice()
                .sort((a, b) => b.ID_Mov - a.ID_Mov)
                .map(p => (
                  <tr
                    key={p.ID_Mov}
                    className="bg-white border-b border-gray-100 hover:bg-sky-50"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedPayrollIds.includes(p.ID_Mov)}
                        onChange={() => togglePayrollSelection(p.ID_Mov)}
                      />
                    </td>
                    <td className="px-4 py-3">{p.Fecha_Registro}</td>
                    <td className="px-4 py-3">
                      {p.Periodo_Desde} al {p.Periodo_Hasta}
                    </td>
                    <td className="px-4 py-3">
                      {getEmployeeName(p.Empleado_ID)}
                    </td>
                    <td className="px-4 py-3">
                      {formatCurrency(p.Neto_Pagar)}
                    </td>
                    <td className="px-4 py-3">{p.Observaciones}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewPayrollPdf(p)}
                        className="text-sky-600 hover:underline text-xs font-semibold"
                      >
                        Ver PDF
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {p.PDF_URL ? (
                        <a
                          href={p.PDF_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:underline text-xs font-semibold"
                        >
                          Ver / Descargar
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">Sin PDF</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteSinglePayroll(p.ID_Mov)}
                        className="text-red-500 hover:underline text-xs font-semibold"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* TABLA LIQUIDACIONES */}
        {activeTab === 'settlement' && (
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-sky-50 text-sky-900">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      settlements.length > 0 &&
                      selectedSettlementIds.length === settlements.length
                    }
                    onChange={e => toggleAllSettlements(e.target.checked)}
                  />
                </th>
                <th className="px-4 py-3">Fecha registro</th>
                <th className="px-4 py-3">Empleado</th>
                <th className="px-4 py-3">Fecha retiro</th>
                <th className="px-4 py-3">Total liquidado</th>
                <th className="px-4 py-3">Observaciones</th>
                <th className="px-4 py-3">PDF</th>
                <th className="px-4 py-3">Recibo PDF</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {settlements
                .slice()
                .sort((a, b) => b.ID_Liq - a.ID_Liq)
                .map(s => (
                  <tr
                    key={s.ID_Liq}
                    className="bg-white border-b border-gray-100 hover:bg-sky-50"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedSettlementIds.includes(s.ID_Liq)}
                        onChange={() => toggleSettlementSelection(s.ID_Liq)}
                      />
                    </td>
                    <td className="px-4 py-3">{s.Fecha_Registro}</td>
                    <td className="px-4 py-3">
                      {getEmployeeName(s.Empleado_ID)}
                    </td>
                    <td className="px-4 py-3">{s.Fecha_Retiro}</td>
                    <td className="px-4 py-3">
                      {formatCurrency(s.Total_Liquidacion)}
                    </td>
                    <td className="px-4 py-3">{s.Observaciones}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewSettlementPdf(s)}
                        className="text-sky-600 hover:underline text-xs font-semibold"
                      >
                        Ver PDF
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {s.PDF_URL ? (
                        <a
                          href={s.PDF_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:underline text-xs font-semibold"
                        >
                          Ver / Descargar
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">Sin PDF</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteSingleSettlement(s.ID_Liq)}
                        className="text-red-500 hover:underline text-xs font-semibold"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
