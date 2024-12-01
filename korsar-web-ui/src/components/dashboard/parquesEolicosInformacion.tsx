import React from 'react';
import { Badge } from 'flowbite-react';
import { HiOutlineCalendar } from 'react-icons/hi';
import DonutChart from './severidadInspeccionGrafico';
import { ParqueEolico, InspeccionFront } from '../../utils/interfaces';

interface ParqueEolicoListProps {
    parquesEolicos: ParqueEolico[];
    inspecciones: InspeccionFront[];
}

const ParqueEolicoList: React.FC<ParqueEolicoListProps> = ({ parquesEolicos, inspecciones }) => {
    return (
        <div className="w-full h-full flex">
            {parquesEolicos.map((parque) => {
                const inspeccion = inspecciones.find(i => i.uuid_parque_eolico === parque.uuid_parque_eolico);

                return (
                    <div key={parque.uuid_parque_eolico}
                        className='w-full h-full p-4 flex">
'
                    >

                        <h1 className="text-3xl text-korsar-text-1 font-light">
                            {parque.nombre_parque}
                        </h1>

                       {/* Línea superior */}
                        <div className="w-auto sm:w-full border-t mt-5 border-gray-300"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 justify-center items-stretch gap-4 h-full pt-6 p-2">
                            {/* Contenedor de Información */}
                            <div className="col-span-2 flex flex-col justify-center">
                                {/* Información del Parque */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center sm:items-stretch h-full">
                                    {/* Ubicación */}
                                    <div className="h-full flex flex-col items-center sm:items-stretch text-start">
                                        <h1 className="text-sm text-korsar-text-2">Ubicación</h1>
                                        <p className="text-sm text-korsar-negro-90 font-semibold">
                                            {parque.ubicacion_comuna}, {parque.ubicacion_region}
                                        </p>
                                    </div>

                                    {/* Potencia Instalada */}
                                    <div className="h-full flex flex-col  items-center sm:items-stretch text-start">
                                        <h1 className="text-sm text-korsar-text-2">Potencia Instalada</h1>
                                        <p className="text-sm text-korsar-negro-90 font-semibold">
                                            {parque.potencia_instalada} MW
                                        </p>
                                    </div>

                                    {/* Cantidad de Turbinas */}
                                    <div className="h-full flex flex-col  items-center sm:items-stretchtext-start">
                                        <h1 className="text-sm text-korsar-text-2">Cantidad de Turbinas</h1>
                                        <p className="text-sm text-korsar-negro-90 font-semibold">
                                            {parque.cantidad_turbinas}
                                        </p>
                                    </div>
                                </div>

                                {/* Línea divisoria */}
                                <div className="border-t border-gray-300 my-6"></div>

                                {/* Inspecciones */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="h-full flex flex-col justify-center items-center text-start">
                                        <h1 className="text-sm text-korsar-text-2 py-1">Última Inspección</h1>
                                        <Badge
                                            icon={() => (<HiOutlineCalendar className="text-korsar-turquesa-viento w-5 h-5" />)}
                                            className="bg-korsar-turquesa-viento bg-opacity-35 text-korsar-azul-noche border border-korsar-turquesa-viento p-2"
                                        >
                                            {inspeccion?.fecha_inspeccion || 'No disponible'}
                                        </Badge>
                                    </div>

                                    <div className="h-full flex flex-col justify-center items-center text-start">
                                        <h1 className="text-sm text-korsar-text-2">Próxima Inspección</h1>
                                        <Badge
                                            icon={() => (<HiOutlineCalendar className="text-korsar-turquesa-viento w-5 h-5" />)}
                                            className="bg-korsar-turquesa-viento bg-opacity-35 text-korsar-azul-noche border border-korsar-turquesa-viento p-2"
                                        >
                                            {inspeccion?.fecha_siguiente_inspeccion || 'No disponible'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Contenedor del DonutChart */}
                            <div className="flex flex-col justify-start items-start text-start border-t sm:border-t-0 sm:border-l border-gray-300 h-full">
                                <h1 className="text-sm text-korsar-text-2 px-3">Estado Última Inspección</h1>

                                    <div className="w-full h-full">
                                        <DonutChart
                                            uuidParque={parque.uuid_parque_eolico}
                                            uuidInspeccion={inspeccion?.uuid_inspeccion || ''}
                                        />
                                    </div>
                            </div>
                        </div>


                    </div>
                );
            })}
        </div>
    );
};

export default ParqueEolicoList;
