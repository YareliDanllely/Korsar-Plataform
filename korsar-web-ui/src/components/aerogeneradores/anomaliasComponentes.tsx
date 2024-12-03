import { useState } from "react";
import { Accordion } from "flowbite-react";
import { Anomalia } from "../../utils/interfaces";

interface AnomaliasComponenteProps {
  cantidad: number;
  data: { [key: string]: Anomalia[] };
}

const AnomaliasComponente: React.FC<AnomaliasComponenteProps> = ({ cantidad, data }) => {
  const partes = Object.keys(data).slice(0, cantidad);

  // Estado para controlar la página actual por cada parte
  const [paginaActual, setPaginaActual] = useState<{ [key: string]: number }>(
    partes.reduce((acc, parte) => ({ ...acc, [parte]: 0 }), {})
  );

  // Función para cambiar de página
  const cambiarPagina = (parte: string, direccion: "prev" | "next") => {
    setPaginaActual((prev) => ({
      ...prev,
      [parte]:
        direccion === "prev"
          ? Math.max(0, prev[parte] - 1)
          : Math.min(Math.ceil(data[parte].length / 3) - 1, prev[parte] + 1),
    }));
  };

  return (
    <div className="h-full w-full bg-white p-10 rounded-lg overflow-hidden">
      <div className={`grid gap-8 ${partes.length === 1 ? "grid-cols-1" : "grid-cols-2"} overflow-auto`}>
        {partes.map((parte) => {
          const totalPaginas = Math.ceil(data[parte].length / 3);
          const inicio = paginaActual[parte] * 3;
          const fin = inicio + 3;
          const anomalíasPaginadas = data[parte].slice(inicio, fin);

          return (
            <div key={parte} className="text-center p-2 rounded-lg border overflow-hidden h-full">
              <h3 className="text-2xl font-light text-korsar-negro-90 capitalize">
                {parte.replace("_", " ")}
              </h3>

              <div className="mt-2 h-full overflow-auto">
                <Accordion collapseAll>
                  <Accordion.Panel className="my-4">
                    <Accordion.Title className="text-base font-semibold">
                      <p
                        className={`${
                          data[parte].length ? "text-korsar-naranja-sol" : "text-korsar-verde-brillante"
                        }`}
                      >
                        {data[parte].length ? "Dañada" : "Sin Daños"}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content>
                      {anomalíasPaginadas.length ? (
                        anomalíasPaginadas.map((anomalia, idx) => (
                          <div key={idx} className="mt-1 text-left text-xs p-2">
                            <p className="font-semibold text-sm text-korsar-azul-noche mb-2">Detalles del daño</p>
                            <p>
                              <span className="font-medium">Descripción:</span> <span className="font-extralight">{anomalia.descripcion_anomalia}</span>
                            </p>
                            <p>
                              <span className="font-semibold">Severidad:</span> {anomalia.severidad_anomalia}
                            </p>

                          </div>
                        ))
                      ) : (
                        <p className="mt-2 text-left text-xs">Sin daño</p>
                      )}
                      {/* Controles de paginación */}
                      {totalPaginas > 1 && (
                        <div className="flex justify-between items-center mt-4">
                          <button
                            className="text-xs px-2 py-1 border rounded disabled:opacity-50"
                            disabled={paginaActual[parte] === 0}
                            onClick={() => cambiarPagina(parte, "prev")}
                          >
                            Anterior
                          </button>
                          <p className="text-xs">
                          </p>
                          <button
                            className="text-xs px-2 py-1 border rounded disabled:opacity-50"
                            disabled={paginaActual[parte] === totalPaginas - 1}
                            onClick={() => cambiarPagina(parte, "next")}
                          >
                            Siguiente
                          </button>
                        </div>
                      )}
                    </Accordion.Content>
                  </Accordion.Panel>
                </Accordion>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnomaliasComponente;
