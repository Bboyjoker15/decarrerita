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

  const statusBadge = (estado) => {
    const map = {
      COMPLETADO: 'bg-[#E36852]/10 text-[#E36852] border-[#E36852]/20',
      PENDIENTE: 'bg-[#F3A85B]/10 text-[#F3A85B] border-[#F3A85B]/20',
      PAGADO: 'bg-[#DE4B43]/10 text-[#DE4B43] border-[#DE4B43]/20',
      CANCELADO: 'bg-[#DE4B43]/10 text-[#DE4B43] border-[#DE4B43]/20',
    };
    return map[estado] || 'bg-[#718096]/10 text-[#718096] border-[#718096]/20';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#4A5568]">Historial de Traslados</h1>
        <p className="text-[#718096] text-sm mt-1">Consulta y filtra tus traslados registrados</p>
      </div>

      <div className="neu-card p-5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Fecha Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full bg-[#F0F3F8] rounded-xl px-4 py-2.5 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Fecha Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full bg-[#F0F3F8] rounded-xl px-4 py-2.5 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Estado de Pago</label>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="w-full bg-[#F0F3F8] rounded-xl px-4 py-2.5 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
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
              className="flex-1 bg-[#E36852] hover:bg-[#EA8559] text-white text-sm font-bold py-2.5 px-4 rounded-xl shadow-neu-sm transition-all duration-200 active:shadow-neu-inset-sm active:scale-[0.98]"
            >
              Filtrar
            </button>
            <button
              onClick={clearFilters}
              className="bg-white text-[#718096] text-sm font-semibold py-2.5 px-4 rounded-xl shadow-neu-sm transition-all duration-200 active:shadow-neu-inset-sm hover:text-[#DE4B43]"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <div className="neu-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F0F3F8] text-[#718096] text-xs uppercase tracking-wider">
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
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#718096]">Cargando...</td>
                </tr>
              ) : traslados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#718096]">No hay traslados registrados</td>
                </tr>
              ) : (
                traslados.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F0F3F8] transition-colors">
                    <td className="p-4 text-[#718096] whitespace-nowrap">{formatDate(t.fecha)}</td>
                    <td className="p-4 text-[#4A5568] max-w-[160px] truncate">{t.origen}</td>
                    <td className="p-4 text-[#4A5568] max-w-[160px] truncate">{t.destino}</td>
                    {(user.rol === 'ADMIN' || user.rol === 'ADMINISTRATIVO') && (
                      <td className="p-4 text-[#718096]">
                        {t.cliente?.user ? `${t.cliente.user.nombre} ${t.cliente.user.apellido}` : '-'}
                      </td>
                    )}
                    <td className="p-4 text-[#718096]">
                      {t.chofer?.user ? `${t.chofer.user.nombre} ${t.chofer.user.apellido}` : '-'}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold border ${statusBadge(t.estado)}`}>
                        {t.estado}
                      </span>
                    </td>
                    <td className="p-4 text-[#E36852] font-semibold text-right">${t.monto_total?.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[#E2E8F0]">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="neu-btn px-3 py-1.5 text-sm text-[#718096] disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-sm text-[#718096]">Página {page} de {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="neu-btn px-3 py-1.5 text-sm text-[#718096] disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
