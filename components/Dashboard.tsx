import React, { useMemo } from 'react';
import type { PatientRecord } from '../types';
import { DoughnutChart, BarChart } from './Charts';

interface DashboardProps {
    records: PatientRecord[];
}

const KpiCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-sm font-medium text-gray-400 uppercase">{title}</h3>
        <p className="mt-2 text-3xl font-bold text-cyan-400">{value}</p>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
    
    const stats = useMemo(() => {
        if (records.length === 0) {
            return {
                total: 0,
                avgAge: 0,
                genderDistribution: { Masculino: 0, Femenino: 0, Otro: 0 },
                outcomeData: { labels: [], data: [] },
                topDiagnosesData: { labels: [], data: [] },
                ageDistributionData: { labels: [], data: [] },
            };
        }

        const totalAge = records.reduce((sum, record) => sum + record.EDAD, 0);
        
        const genderCounts = records.reduce((acc, record) => {
            acc[record.SEXO] = (acc[record.SEXO] || 0) + 1;
            return acc;
        }, { Masculino: 0, Femenino: 0, Otro: 0 });

        const outcomeCounts = records.reduce((acc, record) => {
            const outcome = record.DESTINO_PACIENTE || 'No especificado';
            acc[outcome] = (acc[outcome] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // FIX: The generic argument on `reduce` was causing a type error. By removing
        // it and instead casting the initial accumulator value to `Record<string, number>`,
        // `diagnosisCounts` is correctly typed, resolving the downstream arithmetic error.
        const diagnosisCounts = records.reduce((acc, record) => {
            const diagnosis = record.DIAGNOSTICO || 'No especificado';
            acc[diagnosis] = (acc[diagnosis] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topDiagnoses = Object.entries(diagnosisCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const ageBrackets = { '20-30': 0, '31-40': 0, '41-50': 0, '51-60': 0, '61-70': 0, '71+': 0 };
        records.forEach(record => {
            if (record.EDAD <= 30) ageBrackets['20-30']++;
            else if (record.EDAD <= 40) ageBrackets['31-40']++;
            else if (record.EDAD <= 50) ageBrackets['41-50']++;
            else if (record.EDAD <= 60) ageBrackets['51-60']++;
            else if (record.EDAD <= 70) ageBrackets['61-70']++;
            else ageBrackets['71+']++;
        });

        return {
            total: records.length,
            avgAge: Math.round(totalAge / records.length),
            genderDistribution: genderCounts,
            outcomeData: {
                labels: Object.keys(outcomeCounts),
                data: Object.values(outcomeCounts)
            },
            topDiagnosesData: {
                labels: topDiagnoses.map(item => item[0]),
                data: topDiagnoses.map(item => item[1])
            },
            ageDistributionData: {
                labels: Object.keys(ageBrackets),
                data: Object.values(ageBrackets)
            }
        };
    }, [records]);

    if (records.length === 0) {
        return <p className="text-center text-gray-400 py-8">No hay datos suficientes para mostrar el dashboard.</p>;
    }

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="Total de Pacientes" value={stats.total} />
                <KpiCard title="Promedio de Edad" value={`${stats.avgAge} años`} />
                <KpiCard title="Sexo (M/F)" value={`${stats.genderDistribution.Masculino} / ${stats.genderDistribution.Femenino}`} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Destino del Paciente</h3>
                    <DoughnutChart data={stats.outcomeData.data} labels={stats.outcomeData.labels} />
                </div>
                <div className="lg:col-span-3 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Top 5 Diagnósticos</h3>
                    <BarChart data={stats.topDiagnosesData.data} labels={stats.topDiagnosesData.labels} horizontal={true} />
                </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                 <h3 className="text-lg font-semibold text-gray-200 mb-4">Distribución por Edad</h3>
                 <BarChart data={stats.ageDistributionData.data} labels={stats.ageDistributionData.labels} />
            </div>
        </div>
    );
};

export default Dashboard;