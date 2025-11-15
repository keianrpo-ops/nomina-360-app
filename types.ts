
export type AppView = 'employees' | 'payroll' | 'settlement' | 'history' | 'parameters';

export enum ContractType {
  Fijo = 'Fijo',
  Indefinido = 'Indefinido',
  Aprendiz = 'Aprendiz',
  ObraLabor = 'Obra o Labor',
}

export enum SalaryType {
  Basico = 'Básico',
  Fijo = 'Fijo',
  Horas = 'Por Horas',
  Comision = 'Comisión',
}

export enum EmployeeStatus {
    Activo = 'Activo',
    Inactivo = 'Inactivo',
}

export interface Employee {
  ID: number;
  Cedula: string;
  Nombres: string;
  Apellidos: string;
  Cargo: string;
  Fecha_Ingreso: string; // YYYY-MM-DD
  Tipo_Contrato: ContractType;
  Tipo_Sueldo: SalaryType;
  Salario_Base: number;
  Aux_Transporte: number; // Monto mensual del auxilio de transporte
  Correo: string;
  Estado: EmployeeStatus;
  Fecha_Retiro?: string; // YYYY-MM-DD
  Foto?: string; // Base64 encoded image
}

export interface Parameter {
  Clave: string;
  Valor: number;
  Descripcion: string;
}

export interface PayrollEntry {
  ID_Mov: number;
  Fecha_Registro: string; // YYYY-MM-DD
  Periodo_Desde: string; // YYYY-MM-DD
  Periodo_Hasta: string; // YYYY-MM-DD
  Empleado_ID: number;
  Dias_Laborados: number;
  Devengado_Salario: number;
  Devengado_Auxilio: number;
  Devengado_Otros: number;
  Deduccion_Salud: number;
  Deduccion_Pension: number;
  Deduccion_FSP: number;
  Deduccion_Otros: number;
  Neto_Pagar: number;
  PDF_URL: string;
  Observaciones: string;
}

export interface SettlementEntry {
  ID_Liq: number;
  Fecha_Registro: string; // YYYY-MM-DD
  Empleado_ID: number;
  Fecha_Ingreso: string; // YYYY-MM-DD
  Fecha_Retiro: string; // YYYY-MM-DD
  Dias_Antiguedad: number;
  Cesantias: number;
  Intereses_Cesantias: number;
  Prima: number;
  Vacaciones: number;
  Otros_Conceptos: number;
  Deducciones: number;
  Total_Liquidacion: number;
  PDF_URL: string;
  Observaciones: string;
}

export interface PayrollCalculationResult {
  employee: Employee;
  diasLaborados: number;
  devengadoSalario: number;
  devengadoAuxilio: number;
  devengadoOtros: number;
  baseIBC: number;
  deduccionSalud: number;
  deduccionPension: number;
  deduccionFSP: number;
  deduccionOtros: number;
  netoPagar: number;
}

export interface SettlementCalculationResult {
    employee: Employee;
    fechaRetiro: string;
    diasAntiguedad: number;
    salarioBasePromedio: number;
    cesantias: number;
    interesesCesantias: number;
    prima: number;
    vacaciones: number;
    otrosConceptos: number;
    deducciones: number;
    totalLiquidacion: number;
}