import React from 'react';
import type { PatientRecord } from '../types';
import { PencilIcon } from './Icons';

interface PatientTableProps {
    records: PatientRecord[];
    onEdit: (record: PatientRecord) => void;
}

const getStatusColor = (text: string) => {
    const normalizedText = text.toLowerCase();
    if (normalizedText.includes('fallecido')) return 'bg-red-500/20 text-red-400';
    if (normalizedText.includes('alta')) return 'bg-green-500/20 text-green-400';
    if (normalizedText.includes('oncologia')) return 'bg-purple-500/20 text-purple-400';
    if (normalizedText.includes('seguimiento')) return 'bg-blue-500/20 text-blue-400';
    if (normalizedText.includes('neumologia')) return 'bg-cyan-500/20 text-cyan-400';
    if (normalizedText.includes('emergencia')) return 'bg-yellow-500/20 text-yellow-400';
    if (normalizedText.includes('reumatologia')) return 'bg-pink-500/20 text-pink-400';
    if (normalizedText.includes('acepta')) return 'bg-orange-500/20 text-orange-400';
    return 'bg-gray-500/20 text-gray-300';
};

const StatusPill: React.FC<{ text: string }> = ({ text }) => (
    <span className={`px-3 py-1 text-xs font-semibold leading-tight rounded-full whitespace-nowrap ${getStatusColor(text)}`}>
        {text}
    </span>
);

const PatientTable: React.FC<PatientTableProps> = ({ records, onEdit }) => {
    if (records.length === 0) {
        return <p className="text-center text-gray-400 py-8">No se encontraron registros.</p>;
    }

    const headers = ['Fecha', 'Nombre', 'Edad', 'Sexo', 'Diagnóstico', 'Procedencia', 'Destino Paciente', 'Acciones'];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 text-sm text-left text-gray-300">
                <thead className="bg-gray-700 text-xs text-cyan-400 uppercase tracking-wider">
                    <tr>
                        {headers.map(header => (
                            <th key={header} className={`py-3 px-4 whitespace-nowrap ${header === 'Acciones' ? 'text-right' : ''}`}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {records.map((record) => (
                        <tr key={record.RowID} className="hover:bg-gray-700 transition-colors duration-200">
                           <td className="py-3 px-4 whitespace-nowrap">{record.FECHA}</td>
                           <td className="py-3 px-4 font-medium text-white">{record.NOMBRE}</td>
                           <td className="py-3 px-4 whitespace-nowrap">{record.EDAD}</td>
                           <td className="py-3 px-4 whitespace-nowrap">{record.SEXO}</td>
                           <td className="py-3 px-4 max-w-xs truncate" title={record.DIAGNOSTICO}>{record.DIAGNOSTICO}</td>
                           <td className="py-3 px-4">
                               <StatusPill text={record.PROCEDENCIA} />
                           </td>
                           <td className="py-3 px-4">
                               <StatusPill text={record.DESTINO_PACIENTE} />
                           </td>
                            <td className="py-3 px-4 text-right">
                                <button
                                    onClick={() => onEdit(record)}
                                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                                    aria-label={`Editar ${record.NOMBRE}`}
                                >
                                    <PencilIcon />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatientTable;