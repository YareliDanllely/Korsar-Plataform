import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CantidadSeveridadesPorComponente } from '../utils/interfaces';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
    data: CantidadSeveridadesPorComponente;
    componente: string;
}

const DonutChartComponets: React.FC<DonutChartProps> = ({ data, componente }) => {
    const [chartData, setChartData] = useState({
        labels: ['Sin daño', 'Daño menor', 'Daño significativo', 'Daño mayor', 'Daño crítico'],
        datasets: [
            {
                label: `Estado de Daños en ${componente}`,
                data: [0, 0, 0, 0, 0],
                backgroundColor: ['#53AF0C', '#34B0AD', '#FCD023', '#FF9500', '#D9514E'],
                borderColor: ['#53AF0C', '#34B0AD', '#FCD023', '#FF9500', '#D9514E'],
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        const severidadesComponente = data[componente] || {};

        setChartData({
            labels: ['Sin daño', 'Daño menor', 'Daño significativo', 'Daño mayor', 'Daño crítico'],
            datasets: [
                {
                    label: `Estado de Daños en ${componente}`,
                    data: [
                        severidadesComponente['Sin daño'] || 0,
                        severidadesComponente['Menor'] || 0,
                        severidadesComponente['Significativo'] || 0,
                        severidadesComponente['Mayor'] || 0,
                        severidadesComponente['Crítico'] || 0,
                    ],
                    backgroundColor: ['#53AF0C', '#34B0AD', '#FCD023', '#FF9500', '#D9514E'],
                    borderColor: ['#53AF0C', '#34B0AD', '#FCD023', '#FF9500', '#D9514E'],
                    borderWidth: 1,
                },
            ],
        });
    }, [data, componente]);

    return (
        <div className="flex-grow  w-full max-w-full h-full flex items-center justify-center">
            <Doughnut
                data={chartData}
                options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                boxWidth: 12,
                                padding: 8,
                                font: {
                                    size: 10,
                                },
                                usePointStyle: true,
                                pointStyle: 'circle',
                            },
                        },
                    },
                    cutout: '50%',
                }}
            />
        </div>
    );
};

export default DonutChartComponets;
