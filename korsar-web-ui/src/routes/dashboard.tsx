import { useEffect, useState } from 'react';
import { obtenerParquesEmpresa } from '../services/parquesEolicos';
import { ParqueEolico } from '../utils/interfaces';
import SimpleMap from '../components/mapaParques';

function Dashboard() {
    const [userId, setUserId] = useState<string | null>(null);
    const [empresaId, setEmpresaId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [parquesEolicos, setParques] = useState<ParqueEolico[]>([]);

    useEffect(() => {
        setUserId(localStorage.getItem('user_id'));
        setEmpresaId(localStorage.getItem('empresa_id'));
        setUsername(localStorage.getItem('username'));
    }, []);

    useEffect(() => {
        const obtenerParquesEmpresaAsync = async () => {
            if (empresaId) {
                try {
                    const parques = await obtenerParquesEmpresa(empresaId);
                    console.log("Parques obtenidos:", parques);
                    setParques(parques);
                } catch (error) {
                    console.error("Error obteniendo parques:", error);
                }
            }
        };

        if (empresaId) {
            obtenerParquesEmpresaAsync();
        }
    }, [empresaId]);

    return (
        <div className='p-32 space-y-5'>
            {/* Contenedor principal del Dashboard */}
            <div className="bg-white w-full rounded-lg shadow-md p-16 flex">
                <div className="w-1/2 pr-8">
                    <h1>Dashboard</h1>
                    {userId && <p>ID del usuario: {userId}</p>}
                    {empresaId && <p>ID de la empresa: {empresaId}</p>}
                    {username && <p>Nombre de usuario: {username}</p>}
                </div>

                {/* Parte Derecha: Mapa */}
                <div className="w-1/2">
                    <SimpleMap />
                </div>
            </div>

            {/* Div para cada parque eólico debajo del contenedor principal */}
            <div className="space-y-4">
                {parquesEolicos.map((parque) => (
                    <div
                        key={parque.uuid_parque_eolico}
                        className="bg-white p-5 rounded-lg shadow-md"
                    >
                        <h2>{parque.nombre_parque}</h2>
                        <p>Coordenadas: ({parque.coordenada_latitud}, {parque.coordenada_longitud})</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
