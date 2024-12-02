import { Dropdown, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { obtenerAerogeneradores } from "../../services/aerogeneradores";
import { obtenerComponentesAerogenerador } from "../../services/componentesAerogeneradores";
import { DragZone } from "./zonasDragDrop/dragZone";
import { Aerogenerador, ComponenteAerogenerador } from "../../utils/interfaces";

interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
}

interface MenuDesplegableAerogeneradoresProps {
  uuid_parque_eolico: string;
  uuid_inspeccion: string;
  setUuidTurbina: React.Dispatch<React.SetStateAction<string | null>>;
  setUuidComponente: React.Dispatch<React.SetStateAction<string | null>>;
  onCreateAnomalia: boolean;
  onDragStart: (imagen: Imagen) => void; // Notificar cuando se arrastra una imagen
}

export function MenuDesplegableAerogeneradores({
  uuid_parque_eolico,
  uuid_inspeccion,
  setUuidTurbina,
  setUuidComponente,
  onDragStart,
  onCreateAnomalia,
}: MenuDesplegableAerogeneradoresProps) {


  const [aerogeneradores, setAerogeneradores] = useState<Aerogenerador[]>([]);
  const [componentes, setComponentes] = useState<ComponenteAerogenerador[]>([]);
  const [selectedAerogenerador, setSelectedAerogenerador] = useState<Aerogenerador | null>(null);
  const [selectedComponente, setSelectedComponente] = useState<ComponenteAerogenerador | null>(null);


  const TIPO_COMPONENTE_MAP: Record<string, string> = {
    helice_a: "Hélice A",
    helice_b: "Hélice B",
    helice_c: "Hélice C",
    torre: "Torre",
    nacelle: "Nacelle/Hub",
  };


  useEffect(() => {
    const fetchAerogeneradores = async () => {
      const data = await obtenerAerogeneradores(
        uuid_parque_eolico,
        uuid_inspeccion
      );
      setAerogeneradores(data);
      if (data.length > 0) {
        setSelectedAerogenerador(data[0]);
        setUuidTurbina(data[0].uuid_aerogenerador);
      }
    };
    fetchAerogeneradores();
  }, [uuid_parque_eolico, uuid_inspeccion]);

  useEffect(() => {
    const fetchComponentes = async () => {
      if (selectedAerogenerador) {
        const data = await obtenerComponentesAerogenerador(
          selectedAerogenerador.uuid_aerogenerador
        );
        setComponentes(data);
        if (data.length > 0) {
          setSelectedComponente(data[0]);
          setUuidComponente(data[0].uuid_componente);
        }
      }
    };
    fetchComponentes();
  }, [selectedAerogenerador, uuid_inspeccion]);

  return (
    <div className="flex flex-col gap-2">
      {/* Dropdown de Aerogeneradores */}
      <div className="flex items-start justify-start gap-5 flex-wrap">
        <Dropdown
          label={
            selectedAerogenerador
              ? `Aerogenerador: ${selectedAerogenerador.numero_aerogenerador}`
              : "Seleccione Aerogenerador"
          }
          size="xs"
        >
          {aerogeneradores.map((aero) => (
            <Dropdown.Item
              key={aero.uuid_aerogenerador}
              onClick={() => {
                setSelectedAerogenerador(aero);
                setUuidTurbina(aero.uuid_aerogenerador);
              }}
              className="text-sm"
            >
              Número Aerogenerador: {aero.numero_aerogenerador}
            </Dropdown.Item>
          ))}
        </Dropdown>

        {/* Dropdown de Componentes */}
        <Dropdown
          label={
            selectedComponente
              ? `Componente: ${TIPO_COMPONENTE_MAP[selectedComponente.tipo_componente]}`
              : "Seleccione Componente"
          }
          size="xs"
        >
          {componentes.map((componente) => (
            <Dropdown.Item
              key={componente.uuid_componente}
              onClick={() => {
                setSelectedComponente(componente);
                setUuidComponente(componente.uuid_componente);
              }}
              className="text-sm"
            >
              Tipo Componente: {TIPO_COMPONENTE_MAP[componente.tipo_componente]}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>

      {/* Carrusel de Imágenes (DragZone) */}
      {selectedAerogenerador && selectedComponente && (
        <div className="w-full flex justify-center items-center mt-4 p-10 py-10">
          <DragZone
            uuid_aerogenerador={selectedAerogenerador.uuid_aerogenerador}
            uuid_componente={selectedComponente.uuid_componente}
            uuid_inspeccion={uuid_inspeccion}
            onDragStart={onDragStart} // Notificar al padre que una imagen fue arrastrada
            onCreateAnomalia={onCreateAnomalia}
          />
        </div>
      )}
    </div>
  );
}
