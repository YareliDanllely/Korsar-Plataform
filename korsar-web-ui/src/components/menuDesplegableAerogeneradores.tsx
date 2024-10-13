import { Dropdown } from "flowbite-react";
import { useEffect, useState } from 'react';
import { obtenerAerogeneradores } from "../services/aerogeneradores";
import { obtenerComponentesAerogenerador } from "../services/componentesAerogeneradores";
import { Aerogenerador, ComponenteAerogenerador } from "../interfaces";

export function MenuDesplegableAerogeneradores({ uuid_parque_eolico, uuid_inspeccion }: { uuid_parque_eolico: string; uuid_inspeccion: string }) {
    const [aerogeneradores, setAerogeneradores] = useState<Aerogenerador[]>([]);
    const [componentes, setComponentes] = useState<ComponenteAerogenerador[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedAerogenerador, setSelectedAerogenerador] = useState<Aerogenerador | null>(null);

    useEffect(() => {
        const fetchAerogeneradores = async () => {
            try {
                const data = await obtenerAerogeneradores(uuid_parque_eolico, uuid_inspeccion);
                setAerogeneradores(data);
                console.log('Aerogeneradores:', data);
                if (data.length > 0) {
                    setSelectedAerogenerador(data[0]); // Seleccionar el primer aerogenerador por defecto
                }
            } catch (error) {
                setError('Error al obtener los Aerogeneradores');
                console.error('Error al obtener los Aerogeneradores:', error);
            }
        };
        fetchAerogeneradores();
    }, [uuid_parque_eolico, uuid_inspeccion]);

    useEffect(() => {
        const fetchComponentes = async () => {
            if (selectedAerogenerador) {
                try {
                    const data = await obtenerComponentesAerogenerador(selectedAerogenerador.uuid_aerogenerador, uuid_inspeccion);
                    console.log('Componentes:', data);
                    setComponentes(data);
                } catch (error) {
                    setError('Error al obtener los Componentes');
                    console.error('Error al obtener los Componentes:', error);
                }
            } else {
                setComponentes([]);
            }
        };
        fetchComponentes();
    }, [selectedAerogenerador, uuid_inspeccion]);

    return (
        <div className="flex items-center gap-4">
            {error && <p className="text-red-500">{error}</p>}

            {/* Dropdown de Componentes en la parte superior */}
            {selectedAerogenerador && (
                <Dropdown label="Componentes">
                    {componentes.map((componente) => (
                        <Dropdown.Item key={componente.uuid_componente}>
                            Tipo Componente: {componente.tipo_componente}
                        </Dropdown.Item>
                    ))}
                </Dropdown>
            )}


            {/* Dropdown de Aerogeneradores */}
            <Dropdown label={selectedAerogenerador ? `Aerogenerador ${selectedAerogenerador.numero_aerogenerador}` : 'Seleccione Aerogenerador'}>
                {aerogeneradores.map((aero) => (
                    <Dropdown.Item key={aero.uuid_aerogenerador} onClick={() => setSelectedAerogenerador(aero)}>
                        Número Aerogenerador: {aero.numero_aerogenerador}
                    </Dropdown.Item>
                ))}
            </Dropdown>
        </div>
    );
}
