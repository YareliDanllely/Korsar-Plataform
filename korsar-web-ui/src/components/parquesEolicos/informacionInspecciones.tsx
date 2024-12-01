import { useState, useEffect } from 'react';
import { Inspeccion } from '../../utils/interfaces';
import { ultimaInspeccionPorParque } from '../../services/inspecciones';
import { Badge } from "flowbite-react";
import { HiOutlineCalendar } from "react-icons/hi";

export const InformacionInspecciones = ({ uuid_parque_eolico }: { uuid_parque_eolico: string }) => {
    const [inspeccion, setInspeccion] = useState<Inspeccion | null>(null);

    useEffect(() => {
        const obtenerUltimaInspeccionPorParque = async () => {
            try {
                const response = await ultimaInspeccionPorParque(uuid_parque_eolico);
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
        <div className="h-full w-full grid grid-cols-2 grid-rows-3 gap-2" style={{ gridTemplateRows: '50px 1fr 50px', gridTemplateColumns: '1fr 1fr' }}>
            {/* Div superior más delgado */}
            <div className="col-span-2 border-b border-gray-300 flex items-center">
                <h2 className="text-xl px-2 font-light text-korsar-negro-90">Inspecciones</h2>
            </div>

            {/* Información de las inspecciones */}
            <div className="flex flex-col items-center justify-center row-start-2">
                <h1 className="text-sm text-korsar-text-2">Fecha Inspección</h1>
                <Badge
                    icon={() => <HiOutlineCalendar className="text-korsar-turquesa-viento w-5 h-5" />}
                    className="mt-2 bg-korsar-turquesa-viento bg-opacity-25 text-korsar-azul-noche border border-korsar-turquesa-viento px-2"
                >
                    {inspeccion?.fecha_inspeccion}
                </Badge>
            </div>

            <div className="flex flex-col items-center justify-center row-start-2">
                <h1 className="text-sm text-korsar-text-2">Siguiente Fecha Inspección</h1>
                <Badge
                    icon={() => <HiOutlineCalendar className="text-korsar-turquesa-viento w-5 h-5" />}
                    className="mt-2 bg-korsar-turquesa-viento bg-opacity-25 text-korsar-azul-noche border border-korsar-turquesa-viento px-2"
                >
                    {inspeccion?.fecha_siguiente_inspeccion}
                </Badge>
            </div>

            {/* Div inferior más delgado */}
            <div className="col-span-2 row-start-3 border-t border-gray-300 flex items-center">
            </div>
        </div>
    );
}
