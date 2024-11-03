import { useEffect, useState } from 'react';

function Dashboard() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Obtener el ID del usuario desde localStorage
        const storedUserId = localStorage.getItem('userId');
        const storedEmpresaId = localStorage.getItem('empresa_id');
        const storedUsername = localStorage.getItem('username');

        setUserId(storedUserId);
        console.log(`User ID: ${storedUserId}`);
        console.log(`Empresa ID: ${storedEmpresaId}`);
        console.log(`Username: ${storedUsername}`);



    }, []);  // Se ejecuta cuando el componente se monta

    const parques = Array.from({ length: 2 }, (_, index) => index + 1); // Crea un array [1, 2, 3, 4, 5]

    return (
        <div>
            <h1>Dashboard</h1>
            {userId ? (
                <p>ID del usuario: {userId}</p>
            ) : (
                <p>No se ha encontrado el ID del usuario</p>
            )}

            <div className="grid grid-cols-1 grid-rows-2 gap-5 p-10">
                        {parques.map((parque) => (
                            <div className=' bg-white' key={parque}>{parque}</div>
                        ))}
        </div>

        </div>


    );
}

export default Dashboard;
