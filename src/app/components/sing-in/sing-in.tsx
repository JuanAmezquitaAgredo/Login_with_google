'use client';
import { useState } from "react";
import InputField from "../input/input";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

const SignIn: React.FC = () => {
    interface UserState {
        email: string;
        password: string;
    }

    const initialState: UserState = {
        email: '',
        password: ''
    };

    const [user, setUser] = useState<UserState>(initialState);
    const [signInWithEmailAndPassword, , loading] = useSignInWithEmailAndPassword(auth);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { 
        event.preventDefault();
        try {
            // Intentar iniciar sesión con Firebase
            const response = await signInWithEmailAndPassword(user.email, user.password);

            if (response) {
                // Verificar si el correo del usuario está verificado
                const userEmailVerified = response.user.emailVerified;
                
                if (userEmailVerified) {
                    alert('Login exitoso');
                    setUser(initialState);
                    router.push('/'); // Redirigir al inicio
                } else {
                    // Si el correo no está verificado
                    alert('Por favor, verifica tu correo antes de iniciar sesión.');
                }
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Hubo un error al iniciar sesión. Por favor, intenta de nuevo.');
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser(prevState => ({ ...prevState, [name]: value }));
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 dark:bg-gray-800">
            <div className="w-full max-w-sm bg-gray-800 dark:bg-gray-900 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-100 dark:text-gray-300 mb-6">
                    Sign In
                </h2>
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
                        {loading ? 'Iniciando sesión...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
};

export default SignIn;

