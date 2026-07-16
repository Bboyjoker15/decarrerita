export default function ViajeModal({ traslado, onClose }) {
  if (!traslado) return null;

  const chofer = traslado.chofer;
  const vehiculo = traslado.vehiculo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full animate-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Viaje Asignado</h2>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold border border-emerald-500/20">
              {traslado.estado}
            </span>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 mb-5 border border-slate-700">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Origen</p>
            <p className="text-sm text-white font-medium">{traslado.origen}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-3 mb-1">Destino</p>
            <p className="text-sm text-white font-medium">{traslado.destino}</p>
          </div>

          <div className="space-y-4 mb-5">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Chofer Asignado</h3>
            <div className="flex items-center gap-3 bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {chofer?.user?.nombre?.[0]}{chofer?.user?.apellido?.[0]}
              </div>
              <div>
                <p className="text-white font-semibold">{chofer?.user?.nombre} {chofer?.user?.apellido}</p>
                <p className="text-slate-400 text-sm">{chofer?.user?.correo}</p>
              </div>
            </div>
          </div>

          {vehiculo && (
            <div className="space-y-3 mb-5">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Vehículo</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                  <p className="text-xs text-slate-500">Marca</p>
                  <p className="text-sm text-white font-medium">{vehiculo.marca}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                  <p className="text-xs text-slate-500">Modelo</p>
                  <p className="text-sm text-white font-medium">{vehiculo.modelo}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                  <p className="text-xs text-slate-500">Color</p>
                  <p className="text-sm text-white font-medium">{vehiculo.color}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                  <p className="text-xs text-slate-500">Placa</p>
                  <p className="text-sm text-white font-medium">{vehiculo.placa}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-emerald-500/10 rounded-xl p-4 mb-5 border border-emerald-500/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Monto Total</span>
              <span className="text-xl font-bold text-emerald-400">${traslado.monto_total?.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
