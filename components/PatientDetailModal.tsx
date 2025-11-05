import React from 'react';
import type { PatientRecord } from '../types';
import { UserIcon, StethoscopeIcon, LabIcon, ClipboardIcon, CheckIcon, PrintIcon, InfoIcon } from './Icons';

interface PatientDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    record: PatientRecord;
}

const DetailItem: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm text-gray-200">{value || <span className="text-gray-500">N/A</span>}</dd>
    </div>
);

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ isOpen, onClose, record }) => {
    if (!isOpen) return null;

    const handlePrint = () => {
        window.print();
    };

    const sections: Record<string, { fields: (keyof PatientRecord)[], icon: React.ReactNode }> = {
        'Información del Paciente': { fields: ['FECHA', 'NOMBRE', 'EDAD', 'SEXO', 'REGISTRO'], icon: <UserIcon /> },
        'Diagnóstico y Origen': { fields: ['DIAGNOSTICO', 'FACTOR_DE_RIESGO', 'PROCEDENCIA', 'MEDICO_ENCARGADO'], icon: <StethoscopeIcon /> },
        'Resultados de Laboratorio (Lavado)': { fields: ['GENEXPERT_LAVADO', 'CULTIVO_TBC', 'MICOLOGICO_LAVADO', 'NO_BAAR_LAVADO'], icon: <LabIcon /> },
        'Resultados de Laboratorio (Esputo)': { fields: ['GENEXPERT_ESPUTO', 'CULTIVO_NO_BAAR_ESPUTO'], icon: <LabIcon /> },
        'Biopsia y Observaciones': { fields: ['BIOPSIA', 'RESULTADO_BIOPSIA', 'NUMERO_BIOPSIA', 'OBSERVACION'], icon: <ClipboardIcon /> },
        'Resultado Final': { fields: ['DESTINO_PACIENTE', 'DATO_ADICIONAL_1', 'DATO_ADICIONAL_2'], icon: <CheckIcon /> }
    };
    
    const customLabels: Partial<Record<keyof PatientRecord, string>> = {
        DATO_ADICIONAL_1: 'Código Diagnóstico',
        DATO_ADICIONAL_2: 'Detalle Diagnóstico'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-start p-4 pt-10 print:hidden" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700 z-10 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-cyan-400 flex items-center gap-2">
                        <InfoIcon />
                        Detalles del Paciente
                    </h2>
                    <span className="text-lg font-medium text-gray-300">{record.NOMBRE}</span>
                </header>
                <main className="overflow-y-auto flex-grow p-6">
                    <div className="space-y-6">
                        {Object.entries(sections).map(([title, { fields, icon }]) => (
                             <fieldset key={title} className="border border-gray-600 p-4 rounded-lg">
                                <legend className="px-2 text-cyan-400 font-semibold flex items-center gap-2">
                                    <span className="text-cyan-400">{icon}</span>
                                    {title}
                                </legend>
                                <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 pt-2">
                                    {fields.map(key => {
                                        const label = customLabels[key] || key.replace(/_/g, ' ');
                                        return <DetailItem key={key} label={label} value={record[key]} />;
                                    })}
                                </dl>
                            </fieldset>
                        ))}
                    </div>
                </main>
                <footer className="sticky bottom-0 p-4 bg-gray-800/90 backdrop-blur-sm flex justify-end gap-4 rounded-b-lg border-t border-gray-700">
                    <button type="button" onClick={handlePrint} className="flex items-center gap-2 py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-md transition">
                        <PrintIcon />
                        Imprimir
                    </button>
                    <button type="button" onClick={onClose} className="py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-md transition">
                        Cerrar
                    </button>
                </footer>
            </div>
            {/* Printable version */}
            <div className="hidden print:block p-8">
                <h1 className="text-3xl font-bold mb-4">Registro de Paciente: {record.NOMBRE}</h1>
                {Object.entries(sections).map(([title, { fields }]) => (
                    <div key={title} className="mb-6">
                        <h2 className="text-xl font-semibold border-b pb-2 mb-2">{title}</h2>
                        <dl className="grid grid-cols-3 gap-x-4 gap-y-2">
                            {fields.map(key => {
                                const label = customLabels[key] || key.replace(/_/g, ' ');
                                return <DetailItem key={key} label={label} value={record[key]} />;
                            })}
                        </dl>
                    </div>
                ))}
            </div>
            <style jsx global>{`
                @media print {
                    body > *:not(.print\\:block) {
                        display: none;
                    }
                    .print\\:block {
                        color: #000;
                    }
                }
            `}</style>
        </div>
    );
};

export default PatientDetailModal;
