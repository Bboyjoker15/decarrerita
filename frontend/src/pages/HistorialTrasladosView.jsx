import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LIMIT = 15;

export default function HistorialTrasladosView() {
  const { user } = useAuth();
  const [traslados, setTraslados] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');

  const fetchTraslados = useCallback(async (p) => {
    setLoading(true);
    try {
      let endpoint;
      if (user.rol === 'CLIENTE') {
        endpoint = '/traslados/mis-traslados';
      } else if (user.rol === 'CHOFER') {
        endpoint = '/traslados/chofer/mis-traslados';
      } else {
        endpoint = '/traslados';
      }
      const params = new URLSearchParams({ page: p, limit: LIMIT });
      if (fechaInicio) params.append('fechaInicio', fechaInicio);
      if (fechaFin) params.append('fechaFin', fechaFin);
      if (estadoFiltro) params.append('estado', estadoFiltro);

      const res = await api.get(`${endpoint}?${params}`);
      setTraslados(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setTraslados([]);
    } finally {
      setLoading(false);
    }
  }, [user.rol, fechaInicio, fechaFin, estadoFiltro]);

  useEffect(() => {
    fetchTraslados(page);
  }, [page, fetchTraslados]);

  const handleFilter = () => {
    setPage(1);
    fetchTraslados(1);
  };

  const clearFilters = () => {
    setFechaInicio('');
    setFechaFin('');
    setEstadoFiltro('');
    setPage(1);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Historial de Traslados</h1>
        <p className="text-slate-400 text-sm mt-1">Consulta y filtra tus traslados registrados</p>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Fecha Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Fecha Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Estado de Pago</label>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="">Todos</option>
              <option value="PENDIENTE">Pendientes por Cancelar</option>
              <option value="COMPLETADO">Completados</option>
              <option value="PAGADO">Cancelados</option>
              <option value="CANCELADO">Anulados</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleFilter}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
            >
              Filtrar
            </button>
            <button
              onClick={clearFilters}
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="text-left p-4 font-semibold">Fecha</th>
                <th className="text-left p-4 font-semibold">Origen</th>
                <th className="text-left p-4 font-semibold">Destino</th>
                {(user.rol === 'ADMIN' || user.rol === 'ADMINISTRATIVO') && (
                  <th className="text-left p-4 font-semibold">Cliente</th>
                )}
                <th className="text-left p-4 font-semibold">Chofer</th>
                <th className="text-center p-4 font-semibold">Estado</th>
                <th className="text-right p-4 font-semibold">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">Cargando...</td>
                </tr>
              ) : traslados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">No hay traslados registrados</td>
                </tr>
              ) : (
                traslados.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 text-slate-300 whitespace-nowrap">{formatDate(t.fecha)}</td>
                    <td className="p-4 text-white max-w-[160px] truncate">{t.origen}</td>
                    <td className="p-4 text-white max-w-[160px] truncate">{t.destino}</td>
                    {(user.rol === 'ADMIN' || user.rol === 'ADMINISTRATIVO') && (
                      <td className="p-4 text-slate-300">
                        {t.cliente?.user ? `${t.cliente.user.nombre} ${t.cliente.user.apellido}` : '-'}
                      </td>
                    )}
                    <td className="p-4 text-slate-300">
                      {t.chofer?.user ? `${t.chofer.user.nombre} ${t.chofer.user.apellido}` : '-'}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold ${
                        t.estado === 'COMPLETADO' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        t.estado === 'PENDIENTE' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        t.estado === 'PAGADO' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        t.estado === 'CANCELADO' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {t.estado}
                      </span>
                    </td>
                    <td className="p-4 text-emerald-400 font-semibold text-right">${t.monto_total?.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-700">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 text-sm rounded-lg bg-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-600 transition-colors"
            >
              Anterior
            </button>
            <span className="text-sm text-slate-400">Página {page} de {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 text-sm rounded-lg bg-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-600 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
