
import React, { useEffect, useRef } from 'react';
import type { Chart } from 'chart.js';

interface ChartProps {
    labels: string[];
    data: number[];
}

const chartColors = [
    '#22d3ee', // cyan-400
    '#818cf8', // indigo-400
    '#f472b6', // pink-400
    '#fbbf24', // amber-400
    '#a78bfa', // violet-400
    '#34d399', // emerald-400
];

const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#d1d5db', // gray-300
                font: {
                    size: 12,
                }
            }
        }
    },
};

export const DoughnutChart: React.FC<ChartProps> = ({ labels, data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                chartRef.current = new (window as any).Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Pacientes',
                            data: data,
                            backgroundColor: chartColors,
                            borderColor: '#374151', // gray-700
                        }]
                    },
                    options: commonOptions,
                });
            }
        }
        return () => chartRef.current?.destroy();
    }, [data, labels]);

    return <div className="h-64"><canvas ref={canvasRef}></canvas></div>;
};


interface BarChartProps extends ChartProps {
    horizontal?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({ labels, data, horizontal = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                chartRef.current = new (window as any).Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Cantidad de Pacientes',
                            data: data,
                            backgroundColor: chartColors[0],
                            borderColor: chartColors[0],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        ...commonOptions,
                        indexAxis: horizontal ? 'y' : 'x',
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: { color: '#9ca3af' }, // gray-400
                                grid: { color: '#4b5563' } // gray-600
                            },
                            x: {
                                ticks: { color: '#9ca3af' }, // gray-400
                                grid: { color: '#4b5563' } // gray-600
                            }
                        },
                        plugins: {
                           ...commonOptions.plugins,
                           legend: {
                            display: false // Usually not needed for single-dataset bar charts
                           }
                        }
                    },
                });
            }
        }
        return () => chartRef.current?.destroy();
    }, [data, labels, horizontal]);

    return <div className="h-64"><canvas ref={canvasRef}></canvas></div>;
};
