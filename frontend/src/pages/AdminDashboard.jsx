import { useState, useEffect } from 'react';
import api from '../services/api';
import AdminStaffDashboard from './AdminStaffDashboard';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalClientes: 0,
    choferesAptos: 0,
    viajesHoy: 0,
    gananciasHistoricas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showStaff, setShowStaff] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const hoy = new Date().toISOString().split('T')[0];
        const [cliRes, chofRes, viajesRes] = await Promise.all([
          api.get('/clientes?limit=1'),
          api.get('/choferes?limit=200'),
          api.get(`/traslados?fechaInicio=${hoy}&fechaFin=${hoy}&limit=200`),
        ]);

        const totalClientes = cliRes.data.total || 0;
        const choferes = chofRes.data.data || [];
        const choferesAptos = choferes.filter((c) => {
          const pruebas = c.pruebas || [];
          const ultima = pruebas[pruebas.length - 1];
          return ultima && ultima.calificacion >= 73;
        }).length;

        const viajesHoy = viajesRes.data.data || [];
        const gananciasHoy = viajesHoy.reduce((acc, v) => acc + (v.ganancia_empresa || 0), 0);

        const allViajesRes = await api.get('/traslados?limit=5000');
        const allViajes = allViajesRes.data.data || [];
        const gananciasHistoricas = allViajes.reduce((acc, v) => acc + (v.ganancia_empresa || 0), 0);

        setMetrics({ totalClientes, choferesAptos, viajesHoy: viajesHoy.length, gananciasHistoricas });
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (showStaff) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <button
          onClick={() => setShowStaff(false)}
          className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center gap-1"
        >
          ← Volver al Dashboard
        </button>
        <AdminStaffDashboard />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
          <p className="text-slate-400 text-sm mt-1">Métricas generales del sistema</p>
        </div>
        <button
          onClick={() => setShowStaff(true)}
          className="bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-colors"
        >
          Gestión Operativa
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 shadow-lg">
          <p className="text-emerald-100 text-xs uppercase tracking-wider font-medium">Total Clientes</p>
          {loading ? (
            <div className="h-8 w-16 bg-emerald-500/30 rounded animate-pulse mt-2" />
          ) : (
            <p className="text-3xl font-bold text-white mt-1">{metrics.totalClientes}</p>
          )}
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-lg">
          <p className="text-blue-100 text-xs uppercase tracking-wider font-medium">Choferes Aptos</p>
          {loading ? (
            <div className="h-8 w-16 bg-blue-500/30 rounded animate-pulse mt-2" />
          ) : (
            <p className="text-3xl font-bold text-white mt-1">{metrics.choferesAptos}</p>
          )}
        </div>
        <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl p-6 shadow-lg">
          <p className="text-amber-100 text-xs uppercase tracking-wider font-medium">Viajes Hoy</p>
          {loading ? (
            <div className="h-8 w-16 bg-amber-500/30 rounded animate-pulse mt-2" />
          ) : (
            <p className="text-3xl font-bold text-white mt-1">{metrics.viajesHoy}</p>
          )}
        </div>
        <div className="bg-gradient-to-br from-rose-600 to-rose-800 rounded-2xl p-6 shadow-lg">
          <p className="text-rose-100 text-xs uppercase tracking-wider font-medium">Ganancias Históricas</p>
          {loading ? (
            <div className="h-8 w-20 bg-rose-500/30 rounded animate-pulse mt-2" />
          ) : (
            <p className="text-3xl font-bold text-white mt-1">${metrics.gananciasHistoricas.toFixed(2)}</p>
          )}
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
        <h2 className="text-lg font-bold text-white mb-4">Herramientas de Gestión</h2>
        <p className="text-slate-400 text-sm mb-4">
          Acceda al panel de gestión operativa para administrar evaluaciones, liquidaciones, reportes y bancos.
        </p>
        <button
          onClick={() => setShowStaff(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
        >
          Ir a Gestión Operativa
        </button>
      </div>
    </div>
  );
}
