import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleRoutes = {
  CLIENTE: '/dashboard',
  ADMIN: '/dashboard',
  CHOFER: '/dashboard',
  ADMINISTRATIVO: '/dashboard',
};

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && user) {
    const route = roleRoutes[user.rol] || '/login';
    return <Navigate to={route} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(email, password);
      const route = roleRoutes[userData.rol] || '/login';
      navigate(route, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al conectar con el servidor';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F3F8] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="neu-card p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/logo.png" alt="Cross-Roads" className="w-40 h-40 object-contain" />
            </div>
            <h1 className="text-2xl font-black text-[#4A5568] tracking-tight">Cross-Roads</h1>
            <p className="text-sm text-[#718096] mt-1">Plataforma de Transporte Urbano</p>
          </div>

          {error && (
            <div className="bg-[#DE4B43]/10 text-[#DE4B43] text-sm p-3 rounded-xl mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@cross-roads.com"
                className="w-full bg-[#F0F3F8] rounded-xl px-4 py-3 text-[#4A5568] placeholder-[#718096]/50 shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F0F3F8] rounded-xl px-4 py-3 text-[#4A5568] placeholder-[#718096]/50 shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E36852] hover:bg-[#EA8559] disabled:bg-[#E36852]/60 text-white font-bold py-3 px-4 rounded-xl shadow-neu-sm transition-all duration-200 active:shadow-neu-inset-sm active:scale-[0.98] text-sm mt-2 flex justify-center items-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-[#718096] mt-6">
          &copy; {new Date().getFullYear()} Cross-Roads. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
