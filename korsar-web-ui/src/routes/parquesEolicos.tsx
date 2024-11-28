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
    const obtenerColor = (number: number) => claseColores[number] || "";


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
      <div className="w-full h-screen overflow-y-auto flex justify-center items-start">
        <div
          className="w-full max-w-6xl grid grid-cols-5 gap-4 p-10"
          style={{
            gridTemplateRows: "1fr 0.5fr 0.5fr",
            gridTemplateColumns: "1fr 1.5fr 2fr 1fr 1fr",
          }}
        >
          <div className="col-span-2 bg-white shadow-md rounded-lg">
              {aerogeneradorSeleccionado &&
              <InformacionAerogenerador uuid_aerogenerador={aerogeneradorSeleccionado} />
              }
          </div>

          <div className="col-span-2 col-start-1 row-start-2 bg-white shadow-md rounded-lg p-4">
              {uuid_parque_eolico && <InformacionInspecciones uuid_parque_eolico={uuid_parque_eolico} />}
          </div>

          <div className="col-span-3 row-span-2 col-start-3 row-start-1 bg-white shadow-md rounded-lg p-4">
            {/* <div className="h-[600px] w-full">
              {informacionParqueEolico && (
                <MapaParqueEolico
                  latitud_parque_eolico={informacionParqueEolico.coordenada_latitud}
                  longitud_parque_eolico={informacionParqueEolico.coordenada_longitud}
                  markers={markers}
                  onMarkerClick={aerogeneradorEscogido}
                />
              )}
            </div> */}
          </div>

          <div className="col-span-5 row-start-3 grid grid-cols-4 gap-4">
            {severidadesData && (
              <>
                <DonutChartComponets data={severidadesData} componente="Aspa Interna" />
                <DonutChartComponets data={severidadesData} componente="Aspa Externa" />
                <DonutChartComponets data={severidadesData} componente="Nacelle/Hub" />
                <DonutChartComponets data={severidadesData} componente="Torre" />
              </>
            )}
          </div>
        </div>
      </div>
    );
};

export default ParquesEolicos;
