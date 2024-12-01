import { useState, useEffect } from 'react';
import { ultimaInspeccionPorParque } from '../services/inspecciones';
import { useParams } from "react-router-dom";
import { AerogeneradorCarrusel } from '../components/inspecciones/carruselAerogeneradores';
import { obtenerAnomaliasPorAerogenerador } from '../services/anomalias';
import AnomaliasComponente from '../components/aerogeneradores/anomaliasComponentes';
import { Anomalia, ParqueEolico } from '../utils/interfaces';
import EstadoAerogeneradores from '../components/aerogeneradores/estadoAerogeneradores';
import { obtenerAerogeneradoresPorParque } from "../services/aerogeneradores";
import { obtenerParquesPorEmpresa } from '../services/parquesEolicos';
import { Aerogenerador } from "../utils/interfaces";

import { Button, Dropdown } from "flowbite-react";

interface AspasAnomalias {
  [key: string]: Anomalia[];
}

interface EstructuraAnomalias {
  torre: Anomalia[];
  nacelle: Anomalia[];
}


function Aerogeneradores() {
      const {uuid_empresa } = useParams<{ uuid_empresa: string }>();
      const [uuid_parque_eolico, setUuidParqueEolico] = useState<string | null>(null);
      const [ultimaInspeccion, setUltimaInspeccion] = useState<string | null>(null);
      const [aerogeneradoSeleccionado, setAerogeneradoSeleccionado] = useState<string | null>(null);
      const [tipoUsuario, setTipoUsuario] = useState<number | null>(null);
      const [empresa, setEmpresa] = useState<string | null>(null);
      const [parquesEolicos, setParquesEolicos] = useState<ParqueEolico[]>([]);
      const [aerogeneradores, setAerogeneradores] = useState<Aerogenerador[]>([]);
      const [aerogeneradorIndex, setAerogeneradorIndex] = useState<number>(0);
      const [aspasAnomalias, setAspasAnomalias] = useState<AspasAnomalias>({
        helice_a: [],
        helice_b: [],
        helice_c: []
      });
      const [estructuraAnomalias, setEstructuraAnomalias] = useState<EstructuraAnomalias>({
        torre: [],
        nacelle: []
      });


// -------------------------------------------------------------------------------------- //



      {/* OBTENER TIPO DE USUARIO */}
      useEffect(() => {
        setTipoUsuario(
          localStorage.getItem("tipo_usuario")
            ? parseInt(localStorage.getItem("tipo_usuario")!, 10)
            : null
        );
      },[]);



// -------------------------------------------------------------------------------------- //

      {/* OBTENER PARQUES EOLICOS */}
      useEffect(() => {
        const obtenerParques = async () => {
          try {
            if (uuid_empresa) {
              const response = await obtenerParquesPorEmpresa(uuid_empresa);
              setParquesEolicos(response);
              console.log("Parques eólicos:", response);

              if (response.length > 0) {
                setUuidParqueEolico(response[0].uuid_parque_eolico); // Seleccionar el primer parque por defecto
              }
            }
          } catch (error) {
            console.error("Error al obtener los parques eólicos:", error);
          }
        };

        obtenerParques();
      }, [empresa]);


// -------------------------------------------------------------------------------------- //

      {/* OBTENER AEROGENERADORES*/}
      useEffect(() => {
        const fetchAerogeneradores = async () => {
          try {
            if (uuid_parque_eolico) {
              const data = await obtenerAerogeneradoresPorParque(uuid_parque_eolico);
              setAerogeneradores(data);

              if (data.length > 0) {
                setAerogeneradoSeleccionado(data[0].uuid_aerogenerador); // Seleccionar el primer aerogenerador por defecto
              }
            }
          } catch (error) {
            console.error("Error al obtener los aerogeneradores:", error);
          }
        };

        fetchAerogeneradores();
      }, [uuid_parque_eolico]);




// -------------------------------------------------------------------------------------- //

       const colores: Record<number, string> = {
        1: "#E5E5E5",
        2: "#34B0AD",
        3: "#FCD023",
        4: "#FF9500",
        5: "#D9514E",
      };


      {/* OBTENER COLOR DE SEVERIDAD */}
      const obtenerColor = (number: number) => colores[number] || "";


// -------------------------------------------------------------------------------------- //

      {/* OBTENER EL NIVEL DE SEVERIDAD MÁS ALTO */}
      const getHighestSeverity = (anomalies: Anomalia[]): number => {
        if (anomalies.length === 0) return 1; // Si no hay anomalías, considera "Sin daño" (1)
        return Math.max(...anomalies.map(anomalia => anomalia.severidad_anomalia)); // Devuelve el mayor estado presente
      };




// -------------------------------------------------------------------------------------- //

      {/* OBTENER ANOMALÍAS DE UN AEROGENERADOR */}
      useEffect(() => {
        const obtenerAnomaliasAerogenerador = async () => {
          try {
            if (ultimaInspeccion && aerogeneradoSeleccionado) {
              const response = await obtenerAnomaliasPorAerogenerador(aerogeneradoSeleccionado, ultimaInspeccion);
              console.log("Anomalías del aerogenerador:", response);

              setAspasAnomalias({
                helice_a: response.helice_a || [],
                helice_b: response.helice_b || [],
                helice_c: response.helice_c || []
              });

              setEstructuraAnomalias({
                torre: response.torre || [],
                nacelle: response.nacelle || []
              });
            }
          } catch (error) {
            console.error("Error al obtener las anomalías:", error);
          }
        };

        if (aerogeneradoSeleccionado && ultimaInspeccion) {
          obtenerAnomaliasAerogenerador();
        }
      }, [ultimaInspeccion, aerogeneradoSeleccionado]);



// -------------------------------------------------------------------------------------- //

      {/* OBTENER ULTIMA INSPECCION DEL PARQUE EÓLICO */}
      useEffect(() => {
        const obtenerUltimaInspeccion = async () => {
          try {

            console.log("Parque eólico seleccionado:", uuid_parque_eolico);

            if (uuid_parque_eolico) {
              const response = await ultimaInspeccionPorParque(uuid_parque_eolico);
              console.log("Ultima inspección:", response);
              setUltimaInspeccion(response.uuid_inspeccion);
            }

          } catch (error) {
            console.error("Error al obtener la última inspección:", error);
          }
        };

        if (uuid_parque_eolico) {
          obtenerUltimaInspeccion();
        }
      }, [uuid_parque_eolico]);


// -------------------------------------------------------------------------------------- //

      {/* OBTENER COLORES DE LOS COMPONENTES BASADO EN EL MAYOR NIVEL DE DAÑO */}
      const damageColors = {
        torre: obtenerColor(getHighestSeverity(estructuraAnomalias.torre)) || "E5E5E5",
        heliceA: obtenerColor(getHighestSeverity(aspasAnomalias.helice_a)) || "E5E5E5",
        heliceB: obtenerColor(getHighestSeverity(aspasAnomalias.helice_b)) || "E5E5E5",
        heliceC: obtenerColor(getHighestSeverity(aspasAnomalias.helice_c))  || "E5E5E5",
        nacelle: obtenerColor(getHighestSeverity(estructuraAnomalias.nacelle))  || "E5E5E5"  };


  // -------------------------------------------------------------------------------------- //

      return (

          <div className="w-full flex items-center justify-center min-h-screen">
            <div className="w-full max-w-7xl space-y-7 p-10 h-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-4  gap-3 h-full">
                {/* Elemento 1 */}
                <div className="h-full bg-white shadow-lg rounded-lg">
                  <div className=" w-full h-full flex items-center justify-center">
                    {ultimaInspeccion && uuid_parque_eolico && (
                      <AerogeneradorCarrusel
                        uuid_inspeccion={ultimaInspeccion}
                        uuid_parque_eolico={uuid_parque_eolico}
                        cambioEstadoFinalAero={false}
                      />
                    )}
                  </div>
                </div>

                {/* Elemento 2 */}
                <div className="sm:row-span-2 h-full bg-white shadow-lg  rounded-lg">
                  <div className="w-auto h-auto justify-between">
                    <AnomaliasComponente cantidad={3} data={aspasAnomalias} />
                  </div>
                </div>

                {/* Elemento 3 */}
                <div className="sm:row-span-3 w-auto overflow-scroll bg-white shadow-lg">
                  <div className="w-full h-full flex flex-col p-5">
                    {/* Dropdowns arriba */}
                    <div className="h-auto w-auto flex flex-col sm:flex-row items-center justify-center gap-10 ">
                      <Dropdown label="Parques Eólicos" size="xs">
                        {parquesEolicos.map((parque) => (
                          <Dropdown.Item
                            key={parque.uuid_parque_eolico}
                            onClick={() => setUuidParqueEolico(parque.uuid_parque_eolico)}
                          >
                            {parque.nombre_parque}
                          </Dropdown.Item>
                        ))}
                      </Dropdown>

                      <Dropdown label="Aerogeneradores" size="xs">
                        {aerogeneradores.map((aerogenerador) => (
                          <Dropdown.Item
                            key={aerogenerador.uuid_aerogenerador}
                            onClick={() => setAerogeneradoSeleccionado(aerogenerador.uuid_aerogenerador)}
                          >
                            {aerogenerador.numero_aerogenerador}
                          </Dropdown.Item>
                        ))}
                      </Dropdown>
                    </div>

                    {/* Gráfico o componente */}
                    <div className="flex items-center justify-center h-full">
                      <div className="relative w-full h-[500px] max-w-full max-h-full overflow-hidden">
                        <EstadoAerogeneradores colores={damageColors} ancho="100%" alto="100%" />
                      </div>
                    </div>


                  </div>
                </div>

                {/* Elemento 6 */}
                <div className="sm:row-span-2 sm:col-start-2 sm:row-start-3 h-full bg-white shadow-lg rounded-lg">
                  <div className="w-auto h-auto justify-between">
                    <AnomaliasComponente cantidad={1} data={{ torre: estructuraAnomalias.torre }} />
                    <AnomaliasComponente cantidad={1} data={{ nacelle: estructuraAnomalias.nacelle }} />
                  </div>
                </div>
              </div>
            </div>
          </div>



      );
}

export default Aerogeneradores;
