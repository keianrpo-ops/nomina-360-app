import React, { useState, useEffect } from 'react';
import { Employee, Parameter, SettlementEntry, SettlementCalculationResult } from '../types';
import { calculateSettlement } from '../services/payrollService';
import { formatCurrency } from '../constants';
import { generateSettlementPdf } from '../services/pdfService';
import Modal from './common/Modal';
import SettlementReceipt from './pdf/SettlementReceipt';

interface SettlementViewProps {
  employees: Employee[];
  parameters: Parameter[];
  onRegister: (settlement: Omit<SettlementEntry, 'ID_Liq' | 'Fecha_Registro'>) => void;
}

const SettlementView: React.FC<SettlementViewProps> = ({ employees, parameters, onRegister }) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [fechaRetiro, setFechaRetiro] = useState('');
  const [adjustments, setAdjustments] = useState({ otrosConceptos: 0, deducciones: 0 });
  const [calculationResult, setCalculationResult] = useState<SettlementCalculationResult | null>(null);
  const [receiptToPreview, setReceiptToPreview] = useState<SettlementCalculationResult | null>(null);

  const activeEmployees = employees.filter(e => e.Estado === 'Activo');

  useEffect(() => {
    setCalculationResult(null); // Reset calculation if selected employee changes
  }, [selectedEmployeeId]);

  const handleCalculate = () => {
    if (!selectedEmployeeId || !fechaRetiro) {
      alert('Por favor, seleccione un empleado y una fecha de retiro.');
      return;
    }
    const result = calculateSettlement(selectedEmployeeId, fechaRetiro, employees, parameters, adjustments);
    setCalculationResult(result);
  };

  const handleRegister = () => {
    if (!calculationResult) {
      alert('No hay cálculo para registrar. Por favor, calcule la liquidación primero.');
      return;
    }
    const settlementEntry: Omit<SettlementEntry, 'ID_Liq' | 'Fecha_Registro'> = {
        Empleado_ID: calculationResult.employee.ID,
        Fecha_Ingreso: calculationResult.employee.Fecha_Ingreso,
        Fecha_Retiro: fechaRetiro,
        Dias_Antiguedad: calculationResult.diasAntiguedad,
        Cesantias: calculationResult.cesantias,
        Intereses_Cesantias: calculationResult.interesesCesantias,
        Prima: calculationResult.prima,
        Vacaciones: calculationResult.vacaciones,
        Otros_Conceptos: calculationResult.otrosConceptos,
        Deducciones: calculationResult.deducciones,
        Total_Liquidacion: calculationResult.totalLiquidacion,
        PDF_URL: '',
        Observaciones: 'Liquidación de contrato.',
    };
    onRegister(settlementEntry);
    alert('Liquidación registrada y empleado marcado como inactivo.');
    setCalculationResult(null);
    setSelectedEmployeeId(null);
  };
  
  const renderModalFooter = () => {
    if (!receiptToPreview) return null;
    return (
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={() => setReceiptToPreview(null)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">Cerrar</button>
        <button type="button" onClick={() => generateSettlementPdf(receiptToPreview)} className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg">Descargar PDF</button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-800 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">Empleado a Liquidar</label>
          <select 
            value={selectedEmployeeId ?? ''}
            onChange={e => setSelectedEmployeeId(Number(e.target.value))}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
          >
            <option value="">Seleccione un empleado</option>
            {activeEmployees.map(emp => (
              <option key={emp.ID} value={emp.ID}>{emp.Nombres} {emp.Apellidos}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Retiro</label>
          <input type="date" value={fechaRetiro} onChange={e => setFechaRetiro(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white" />
        </div>
        <div className="flex space-x-2">
            <button onClick={handleCalculate} className="w-full bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg">Calcular</button>
            <button onClick={handleRegister} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg" disabled={!calculationResult}>Registrar</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Ajustes de Liquidación (Opcional)</h3>
          <div className="space-y-2">
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Otros Conceptos (Bonificaciones, etc.)</label>
                <input type="number" value={adjustments.otrosConceptos} onChange={e => setAdjustments(p => ({...p, otrosConceptos: Number(e.target.value)}))} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Deducciones (Préstamos, etc.)</label>
                <input type="number" value={adjustments.deducciones} onChange={e => setAdjustments(p => ({...p, deducciones: Number(e.target.value)}))} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" />
             </div>
          </div>
        </div>
        {calculationResult && (
          <div className="bg-gray-800 p-4 rounded-lg space-y-2">
            <h3 className="text-lg font-bold">Resumen de la Liquidación</h3>
            <p className="text-sm text-yellow-400">Estos cálculos son referenciales; ajustar a normativa vigente/convenciones internas.</p>
            <div className="flex justify-between border-b border-gray-700 py-1"><span className="text-gray-400">Cesantías:</span><span>{formatCurrency(calculationResult.cesantias)}</span></div>
            <div className="flex justify-between border-b border-gray-700 py-1"><span className="text-gray-400">Intereses Cesantías:</span><span>{formatCurrency(calculationResult.interesesCesantias)}</span></div>
            <div className="flex justify-between border-b border-gray-700 py-1"><span className="text-gray-400">Prima de Servicios:</span><span>{formatCurrency(calculationResult.prima)}</span></div>
            <div className="flex justify-between border-b border-gray-700 py-1"><span className="text-gray-400">Vacaciones:</span><span>{formatCurrency(calculationResult.vacaciones)}</span></div>
            <div className="flex justify-between border-b border-gray-700 py-1"><span className="text-gray-400">Otros Conceptos:</span><span className="text-green-400">{formatCurrency(calculationResult.otrosConceptos)}</span></div>
            <div className="flex justify-between border-b border-gray-700 py-1"><span className="text-gray-400">Deducciones:</span><span className="text-red-400">-{formatCurrency(calculationResult.deducciones)}</span></div>
            <div className="flex justify-between text-lg font-bold pt-2"><span>Total a Pagar:</span><span>{formatCurrency(calculationResult.totalLiquidacion)}</span></div>
            <div className="pt-4 flex justify-end">
                <button onClick={() => setReceiptToPreview(calculationResult)} className="text-accent hover:underline">Ver Recibo PDF</button>
            </div>
          </div>
        )}
      </div>

      {receiptToPreview && (
        <Modal 
            isOpen={!!receiptToPreview} 
            onClose={() => setReceiptToPreview(null)} 
            title={`Previsualización de Liquidación - ${receiptToPreview.employee.Nombres}`}
            size="4xl"
            footer={renderModalFooter()}
        >
            <SettlementReceipt data={receiptToPreview} />
        </Modal>
      )}
    </div>
  );
};

export default SettlementView;