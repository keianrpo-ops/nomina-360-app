import React, { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
// FIX: Import EmployeeStatus to use enum values for type safety.
import { Employee, PayrollEntry, SettlementEntry, Parameter, AppView, EmployeeStatus } from './types';
import { DEFAULT_PARAMETERS, DEMO_EMPLOYEE } from './constants';
import EmployeeView from './components/EmployeeView';
import PayrollView from './components/PayrollView';
import SettlementView from './components/SettlementView';
import ParametersView from './components/ParametersView';
import HistoryView from './components/HistoryView';
import { calculatePayroll } from './services/payrollService';
import { addToSheet, SHEET_EMPLOYEES, SHEET_PAYROLL, SHEET_SETTLEMENTS } from "./services/services/googleSheetsService";


// Icons for navigation
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const ArchiveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

const App: React.FC = () => {
  const [employees, setEmployees] = useLocalStorage<Employee[]>('employees', [DEMO_EMPLOYEE]);
  const [payrolls, setPayrolls] = useLocalStorage<PayrollEntry[]>('payrolls', []);
  const [settlements, setSettlements] = useLocalStorage<SettlementEntry[]>('settlements', []);
  const [parameters, setParameters] = useLocalStorage<Parameter[]>('parameters', DEFAULT_PARAMETERS);
  const [activeView, setActiveView] = useState<AppView>('employees');

  // 🔹 Botón de prueba (lo dejamos activo porque ya viste que funciona)
  const probarConexion = async () => {
  try {
    await addToSheet(SHEET_EMPLOYEES, {
      id: Date.now(),
      cedula: "999999999",
      nombres: "Empleado",
      apellidos: "Prueba",
      cargo: "Prueba conexión",
      fechaIngreso: new Date().toISOString().slice(0, 10),
      tipoContrato: "Indefinido",
      tipoSueldo: "Básico",
      salarioBase: 1234567,
      auxTransporte: 0,
      correo: "demo@empresa.com",
      estado: "Activo",
      fechaRetiro: "",
      foto: "",
    });

    alert("✅ Se guardó un empleado de prueba en Google Sheets");
  } catch (error) {
    console.error(error);
    alert("❌ Error al guardar en Google Sheets. Revisa la consola del navegador.");
  }
};

  // ✅ Guardar empleado en localStorage + Google Sheets (Empleados)
const addEmployee = (employee: Omit<Employee, 'ID'>) => {
  const newEmployee: Employee = { ...employee, ID: Date.now() };

  setEmployees([...employees, newEmployee]);

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
    fechaRetiro: newEmployee.Fecha_Retiro || "",
    foto: newEmployee.Foto || "",
  }).catch((error) => {
    console.error("Error al guardar empleado en Google Sheets:", error);
    alert("El empleado se guardó en la app, pero hubo un error al guardar en Google Sheets.");
  });
};

  const updateEmployee = (updatedEmployee: Employee) => {
    setEmployees(employees.map(e => e.ID === updatedEmployee.ID ? updatedEmployee : e));
  };
  
  // ✅ Guardar nómina en localStorage + Google Sheets (Nomina)
  const addPayroll = (payroll: Omit<PayrollEntry, 'ID_Mov' | 'Fecha_Registro'>) => {
    const newPayroll: PayrollEntry = { 
      ...payroll, 
      ID_Mov: Date.now(),
      Fecha_Registro: new Date().toISOString().split('T')[0]
    };

    // 1) Guardar en la app
    setPayrolls([...payrolls, newPayroll]);

    // 2) Buscar empleado para el nombre
    const empleado = employees.find(e => e.ID === newPayroll.Empleado_ID);

    // 3) Guardar en Google Sheets
    addToSheet("Nomina", {
      id_mov: newPayroll.ID_Mov,
      fecha_registro: newPayroll.Fecha_Registro,
      periodo_desde: newPayroll.Periodo_Desde,
      periodo_hasta: newPayroll.Periodo_Hasta,
      empleado_id: newPayroll.Empleado_ID,
      empleado_nombre: empleado ? `${empleado.Nombres} ${empleado.Apellidos}` : "",
      devengado_salario: newPayroll.Devengado_Salario,
      devengado_auxilio: newPayroll.Devengado_Auxilio,
      devengado_otros: newPayroll.Devengado_Otros,
      deduccion_salud: newPayroll.Deduccion_Salud,
      deduccion_pension: newPayroll.Deduccion_Pension,
      deduccion_fsp: newPayroll.Deduccion_FSP,
      deduccion_otros: newPayroll.Deduccion_Otros,
      neto_pagar: newPayroll.Neto_Pagar,
      observaciones: newPayroll.Observaciones,
      pdf_url: newPayroll.PDF_URL,
    }).catch((error) => {
      console.error("Error al guardar nómina en Google Sheets:", error);
      alert("La nómina se guardó en la app, pero hubo un error al guardar en Google Sheets.");
    });
  };

  // ✅ Guardar liquidación en localStorage + Google Sheets (Liquidaciones)
  const addSettlement = (settlement: Omit<SettlementEntry, 'ID_Liq' | 'Fecha_Registro'>) => {
    const newSettlement: SettlementEntry = {
      ...settlement,
      ID_Liq: Date.now(),
      Fecha_Registro: new Date().toISOString().split('T')[0]
    };

    // 1) Guardar en la app
    setSettlements([...settlements, newSettlement]);

    // 2) Marcar empleado como inactivo
    const employee = employees.find(e => e.ID === settlement.Empleado_ID);
    if (employee) {
      updateEmployee({
        ...employee,
        Estado: EmployeeStatus.Inactivo,
        Fecha_Retiro: settlement.Fecha_Retiro
      });
    }

    // 3) Guardar en Google Sheets
    addToSheet("Liquidaciones", {
      id_liq: newSettlement.ID_Liq,
      fecha_registro: newSettlement.Fecha_Registro,
      empleado_id: newSettlement.Empleado_ID,
      empleado_nombre: employee ? `${employee.Nombres} ${employee.Apellidos}` : "",
      fecha_ingreso: employee ? employee.Fecha_Ingreso : "",
      fecha_retiro: newSettlement.Fecha_Retiro,
      cesantias: newSettlement.Cesantias,
      intereses_cesantias: newSettlement.Intereses_Cesantias,
      primas: newSettlement.Primas,
      vacaciones: newSettlement.Vacaciones,
      otros_conceptos: newSettlement.Otros_Conceptos,
      deducciones: newSettlement.Deducciones,
      total_pagar: newSettlement.Total_Pagar,
      pdf_url: newSettlement.PDF_URL,
    }).catch((error) => {
      console.error("Error al guardar liquidación en Google Sheets:", error);
      alert("La liquidación se guardó en la app, pero hubo un error al guardar en Google Sheets.");
    });
  };

  const loadDemoData = useCallback(() => {
    if (employees.some(e => e.ID === DEMO_EMPLOYEE.ID)) {
      alert("El empleado demo ya existe.");
      return;
    }
    setEmployees(prev => [...prev, DEMO_EMPLOYEE]);
    alert("Empleado demo cargado.");
  }, [employees, setEmployees]);

  const generateDemoPayroll = useCallback(() => {
    const demoEmployee = employees.find(e => e.ID === DEMO_EMPLOYEE.ID && e.Estado === 'Activo');
    if (!demoEmployee) {
      alert("Por favor, cargue el empleado demo primero (y asegúrese que esté activo).");
      return;
    }
    const today = new Date();
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(today.getDate() - 15);

    const periodFrom = fifteenDaysAgo.toISOString().split('T')[0];
    const periodTo = today.toISOString().split('T')[0];
    
    const { results } = calculatePayroll(periodFrom, periodTo, [demoEmployee.ID], employees, parameters, {});
    if (results.length > 0) {
      const demoResult = results[0];
      const newPayroll: Omit<PayrollEntry, 'ID_Mov'|'Fecha_Registro'> = {
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
        Observaciones: 'Nómina demo generada automáticamente.'
      };
      addPayroll(newPayroll);
      alert("Nómina demo generada para los últimos 15 días.");
      setActiveView('history');
    } else {
      alert("No se pudo calcular la nómina demo.");
    }
  }, [employees, parameters, addPayroll, setActiveView]);

  const NavItem: React.FC<{ view: AppView; label: string; icon: React.ReactNode; }> = ({ view, label, icon }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
        activeView === view ? 'bg-secondary text-white' : 'hover:bg-neutral'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen font-sans">
      <nav className="w-full md:w-24 bg-neutral p-2 flex md:flex-col justify-around md:justify-start md:space-y-4 shadow-lg z-10">
        <div className="flex flex-col items-center mb-6 hidden md:flex">
          <BriefcaseIcon />
          <h1 className="text-sm font-bold mt-1 text-center">Nómina 360</h1>
        </div>
        <NavItem view="employees" label="Empleados" icon={<UserGroupIcon />} />
        <NavItem view="payroll" label="Nómina" icon={<DocumentTextIcon />} />
        <NavItem view="settlement" label="Liquidación" icon={<BriefcaseIcon />} />
        <NavItem view="history" label="Historial" icon={<ArchiveIcon />} />
        <NavItem view="parameters" label="Parámetros" icon={<CogIcon />} />
      </nav>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-base-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold capitalize text-white">
            {activeView === "employees" && "Gestión de Empleados"}
            {activeView === "payroll" && "Proceso de Nómina"}
            {activeView === "settlement" && "Liquidación de Contrato"}
            {activeView === "history" && "Historial de Movimientos"}
            {activeView === "parameters" && "Configuración de Parámetros"}
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
        
        <div className="bg-neutral p-4 sm:p-6 rounded-xl shadow-2xl">
          {activeView === 'employees' && <EmployeeView employees={employees} onAdd={addEmployee} onUpdate={updateEmployee} />}
          {activeView === 'payroll' && <PayrollView employees={employees} parameters={parameters} onRegister={addPayroll} />}
          {activeView === 'settlement' && <SettlementView employees={employees} parameters={parameters} onRegister={addSettlement} />}
          {activeView === 'history' && <HistoryView payrolls={payrolls} settlements={settlements} employees={employees} />}
          {activeView === 'parameters' && <ParametersView parameters={parameters} setParameters={setParameters} />}
        </div>
      </main>
    </div>
  );
};

export default App;
