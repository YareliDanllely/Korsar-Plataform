import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { ultimaInspeccionPorParque, cantidadSeveridadesPorComponentes } from "../services/inspecciones";
import { obtenerInformacionParque } from "../services/parquesEolicos";
import { obtenerAerogeneradores } from "../services/aerogeneradores";
import MapaParqueEolico from "../components/parquesEolicos/mapaAerogeneradores";
import DonutChartComponets from "../components/parquesEolicos/severidadComponentesGrafico";
import { InformacionAerogenerador } from "../components/parquesEolicos/InformacionAerogeneradors";
import { InformacionInspecciones } from "../components/parquesEolicos/informacionInspecciones";
import { Inspeccion, CantidadSeveridadesPorComponente, AerogeneradorConEstado, ParqueEolico } from "../utils/interfaces";
import {claseColores} from "../utils/colores";


const ParquesEolicos: React.FC = () => {
    const { uuid_parque_eolico } = useParams<{ uuid_parque_eolico: string }>();
    const [ultimaInspeccion, setUltimaInspeccion] = useState<Inspeccion | null>(null);
    const [severidadesData, setSeveridadesData] = useState<CantidadSeveridadesPorComponente | null>(null);
    const [informacionParqueEolico, setInformacionParqueEolico] = useState<ParqueEolico | null>(null);
    const [estadoAerogeneradores, setEstadoAerogeneradores] = useState<AerogeneradorConEstado[]>([]);
    const [aerogeneradorSeleccionado, setAerogeneradorSeleccionado] = useState<string | null>(null);


//-------------------------------------------------------------------------------//


    {/* OBTENER COLOR DE SEVERIDAD */}
    const obtenerColor = (number: number) => claseColores[number] || ""


//-------------------------------------------------------------------------------//


    {/* AEROGNERADOR ESCOGIDO: CAMBIO DINAMICO EN LA TABLA DESCRIPCION AEROGENERADORES */}
    const aerogeneradorEscogido = (uuid_aerogenerador: string) => {
        setAerogeneradorSeleccionado(uuid_aerogenerador);
    };

//-------------------------------------------------------------------------------//

    {/* OBTENER INFORMACIÓN DE LA ÚLTIMA INSPECCIÓN */}
    useEffect(() => {
          const obtenerUltimaInspeccion = async () => {
            if (!uuid_parque_eolico) return;
            try {
              console.log("uuid_parque_eolico", uuid_parque_eolico);
              const response = await ultimaInspeccionPorParque(uuid_parque_eolico);
              setUltimaInspeccion(response);
            } catch (error) {
              console.error("Error al obtener la última inspección:", error);
            }
          };

          obtenerUltimaInspeccion();
        }, [uuid_parque_eolico]);

//-------------------------------------------------------------------------------//


    {/* OBTENER INFORMACIÓN DEL PARQUE EÓLICO */}
    useEffect(() => {
      const obtenerInformacionParqueEolico = async () => {
        if (!uuid_parque_eolico) return;
        try {
          const response = await obtenerInformacionParque(uuid_parque_eolico);
          console.log("response 222", response);
          setInformacionParqueEolico(response);
        } catch (error) {
          console.error("Error al obtener el parque eólico:", error);
        }
      };

      obtenerInformacionParqueEolico();
    }, [uuid_parque_eolico]);

//-------------------------------------------------------------------------------//


    {/* OBTENER SEVERIDADES POR COMPONENTES */}
    useEffect(() => {
      const obtenerSeveridades = async () => {
        if (!ultimaInspeccion) return;

        try {
          const response: CantidadSeveridadesPorComponente = await cantidadSeveridadesPorComponentes(ultimaInspeccion.uuid_inspeccion);
          console.log("response 333", response);
          setSeveridadesData(response);
        } catch (error) {
          console.error("Error al obtener los datos de severidades:", error);
        }
      };

      obtenerSeveridades();
    }, [ultimaInspeccion]);


//-------------------------------------------------------------------------------//

    {/* OBTENER AEROGENERADORES CON ESTADO */}
    useEffect(() => {
      const obtenerAerogeneradoresConEstado = async () => {
        if (!ultimaInspeccion || !uuid_parque_eolico) return;

        try {
          const response = await obtenerAerogeneradores(uuid_parque_eolico, ultimaInspeccion.uuid_inspeccion);
          setEstadoAerogeneradores(response);
          console.log("response 444", response);

          // Seleccionar el primer aerogenerador por defecto si existen
          if (response.length > 0) {
            setAerogeneradorSeleccionado(response[0].uuid_aerogenerador);
          }
        } catch (error) {
          console.error("Error al obtener los aerogeneradores con estado:", error);
        }
      };

      obtenerAerogeneradoresConEstado();
    }, [uuid_parque_eolico, ultimaInspeccion]);



//-------------------------------------------------------------------------------//


    {/* MARCADORES PARA EL MAPA*/}
    const markers = estadoAerogeneradores.map((aero) => ({
      id: aero.uuid_aerogenerador,
      latitud: aero.coordenada_latitud,
      longitud: aero.coordenada_longitud,
      color: obtenerColor(aero.estado_final),
      size: 30,
      title: `A${aero.numero_aerogenerador}`,
      description: `Estado: ${aero.estado_final} `,
    }));


//-------------------------------------------------------------------------------//
    return (

      <div className="w-full flex items-center justify-center min-h-screen">
          <div className="w-full max-w-7xl space-y-7 p-10 h-full">

              {/* Título al inicio */}
              <div className="w-full text-start mb-6">
                  <h1 className="text-5xl font-light text-korsar-azul-noche mb-6">Monitoreo Parque Eólico</h1>
                  <p className="text-start text-2xl font-light text-gray-600 w-3/4">
                      Consulta detalles clave del parque, inspeccion reciente, anomalías y el estado general de los aerogeneradores.
                  </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 sm:grid-rows-4 gap-4">

                  <div className="sm:col-span-2 sm:row-span-2 bg-white shadow-lg rounded-lg">
                      {aerogeneradorSeleccionado && <InformacionAerogenerador uuid_aerogenerador={aerogeneradorSeleccionado} />}
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1 sm:row-start-3 bg-white shadow-lg rounded-lg p-2">
                      {uuid_parque_eolico && <InformacionInspecciones uuid_parque_eolico={uuid_parque_eolico} />}
                  </div>

                  <div className="sm:col-span-3 sm:row-span-3 sm:col-start-3 sm:row-start-1 bg-white shadow-lg rounded-lg">
                      <div className="h-[700px] w-full items-center justify-center p-10 rounded-md">
                          <h1 className="text-center text-2xl font-light text-korsar-text-1 mb-4">Mapa Aerogeneradores</h1>

                          {/* {informacionParqueEolico && (
                          <MapaParqueEolico
                              latitud_parque_eolico={informacionParqueEolico.coordenada_latitud}
                              longitud_parque_eolico={informacionParqueEolico.coordenada_longitud}
                              markers={markers}
                              onMarkerClick={aerogeneradorEscogido}
                          />
                          )} */}
                      </div>
                  </div>

                  <div className="sm:col-span-5 sm:row-start-4 bg-white shadow-lg rounded-lg p-2 h-auto">
                      {severidadesData && (
                          <div className="flex flex-col justify-start gap-1 h-full w-full">
                              <h3 className="text-center text-2xl font-light text-korsar-text-1 mb-4">
                                  Severidades por Componentes
                              </h3>

                              <div className="grid grid-cols-1 p-2 sm:grid-cols-4 justify-start gap-2 h-full w-full">
                                  <div>
                                      <h1 className="text-korsar-text-1 font-thin text-lg">Aspa Interna</h1>
                                      <DonutChartComponets data={severidadesData} componente="Aspa Interna" />
                                  </div>
                                  <div>
                                      <h1 className="text-korsar-text-1 font-thin text-lg">Aspa Externa</h1>
                                      <DonutChartComponets data={severidadesData} componente="Aspa Externa" />
                                  </div>
                                  <div>
                                      <h1 className="text-korsar-text-1 font-thin text-lg">Torre</h1>
                                      <DonutChartComponets data={severidadesData} componente="Torre" />
                                  </div>
                                  <div className="flex flex-col">
                                      <h1 className="text-korsar-text-1 font-thin text-lg">Nacelle/Hub</h1>
                                      <DonutChartComponets data={severidadesData} componente="Nacelle/Hub" />
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
  </div>













    );
};

export default ParquesEolicos;



// <div className="col-span-2 flex flex-col sm:flex-row items-start py-4 px-3">
// <div className="flex flex-col justify-between w-full">
//       <h1 className="text-3xl font-light text-korsar-azul-noche">Detalles de la Inspección</h1>
//     {inspeccionInformacion && (
//     <div className="flex flex-col gap-4">
//         <div>
//             <span className="text-lg text-korsar-text-1">Parque Eólico {inspeccionInformacion?.nombre_parque}</span>
//         </div>
//         <div>
//             <span className="text-lg text-korsar-text-1">Fecha: {inspeccionInformacion?.fecha_inspeccion}</span>
//         </div>

//         <div>
//             <span className="text-lg text-korsar-text-1">Progeso: {inspeccionInformacion?.progreso}</span>
//         </div>
//         <div>

//     </div>
//     </div>
//     )}

// </div>

// <div className="flex flex-col sm:flex-row justify-end w-full">
//         <Button
//           className="bg-korsar-verde-brillante rounded-2xl text-white"
//           onClick={() => {
//             confirmarTerminoInspeccion();
//           }}
//         >
//           Terminar Inspección
//         </Button>
// </div>
// </div>
// </div>
