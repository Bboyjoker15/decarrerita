export default function ClienteDashboard() {
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="bg-slate-850 p-6 rounded-2xl border border-slate-700 shadow-lg">
        <h2 className="text-2xl font-bold text-emerald-400">¡Panel de Cliente Operativo!</h2>
        <p className="text-slate-400 mt-1 text-sm">
          El sistema de enrutamiento por roles y el contexto global de autenticación están respondiendo correctamente.
        </p>
      </div>

      {/* Tarjetas de estado provisionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Mi Saldo</p>
          <p className="text-3xl font-black text-white mt-2">$0.00</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Viajes Realizados</p>
          <p className="text-3xl font-black text-white mt-2">0</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Estado de Cuenta</p>
          <p className="text-sm font-semibold text-emerald-400 mt-3 inline-block bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Activa
          </p>
        </div>
      </div>
    </div>
  );
}
