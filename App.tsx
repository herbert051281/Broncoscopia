import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { PatientRecord, NewPatientRecord, SortKey, SortDirection } from './types';
import { fetchRecords, addRecord, updateRecord, deleteRecord } from './services/api';
import PatientTable from './components/PatientTable';
import PatientFormModal from './components/PatientFormModal';
import PatientDetailModal from './components/PatientDetailModal';
import Pagination from './components/Pagination';
import Spinner from './components/Spinner';
import Toast from './components/Toast';
import Dashboard from './components/Dashboard';
import { PlusIcon, SearchIcon, ChartBarIcon, TableIcon, ExportIcon } from './components/Icons';

type View = 'table' | 'dashboard';
const ITEMS_PER_PAGE = 10;

const App: React.FC = () => {
    const [records, setRecords] = useState<PatientRecord[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingRecord, setEditingRecord] = useState<PatientRecord | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'FECHA', direction: 'descending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [detailRecord, setDetailRecord] = useState<PatientRecord | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const loadRecords = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await fetchRecords();
            setRecords(data);
        } catch (error) {
            console.error("Error fetching records:", error);
            showToast('Error al cargar los registros.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRecords();
    }, [loadRecords]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleOpenAddModal = () => {
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (record: PatientRecord) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    };
    
    const handleOpenDetailModal = (record: PatientRecord) => {
        setDetailRecord(record);
        setIsDetailModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRecord(null);
    };
    
    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setDetailRecord(null);
    };

    const handleSubmit = async (formData: NewPatientRecord | PatientRecord) => {
        handleCloseModal();
        try {
            if ('RowID' in formData && formData.RowID) {
                await updateRecord(formData as PatientRecord);
                showToast('Registro actualizado con éxito.', 'success');
            } else {
                await addRecord(formData as NewPatientRecord);
                showToast('Registro agregado con éxito.', 'success');
            }
            await loadRecords();
        } catch (error) {
            console.error("Error saving record:", error);
            showToast('Error al guardar el registro.', 'error');
        }
    };
    
    const handleDeleteRecord = async (recordToDelete: PatientRecord) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar el registro de ${recordToDelete.NOMBRE}?`)) {
            try {
                await deleteRecord(recordToDelete.RowID);
                showToast('Registro eliminado con éxito.', 'success');
                await loadRecords();
            } catch (error) {
                console.error("Error deleting record:", error);
                showToast('Error al eliminar el registro.', 'error');
            }
        }
    };

    const handleSort = (key: SortKey) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const dateFilteredRecords = useMemo(() => {
        setCurrentPage(1);
        return records.filter(record => {
            return (!startDate || record.FECHA >= startDate) &&
                   (!endDate || record.FECHA <= endDate);
        });
    }, [records, startDate, endDate]);

    const filteredRecords = useMemo(() => {
        setCurrentPage(1);
        if (!searchTerm) {
            return dateFilteredRecords;
        }
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return dateFilteredRecords.filter(record =>
            Object.values(record).some(value =>
                String(value).toLowerCase().includes(lowercasedSearchTerm)
            )
        );
    }, [dateFilteredRecords, searchTerm]);

    const sortedAndFilteredRecords = useMemo(() => {
        const sortableItems = [...filteredRecords];
        sortableItems.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
            }

            const stringA = String(aValue).toLowerCase();
            const stringB = String(bValue).toLowerCase();

            if (stringA < stringB) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (stringA > stringB) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        return sortableItems;
    }, [filteredRecords, sortConfig]);
    
    const paginatedRecords = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedAndFilteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [sortedAndFilteredRecords, currentPage]);

    const totalPages = Math.ceil(sortedAndFilteredRecords.length / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleExportCSV = () => {
        if (sortedAndFilteredRecords.length === 0) {
            showToast('No hay datos para exportar.', 'error');
            return;
        }
    
        const headers = Object.keys(sortedAndFilteredRecords[0]) as (keyof PatientRecord)[];
        const headerLabels = {
            RowID: "ID de Fila", FECHA: "Fecha", NOMBRE: "Nombre", EDAD: "Edad", SEXO: "Sexo",
            REGISTRO: "Registro", DIAGNOSTICO: "Diagnóstico", FACTOR_DE_RIESGO: "Factor de Riesgo",
            PROCEDENCIA: "Procedencia", MEDICO_ENCARGADO: "Médico Encargado", GENEXPERT_LAVADO: "Genexpert Lavado",
            CULTIVO_TBC: "Cultivo TBC", MICOLOGICO_LAVADO: "Micológico Lavado", NO_BAAR_LAVADO: "No. BAAR Lavado",
            GENEXPERT_ESPUTO: "Genexpert Esputo", CULTIVO_NO_BAAR_ESPUTO: "Cultivo No. BAAR Esputo",
            BIOPSIA: "Biopsia", RESULTADO_BIOPSIA: "Resultado Biopsia", OBSERVACION: "Observación",
            DESTINO_PACIENTE: "Destino del Paciente", NUMERO_BIOPSIA: "Número de Biopsia",
            DATO_ADICIONAL_1: "Código Diagnóstico", DATO_ADICIONAL_2: "Detalle Diagnóstico",
        };

        const csvRows = [headers.map(h => headerLabels[h] || h).join(',')];
    
        sortedAndFilteredRecords.forEach(record => {
            const values = headers.map(header => {
                const value = record[header];
                const escaped = String(value).replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        });
    
        const csvString = csvRows.join('\n');
        const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        const today = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `registros_pacientes_${today}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400 tracking-tight text-center sm:text-left">
                            Registro de Diagnóstico de Pacientes
                        </h1>
                        <button
                            onClick={handleOpenAddModal}
                            className="flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 w-full sm:w-auto justify-center"
                        >
                            <PlusIcon />
                            <span className="ml-2">Agregar Nuevo Registro</span>
                        </button>
                    </div>

                    <div className="mt-6 border-b border-gray-700 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="bg-gray-800 p-1 rounded-lg flex gap-1">
                           <button onClick={() => setActiveView('table')} className={`px-3 py-1 text-sm font-medium rounded-md flex items-center gap-2 ${activeView === 'table' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                                <TableIcon />
                                Vista de Tabla
                           </button>
                           <button onClick={() => setActiveView('dashboard')} className={`px-3 py-1 text-sm font-medium rounded-md flex items-center gap-2 ${activeView === 'dashboard' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                                <ChartBarIcon />
                                Vista de Dashboard
                           </button>
                        </div>
                      </div>
                    </div>
                </header>

                {!isLoading && (
                    <div className="bg-gray-800 shadow-xl rounded-lg p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            <div className="lg:col-span-1">
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-400 mb-1">Desde</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                                    aria-label="Fecha de inicio"
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-400 mb-1">Hasta</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                                    aria-label="Fecha de fin"
                                />
                            </div>
                             {activeView === 'table' && (
                                <>
                                <div className="md:col-span-2 lg:col-span-2">
                                     <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-1">Búsqueda General</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <SearchIcon />
                                        </div>
                                        <input
                                            type="text"
                                            id="search"
                                            placeholder="Buscar en todos los campos..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                                            aria-label="Búsqueda general en todos los campos"
                                        />
                                    </div>
                                </div>
                                <div className="lg:col-span-1">
                                     <button
                                        onClick={handleExportCSV}
                                        className="flex w-full items-center justify-center bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
                                        aria-label="Exportar datos a CSV"
                                    >
                                        <ExportIcon />
                                        <span className="ml-2 whitespace-nowrap">Exportar CSV</span>
                                    </button>
                                </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
                
                <main>
                    {isLoading && <div className="flex items-center justify-center p-12"><Spinner /></div>}
                    {!isLoading && activeView === 'table' && (
                         <div className="bg-gray-800 shadow-2xl rounded-lg p-6 relative">
                           <PatientTable records={paginatedRecords} onEdit={handleOpenEditModal} onDelete={handleDeleteRecord} onSort={handleSort} sortConfig={sortConfig} onOpenDetail={handleOpenDetailModal} />
                           <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                               <p className="text-sm text-gray-400">
                                   Mostrando <span className="font-medium text-gray-200">{paginatedRecords.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</span>-
                                   <span className="font-medium text-gray-200">{(currentPage - 1) * ITEMS_PER_PAGE + paginatedRecords.length}</span> de 
                                   <span className="font-medium text-gray-200"> {sortedAndFilteredRecords.length} </span> 
                                   registros
                               </p>
                               {totalPages > 1 && (
                                   <Pagination
                                       currentPage={currentPage}
                                       totalPages={totalPages}
                                       onPageChange={handlePageChange}
                                   />
                               )}
                           </div>
                         </div>
                    )}
                    {!isLoading && activeView === 'dashboard' && <Dashboard records={dateFilteredRecords} />}
                </main>

                {isModalOpen && <PatientFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                    initialData={editingRecord}
                />}

                {isDetailModalOpen && detailRecord && <PatientDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={handleCloseDetailModal}
                    record={detailRecord}
                />}
                
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </div>
        </div>
    );
};

export default App;