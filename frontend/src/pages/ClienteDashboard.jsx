import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import ViajeModal from '../components/ViajeModal';

export default function ClienteDashboard() {
  const [saldo, setSaldo] = useState(0);
  const [loadingSaldo, setLoadingSaldo] = useState(true);

  const [bancos, setBancos] = useState([]);

  const [recargaForm, setRecargaForm] = useState({ banco_id: '', referencia: '', monto: '' });
  const [recargaLoading, setRecargaLoading] = useState(false);
  const [recargaMsg, setRecargaMsg] = useState(null);

  const [trasladoForm, setTrasladoForm] = useState({ origen: '', destino: '' });
  const [trasladoLoading, setTrasladoLoading] = useState(false);
  const [trasladoError, setTrasladoError] = useState('');
  const [viajeAsignado, setViajeAsignado] = useState(null);

  const [recargas, setRecargas] = useState([]);
  const [recargasPage, setRecargasPage] = useState(1);
  const [recargasTotalPages, setRecargasTotalPages] = useState(1);
  const [recargasLoading, setRecargasLoading] = useState(false);

  const [traslados, setTraslados] = useState([]);
  const [trasladosPage, setTrasladosPage] = useState(1);
  const [trasladosTotalPages, setTrasladosTotalPages] = useState(1);
  const [trasladosLoading, setTrasladosLoading] = useState(false);

  const LIMIT = 20;

  const fetchSaldo = useCallback(async () => {
    try {
      const res = await api.get('/clientes/mi-saldo');
      setSaldo(res.data.data.saldo);
    } catch {
      // silent
    } finally {
      setLoadingSaldo(false);
    }
  }, []);

  const fetchBancos = useCallback(async () => {
    try {
      const res = await api.get('/bancos');
      setBancos(res.data.data || []);
    } catch {
      // silent
    }
  }, []);

  const fetchRecargas = useCallback(async (page) => {
    setRecargasLoading(true);
    try {
      const res = await api.get(`/recargas/mis-recargas?page=${page}&limit=${LIMIT}`);
      setRecargas(res.data.data);
      setRecargasTotalPages(res.data.totalPages);
    } catch {
      // silent
    } finally {
      setRecargasLoading(false);
    }
  }, []);

  const fetchTraslados = useCallback(async (page) => {
    setTrasladosLoading(true);
    try {
      const res = await api.get(`/traslados/mis-traslados?page=${page}&limit=${LIMIT}`);
      setTraslados(res.data.data);
      setTrasladosTotalPages(res.data.totalPages);
    } catch {
      // silent
    } finally {
      setTrasladosLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSaldo();
    fetchBancos();
    fetchRecargas(1);
    fetchTraslados(1);
  }, [fetchSaldo, fetchBancos, fetchRecargas, fetchTraslados]);

  const handleRecargaChange = (e) => {
    setRecargaForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRecargaSubmit = async (e) => {
    e.preventDefault();
    setRecargaMsg(null);
    setRecargaLoading(true);
    try {
      await api.post('/recargas', {
        banco_id: parseInt(recargaForm.banco_id, 10),
        referencia: recargaForm.referencia,
        monto: parseFloat(recargaForm.monto),
      });
      setRecargaMsg({ type: 'success', text: 'Recarga reportada exitosamente. Saldo actualizado.' });
      setRecargaForm({ banco_id: '', referencia: '', monto: '' });
      fetchSaldo();
      fetchRecargas(1);
      setRecargasPage(1);
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al reportar la recarga';
      setRecargaMsg({ type: 'error', text: Array.isArray(msg) ? msg.join(', ') : msg });
    } finally {
      setRecargaLoading(false);
    }
  };

  const handleTrasladoChange = (e) => {
    setTrasladoForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTrasladoSubmit = async (e) => {
    e.preventDefault();
    setTrasladoError('');
    setViajeAsignado(null);
    setTrasladoLoading(true);
    try {
      const res = await api.post('/traslados', {
        origen: trasladoForm.origen,
        destino: trasladoForm.destino,
        distancia_km: 5.0,
        tarifa_km: 1.5,
      });
      setViajeAsignado(res.data.data);
      setTrasladoForm({ origen: '', destino: '' });
      fetchSaldo();
      fetchTraslados(1);
      setTrasladosPage(1);
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al solicitar el traslado';
      setTrasladoError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setTrasladoLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Panel de Cliente</h1>
        <p className="text-slate-400 text-sm mt-1">Gestiona tu saldo, recargas y viajes</p>
      </div>

      {/* Saldo card */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider">Saldo Disponible</p>
            {loadingSaldo ? (
              <div className="h-8 w-24 bg-emerald-500/30 rounded animate-pulse mt-2" />
            ) : (
              <p className="text-4xl font-bold text-white mt-1">${saldo.toFixed(2)}</p>
            )}
          </div>
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Two-column forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recarga form */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Reportar Recarga</h2>

          {recargaMsg && (
            <div className={`text-sm p-3 rounded-xl mb-4 flex items-center gap-2 ${
              recargaMsg.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              <span>{recargaMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleRecargaSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Banco</label>
              <select
                name="banco_id"
                value={recargaForm.banco_id}
                onChange={handleRecargaChange}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">Seleccionar banco</option>
                {bancos.map((b) => (
                  <option key={b.id} value={b.id}>{b.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Número de Referencia</label>
              <input
                type="text"
                name="referencia"
                value={recargaForm.referencia}
                onChange={handleRecargaChange}
                required
                placeholder="REF-123456"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Monto ($)</label>
              <input
                type="number"
                name="monto"
                value={recargaForm.monto}
                onChange={handleRecargaChange}
                required
                min="0.01"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={recargaLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
            >
              {recargaLoading ? 'Procesando...' : 'Reportar Recarga'}
            </button>
          </form>
        </div>

        {/* Traslado form */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Solicitar Traslado</h2>

          {trasladoError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{trasladoError}</span>
            </div>
          )}

          <form onSubmit={handleTrasladoSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Dirección de Origen (A)</label>
              <input
                type="text"
                name="origen"
                value={trasladoForm.origen}
                onChange={handleTrasladoChange}
                required
                placeholder="Av. Principal, Edif. 123"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Dirección de Destino (B)</label>
              <input
                type="text"
                name="destino"
                value={trasladoForm.destino}
                onChange={handleTrasladoChange}
                required
                placeholder="Calle 5, Edif. 456"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={trasladoLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
            >
              {trasladoLoading ? 'Solicitando...' : 'Solicitar Viaje'}
            </button>
          </form>
        </div>
      </div>

      {/* Recargas table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">Historial de Recargas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="text-left p-4 font-semibold">Fecha</th>
                <th className="text-left p-4 font-semibold">Banco</th>
                <th className="text-left p-4 font-semibold">Referencia</th>
                <th className="text-right p-4 font-semibold">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {recargasLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">Cargando...</td>
                </tr>
              ) : recargas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">No hay recargas registradas</td>
                </tr>
              ) : (
                recargas.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 text-slate-300">{formatDate(r.fecha)}</td>
                    <td className="p-4 text-white">{r.banco?.nombre || '-'}</td>
                    <td className="p-4 text-slate-300 font-mono text-xs">{r.referencia}</td>
                    <td className="p-4 text-emerald-400 font-semibold text-right">${r.monto?.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {recargasTotalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-slate-700">
            <button
              disabled={recargasPage <= 1}
              onClick={() => { setRecargasPage((p) => p - 1); fetchRecargas(recargasPage - 1); }}
              className="px-3 py-1.5 text-sm rounded-lg bg-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-600 transition-colors"
            >
              Anterior
            </button>
            <span className="px-3 py-1.5 text-sm text-slate-400">
              {recargasPage} / {recargasTotalPages}
            </span>
            <button
              disabled={recargasPage >= recargasTotalPages}
              onClick={() => { setRecargasPage((p) => p + 1); fetchRecargas(recargasPage + 1); }}
              className="px-3 py-1.5 text-sm rounded-lg bg-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-600 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Traslados table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">Historial de Traslados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="text-left p-4 font-semibold">Fecha</th>
                <th className="text-left p-4 font-semibold">Origen</th>
                <th className="text-left p-4 font-semibold">Destino</th>
                <th className="text-left p-4 font-semibold">Chofer</th>
                <th className="text-right p-4 font-semibold">Costo</th>
                <th className="text-center p-4 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {trasladosLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">Cargando...</td>
                </tr>
              ) : traslados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No hay traslados registrados</td>
                </tr>
              ) : (
                traslados.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 text-slate-300 whitespace-nowrap">{formatDate(t.fecha)}</td>
                    <td className="p-4 text-white max-w-[160px] truncate">{t.origen}</td>
                    <td className="p-4 text-white max-w-[160px] truncate">{t.destino}</td>
                    <td className="p-4 text-slate-300">
                      {t.chofer?.user ? `${t.chofer.user.nombre} ${t.chofer.user.apellido}` : '-'}
                    </td>
                    <td className="p-4 text-emerald-400 font-semibold text-right">${t.monto_total?.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold ${
                        t.estado === 'COMPLETADO' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        t.estado === 'PENDIENTE' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        t.estado === 'CANCELADO' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {t.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {trasladosTotalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-slate-700">
            <button
              disabled={trasladosPage <= 1}
              onClick={() => { setTrasladosPage((p) => p - 1); fetchTraslados(trasladosPage - 1); }}
              className="px-3 py-1.5 text-sm rounded-lg bg-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-600 transition-colors"
            >
              Anterior
            </button>
            <span className="px-3 py-1.5 text-sm text-slate-400">
              {trasladosPage} / {trasladosTotalPages}
            </span>
            <button
              disabled={trasladosPage >= trasladosTotalPages}
              onClick={() => { setTrasladosPage((p) => p + 1); fetchTraslados(trasladosPage + 1); }}
              className="px-3 py-1.5 text-sm rounded-lg bg-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-600 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Viaje modal */}
      {viajeAsignado && (
        <ViajeModal traslado={viajeAsignado} onClose={() => setViajeAsignado(null)} />
      )}
    </div>
  );
}
