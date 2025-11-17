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
}

const HistoryView: React.FC<HistoryViewProps> = ({
  payrolls,
  settlements,
  employees,
}) => {
  const [activeTab, setActiveTab] = useState<'payroll' | 'settlement'>(
    'payroll'
  );

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

    // Reconstruimos un objeto compatible con el componente de PDF
    const calc: PayrollCalculationResult = {
      employee,
      diasLaborados: p.Dias_Laborados,
      devengadoSalario: p.Devengado_Salario,
      devengadoAuxilio: p.Devengado_Auxilio,
      devengadoOtros: p.Devengado_Otros,
      // Aproximación razonable: IBC = salario + otros (sin auxilio)
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
      // Usamos el salario base actual del empleado como referencia
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

  return (
    <div>
      <div className="flex border-b border-gray-700 mb-4">
        <button
          onClick={() => setActiveTab('payroll')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'payroll'
              ? 'text-accent border-b-2 border-accent'
              : 'text-gray-400'
          }`}
        >
          Nóminas
        </button>
        <button
          onClick={() => setActiveTab('settlement')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'settlement'
              ? 'text-accent border-b-2 border-accent'
              : 'text-gray-400'
          }`}
        >
          Liquidaciones
        </button>
      </div>

      <div className="overflow-x-auto">
        {activeTab === 'payroll' && (
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-2 00 uppercase bg-gray-700">
              <tr>
                <th className="px-6 py-3">Fecha Registro</th>
                <th className="px-6 py-3">Período</th>
                <th className="px-6 py-3">Empleado</th>
                <th className="px-6 py-3">Neto Pagado</th>
                <th className="px-6 py-3">Observaciones</th>
                <th className="px-6 py-3">PDF</th>
              </tr>
            </thead>
            <tbody>
              {payrolls
                .slice()
                .sort((a, b) => b.ID_Mov - a.ID_Mov)
                .map((p) => (
                  <tr
                    key={p.ID_Mov}
                    className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600"
                  >
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
                        className="text-accent hover:underline"
                      >
                        Ver PDF
                      </button>
                    </td>
                  </tr>
                ))}
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
                <th className="px-6 py-3">PDF</th>
              </tr>
            </thead>
            <tbody>
              {settlements
                .slice()
                .sort((a, b) => b.ID_Liq - a.ID_Liq)
                .map((s) => (
                  <tr
                    key={s.ID_Liq}
                    className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600"
                  >
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
                        className="text-accent hover:underline"
                      >
                        Ver PDF
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
