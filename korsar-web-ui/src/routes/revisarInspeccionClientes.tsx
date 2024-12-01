import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { obtenerInspeccionPorUuid } from '../services/inspecciones';
import { Inspeccion, Anomalia, ImagenAnomaliaFront, Aerogenerador, ComponenteAerogenerador } from '../utils/interfaces';
import {obtenerAerogeneradoresPorParque} from '../services/aerogeneradores';
import { obtenerAnomaliasFiltradas } from '../services/anomalias';
import {obtenerComponentesAerogenerador} from '../services/componentesAerogeneradores';
import {obtenerImagenesAnomalia} from '../services/imagenesAnomalia';
import { Dropdown, Button } from "flowbite-react";
import VisualizadorAnomalias from '../components/inspecciones/visualizadorAnomalias';
import DetalleAnomalia from '../components/inspecciones/detalleAnomalia';
import { AerogeneradorCarrusel } from '../components/inspecciones/carruselAerogeneradores';
import CarruselImagenes from '../components/inspecciones/carruselImagenes';


const RevisarInspeccionClientes: React.FC = () => {
    const { uuid_inspeccion, uuid_parque } = useParams<{ uuid_inspeccion: string; uuid_parque: string }>();
    const [inspeccionInformacion, setInspeccionInformacion] = useState<Inspeccion | null>(null);
    const [anomaliasInspeccion, setAnomaliasInspeccion] = useState<Anomalia[]>([]);
    const [imagenesAnomalia, setImagenesAnomalia] = useState<ImagenAnomaliaFront[]>([]);
    const [aerogeneradoresInspeccion, setAerogeneradoresInspeccion] = useState<Aerogenerador[]>([]);
    const [componentesAerogenerador, setComponentesAerogenerador] = useState<ComponenteAerogenerador[]>([]);

    const [aerogeneradorSeleccionado, setAerogeneradorSeleccionado] = useState<Aerogenerador>();
    const [componenteSeleccionado, setComponenteSeleccionado] = useState<ComponenteAerogenerador>();


    const [anomaliaSeleccionada, setAnomaliaSeleccionada] = useState<string | null>(null);
    const [anomaliaSeleccionadaInformacion, setAnomaliaSeleccionadaInformacion] = useState<Anomalia | null>(null);


//-----------------------------------------------------------------------------------------------//

    {/* OBTENER ANOMALÍAS DE LA INSPECCIÓN */}
    const seleccionAnomalia = (uuid_anomalia: string) => {
        setAnomaliaSeleccionada(uuid_anomalia);
    }



//-----------------------------------------------------------------------------------------------//

    {/* ASOCIAR DATOS DE LA ANOMALÍA SELECCIONADA */}
    useEffect(() => {
        const informacionAnomaliaSeleccionada = () => {
            const anomalia = anomaliasInspeccion.find((anomalia) => anomalia.uuid_anomalia === anomaliaSeleccionada);
            if (anomalia) {
                setAnomaliaSeleccionadaInformacion(anomalia);
            }
        }
        informacionAnomaliaSeleccionada();
    }, [anomaliaSeleccionada, anomaliasInspeccion]);

//-----------------------------------------------------------------------------------------------//

      {/* OBTENER INFORMACIÓN DE LA INSPECCIÓN */}
      useEffect(() => {
        if (uuid_inspeccion) {
          const fetchInspeccion = async () => {
            try {
              const inspeccionData = await obtenerInspeccionPorUuid(uuid_inspeccion);
              setInspeccionInformacion(inspeccionData);
            } catch (error) {
              console.error("Error al obtener la inspección:", error);
            }
          };

          fetchInspeccion();
        }
      }, [uuid_inspeccion,]);


//--------------------------------------------------------------------------------------------

      {/* OBTENER AEROGENERADORES DE LA INSPECCIÓN */}
      useEffect(() => {
        if (uuid_parque) {
          const fetchAerogeneradores = async () => {
            try {
              const aerogeneradoresData = await obtenerAerogeneradoresPorParque(uuid_parque);
              setAerogeneradoresInspeccion(aerogeneradoresData);

                if (aerogeneradoresData.length > 0) {
                    setAerogeneradorSeleccionado(aerogeneradoresData[0]);
                }


            } catch (error) {
              console.error("Error al obtener los aerogeneradores:", error);
            }
          };

          fetchAerogeneradores();
        }
      }, [uuid_parque]);


//--------------------------------------------------------------------------------------------

        {/* OBTENER COMPONENTES DE LOS AEROGENERADORES */}
        useEffect(() => {
            if (aerogeneradorSeleccionado) {
                const fetchComponentes = async () => {
                try {
                    const componentesData = await obtenerComponentesAerogenerador(aerogeneradorSeleccionado.uuid_aerogenerador);
                    setComponentesAerogenerador(componentesData);

                    if (componentesData.length > 0) {
                        setComponenteSeleccionado(componentesData[0]);
                    }


                } catch (error) {
                    console.error("Error al obtener los componentes del aerogenerador:", error);
                }
                };

                fetchComponentes();
            };
            }, [aerogeneradorSeleccionado]);

//--------------------------------------------------------------------------------------------//

        {/* OBTENER ANOMALÍAS FILTRADAS*/}

        const fetchAnomalias = async () => {
            if (aerogeneradorSeleccionado && componenteSeleccionado && uuid_inspeccion) {
                try {
                    const anomaliasData = await obtenerAnomaliasFiltradas(aerogeneradorSeleccionado.uuid_aerogenerador,componenteSeleccionado?.uuid_componente,uuid_inspeccion);
                    setAnomaliasInspeccion(anomaliasData);
                if (anomaliasData.length > 0) {
                    setAnomaliaSeleccionada(anomaliasData[0].uuid_anomalia);
                    setAnomaliaSeleccionadaInformacion(anomaliasData[0]);
                }

                    console.log('Anomalias:', anomaliasData);
                } catch (error) {
                    console.error("Error al obtener las anomalías:", error);
                }
            }
        };


//--------------------------------------------------------------------------------------------//

        {/* OBTENER IMÁGENES DE LAS ANOMALÍAS */}
        useEffect(() => {
            if (anomaliaSeleccionada) {
                const fetchImagenes = async () => {
                try {
                    console.log('Anomalia Seleccionada:', anomaliaSeleccionada);
                        const imagenesData = await obtenerImagenesAnomalia(anomaliaSeleccionada);
                        setImagenesAnomalia(imagenesData);
                        console.log('Imagenes Anomalia:', imagenesData);
                } catch (error) {
                    console.error("Error al obtener las imágenes de las anomalías:", error);
                }
                };

                fetchImagenes();
            };
            }, [anomaliaSeleccionada]);



//--------------------------------------------------------------------------------------------//

    useEffect(() => {
        fetchAnomalias();
    }, [componenteSeleccionado]);


    return (
<div className="w-full flex items-center justify-center min-h-screen">
  <div className="w-full max-w-7xl space-y-7 p-10 h-full">

    <div className="grid grid-cols-1 sm:grid-cols-4 sm:grid-rows-7 gap-4 h-full">

        {/* Detalles de la Inspección */}
        <div className="sm:col-span-4">
            <div className="p-4">
                <h1 className="text-5xl font-light text-korsar-azul-noche">Detalles de la Inspección</h1>
                {inspeccionInformacion && (
                <div className="flex flex-col gap-4">
                    <div>
                        <span className="text-lg text-korsar-text-1">Parque Eólico {inspeccionInformacion?.nombre_parque}</span>
                    </div>
                    <div>
                        <span className="text-lg text-korsar-text-1">Fecha: {inspeccionInformacion?.fecha_inspeccion}</span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mt-1">
                        Esta sección muestra un resumen de la última inspección realizada.
                    </p>
                 </div>
                </div>
                )}
            </div>
        </div>




      {/* Aerogenerador Carrusel */}
      <div className="sm:col-span-2 sm:row-start-2 rounded-lg shadow-md p-4 flex items-center justify-center">
                <AerogeneradorCarrusel
                uuid_inspeccion={uuid_inspeccion || ''}
                uuid_parque_eolico={uuid_parque || ''}
                />
      </div>

      {/* Detalles de la Anomalía */}
      <div className=" sm:col-span-2 sm:row-span-4 sm:col-start-1 sm:row-start-3 rounded-lg shadow-md p-4">
                    <h1 className="text-3xl font-light text-korsar-azul-noche mb-4">Detalles de la Anomalía</h1>
                    {anomaliaSeleccionadaInformacion && (
                    <>
                        {/* Dropdowns */}
                        <div className="flex flex-wrap gap-2 mb-4">
                        <Dropdown
                            label={
                            aerogeneradorSeleccionado
                                ? `Aerogenerador: ${aerogeneradorSeleccionado.numero_aerogenerador}`
                                : 'Seleccione Aerogenerador'
                            }
                            size="xs"
                        >
                            {aerogeneradoresInspeccion.map((aero) => (
                            <Dropdown.Item
                                key={aero.numero_aerogenerador}
                                onClick={() => setAerogeneradorSeleccionado(aero)}
                                className="text-sm"
                            >
                                Número Aerogenerador: {aero.numero_aerogenerador}
                            </Dropdown.Item>
                            ))}
                        </Dropdown>

                        <Dropdown
                            label={
                            componenteSeleccionado
                                ? `Componente: ${componenteSeleccionado.tipo_componente}`
                                : 'Seleccione Componente'
                            }
                            size="xs"
                        >
                            {componentesAerogenerador.map((componente) => (
                            <Dropdown.Item
                                key={componente.uuid_componente}
                                onClick={() => setComponenteSeleccionado(componente)}
                                className="text-sm"
                            >
                                Tipo Componente: {componente.tipo_componente}
                            </Dropdown.Item>
                            ))}
                        </Dropdown>
                        </div>

                        {/* Visualizador de Anomalías */}
                        <div className="mt-4">
                        <VisualizadorAnomalias
                            anomalias={anomaliasInspeccion}
                            anomaliaSeleccionada={seleccionAnomalia}
                        />
                        </div>
                    </>
                    )}
             </div>

             <div className="sm:col-span-2 sm:row-span-5 sm:col-start-3 sm:row-start-2 rounded-lg shadow-md p-4 ">

                       <div className='flex flex-col gap-10'>
                                <div className='flex flex-row justify-between items-center'>
                                        <h1 className="text-3xl font-light text-korsar-azul-noche">Detalles de la Anomalía</h1>
                                        {anomaliaSeleccionadaInformacion && (
                                        <h2 className="text-xl text-korsar-text-1">{anomaliaSeleccionadaInformacion.codigo_anomalia}</h2>
                                    )}
                                </div>
                         <div >
                            <h1 className="text-2xl font-medium text-korsar-azul-noche">Imágenes</h1>
                            <CarruselImagenes
                                imagenes={imagenesAnomalia}
                            />
                         </div>

                         <div className='p-5' >
                            {anomaliaSeleccionadaInformacion  && (
                                <DetalleAnomalia
                                    informacionAnomalia={anomaliaSeleccionadaInformacion}
                                />
                                )}
                         </div>
                     </div>


             </div>


    </div>
  </div>
</div>



      );
};

export default RevisarInspeccionClientes;
