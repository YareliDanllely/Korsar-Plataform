import { useEffect, useState } from 'react';

function Dashboard() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Obtener el ID del usuario desde localStorage
        const storedUserId = localStorage.getItem('userId');
        setUserId(storedUserId);
        console.log(`User ID: ${storedUserId}`);
    }, []);  // Se ejecuta cuando el componente se monta

    return (
        <div>
            <h1>Dashboard</h1>
            {userId ? (
                <p>ID del usuario: {userId}</p>
            ) : (
                <p>No se ha encontrado el ID del usuario</p>
            )}
        </div>
    );
}

export default Dashboard;
