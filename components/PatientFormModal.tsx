
import React, { useState, useEffect, FormEvent } from 'react';
import type { PatientRecord, NewPatientRecord } from '../types';

interface PatientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (record: NewPatientRecord | PatientRecord) => void;
    initialData: PatientRecord | null;
}

const emptyFormState: NewPatientRecord = {
    FECHA: new Date().toISOString().split('T')[0],
    NOMBRE: '',
    EDAD: 0,
    SEXO: 'Masculino',
    REGISTRO: '',
    DIAGNOSTICO: '',
    FACTOR_DE_RIESGO: '',
    PROCEDENCIA: '',
    MEDICO_ENCARGADO: '',
    GENEXPERT_LAVADO: '',
    CULTIVO_TBC: '',
    MICOLOGICO_LAVADO: '',
    NO_BAAR_LAVADO: '',
    GENEXPERT_ESPUTO: '',
    CULTIVO_NO_BAAR_ESPUTO: '',
    BIOPSIA: 'No',
    RESULTADO_BIOPSIA: '',
    OBSERVACION: '',
    DESTINO_PACIENTE: '',
    NUMERO_BIOPSIA: '',
    DATO_ADICIONAL_1: '',
    DATO_ADICIONAL_2: '',
};

const FormField: React.FC<{
    fieldKey: keyof NewPatientRecord;
    formData: NewPatientRecord | PatientRecord;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}> = ({ fieldKey, formData, onChange }) => {
    
    let label = fieldKey.replace(/_/g, ' ');
    // Custom labels for better readability
    if (fieldKey === 'DATO_ADICIONAL_1') label = 'Código Diagnóstico';
    if (fieldKey === 'DATO_ADICIONAL_2') label = 'Detalle Diagnóstico';

    const commonClasses = "w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500";
    const value = formData[fieldKey];

    const renderInput = () => {
        switch (fieldKey) {
            case 'SEXO':
                return (
                    <select name={fieldKey} value={value} onChange={onChange} className={commonClasses}>
                        <option>Masculino</option>
                        <option>Femenino</option>
                        <option>Otro</option>
                    </select>
                );
            case 'BIOPSIA':
                return (
                    <select name={fieldKey} value={value} onChange={onChange} className={commonClasses}>
                        <option>No</option>
                        <option>Sí</option>
                    </select>
                );
            case 'DIAGNOSTICO':
            case 'OBSERVACION':
            case 'RESULTADO_BIOPSIA':
            case 'FACTOR_DE_RIESGO':
                return <textarea name={fieldKey} value={String(value)} onChange={onChange} className={commonClasses} rows={2}></textarea>;
            case 'FECHA':
                 return <input type="date" name={fieldKey} value={String(value)} onChange={onChange} className={commonClasses} />;
            case 'EDAD':
                return <input type="number" name={fieldKey} value={Number(value)} onChange={onChange} className={commonClasses} />;
            default:
                return <input type="text" name={fieldKey} value={String(value)} onChange={onChange} className={commonClasses} />;
        }
    };

    return (
        <div>
            <label htmlFor={fieldKey} className="block text-sm font-medium text-gray-400 capitalize mb-1">{label}</label>
            {renderInput()}
        </div>
    );
};


const PatientFormModal: React.FC<PatientFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState<NewPatientRecord | PatientRecord>(emptyFormState);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(emptyFormState);
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;
    
    const isEditing = !!initialData;

    const sections: Record<string, (keyof NewPatientRecord)[]> = {
        'Información del Paciente': ['FECHA', 'NOMBRE', 'EDAD', 'SEXO', 'REGISTRO'],
        'Diagnóstico y Origen': ['DIAGNOSTICO', 'FACTOR_DE_RIESGO', 'PROCEDENCIA', 'MEDICO_ENCARGADO'],
        'Resultados de Laboratorio (Lavado)': ['GENEXPERT_LAVADO', 'CULTIVO_TBC', 'MICOLOGICO_LAVADO', 'NO_BAAR_LAVADO'],
        'Resultados de Laboratorio (Esputo)': ['GENEXPERT_ESPUTO', 'CULTIVO_NO_BAAR_ESPUTO'],
        'Biopsia y Observaciones': ['BIOPSIA', 'RESULTADO_BIOPSIA', 'NUMERO_BIOPSIA', 'OBSERVACION'],
        'Resultado Final': ['DESTINO_PACIENTE', 'DATO_ADICIONAL_1', 'DATO_ADICIONAL_2']
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-start p-4 pt-10" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700 z-10">
                    <h2 className="text-2xl font-semibold text-cyan-400">{isEditing ? 'Editar Registro' : 'Agregar Nuevo Registro'}</h2>
                </header>
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-grow">
                    <div className="p-6 space-y-6">
                        {Object.entries(sections).map(([title, fields]) => (
                            <fieldset key={title} className="border border-gray-600 p-4 rounded-lg">
                                <legend className="px-2 text-cyan-400 font-semibold">{title}</legend>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                                    {fields.map(key => (
                                        <FormField key={key} fieldKey={key} formData={formData} onChange={handleChange} />
                                    ))}
                                </div>
                            </fieldset>
                        ))}
                    </div>
                    <footer className="sticky bottom-0 p-6 bg-gray-800/90 backdrop-blur-sm flex justify-end gap-4 rounded-b-lg border-t border-gray-700">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-md transition">
                            Cancelar
                        </button>
                        <button type="submit" className="py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-md transition">
                            {isEditing ? 'Guardar Cambios' : 'Guardar Registro'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default PatientFormModal;
