import { useState, useEffect } from 'react';
import { Inspeccion } from '../utils/interfaces';
import { ultimaInspeccionPorPaquete } from '../services/inspecciones';
import { Badge } from "flowbite-react";
import { HiOutlineCalendar } from "react-icons/hi";

export const InformacionInspecciones = ({ uuid_parque_eolico }: { uuid_parque_eolico: string }) => {
    const [inspeccion, setInspeccion] = useState<Inspeccion | null>(null);

    useEffect(() => {
        const obtenerUltimaInspeccionPorParque = async () => {
            try {
                const response = await ultimaInspeccionPorPaquete(uuid_parque_eolico);
                console.log('Inspección obtenida:', response);
                setInspeccion(response);
            } catch (error) {
                console.error('Error al obtener la última inspección:', error);
            }
        };

        if (uuid_parque_eolico) {
            obtenerUltimaInspeccionPorParque();
        }
    }, [uuid_parque_eolico]);

    return (
        <div className="h-full w-full grid grid-cols-2 grid-rows-3 gap-2">
            {/* Div superior más delgado */}
            <div className="col-span-2  border-b border-gray-300 flex items-center">
                <h2 className="text-lg text-korsar-text-2">Inspecciones</h2>
            </div>

            {/* Información de las inspecciones */}
            <div className="flex flex-col items-center row-start-2 ">
                <span className="text-sm text-korsar-text-2 ">Fecha Inspección</span>
                <Badge
                    icon={() => <HiOutlineCalendar className="text-korsar-turquesa-viento w-5 h-5" />}
                    className="bg-korsar-turquesa-viento bg-opacity-25 text-korsar-azul-noche border border-korsar-turquesa-viento px-2"
                >
                    {inspeccion?.fecha_inspeccion}
                </Badge>
            </div>

            <div className="flex flex-col items-center row-start-2 ">
                <span className="text-sm text-korsar-text-2 ">Siguiente Fecha Inspección</span>
                <Badge
                    icon={() => <HiOutlineCalendar className="text-korsar-turquesa-viento w-5 h-5" />}
                    className="bg-korsar-turquesa-viento bg-opacity-25 text-korsar-azul-noche border border-korsar-turquesa-viento px-2"
                >
                    {inspeccion?.fecha_siguiente_inspeccion}
                </Badge>
            </div>

            {/* Div inferior más delgado */}
            <div className="col-span-2  row-start-3 border-t border-gray-300 flex items-center">
            </div>
        </div>
    );
}