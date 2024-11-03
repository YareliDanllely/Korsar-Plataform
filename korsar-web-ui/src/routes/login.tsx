import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, FloatingLabel, Toast } from "flowbite-react";
import { HiExclamationCircle } from "react-icons/hi";
import 'flowbite';

function Login() {
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const onSubmit = async (data: FieldValues) => {
        const { username, password } = data as { username: string; password: string };

        try {
            const response = await axios.post('http://localhost:8000/api/token/', {
                username,
                password,
            });

            const token = response.data.access;
            const userId = response.data.user_id;  // Capturar el ID del usuario desde la respuesta
            const empresaId = response.data.empresa_id; // Capturar el ID de la empresa
            const usernameResponse = response.data.username; // Capturar el nombre de usuario


            console.log(`Token: ${token}, User ID: ${userId}`);

            // Almacena el token y el ID del usuario en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('empresa_id', empresaId);
            localStorage.setItem('username', usernameResponse);

            // Navega al dashboard
            navigate('/dashboard');

        } catch (error) {
            setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
        }
    };

    return (
        <div className="bg-korsar-azul-noche min-h-screen flex items-center justify-center">
            <div className="w-3/5 min-h-[80vh] max-h-[90vh] bg-white rounded-lg grid grid-cols-2 gap-0 overflow-y-auto">
                <div className="bg-white rounded-l-lg flex items-center justify-center">
                    <img src="/Isotipo_Korsar_Viento.png" alt="Description" className=" top-0 right-0 h-30 w-auto object-contain"></img>
                </div>

                <div className="bg-korsar-gris-100 rounded-r-lg p-8">
                    <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="mb-4 text-4xl">Iniciar sesión</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                            <div className="mb-2 w-full">
                                <FloatingLabel
                                    variant="filled"
                                    label="Usuario"
                                    {...register('username')}
                                />
                            </div>
                            <div className="mb-2 w-full">
                                <FloatingLabel
                                    variant="filled"
                                    label="Contraseña"
                                    {...register('password')}
                                    type="password"
                                />
                            </div>

                            {error && (
                                <Toast className="mt-4" onClick={() => setError(null)}>
                                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                        <HiExclamationCircle className="h-5 w-5" />
                                    </div>
                                    <div className="ml-3 text-sm font-normal">
                                        {error}
                                    </div>
                                    <Toast.Toggle />
                                </Toast>
                            )}

                            <div className="flex justify-center mt-4">
                                <Button type="submit" className="bg-korsar-turquesa-viento text-white rounded-full" pill>
                                    Iniciar sesión
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
