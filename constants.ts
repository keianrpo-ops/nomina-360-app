
import { Parameter, Employee, ContractType, SalaryType, EmployeeStatus } from './types';

export const DEFAULT_PARAMETERS: Parameter[] = [
  { Clave: 'SMMLV', Valor: 1300000, Descripcion: 'Salario Mínimo Mensual Legal Vigente' },
  { Clave: 'Auxilio_Transporte_Mensual', Valor: 162000, Descripcion: 'Auxilio de Transporte Mensual (Valor legal de referencia)' },
  { Clave: 'Dias_Mes_Base', Valor: 30, Descripcion: 'Días base para cálculos mensuales' },
  { Clave: 'Tasa_Salud_Empleado', Valor: 0.04, Descripcion: 'Aporte a salud del empleado' },
  { Clave: 'Tasa_Pension_Empleado', Valor: 0.04, Descripcion: 'Aporte a pensión del empleado' },
  { Clave: 'Tasa_Fondo_Solidaridad', Valor: 0.01, Descripcion: 'Aporte al Fondo de Solidaridad Pensional' },
  { Clave: 'Tope_FSP_SMMLV', Valor: 4, Descripcion: 'Salario base (en SMMLV) para aplicar FSP' },
  { Clave: 'Tasa_Arl_Referencial', Valor: 0.00522, Descripcion: 'Tasa de Riesgos Laborales (Clase I)' },
  { Clave: 'Tasa_Caja_Compensacion', Valor: 0.04, Descripcion: 'Aporte a Caja de Compensación Familiar' },
  { Clave: 'Tasa_Cesantias', Valor: 0.0833, Descripcion: 'Provisión mensual de Cesantías (Salario/12)' },
  { Clave: 'Tasa_Intereses_Cesantias_Anual', Valor: 0.12, Descripcion: 'Tasa de Intereses sobre Cesantías (anual)' },
  { Clave: 'Tasa_Prima', Valor: 0.0833, Descripcion: 'Provisión mensual de Prima de Servicios (Salario/12)' },
  { Clave: 'Tasa_Vacaciones', Valor: 0.0417, Descripcion: 'Provisión mensual de Vacaciones (Salario/24)' },
  { Clave: 'Tope_Aux_Transporte_SMMLV', Valor: 2, Descripcion: 'Salario máximo (en SMMLV) para recibir Aux. Transporte' },
];

export const DEMO_EMPLOYEE: Employee = {
    ID: 1001,
    Cedula: '123456789',
    Nombres: 'Juan',
    Apellidos: 'Pérez Demo',
    Cargo: 'Desarrollador React',
    Fecha_Ingreso: '2023-01-15',
    Tipo_Contrato: ContractType.Indefinido,
    Tipo_Sueldo: SalaryType.Basico,
    Salario_Base: 2500000,
    Aux_Transporte: 162000,
    Correo: 'juan.perez.demo@example.com',
    Estado: EmployeeStatus.Activo,
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// 🔹 Info fija de la empresa
export const COMPANY_INFO = {
  name: 'EcoParadise',
  nit: '901891752',
  address: 'Pereira, Colombia',
};
