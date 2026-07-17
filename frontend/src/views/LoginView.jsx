import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ParticlesBackground from '../components/lightswind/particles-background';

const roleRoutes = {
  CLIENTE: '/dashboard',
  ADMIN: '/dashboard',
  CHOFER: '/dashboard',
  ADMINISTRATIVO: '/dashboard',
};

export default function LoginView() {
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
    <div className="min-h-screen bg-[#E0E5EC] flex">
      <div className="hidden lg:flex w-[40%] bg-[#E0E5EC] relative overflow-hidden items-center justify-center">
        <ParticlesBackground
          colors={['#9c4400', '#f47d31', '#EA8559']}
          zIndex={0}
          height="100%"
        />
        <div className="neo-extruded rounded-[2.5rem] p-12 z-10 mx-8 text-center">
          <img
            src="/logo.png"
            alt="Cross-Roads Logo"
            className="w-24 h-24 object-contain mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-[#4A5568] mb-3">Cross-Roads</h2>
          <p className="text-base text-[#718096] leading-relaxed">
            Gestión inteligente de traslados urbanos con precisión digital
          </p>
        </div>
      </div>

      <div className="flex-1 bg-[#E0E5EC] flex items-center justify-center relative min-h-screen">
        <div className="absolute top-4 right-4 z-10">
          <Link
            to="/"
            className="neo-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-[#4A5568]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>

        <div className="w-full max-w-md px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-[#4A5568] tracking-tight">Comienza ahora</h1>
            <p className="text-[#718096] mt-2">Ingresa tus credenciales para acceder a la plataforma</p>
          </div>

          {error && (
            <div className="bg-[#DE4B43]/10 text-[#DE4B43] text-sm p-4 rounded-2xl mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="neo-input w-full rounded-2xl px-5 py-3.5 text-[#4A5568] placeholder-[#718096]/50 text-sm"
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
                className="neo-input w-full rounded-2xl px-5 py-3.5 text-[#4A5568] placeholder-[#718096]/50 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ background: '#f47d31' }}
              className="w-full text-white font-bold py-3.5 px-4 rounded-2xl text-sm flex justify-center items-center shadow-neu-lg transition-all duration-200 active:shadow-neu-inset active:scale-[0.98]"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="text-center text-xs text-[#718096] mt-8">
            &copy; {new Date().getFullYear()} Cross-Roads. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
