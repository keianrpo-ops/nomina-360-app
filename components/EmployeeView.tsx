import React, { useState, useEffect } from 'react';
import { Employee, ContractType, SalaryType, EmployeeStatus } from '../types';
import Modal from './common/Modal';

interface EmployeeViewProps {
  employees: Employee[];
  onAdd: (employee: Omit<Employee, 'ID'>) => void;
  onUpdate: (employee: Employee) => void;
  onDelete?: (id: number) => void; // 👈 NUEVO (opcional)
}

const EmployeeForm: React.FC<{
  onSubmit: (employee: Omit<Employee, 'ID'> | Employee) => void;
  onClose: () => void;
  employeeToEdit?: Employee | null;
}> = ({ onSubmit, onClose, employeeToEdit }) => {
  const [formData, setFormData] = useState({
    Cedula: '',
    Nombres: '',
    Apellidos: '',
    Cargo: '',
    Fecha_Ingreso: '',
    Tipo_Contrato: ContractType.Indefinido,
    Tipo_Sueldo: SalaryType.Basico,
    Salario_Base: '',
    Aux_Transporte: '',
    Correo: '',
    Estado: EmployeeStatus.Activo,
    Fecha_Retiro: ''
  });

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        ...employeeToEdit,
        Salario_Base: String(employeeToEdit.Salario_Base),
        Aux_Transporte: String(employeeToEdit.Aux_Transporte),
        Fecha_Retiro: employeeToEdit.Fecha_Retiro || ''
      } as any);
    }
  }, [employeeToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employeeData = {
      ...formData,
      Salario_Base: parseFloat(formData.Salario_Base),
      Aux_Transporte: parseFloat(formData.Aux_Transporte) || 0
    };
    if (employeeToEdit) {
      onSubmit({ ...employeeToEdit, ...employeeData });
    } else {
      onSubmit(employeeData as Omit<Employee, 'ID'>);
    }
    onClose();
  };

  const formGridClass = 'grid grid-cols-1 md:grid-cols-2 gap-4';
  const labelClass = 'block text-sm font-medium text-gray-300 mb-1';
  const inputClass =
    'w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-accent focus:border-accent';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={formGridClass}>
        <div>
          <label className={labelClass}>Cédula</label>
          <input
            type="text"
            name="Cedula"
            value={formData.Cedula}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Nombres</label>
          <input
            type="text"
            name="Nombres"
            value={formData.Nombres}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Apellidos</label>
          <input
            type="text"
            name="Apellidos"
            value={formData.Apellidos}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Cargo</label>
          <input
            type="text"
            name="Cargo"
            value={formData.Cargo}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Correo Electrónico</label>
          <input
            type="email"
            name="Correo"
            value={formData.Correo}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Fecha de Ingreso</label>
          <input
            type="date"
            name="Fecha_Ingreso"
            value={formData.Fecha_Ingreso}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Tipo de Contrato</label>
          <select
            name="Tipo_Contrato"
            value={formData.Tipo_Contrato}
            onChange={handleChange}
            className={inputClass}
          >
            {Object.values(ContractType).map(v => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Tipo de Sueldo</label>
          <select
            name="Tipo_Sueldo"
            value={formData.Tipo_Sueldo}
            onChange={handleChange}
            className={inputClass}
          >
            {Object.values(SalaryType).map(v => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Salario Base</label>
          <input
            type="number"
            name="Salario_Base"
            value={formData.Salario_Base}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Auxilio de Transporte (Mensual)</label>
          <input
            type="number"
            name="Aux_Transporte"
            value={formData.Aux_Transporte}
            onChange={handleChange}
            className={inputClass}
            placeholder="0 si no aplica"
          />
        </div>
        <div>
          <label className={labelClass}>Estado</label>
          <select
            name="Estado"
            value={formData.Estado}
            onChange={handleChange}
            className={inputClass}
          >
            {Object.values(EmployeeStatus).map(v => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        {formData.Estado === EmployeeStatus.Inactivo && (
          <div>
            <label className={labelClass}>Fecha de Retiro</label>
            <input
              type="date"
              name="Fecha_Retiro"
              value={formData.Fecha_Retiro}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        )}
      </div>
      <div className="flex justify-end pt-4 space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg"
        >
          {employeeToEdit ? 'Actualizar' : 'Crear'} Empleado
        </button>
      </div>
    </form>
  );
};

const EmployeeView: React.FC<EmployeeViewProps> = ({
  employees,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  const handleAddClick = () => {
    setEmployeeToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (employee: Employee) => {
    if (!onDelete) return;
    const ok = window.confirm(
      `¿Seguro que deseas eliminar al empleado ${employee.Nombres} ${employee.Apellidos}?`
    );
    if (ok) {
      onDelete(employee.ID);
    }
  };

  const handleFormSubmit = (employeeData: Omit<Employee, 'ID'> | Employee) => {
    if ('ID' in employeeData) {
      onUpdate(employeeData);
    } else {
      onAdd(employeeData);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddClick}
          className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg"
        >
          + Agregar Empleado
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-200 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3">
                Cédula
              </th>
              <th scope="col" className="px-6 py-3">
                Cargo
              </th>
              <th scope="col" className="px-6 py-3">
                Estado
              </th>
              <th scope="col" className="px-6 py-3">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr
                key={employee.ID}
                className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600"
              >
                <td className="px-6 py-4">
                  {`${employee.Nombres} ${employee.Apellidos}`}
                </td>
                <td className="px-6 py-4">{employee.Cedula}</td>
                <td className="px-6 py-4">{employee.Cargo}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      employee
