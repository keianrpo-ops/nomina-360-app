
import React, { useState } from 'react';
import { Parameter } from '../types';

interface ParametersViewProps {
    parameters: Parameter[];
    setParameters: React.Dispatch<React.SetStateAction<Parameter[]>>;
}

const ParametersView: React.FC<ParametersViewProps> = ({ parameters, setParameters }) => {
    const [localParams, setLocalParams] = useState<Parameter[]>(parameters);

    const handleParamChange = (clave: string, value: string) => {
        const updatedParams = localParams.map(p =>
            p.Clave === clave ? { ...p, Valor: parseFloat(value) || 0 } : p
        );
        setLocalParams(updatedParams);
    };
    
    const handleSave = () => {
        setParameters(localParams);
        alert('Parámetros guardados exitosamente.');
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {localParams.map(param => (
                    <div key={param.Clave} className="bg-gray-800 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-300">{param.Descripcion}</label>
                        <span className="text-xs text-gray-500">Clave: {param.Clave}</span>
                        <input
                            type="number"
                            value={param.Valor}
                            onChange={(e) => handleParamChange(param.Clave, e.target.value)}
                            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-end pt-4">
                <button onClick={handleSave} className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg">
                    Guardar Cambios
                </button>
            </div>
        </div>
    );
};

export default ParametersView;
