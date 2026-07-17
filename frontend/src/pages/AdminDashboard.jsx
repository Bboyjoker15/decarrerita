import { useState, useEffect } from 'react';
import api from '../services/api';
import AdminStaffDashboard from './AdminStaffDashboard';

function MetricCard({ label, value, loading, accent }) {
  return (
    <div className="neu-card p-6">
      <p className="text-[#718096] text-xs uppercase tracking-wider font-medium">{label}</p>
      {loading ? (
        <div className="h-8 w-20 bg-[#d1d9e6]/50 rounded-xl animate-pulse mt-2" />
      ) : (
        <p className="text-3xl font-bold text-[#4A5568] mt-1">{value}</p>
      )}
    </div>
  );
}

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
          className="text-[#E36852] hover:text-[#EA8559] text-sm font-semibold flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver al Dashboard
        </button>
        <AdminStaffDashboard />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#4A5568]">Panel de Administración</h1>
          <p className="text-[#718096] text-sm mt-1">Métricas generales del sistema</p>
        </div>
        <button
          onClick={() => setShowStaff(true)}
          className="bg-[#FFF8F0] text-[#E36852] font-bold py-2.5 px-5 rounded-xl shadow-neu-sm transition-all duration-200 active:shadow-neu-inset-sm active:scale-[0.98] text-sm hover:text-[#EA8559]"
        >
          Gestión Operativa
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Clientes" value={metrics.totalClientes} loading={loading} />
        <MetricCard label="Choferes Aptos" value={metrics.choferesAptos} loading={loading} />
        <MetricCard label="Viajes Hoy" value={metrics.viajesHoy} loading={loading} />
        <MetricCard
          label="Ganancias Históricas"
          value={`$${metrics.gananciasHistoricas.toFixed(2)}`}
          loading={loading}
        />
      </div>

      <div className="neu-card p-6">
        <h2 className="text-lg font-bold text-[#4A5568] mb-4">Herramientas de Gestión</h2>
        <p className="text-[#718096] text-sm mb-4">
          Acceda al panel de gestión operativa para administrar evaluaciones, liquidaciones, reportes y bancos.
        </p>
        <button
          onClick={() => setShowStaff(true)}
          className="bg-[#E36852] hover:bg-[#EA8559] text-white font-bold py-3 px-6 rounded-xl shadow-neu-sm transition-all duration-200 active:shadow-neu-inset-sm active:scale-[0.98] text-sm"
        >
          Ir a Gestión Operativa
        </button>
      </div>
    </div>
  );
}
