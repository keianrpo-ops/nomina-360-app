import React, { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  Employee,
  PayrollEntry,
  SettlementEntry,
  Parameter,
  AppView,
  EmployeeStatus,
} from './types';
import { DEFAULT_PARAMETERS, DEMO_EMPLOYEE } from './constants';
import EmployeeView from './components/EmployeeView';
import PayrollView from './components/PayrollView';
import SettlementView from './components/SettlementView';
import ParametersView from './components/ParametersView';
import HistoryView from './components/HistoryView';
import { calculatePayroll } from './services/payrollService';
import {
  addToSheet,
  SHEET_EMPLOYEES,
  SHEET_PAYROLL,
  SHEET_SETTLEMENTS,
} from './services/services/googleSheetsService';

import macawLogo from './assets/macaw-logo-3d.png';

// 🔹 Helper: NO guardar la foto en localStorage (solo en Sheets)
const stripFoto = (emp: Employee): Employee => ({
  ...emp,
  Foto: '',
});

// ========= ICONOS DEL SIDEBAR =========
const UserGroupIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const DocumentTextIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const ArchiveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
    />
  </svg>
);

const CogIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const BriefcaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

// ========= COMPONENTE PRINCIPAL =========
const App: React.FC = () => {
  const [employees, setEmployees] = useLocalStorage<Employee[]>('employees', [
    DEMO_EMPLOYEE,
  ]);
  const [payrolls, setPayrolls] = useLocalStorage<PayrollEntry[]>('payrolls', []);
  const [settlements, setSettlements] = useLocalStorage<SettlementEntry[]>(
    'settlements',
    [],
  );
  const [parameters, setParameters] = useLocalStorage<Parameter[]>(
    'parameters',
    DEFAULT_PARAMETERS,
  );
  const [activeView, setActiveView] = useState<AppView>('employees');

  // 🔹 Botón de prueba Google Sheets
  const probarConexion = async () => {
    try {
      await addToSheet(SHEET_EMPLOYEES, {
        id: Date.now(),
        cedula: '999999999',
        nombres: 'Empleado',
        apellidos: 'Prueba',
        cargo: 'Prueba conexión',
        fechaIngreso: new Date().toISOString().slice(0, 10),
        tipoContrato: 'Indefinido',
        tipoSueldo: 'Básico',
        salarioBase: 1234567,
        auxTransporte: 0,
        correo: 'demo@empresa.com',
        estado: 'Activo',
        fechaRetiro: '',
        foto: '',
      });

      alert('✅ Se guardó un empleado de prueba en Google Sheets');
    } catch (error) {
      console.error(error);
      alert('❌ Error al guardar en Google Sheets. Revisa la consola del navegador.');
    }
  };

  // ✅ Guardar empleado (foto SOLO en Sheets, NO en localStorage)
  const addEmployee = (employee: Omit<Employee, 'ID'>) => {
    const newEmployee: Employee = { ...employee, ID: Date.now() };

    const sanitizedExisting = employees.map(stripFoto);
    const newList = [...sanitizedExisting, stripFoto(newEmployee)];
    setEmployees(newList);

    addToSheet(SHEET_EMPLOYEES, {
      id: newEmployee.ID,
      cedula: newEmployee.Cedula,
      nombres: newEmployee.Nombres,
      apellidos: newEmployee.Apellidos,
      cargo: newEmployee.Cargo,
      fechaIngreso: newEmployee.Fecha_Ingreso,
      tipoContrato: newEmployee.Tipo_Contrato,
      tipoSueldo: newEmployee.Tipo_Sueldo,
      salarioBase: newEmployee.Salario_Base,
      auxTransporte: newEmployee.Aux_Transporte,
      correo: newEmployee.Correo,
      estado: newEmployee.Estado,
      fechaRetiro: newEmployee.Fecha_Retiro || '',
      foto: newEmployee.Foto || '',
    }).catch((error) => {
      console.error('Error al guardar empleado en Google Sheets:', error);
      alert(
        'El empleado se guardó en la app, pero hubo un error al guardar en Google Sheets.',
      );
    });
  };

  const updateEmployee = (updatedEmployee: Employee) => {
    const sanitizedExisting = employees.map(stripFoto);
    const newList = sanitizedExisting.map((e) =>
      e.ID === updatedEmployee.ID ? stripFoto(updatedEmployee) : e,
    );
    setEmployees(newList);
  };

  // ✅ Guardar nómina
  const addPayroll = (
    payroll: Omit<PayrollEntry, 'ID_Mov' | 'Fecha_Registro'>,
  ) => {
    const newPayroll: PayrollEntry = {
      ...payroll,
      ID_Mov: Date.now(),
      Fecha_Registro: new Date().toISOString().split('T')[0],
    };

    setPayrolls([...payrolls, newPayroll]);

    const empleado = employees.find((e) => e.ID === newPayroll.Empleado_ID);

    addToSheet(SHEET_PAYROLL, {
      idMov: newPayroll.ID_Mov,
      fechaRegistro: newPayroll.Fecha_Registro,
      periodoDesde: newPayroll.Periodo_Desde,
      periodoHasta: newPayroll.Periodo_Hasta,
      empleadoId: newPayroll.Empleado_ID,
      empleadoNombre: empleado
        ? `${empleado.Nombres} ${empleado.Apellidos}`
        : '',
      diasLaborados: newPayroll.Dias_Laborados,
      devengadoSalario: newPayroll.Devengado_Salario,
      devengadoAuxilio: newPayroll.Devengado_Auxilio,
      devengadoOtros: newPayroll.Devengado_Otros,
      deduccionSalud: newPayroll.Deduccion_Salud,
      deduccionPension: newPayroll.Deduccion_Pension,
      deduccionFsp: newPayroll.Deduccion_FSP,
      deduccionOtros: newPayroll.Deduccion_Otros,
      netoPagar: newPayroll.Neto_Pagar,
      pdfUrl: newPayroll.PDF_URL,
      observaciones: newPayroll.Observaciones,
    }).catch((error) => {
      console.error('Error al guardar nómina en Google Sheets:', error);
      alert(
        'La nómina se guardó en la app, pero hubo un error al guardar en Google Sheets.',
      );
    });
  };

  // ✅ Guardar liquidación
  const addSettlement = (
    settlement: Omit<SettlementEntry, 'ID_Liq' | 'Fecha_Registro'>,
  ) => {
    const newSettlement: SettlementEntry = {
      ...settlement,
      ID_Liq: Date.now(),
      Fecha_Registro: new Date().toISOString().split('T')[0],
    };

    setSettlements([...settlements, newSettlement]);

    const employee = employees.find((e) => e.ID === settlement.Empleado_ID);
    if (employee) {
      updateEmployee({
        ...employee,
        Estado: EmployeeStatus.Inactivo,
        Fecha_Retiro: settlement.Fecha_Retiro,
      });
    }

    addToSheet(SHEET_SETTLEMENTS, {
      idLiq: newSettlement.ID_Liq,
      fechaRegistro: newSettlement.Fecha_Registro,
      empleadoId: newSettlement.Empleado_ID,
      fechaIngreso: newSettlement.Fecha_Ingreso,
      fechaRetiro: newSettlement.Fecha_Retiro,
      diasAntiguedad: newSettlement.Dias_Antiguedad,
      cesantias: newSettlement.Cesantias,
      interesesCesantias: newSettlement.Intereses_Cesantias,
      prima: newSettlement.Prima,
      vacaciones: newSettlement.Vacaciones,
      otrosConceptos: newSettlement.Otros_Conceptos,
      deducciones: newSettlement.Deducciones,
      totalLiquidacion: newSettlement.Total_Liquidacion,
      pdfUrl: newSettlement.PDF_URL,
      observaciones: newSettlement.Observaciones,
    }).catch((error) => {
      console.error('Error al guardar liquidación en Google Sheets:', error);
      alert(
        'La liquidación se guardó en la app, pero hubo un error al guardar en Google Sheets.',
      );
    });
  };

  const loadDemoData = useCallback(() => {
    if (employees.some((e) => e.ID === DEMO_EMPLOYEE.ID)) {
      alert('El empleado demo ya existe.');
      return;
    }
    setEmployees((prev) => [...prev, DEMO_EMPLOYEE]);
    alert('Empleado demo cargado.');
  }, [employees, setEmployees]);

  const generateDemoPayroll = useCallback(() => {
    const demoEmployee = employees.find(
      (e) => e.ID === DEMO_EMPLOYEE.ID && e.Estado === EmployeeStatus.Activo,
    );
    if (!demoEmployee) {
      alert(
        'Por favor, cargue el empleado demo primero (y asegúrese que esté activo).',
      );
      return;
    }
    const today = new Date();
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(today.getDate() - 15);

    const periodFrom = fifteenDaysAgo.toISOString().split('T')[0];
    const periodTo = today.toISOString().split('T')[0];

    const { results } = calculatePayroll(
      periodFrom,
      periodTo,
      [demoEmployee.ID],
      employees,
      parameters,
      {},
    );
    if (results.length > 0) {
      const demoResult = results[0];
      const newPayroll: Omit<PayrollEntry, 'ID_Mov' | 'Fecha_Registro'> = {
        Periodo_Desde: periodFrom,
        Periodo_Hasta: periodTo,
        Empleado_ID: demoResult.employee.ID,
        Dias_Laborados: demoResult.diasLaborados,
        Devengado_Salario: demoResult.devengadoSalario,
        Devengado_Auxilio: demoResult.devengadoAuxilio,
        Devengado_Otros: demoResult.devengadoOtros,
        Deduccion_Salud: demoResult.deduccionSalud,
        Deduccion_Pension: demoResult.deduccionPension,
        Deduccion_FSP: demoResult.deduccionFSP,
        Deduccion_Otros: demoResult.deduccionOtros,
        Neto_Pagar: demoResult.netoPagar,
        PDF_URL: '',
        Observaciones: 'Nómina demo generada automáticamente.',
      };
      addPayroll(newPayroll);
      alert('Nómina demo generada para los últimos 15 días.');
      setActiveView('history');
    } else {
      alert('No se pudo calcular la nómina demo.');
    }
  }, [employees, parameters]);

  // ========= NAV ITEM =========
  const NavItem: React.FC<{
    view: AppView;
    label: string;
    icon: React.ReactNode;
  }> = ({ view, label, icon }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200
        ${
          activeView === view
            ? 'bg-white text-sky-700 shadow-md'
            : 'text-white opacity-70 hover:bg-sky-600 hover:opacity-100'
        }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen font-sans">
      {/* SIDEBAR */}
      <nav className="w-full md:w-24 bg-sky-500 text-white p-2 flex md:flex-col justify-around md:justify-start md:space-y-4 shadow-lg z-10">
        {/* Logo Macaw */}
        <div className="flex flex-col items-center mb-6 hidden md:flex">
          <img
  src={macawLogo}
  alt="Macaw Logo"
  className="h-10 w-10 rounded-full bg-white object-cover shadow-md"
/>

          <h1 className="text-xs font-bold mt-2 text-center tracking-wide">
            Nómina 360
          </h1>
        </div>

        <NavItem view="employees" label="Empleados" icon={<UserGroupIcon />} />
        <NavItem view="payroll" label="Nómina" icon={<DocumentTextIcon />} />
        <NavItem view="settlement" label="Liquidación" icon={<BriefcaseIcon />} />
        <NavItem view="history" label="Historial" icon={<ArchiveIcon />} />
        <NavItem view="parameters" label="Parámetros" icon={<CogIcon />} />
      </nav>

      {/* MAIN */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-base-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold capitalize text-sky-800">
            {activeView === 'employees' && 'Gestión de Empleados'}
            {activeView === 'payroll' && 'Proceso de Nómina'}
            {activeView === 'settlement' && 'Liquidación de Contrato'}
            {activeView === 'history' && 'Historial de Movimientos'}
            {activeView === 'parameters' && 'Configuración de Parámetros'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadDemoData}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
            >
              Cargar Empleado Demo
            </button>
            <button
              onClick={generateDemoPayroll}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
            >
              Generar Nómina Demo
            </button>
            <button
              onClick={probarConexion}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
            >
              Probar conexión Google Sheets
            </button>
          </div>
        </div>

        {/* Tarjeta principal blanca */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl">
          {activeView === 'employees' && (
            <EmployeeView
              employees={employees}
              onAdd={addEmployee}
              onUpdate={updateEmployee}
            />
          )}
          {activeView === 'payroll' && (
            <PayrollView
              employees={employees}
              parameters={parameters}
              onRegister={addPayroll}
            />
          )}
          {activeView === 'settlement' && (
            <SettlementView
              employees={employees}
              parameters={parameters}
              onRegister={addSettlement}
            />
          )}
          {activeView === 'history' && (
            <HistoryView
              payrolls={payrolls}
              settlements={settlements}
              employees={employees}
            />
          )}
          {activeView === 'parameters' && (
            <ParametersView
              parameters={parameters}
              setParameters={setParameters}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
