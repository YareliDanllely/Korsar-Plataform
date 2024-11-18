import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from "flowbite-react";

const AdministradorSesion: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [tiempoRestante, setTiempoRestante] = useState<number>(120); // Tiempo restante en segundos
    const navegar = useNavigate();

    const TIEMPO_DE_VIDA_TOKEN = 30 * 60 * 1000; // 30 minutos en milisegundos
    const TIEMPO_AVISO = 1 * 60 * 1000; // Mostrar aviso 1 minuto antes de expirar

    useEffect(() => {
        // Verificar si el token existe al cargar la página
        const token = localStorage.getItem('token');
        if (!token) {
            cerrarSesion();
            return; // Detener ejecución si no hay token
        }

        // Temporizador para mostrar el modal antes de expirar el token
        const temporizadorModal = setTimeout(() => {
            setMostrarModal(true);
        }, TIEMPO_DE_VIDA_TOKEN - TIEMPO_AVISO);

        // Temporizador para cerrar la sesión automáticamente
        const temporizadorLogout = setTimeout(() => {
            cerrarSesion();
        }, TIEMPO_DE_VIDA_TOKEN);

        // Limpiar temporizadores cuando el componente se desmonte
        return () => {
            clearTimeout(temporizadorModal);
            clearTimeout(temporizadorLogout);
        };
    }, []);

    useEffect(() => {
        if (mostrarModal) {
            const cuentaRegresiva = setInterval(() => {
                setTiempoRestante((prev) => {
                    if (prev <= 1) {
                        clearInterval(cuentaRegresiva);
                        cerrarSesion();
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(cuentaRegresiva);
        }
    }, [mostrarModal]);

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        navegar('/login'); // Redirigir al login
    };

    const extenderSesion = async () => {
        try {
            const tokenRefresh = localStorage.getItem('refresh_token');
            if (!tokenRefresh) {
                cerrarSesion();
                return;
            }

            const respuesta = await axios.post('http://localhost:8000/api/token/refresh/', { refresh: tokenRefresh });
            localStorage.setItem('token', respuesta.data.access);
            setMostrarModal(false);
            setTiempoRestante(TIEMPO_DE_VIDA_TOKEN / 1000); // Reinicia el contador del aviso
        } catch (error) {
            console.error('Error al renovar el token:', error);
            cerrarSesion();
        }
    };

    return (
        <>
            <Modal
                dismissible
                show={mostrarModal}
                onClose={cerrarSesion}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            >
                <Modal.Header>Sesión por expirar</Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        Tu sesión está por expirar en <strong>{tiempoRestante}</strong> segundos.
                    </div>
                    <p className="text-center mt-2">
                        Puedes extender tu sesión o salir del sistema.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={extenderSesion} className="bg-teal-500">
                        Continuar sesión
                    </Button>
                    <Button color="gray" onClick={cerrarSesion}>
                        Cerrar sesión
                    </Button>
                </Modal.Footer>
            </Modal>
            {children}
        </>
    );
};

export default AdministradorSesion;
