import React, { useMemo } from 'react';
import type { PatientRecord } from '../types';
import { DoughnutChart, BarChart } from './Charts';

interface DashboardProps {
    records: PatientRecord[];
}

interface KpiCardProps {
    title: string;
    value: string | number;
    colorClasses: { bg: string; text: string };
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, colorClasses }) => (
    <div className={`${colorClasses.bg} p-6 rounded-lg shadow-lg`}>
        <h3 className="text-sm font-medium text-gray-400 uppercase">{title}</h3>
        <p className={`mt-2 text-3xl font-bold ${colorClasses.text}`}>{value}</p>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ records }) => {
    
    const stats = useMemo(() => {
        if (records.length === 0) {
            return {
                total: 0,
                avgAge: 0,
                genderDistribution: { Masculino: 0, Femenino: 0, Otro: 0 },
                biopsiesPerformed: 0,
                positiveTbCases: 0,
                malignancyCases: 0,
                outcomeData: { labels: [], data: [] },
                procedenciaData: { labels: [], data: [] },
                ageDistributionData: { labels: [], data: [] },
                genderChartData: { labels: [], data: [] },
            };
        }

        const totalAge = records.reduce((sum, record) => sum + record.EDAD, 0);
        
        const genderCounts = records.reduce((acc, record) => {
            acc[record.SEXO] = (acc[record.SEXO] || 0) + 1;
            return acc;
        }, { Masculino: 0, Femenino: 0, Otro: 0 });

        // FIX: The initial value for reduce must be typed, otherwise the return type is inferred as '{}'.
        const outcomeCounts = records.reduce((acc: Record<string, number>, record) => {
            const outcome = record.DESTINO_PACIENTE || 'No especificado';
            acc[outcome] = (acc[outcome] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const sortedOutcomes = Object.entries(outcomeCounts).sort(([, a], [, b]) => b - a);

        // FIX: The initial value for reduce must be typed, otherwise the return type is inferred as '{}'.
        const procedenciaCounts = records.reduce((acc: Record<string, number>, record) => {
            const procedencia = record.PROCEDENCIA || 'No especificada';
            acc[procedencia] = (acc[procedencia] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const sortedProcedencia = Object.entries(procedenciaCounts).sort(([, a], [, b]) => b - a);

        const ageBrackets = { '20-30': 0, '31-40': 0, '41-50': 0, '51-60': 0, '61-70': 0, '71+': 0 };
        records.forEach(record => {
            if (record.EDAD <= 30) ageBrackets['20-30']++;
            else if (record.EDAD <= 40) ageBrackets['31-40']++;
            else if (record.EDAD <= 50) ageBrackets['41-50']++;
            else if (record.EDAD <= 60) ageBrackets['51-60']++;
            else if (record.EDAD <= 70) ageBrackets['61-70']++;
            else ageBrackets['71+']++;
        });

        const biopsiesPerformed = records.filter(r => r.BIOPSIA === 'Sí').length;

        const positiveTbCases = records.filter(r => {
            const lavado = r.GENEXPERT_LAVADO.toLowerCase();
            const esputo = r.GENEXPERT_ESPUTO.toLowerCase();
            return lavado.includes('detected') || esputo.includes('detected');
        }).length;

        const malignancyKeywords = ['carcinoma', 'neoplasia', 'malignidad', 'adenocarcinoma', 'mets', 'metástasis'];
        const malignancyCases = records.filter(r => {
            const result = r.RESULTADO_BIOPSIA.toLowerCase();
            const diagnosis = r.DIAGNOSTICO.toLowerCase();
            return malignancyKeywords.some(keyword => result.includes(keyword) || diagnosis.includes(keyword));
        }).length;

        return {
            total: records.length,
            avgAge: Math.round(totalAge / records.length),
            genderDistribution: genderCounts,
            biopsiesPerformed,
            positiveTbCases,
            malignancyCases,
            outcomeData: {
                labels: sortedOutcomes.map(([label]) => label),
                data: sortedOutcomes.map(([, count]) => count)
            },
            procedenciaData: {
                labels: sortedProcedencia.map(([label]) => label),
                data: sortedProcedencia.map(([, count]) => count)
            },
            ageDistributionData: {
                labels: Object.keys(ageBrackets),
                data: Object.values(ageBrackets)
            },
            genderChartData: {
                labels: Object.keys(genderCounts),
                data: Object.values(genderCounts)
            }
        };
    }, [records]);

    if (records.length === 0) {
        return <p className="text-center text-gray-400 py-8">No hay datos suficientes para mostrar el dashboard.</p>;
    }

    const cardColors = [
        { bg: 'bg-cyan-900/50 border border-cyan-700/50', text: 'text-cyan-400' },
        { bg: 'bg-indigo-900/50 border border-indigo-700/50', text: 'text-indigo-400' },
        { bg: 'bg-pink-900/50 border border-pink-700/50', text: 'text-pink-400' },
        { bg: 'bg-amber-900/50 border border-amber-700/50', text: 'text-amber-400' },
        { bg: 'bg-emerald-900/50 border border-emerald-700/50', text: 'text-emerald-400' },
        { bg: 'bg-violet-900/50 border border-violet-700/50', text: 'text-violet-400' },
    ];

    const kpiData = [
        { title: "Total de Pacientes", value: stats.total },
        { title: "Promedio de Edad", value: `${stats.avgAge} años` },
        { title: "Sexo (M/F)", value: `${stats.genderDistribution.Masculino} / ${stats.genderDistribution.Femenino}` },
        { title: "Biopsias Realizadas", value: stats.biopsiesPerformed },
        { title: "Casos TB Positivos", value: stats.positiveTbCases },
        { title: "Diagnósticos de Malignidad", value: stats.malignancyCases }
    ];

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 {kpiData.map((kpi, index) => (
                    <KpiCard 
                        key={kpi.title}
                        title={kpi.title}
                        value={kpi.value}
                        colorClasses={cardColors[index % cardColors.length]}
                    />
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Procedencia del Paciente</h3>
                    <BarChart data={stats.procedenciaData.data} labels={stats.procedenciaData.labels} horizontal={true} />
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Destino del Paciente</h3>
                    <BarChart data={stats.outcomeData.data} labels={stats.outcomeData.labels} horizontal={true} />
                </div>
                 <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                     <h3 className="text-lg font-semibold text-gray-200 mb-4">Distribución por Edad</h3>
                     <BarChart data={stats.ageDistributionData.data} labels={stats.ageDistributionData.labels} />
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Distribución por Sexo</h3>
                    <DoughnutChart data={stats.genderChartData.data} labels={stats.genderChartData.labels} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;