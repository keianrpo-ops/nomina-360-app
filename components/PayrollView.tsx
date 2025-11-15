import React, { useState } from 'react';
import { Employee, Parameter, PayrollEntry, PayrollCalculationResult } from '../types';
import { calculatePayroll } from '../services/payrollService';
import { formatCurrency } from '../constants';
import { generatePayrollPdf } from '../services/pdfService';
import Modal from './common/Modal';
import PayrollReceipt from './pdf/PayrollReceipt';

interface PayrollViewProps {
  employees: Employee[];
  parameters: Parameter[];
  onRegister: (payroll: Omit<PayrollEntry, 'ID_Mov' | 'Fecha_Registro'>) => void;
}

const PayrollView: React.FC<PayrollViewProps> = ({ employees, parameters, onRegister }) => {
  const [periodFrom, setPeriodFrom] = useState('');
  const [periodTo, setPeriodTo] = useState('');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
  const [adjustments, setAdjustments] = useState<{ [employeeId: number]: { devengadoOtros: number, deduccionOtros: number } }>({});
  const [calculationResults, setCalculationResults] = useState<PayrollCalculationResult[]>([]);
  const [receiptToPreview, setReceiptToPreview] = useState<{
    data: PayrollCalculationResult;
    period: { from: string; to: string };
  } | null>(null);
  
  const activeEmployees = employees.filter(e => e.Estado === 'Activo');

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedEmployeeIds(activeEmployees.map(emp => emp.ID));
    } else {
      setSelectedEmployeeIds([]);
    }
  };

  const handleSelectEmployee = (id: number) => {
    setSelectedEmployeeIds(prev =>
      prev.includes(id) ? prev.filter(empId => empId !== id) : [...prev, id]
    );
  };

  const handleAdjustmentChange = (employeeId: number, field: 'devengadoOtros' | 'deduccionOtros', value: string) => {
    const numericValue = parseFloat(value) || 0;
    setAdjustments(prev => ({
      ...prev,
      [employeeId]: {
        ...(prev[employeeId] || { devengadoOtros: 0, deduccionOtros: 0 }),
        [field]: numericValue
      }
    }));
  };

  const handleCalculate = () => {
    if (!periodFrom || !periodTo || selectedEmployeeIds.length === 0) {
      alert('Por favor, defina el período y seleccione al menos un empleado.');
      return;
    }
    const { results } = calculatePayroll(periodFrom, periodTo, selectedEmployeeIds, employees, parameters, adjustments);
    setCalculationResults(results);
  };
  
  const handleRegister = () => {
    if (calculationResults.length === 0) {
      alert('No hay cálculos para registrar. Por favor, calcule la nómina primero.');
      return;
    }
    calculationResults.forEach(result => {
      const payrollEntry: Omit<PayrollEntry, 'ID_Mov' | 'Fecha_Registro'> = {
        Periodo_Desde: periodFrom,
        Periodo_Hasta: periodTo,
        Empleado_ID: result.employee.ID,
        Dias_Laborados: result.diasLaborados,
        Devengado_Salario: result.devengadoSalario,
        Devengado_Auxilio: result.devengadoAuxilio,
        Devengado_Otros: result.devengadoOtros,
        Deduccion_Salud: result.deduccionSalud,
        Deduccion_Pension: result.deduccionPension,
        Deduccion_FSP: result.deduccionFSP,
        Deduccion_Otros: result.deduccionOtros,
        Neto_Pagar: result.netoPagar,
        PDF_URL: '', // This would be populated after PDF generation
        Observaciones: '',
      };
      onRegister(payrollEntry);
    });
    alert('Nómina registrada exitosamente.');
    setCalculationResults([]);
    setSelectedEmployeeIds([]);
    setAdjustments({});
  };

  const renderModalFooter = () => {
    if (!receiptToPreview) return null;
    return (
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={() => setReceiptToPreview(null)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">Cerrar</button>
        <button type="button" onClick={() => generatePayrollPdf(receiptToPreview.data, receiptToPreview.period)} className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg">Descargar PDF</button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-800 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Período Desde</label>
          <input type="date" value={periodFrom} onChange={e => setPeriodFrom(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Período Hasta</label>
          <input type="date" value={periodTo} onChange={e => setPeriodTo(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" />
        </div>
        <div className="col-span-1 md:col-span-2 flex space-x-2">
            <button onClick={handleCalculate} className="w-full bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg">Previsualizar Cálculo</button>
            <button onClick={handleRegister} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg" disabled={calculationResults.length === 0}>Registrar Nómina</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-gray-800 p-4 rounded-lg max-h-96 overflow-y-auto">
          <h3 className="text-lg font-bold mb-2">Seleccionar Empleados</h3>
          <div className="flex items-center mb-2">
            <input type="checkbox" onChange={handleSelectAll} checked={selectedEmployeeIds.length === activeEmployees.length && activeEmployees.length > 0} className="w-4 h-4 text-blue-600 bg-gray-700 rounded border-gray-500 focus:ring-blue-600" />
            <label className="ml-2 text-sm font-medium text-gray-300">Seleccionar Todos</label>
          </div>
          {activeEmployees.map(emp => (
            <div key={emp.ID} className="flex items-center my-1">
              <input type="checkbox" checked={selectedEmployeeIds.includes(emp.ID)} onChange={() => handleSelectEmployee(emp.ID)} className="w-4 h-4 text-blue-600 bg-gray-700 rounded border-gray-500 focus:ring-blue-600" />
              <label className="ml-2 text-sm text-gray-300">{emp.Nombres} {emp.Apellidos}</label>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 bg-gray-800 p-4 rounded-lg max-h-96 overflow-y-auto">
          <h3 className="text-lg font-bold mb-2">Ajustes Adicionales (Opcional)</h3>
          {selectedEmployeeIds.map(id => {
              const emp = employees.find(e => e.ID === id);
              if (!emp) return null;
              return (
                <div key={id} className="grid grid-cols-3 gap-2 items-center mb-2 border-b border-gray-700 pb-2">
                  <span className="col-span-3 md:col-span-1 text-sm">{emp.Nombres} {emp.Apellidos}</span>
                  <input type="number" placeholder="Otros Devengados" value={adjustments[id]?.devengadoOtros || ''} onChange={e => handleAdjustmentChange(id, 'devengadoOtros', e.target.value)} className="col-span-3 md:col-span-1 bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm" />
                  <input type="number" placeholder="Otras Deducciones" value={adjustments[id]?.deduccionOtros || ''} onChange={e => handleAdjustmentChange(id, 'deduccionOtros', e.target.value)} className="col-span-3 md:col-span-1 bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm" />
                </div>
              );
          })}
        </div>
      </div>

      {calculationResults.length > 0 && (
        <div className="overflow-x-auto bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Resultados del Cálculo</h3>
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-200 uppercase bg-gray-700">
              <tr>
                <th className="px-4 py-2">Empleado</th>
                <th className="px-4 py-2">Neto a Pagar</th>
                <th className="px-4 py-2">Total Devengado</th>
                <th className="px-4 py-2">Total Deducido</th>
                 <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {calculationResults.map(res => (
                <tr key={res.employee.ID} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                  <td className="px-4 py-2">{res.employee.Nombres} {res.employee.Apellidos}</td>
                  <td className="px-4 py-2 font-bold">{formatCurrency(res.netoPagar)}</td>
                  <td className="px-4 py-2 text-green-400">{formatCurrency(res.devengadoSalario + res.devengadoAuxilio + res.devengadoOtros)}</td>
                  <td className="px-4 py-2 text-red-400">{formatCurrency(res.deduccionSalud + res.deduccionPension + res.deduccionFSP + res.deduccionOtros)}</td>
                  <td className="px-4 py-2">
                    <button 
                        onClick={() => setReceiptToPreview({ data: res, period: { from: periodFrom, to: periodTo } })}
                        className="text-accent hover:underline text-xs">
                        Ver Recibo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

        {receiptToPreview && (
            <Modal 
                isOpen={!!receiptToPreview} 
                onClose={() => setReceiptToPreview(null)} 
                title={`Previsualización de Recibo - ${receiptToPreview.data.employee.Nombres}`}
                size="4xl"
                footer={renderModalFooter()}
            >
                <PayrollReceipt data={receiptToPreview.data} period={receiptToPreview.period} />
            </Modal>
        )}
    </div>
  );
};

export default PayrollView;