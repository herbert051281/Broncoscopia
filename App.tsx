import React, { useState, useEffect, useCallback } from 'react';
import type { PatientRecord, NewPatientRecord } from './types';
import { fetchRecords, addRecord, updateRecord } from './services/api';
import PatientTable from './components/PatientTable';
import PatientFormModal from './components/PatientFormModal';
import Spinner from './components/Spinner';
import Toast from './components/Toast';
import Dashboard from './components/Dashboard';
import { PlusIcon, SearchIcon, ChartBarIcon, TableIcon } from './components/Icons';

type View = 'table' | 'dashboard';

const App: React.FC = () => {
    const [records, setRecords] = useState<PatientRecord[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingRecord, setEditingRecord] = useState<PatientRecord | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [activeView, setActiveView] = useState<View>('table');

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

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRecord(null);
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
    
    const filteredRecords = records.filter(record => {
        const dateMatch = (!startDate || record.FECHA >= startDate) &&
                          (!endDate || record.FECHA <= endDate);
        
        const searchMatch = record.NOMBRE.toLowerCase().includes(searchTerm.toLowerCase());

        return dateMatch && searchMatch;
    });


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
                        {/* View switcher */}
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
                
                <main>
                    {isLoading && <div className="flex items-center justify-center p-12"><Spinner /></div>}
                    {!isLoading && activeView === 'table' && (
                         <div className="bg-gray-800 shadow-2xl rounded-lg p-6 relative">
                            {/* Filters section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
                                <div className="md:col-span-2 lg:col-span-2">
                                     <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-1">Buscar por Nombre</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <SearchIcon />
                                        </div>
                                        <input
                                            type="text"
                                            id="search"
                                            placeholder="Buscar paciente..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                                            aria-label="Buscar paciente"
                                        />
                                    </div>
                                </div>
                            </div>
                           <PatientTable records={filteredRecords} onEdit={handleOpenEditModal} />
                         </div>
                    )}
                    {!isLoading && activeView === 'dashboard' && <Dashboard records={records} />}
                </main>

                {isModalOpen && <PatientFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                    initialData={editingRecord}
                />}
                
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </div>
        </div>
    );
};

export default App;