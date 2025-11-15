import { Employee, Parameter, PayrollCalculationResult, SettlementCalculationResult } from '../types';

const getParamValue = (parameters: Parameter[], clave: string): number => {
  const param = parameters.find(p => p.Clave === clave);
  return param ? param.Valor : 0;
};

const diffDays = (date1Str: string, date2Str: string): number => {
  const d1 = new Date(date1Str);
  const d2 = new Date(date2Str);
  // Add 1 to make it inclusive
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

export const calculatePayroll = (
  periodFrom: string,
  periodTo: string,
  selectedEmployeeIds: number[],
  allEmployees: Employee[],
  parameters: Parameter[],
  adjustments: { [employeeId: number]: { devengadoOtros: number, deduccionOtros: number } }
) => {
  const results: PayrollCalculationResult[] = [];
  const diasMesBase = getParamValue(parameters, 'Dias_Mes_Base');

  const smmlv = getParamValue(parameters, 'SMMLV');
  const topeAuxTransporte = getParamValue(parameters, 'Tope_Aux_Transporte_SMMLV');
  const tasaSalud = getParamValue(parameters, 'Tasa_Salud_Empleado');
  const tasaPension = getParamValue(parameters, 'Tasa_Pension_Empleado');
  const topeFSP = getParamValue(parameters, 'Tope_FSP_SMMLV');
  const tasaFSP = getParamValue(parameters, 'Tasa_Fondo_Solidaridad');

  selectedEmployeeIds.forEach(id => {
    const employee = allEmployees.find(e => e.ID === id);
    if (!employee || employee.Estado !== 'Activo') return;

    const diasLaborados = diffDays(periodFrom, periodTo);
    const devengadoSalario = (employee.Salario_Base / diasMesBase) * diasLaborados;

    let devengadoAuxilio = 0;
    // Check eligibility by salary, then use employee's specific allowance
    if (employee.Salario_Base <= topeAuxTransporte * smmlv) {
      devengadoAuxilio = (employee.Aux_Transporte / diasMesBase) * diasLaborados;
    }

    const devengadoOtros = adjustments[id]?.devengadoOtros || 0;
    const deduccionOtros = adjustments[id]?.deduccionOtros || 0;
    
    const totalDevengadoSinAuxilio = devengadoSalario + devengadoOtros;
    
    // Corrected IBC Calculation:
    // The contribution base (IBC) cannot be lower than the proportional minimum wage for the days worked.
    const smmlvProporcional = (smmlv / diasMesBase) * diasLaborados;
    let baseIBC = totalDevengadoSinAuxilio;
    if (baseIBC < smmlvProporcional) {
      baseIBC = smmlvProporcional;
    }
    
    const deduccionSalud = baseIBC * tasaSalud;
    const deduccionPension = baseIBC * tasaPension;
    
    let deduccionFSP = 0;
    if (baseIBC >= topeFSP * smmlv) {
        deduccionFSP = baseIBC * tasaFSP;
    }

    const totalDeducciones = deduccionSalud + deduccionPension + deduccionFSP + deduccionOtros;
    const netoPagar = totalDevengadoSinAuxilio + devengadoAuxilio - totalDeducciones;
    
    results.push({
      employee,
      diasLaborados,
      devengadoSalario,
      devengadoAuxilio,
      devengadoOtros,
      baseIBC,
      deduccionSalud,
      deduccionPension,
      deduccionFSP,
      deduccionOtros,
      netoPagar,
    });
  });

  return { results };
};

export const calculateSettlement = (
    employeeId: number,
    fechaRetiro: string,
    allEmployees: Employee[],
    parameters: Parameter[],
    adjustments: { otrosConceptos: number, deducciones: number }
) => {
    const employee = allEmployees.find(e => e.ID === employeeId);
    if (!employee) return null;

    const smmlv = getParamValue(parameters, 'SMMLV');
    const topeAuxTransporte = getParamValue(parameters, 'Tope_Aux_Transporte_SMMLV');
    const tasaInteresesCesantiasAnual = getParamValue(parameters, 'Tasa_Intereses_Cesantias_Anual');
    
    // Base salary for settlement benefits (Cesantías, Prima) includes transport allowance if applicable.
    let salarioBasePrestaciones = employee.Salario_Base;
    if (employee.Aux_Transporte > 0 && employee.Salario_Base <= topeAuxTransporte * smmlv) {
        salarioBasePrestaciones += employee.Aux_Transporte;
    }
    
    const diasAntiguedad = diffDays(employee.Fecha_Ingreso, fechaRetiro);

    // Cesantías: 1 month's salary per year.
    const cesantias = (salarioBasePrestaciones * diasAntiguedad) / 360;

    // Intereses sobre Cesantías: 12% annual on the last year's balance.
    const interesesCesantias = cesantias * (tasaInteresesCesantiasAnual * (diasAntiguedad % 360) / 360);
    
    // Prima de Servicios: 1 month's salary per year.
    const prima = (salarioBasePrestaciones * diasAntiguedad) / 360; 

    // Vacaciones: 15 days of salary per year. Calculated on salary WITHOUT transport allowance.
    const vacaciones = (employee.Salario_Base * diasAntiguedad) / 720;

    const otrosConceptos = adjustments.otrosConceptos || 0;
    const deducciones = adjustments.deducciones || 0;

    const totalLiquidacion = cesantias + interesesCesantias + prima + vacaciones + otrosConceptos - deducciones;

    const result: SettlementCalculationResult = {
        employee,
        fechaRetiro,
        diasAntiguedad,
        salarioBasePromedio: salarioBasePrestaciones, // Using this as the representative average salary for the receipt
        cesantias,
        interesesCesantias,
        prima,
        vacaciones,
        otrosConceptos,
        deducciones,
        totalLiquidacion
    };
    
    return result;
};