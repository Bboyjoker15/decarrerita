import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PerfilConfigView() {
  const { user } = useAuth();
  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '', correo: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/auth/me');
        const u = res.data.data;
        setForm({ nombre: u.nombre, apellido: u.apellido, telefono: u.telefono, correo: u.correo });
      } catch {
        setMsg({ type: 'error', text: 'Error al cargar perfil' });
      } finally {
        setFetching(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      await api.put('/auth/me', form);
      setMsg({ type: 'success', text: 'Perfil actualizado exitosamente' });
    } catch (err) {
      const text = err.response?.data?.error || 'Error al actualizar perfil';
      setMsg({ type: 'error', text: Array.isArray(text) ? text.join(', ') : text });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#E36852] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#4A5568]">Configuración de Perfil</h1>
        <p className="text-[#718096] text-sm mt-1">Actualiza tus datos personales</p>
      </div>

      <div className="neu-card p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <label className="text-xs text-[#718096] uppercase tracking-wider font-semibold">Cédula</label>
            <p className="text-[#4A5568] font-medium mt-1">{user?.cedula || '-'}</p>
          </div>
          <div>
            <label className="text-xs text-[#718096] uppercase tracking-wider font-semibold">Rol</label>
            <span className="inline-block mt-1 bg-[#E36852]/10 text-[#E36852] text-xs px-2.5 py-1 rounded-full font-semibold border border-[#E36852]/20">
              {user?.rol}
            </span>
          </div>
        </div>

        {msg && (
          <div className={`text-sm p-3 rounded-xl flex items-center gap-2 ${msg.type === 'success'
              ? 'bg-[#E36852]/10 text-[#E36852]'
              : 'bg-[#DE4B43]/10 text-[#DE4B43]'
            }`}>
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full bg-[#F0F3F8] rounded-xl px-4 py-3 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                required
                className="w-full bg-[#F0F3F8] rounded-xl px-4 py-3 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
              className="w-full bg-[#F0F3F8] rounded-xl px-4 py-3 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              required
              placeholder="+58 XXX XXX XXXX"
              className="w-full bg-[#F0F3F8] rounded-xl px-4 py-3 text-[#4A5568] placeholder-[#718096]/50 text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E36852] hover:bg-[#EA8559] disabled:bg-[#E36852]/60 text-white font-bold py-3 px-4 rounded-xl shadow-neu-sm transition-all duration-200 active:shadow-neu-inset-sm active:scale-[0.98] text-sm flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}
