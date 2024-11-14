import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { AerogeneradorConEstado } from '../../utils/interfaces';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { obtenerAerogeneradores } from '../../services/aerogeneradores';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
    uuidParque: string;
    uuidInspeccion: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ uuidParque, uuidInspeccion }) => {
    const [data, setData] = useState({
        labels: ['Sin daño', 'Daño menor', 'Daño significativo', 'Daño mayor', 'Daño crítico'],
        datasets: [
            {
                label: 'Estado de Daños',
                data: [0, 0, 0, 0, 0], // Valores iniciales
                backgroundColor: ['#53AF0C', '#34B0AD', '#FCD023', '#FF9500', '#D9514E'],
                borderColor: ['#53AF0C', '#34B0AD', '#FCD023', '#FF9500', '#D9514E'],
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const response = await obtenerAerogeneradores(uuidParque, uuidInspeccion);
                const estados: AerogeneradorConEstado[] = response;

                // Contar el número de aerogeneradores por cada estado
                const conteoEstados = estados.reduce((acc: Record<number, number>, aerogenerador) => {
                    const estado = aerogenerador.estado_final;
                    acc[estado] = (acc[estado] || 0) + 1;
                    return acc;
                }, {});

                // Actualizar los datos para el gráfico
                setData({
                    labels: ['Sin daño', 'Daño menor', 'Daño significativo', 'Daño mayor', 'Daño crítico'],
                    datasets: [
                        {
                            label: 'Estado de Daños',
                            data: [
                                conteoEstados[1] || 0,  // Sin daño
                                conteoEstados[2] || 0,  // Daño menor
                                conteoEstados[3] || 0,  // Daño significativo
                                conteoEstados[4] || 0,  // Daño mayor
                                conteoEstados[5] || 0,  // Daño crítico
                            ],
                            backgroundColor: ['#53AF0C', '#34B0AD', '#FCD023', '#FF9500', '#D9514E'],
                            borderColor: ['#53AF0C', '#34B0AD', '#FCD023', '#FF9500', '#D9514E'],
                            borderWidth: 1,
                        },
                    ],
                });

            } catch (error) {
                console.error("Error al obtener los datos de estados:", error);
            }
        };

        obtenerDatos();
    }, [uuidParque, uuidInspeccion]);

    return (
        <div className="w-full flex items-center justify-center p-10" style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <Doughnut
            data={data}
            options={{
                maintainAspectRatio: false,
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
            style={{ width: '80%', height: '80%', maxWidth: '100%', maxHeight: '100%' }} // Ajusta el tamaño
        />
    </div>

    );
};

export default DonutChart;
