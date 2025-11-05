import React, { useState, useEffect, FormEvent } from 'react';
import type { PatientRecord, NewPatientRecord } from '../types';
import { UserIcon, StethoscopeIcon, LabIcon, ClipboardIcon, CheckIcon } from './Icons';

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

type FormErrors = Partial<Record<keyof NewPatientRecord, string>>;

const FormField: React.FC<{
    fieldKey: keyof NewPatientRecord;
    formData: NewPatientRecord | PatientRecord;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    error?: string;
}> = ({ fieldKey, formData, onChange, error }) => {
    
    let label = fieldKey.replace(/_/g, ' ');
    if (fieldKey === 'DATO_ADICIONAL_1') label = 'Código Diagnóstico';
    if (fieldKey === 'DATO_ADICIONAL_2') label = 'Detalle Diagnóstico';

    const commonClasses = "w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500";
    const errorClasses = "border-red-500 focus:border-red-500 focus:ring-red-500";
    const value = formData[fieldKey];

    const renderInput = () => {
        const inputClasses = `${commonClasses} ${error ? errorClasses : ''}`;
        switch (fieldKey) {
            case 'SEXO':
                return <select name={fieldKey} value={value} onChange={onChange} className={inputClasses}>
                        <option>Masculino</option><option>Femenino</option><option>Otro</option>
                    </select>;
            case 'BIOPSIA':
                return <select name={fieldKey} value={value} onChange={onChange} className={inputClasses}>
                        <option>No</option><option>Sí</option>
                    </select>;
            case 'DIAGNOSTICO': case 'OBSERVACION': case 'RESULTADO_BIOPSIA': case 'FACTOR_DE_RIESGO':
                return <textarea name={fieldKey} value={String(value)} onChange={onChange} className={inputClasses} rows={2}></textarea>;
            case 'FECHA':
                 return <input type="date" name={fieldKey} value={String(value)} onChange={onChange} className={inputClasses} />;
            case 'EDAD':
                return <input type="number" name={fieldKey} value={Number(value)} onChange={onChange} className={inputClasses} />;
            default:
                return <input type="text" name={fieldKey} value={String(value)} onChange={onChange} className={inputClasses} />;
        }
    };

    return (
        <div>
            <label htmlFor={fieldKey} className="block text-sm font-medium text-gray-400 capitalize mb-1">{label}</label>
            {renderInput()}
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
};


const PatientFormModal: React.FC<PatientFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState<NewPatientRecord | PatientRecord>(emptyFormState);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(emptyFormState);
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!formData.NOMBRE.trim()) newErrors.NOMBRE = 'El nombre es obligatorio.';
        if (!formData.FECHA) newErrors.FECHA = 'La fecha es obligatoria.';
        if (formData.EDAD <= 0) newErrors.EDAD = 'La edad debe ser un número positivo.';
        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (errors[name as keyof NewPatientRecord]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name as keyof NewPatientRecord];
                return newErrors;
            });
        }
        
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? (value === '' ? '' : Number(value)) : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onSubmit(formData);
    };

    if (!isOpen) return null;
    
    const isEditing = !!initialData;

    const sections: Record<string, { fields: (keyof NewPatientRecord)[], icon: React.ReactNode }> = {
        'Información del Paciente': { fields: ['FECHA', 'NOMBRE', 'EDAD', 'SEXO', 'REGISTRO'], icon: <UserIcon /> },
        'Diagnóstico y Origen': { fields: ['DIAGNOSTICO', 'FACTOR_DE_RIESGO', 'PROCEDENCIA', 'MEDICO_ENCARGADO'], icon: <StethoscopeIcon /> },
        'Resultados de Laboratorio (Lavado)': { fields: ['GENEXPERT_LAVADO', 'CULTIVO_TBC', 'MICOLOGICO_LAVADO', 'NO_BAAR_LAVADO'], icon: <LabIcon /> },
        'Resultados de Laboratorio (Esputo)': { fields: ['GENEXPERT_ESPUTO', 'CULTIVO_NO_BAAR_ESPUTO'], icon: <LabIcon /> },
        'Biopsia y Observaciones': { fields: ['BIOPSIA', 'RESULTADO_BIOPSIA', 'NUMERO_BIOPSIA', 'OBSERVACION'], icon: <ClipboardIcon /> },
        'Resultado Final': { fields: ['DESTINO_PACIENTE', 'DATO_ADICIONAL_1', 'DATO_ADICIONAL_2'], icon: <CheckIcon /> }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-start p-4 pt-10" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700 z-10">
                    <h2 className="text-2xl font-semibold text-cyan-400">{isEditing ? 'Editar Registro' : 'Agregar Nuevo Registro'}</h2>
                </header>
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-grow">
                    <div className="p-6 space-y-6">
                        {Object.entries(sections).map(([title, { fields, icon }]) => (
                            <fieldset key={title} className="border border-gray-600 p-4 rounded-lg">
                                <legend className="px-2 text-cyan-400 font-semibold flex items-center gap-2">
                                    <span className="text-cyan-400">{icon}</span>
                                    {title}
                                </legend>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                                    {fields.map(key => (
                                        <FormField key={key} fieldKey={key} formData={formData} onChange={handleChange} error={errors[key]} />
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