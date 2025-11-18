import React, { useState, useEffect } from 'react';
import { Employee, ContractType, SalaryType, EmployeeStatus } from '../types';
import Modal from './common/Modal';

interface EmployeeViewProps {
  employees: Employee[];
  onAdd: (employee: Omit<Employee, 'ID'>) => void;
  onUpdate: (employee: Employee) => void;
  onDelete: (id: number) => void;
}

// -----------------------------
// Estado inicial del formulario
// -----------------------------
type EmployeeFormState = {
  Cedula: string;
  Nombres: string;
  Apellidos: string;
  Cargo: string;
  Fecha_Ingreso: string;
  Tipo_Contrato: ContractType;
  Tipo_Sueldo: SalaryType;
  Salario_Base: string;
  Aux_Transporte: string;
  Correo: string;
  Estado: EmployeeStatus;
  Fecha_Retiro: string;
  Foto: string;
};

const initialFormState: EmployeeFormState = {
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
  Fecha_Retiro: '',
  Foto: '',
};

// -----------------------------
// FORMULARIO (crear / editar)
// -----------------------------
const EmployeeForm: React.FC<{
  onSubmit: (employee: Omit<Employee, 'ID'> | Employee) => void;
  onClose: () => void;
  employeeToEdit?: Employee | null;
}> = ({ onSubmit, onClose, employeeToEdit }) => {
  const [formData, setFormData] = useState<EmployeeFormState>(initialFormState);
  const [preview, setPreview] = useState<string | null>(null);

  // Cargar datos cuando se edita
  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        Cedula: employeeToEdit.Cedula,
        Nombres: employeeToEdit.Nombres,
        Apellidos: employeeToEdit.Apellidos,
        Cargo: employeeToEdit.Cargo,
        Fecha_Ingreso: employeeToEdit.Fecha_Ingreso,
        Tipo_Contrato: employeeToEdit.Tipo_Contrato,
        Tipo_Sueldo: employeeToEdit.Tipo_Sueldo,
        Salario_Base: String(employeeToEdit.Salario_Base),
        Aux_Transporte: String(employeeToEdit.Aux_Transporte),
        Correo: employeeToEdit.Correo,
        Estado: employeeToEdit.Estado,
        Fecha_Retiro: employeeToEdit.Fecha_Retiro ?? '',
        Foto: employeeToEdit.Foto ?? '',
      });
      setPreview(employeeToEdit.Foto ?? null);
    } else {
      setFormData(initialFormState);
      setPreview(null);
    }
  }, [employeeToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFormData(prev => ({ ...prev, Foto: base64 }));
      setPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Foto OBLIGATORIA (tanto crear como editar)
    if (!formData.Foto || formData.Foto === '') {
      alert('Por favor selecciona una foto para este empleado.');
      return;
    }

    const employeeData = {
      ...formData,
      Salario_Base: parseFloat(formData.Salario_Base),
      Aux_Transporte: parseFloat(formData.Aux_Transporte) || 0,
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
          <label className={labelClass}>Auxilio de Transporte</label>
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

        {/* FOTO - OBLIGATORIA */}
        <div className="md:col-span-2 flex flex-col md:flex-row md:items-center gap-4 mt-2">
          <div className="flex-1">
            <label className={labelClass}>Foto * (obligatoria)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={inputClass}
            />
            <p className="text-xs text-gray-400 mt-1">
              La imagen se guarda en la base de datos como Base64 y se envía a Google Sheets.
            </p>
          </div>

          {preview && (
            <div className="flex items-center justify-center">
              <img
                src={preview}
                alt="Preview empleado"
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-accent shadow-lg"
              />
            </div>
          )}
        </div>
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

// -----------------------------
// LISTA DE EMPLEADOS
// -----------------------------
const EmployeeView: React.FC<EmployeeViewProps> = ({
  employees,
  onAdd,
  onUpdate,
  onDelete,
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

  const handleDeleteClick = (id: number) => {
    const ok = window.confirm('¿Seguro que deseas eliminar este empleado?');
    if (ok) {
      onDelete(id);
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
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Cédula</th>
              <th className="px-6 py-3">Cargo</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {employees.map(employee => (
              <tr
                key={employee.ID}
                className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600"
              >
                <td className="px-6 py-4">
                  {employee.Nombres} {employee.Apellidos}
                </td>
                <td className="px-6 py-4">{employee.Cedula}</td>
                <td className="px-6 py-4">{employee.Cargo}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      employee.Estado === EmployeeStatus.Activo
                        ? 'bg-green-900 text-green-300'
                        : 'bg-red-900 text-red-300'
                    }`}
                  >
                    {employee.Estado}
                  </span>
                </td>

                <td className="px-6 py-4 space-x-3">
                  <button
                    onClick={() => handleEditClick(employee)}
                    className="font-medium text-accent hover:underline"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDeleteClick(employee.ID)}
                    className="font-medium text-red-400 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={employeeToEdit ? 'Editar Empleado' : 'Nuevo Empleado'}
      >
        <EmployeeForm
          onSubmit={handleFormSubmit}
          onClose={() => setIsModalOpen(false)}
          employeeToEdit={employeeToEdit}
        />
      </Modal>
    </div>
  );
};

export default EmployeeView;
