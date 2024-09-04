'use client'

import { useState } from "react";
import InputField from "../input/input";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/config";
import { sendEmailVerification } from 'firebase/auth'; // Importar la función para enviar el email
import { useRouter } from "next/navigation";

const SignUp: React.FC = () => {
    interface UserState {
        email: string;
        password: string;
    }

    const initialState: UserState = {
        email: '',
        password: ''
    };

    const [user, setUser] = useState<UserState>(initialState);
    const [createUserWithEmailAndPassword, , loading] = useCreateUserWithEmailAndPassword(auth);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            // Crear el usuario en Firebase
            const response = await createUserWithEmailAndPassword(user.email, user.password);
            
            if (response) {
                // Enviar el enlace de verificación de correo electrónico
                await sendEmailVerification(response.user);
                alert('El enlace de verificación ha sido enviado a tu correo electrónico.');
                
                // Limpiar el formulario
                setUser(initialState);
                
                // Redirigir al usuario a la página de inicio de sesión después de que se haya registrado
                router.push('/sign-in');
            }
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            alert('Hubo un error al crear la cuenta.');
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser(prevState => ({ ...prevState, [name]: value }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 dark:bg-gray-800">
            <div className="w-full max-w-sm bg-gray-800 dark:bg-gray-900 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-100 dark:text-gray-300 mb-6">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Email"
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />
                    <InputField
                        // La contraseña debe ser mínimo de 6 caracteres
                        label="Password"
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {loading ? 'Registrando...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
