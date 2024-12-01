import { Accordion } from "flowbite-react";
import { Anomalia } from "../../utils/interfaces";

/**
 * Propiedades para el componente `AnomaliasComponente`
 * @interface AnomaliasComponenteProps
 * @property {number} cantidad - Cantidad máxima de partes a mostrar.
 * @property {{ [key: string]: Anomalia[] }} data - Datos de anomalías agrupados por parte.
 */
interface AnomaliasComponenteProps {
  cantidad: number;
  data: { [key: string]: Anomalia[] };
}

/**
 * Componente para visualizar anomalías por componente de una hélice.
 *
 * Este componente muestra las condiciones de las partes de una hélice (por ejemplo, aspas internas/externas)
 * y organiza las anomalías relacionadas utilizando un acordeón para cada parte.
 *
 * @param {AnomaliasComponenteProps} props - Propiedades del componente.
 * @returns {JSX.Element} Un contenedor con las anomalías organizadas por parte.
 */
const AnomaliasComponente: React.FC<AnomaliasComponenteProps> = ({ cantidad, data }) => {

  // Obtiene las primeras `cantidad` claves de las partes disponibles en los datos
  const partes = Object.keys(data).slice(0, cantidad);

  return (
    <div className="h-full w-full bg-white p-10 rounded-lg overflow-hidden">

      {/* Contenedor principal que varía según la cantidad de partes */}
      <div className={`grid gap-8 ${partes.length === 1 ? "grid-cols-1" : "grid-cols-2"} overflow-auto`}>
        {partes.map((parte) => (
          <div
            key={parte}
            className="text-center p-2 rounded-lg border overflow-hidden h-full"
          >
            {/* Título de la parte actual */}
            <h3 className="text-2xl font-light  text-korsar-negro-90  capitalize">
              {parte.replace("_", " ")} {/* Reemplaza los guiones bajos con espacios */}
            </h3>

            {/* Contenedor de las anomalías */}
            <div className="mt-2 h-full overflow-auto">
              <Accordion collapseAll>
                {/* Panel del acordeón */}
                <Accordion.Panel className="my-4">
                  {/* Título del acordeón que indica el estado de la parte */}
                  <Accordion.Title className="text-base font-semibold">
                    <p className={`${data[parte].length ? "text-korsar-naranja-sol" : "text-korsar-verde-brillante"}   `}>
                      {data[parte].length ? "Dañada" : "Sin Daños"}
                    </p>
                  </Accordion.Title>
                  {/* Contenido del acordeón */}
                  <Accordion.Content>
                    {data[parte].length ? (
                      // Muestra la lista de anomalías si existen
                      data[parte].map((anomalia, idx) => (
                        <div key={idx} className="mt-1 text-left text-xs">
                          <p className="font-semibold">Detalles del daño:</p>
                          <p>Descripción: {anomalia.descripcion_anomalia}</p>
                          <p>Severidad: {anomalia.severidad_anomalia}</p>
                        </div>
                      ))
                    ) : (
                      // Mensaje si no hay anomalías
                      <p className="mt-2 text-left text-xs">Sin daño</p>
                    )}
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnomaliasComponente;
