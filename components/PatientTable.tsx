import React from 'react';
import type { PatientRecord, SortKey, SortDirection } from '../types';
import { PencilIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from './Icons';

interface PatientTableProps {
    records: PatientRecord[];
    onEdit: (record: PatientRecord) => void;
    onDelete: (record: PatientRecord) => void;
    onSort: (key: SortKey) => void;
    sortConfig: { key: SortKey; direction: SortDirection };
    onOpenDetail: (record: PatientRecord) => void;
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

const SortableHeader: React.FC<{
    label: string;
    sortKey: SortKey;
    onSort: (key: SortKey) => void;
    sortConfig: { key: SortKey; direction: SortDirection };
}> = ({ label, sortKey, onSort, sortConfig }) => {
    const isSorted = sortConfig.key === sortKey;
    const direction = sortConfig.direction;

    return (
        <th className="py-3 px-4 whitespace-nowrap">
            <button onClick={() => onSort(sortKey)} className="flex items-center gap-2 group">
                <span className="group-hover:text-white transition-colors">{label}</span>
                {isSorted ? (
                    direction === 'ascending' ? <ArrowUpIcon /> : <ArrowDownIcon />
                ) : (
                    <span className="opacity-0 group-hover:opacity-50 transition-opacity"><ArrowDownIcon /></span>
                )}
            </button>
        </th>
    );
};


const PatientTable: React.FC<PatientTableProps> = ({ records, onEdit, onDelete, onSort, sortConfig, onOpenDetail }) => {
    if (records.length === 0) {
        return <p className="text-center text-gray-400 py-8">No se encontraron registros.</p>;
    }

    const headers: { label: string; key: SortKey }[] = [
        { label: 'Fecha', key: 'FECHA' },
        { label: 'Registro', key: 'REGISTRO' },
        { label: 'Nombre', key: 'NOMBRE' },
        { label: 'Edad', key: 'EDAD' },
        { label: 'Diagnóstico', key: 'DIAGNOSTICO' },
        { label: 'Médico', key: 'MEDICO_ENCARGADO' },
        { label: 'Destino Paciente', key: 'DESTINO_PACIENTE' },
    ];
    
    const truncatedFields: SortKey[] = ['DIAGNOSTICO'];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 text-sm text-left text-gray-300">
                <thead className="bg-gray-700 text-xs text-cyan-400 uppercase tracking-wider">
                    <tr>
                        {headers.map(header => (
                            <SortableHeader
                                key={header.key}
                                label={header.label}
                                sortKey={header.key}
                                onSort={onSort}
                                sortConfig={sortConfig}
                            />
                        ))}
                        <th className="py-3 px-4 whitespace-nowrap text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {records.map((record) => (
                        <tr key={record.RowID} className="hover:bg-gray-700 transition-colors duration-200">
                           {headers.map(header => {
                                const value = record[header.key] || '';
                                const isTruncated = truncatedFields.includes(header.key);
                                const isStatusPill = header.key === 'DESTINO_PACIENTE';
                                const isNameColumn = header.key === 'NOMBRE';

                                let cellContent;
                                if (isNameColumn) {
                                    cellContent = (
                                        <button onClick={() => onOpenDetail(record)} className="font-medium text-white hover:text-cyan-400 transition-colors text-left w-full">
                                            {String(value)}
                                        </button>
                                    );
                                } else if (isStatusPill) {
                                    cellContent = <StatusPill text={String(value)} />;
                                } else if (isTruncated) {
                                    cellContent = <span className="block truncate max-w-xs" title={String(value)}>{String(value)}</span>;
                                } else {
                                    cellContent = String(value);
                                }
    
                                return (
                                    <td key={header.key} className="py-3 px-4 whitespace-nowrap">
                                        {cellContent}
                                    </td>
                                );
                           })}
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        onClick={() => onEdit(record)}
                                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                                        aria-label={`Editar ${record.NOMBRE}`}
                                    >
                                        <PencilIcon />
                                    </button>
                                     <button
                                        onClick={() => onDelete(record)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                        aria-label={`Borrar ${record.NOMBRE}`}
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatientTable;