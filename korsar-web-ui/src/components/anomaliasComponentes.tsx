import React from "react";
import { Accordion } from "flowbite-react";
import { Anomalia } from "../utils/interfaces";

interface AnomaliasComponenteProps {
  cantidad: number;
  data: { [key: string]: Anomalia[] };
}

function AnomaliasComponente({ cantidad, data }: AnomaliasComponenteProps) {
  const partes = Object.keys(data).slice(0, cantidad);

  return (
    <div className="h-full w-full bg-white p-3 rounded-lg overflow-hidden">
      <h2 className="text-base mb-2">Condición de Hélice</h2>
      <div className={`grid gap-2 ${partes.length === 1 ? "grid-cols-1" : "grid-cols-2"} overflow-auto`}>
        {partes.map((parte) => (
          <div key={parte} className="text-center p-2 rounded-lg border overflow-hidden h-full">
            <h3 className="text-sm font-semibold capitalize">{parte.replace("_", " ")}</h3>
            <div className="mt-2 h-full overflow-auto"> {/* Contenedor con desplazamiento */}
              <Accordion collapseAll>
                <Accordion.Panel>
                  <Accordion.Title className="text-xs font-semibold">
                    <p className={`${data[parte].length ? "text-red-600" : "text-green-600"} font-semibold`}>
                      {data[parte].length ? "Dañada" : "Sin Daños"}
                    </p>
                  </Accordion.Title>
                  <Accordion.Content>
                    {data[parte].length ? (
                      data[parte].map((anomalia, idx) => (
                        <div key={idx} className="mt-1 text-left text-xs">
                          <p className="font-semibold">Detalles del daño:</p>
                          <p>Descripción: {anomalia.descripcion_anomalia}</p>
                          <p>Severidad: {anomalia.severidad_anomalia}</p>
                        </div>
                      ))
                    ) : (
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
}

export default AnomaliasComponente;
