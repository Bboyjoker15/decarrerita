import { useState } from 'react';
import axios from 'axios';

// Configuración de la URL base utilizando la variable de entorno que ya tienes configurada
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Se cambia la estructura del cuerpo para enviar 'correo' en lugar de 'email'
            const response = await axios.post(`${API_URL}/auth/login`, {
                correo: email,        // Mapeo correcto para el validador del backend
                password: password,   // Se mantiene 'password' según los nombres estandarizados del ORM
            }, {
                timeout: 10000, // 10 seconds
            });

            const data = response.data.data || response.data;
            setUser(data.user);
            localStorage.setItem('token', data.token);

        } catch (err) {
            const mensajeError = err.response?.data?.error || 'Error al conectar con el servidor';
            setError(mensajeError);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        setEmail('');
        setPassword('');
    };

    // Vista cuando la sesión ya está iniciada exitosamente
    if (user) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white px-4">
                <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-emerald-400">Sesión iniciada</h1>
                    <p className="text-slate-400 mb-6">¡Conexión con el Backend exitosa!</p>

                    <div className="bg-slate-900/50 rounded-xl p-4 mb-6 border border-slate-700 text-left">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Usuario Autenticado</p>
                        <p className="text-sm font-medium text-slate-300 mt-1">{user.email}</p>
                        <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center">
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Rol Asignado</span>
                            <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/20">
                                {user.rol}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2.5 px-4 rounded-xl transition duration-200"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        );
    }

    // Formulario de Login
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Decarrerita</h2>
                    <p className="text-sm text-slate-400 mt-2">Plataforma de Transporte Urbano</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ejemplo@decarrerita.com"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-200 text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/20 transition duration-200 text-sm mt-2 flex justify-center items-center"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}