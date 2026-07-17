function VehicleIcon() {
  return (
    <svg className="w-6 h-6 text-[#E36852]" viewBox="0 0 52 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 16L6 34L46 34L46 16" />
      <path d="M8 16L8 10L30 10L36 16" />
      <circle cx="16" cy="30" r="3" fill="#E36852" stroke="none" />
      <circle cx="36" cy="30" r="3" fill="#E36852" stroke="none" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-5 h-5 text-[#F3A85B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg className="w-5 h-5 text-[#E36852]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg className="w-5 h-5 text-[#F3A85B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function ViajeModal({ traslado, onClose }) {
  if (!traslado) return null;

  const chofer = traslado.chofer;
  const vehiculo = traslado.vehiculo;

  const statusColorMap = {
    COMPLETADO: 'bg-[#E36852]/10 text-[#E36852] border-[#E36852]/20',
    PENDIENTE: 'bg-[#F3A85B]/10 text-[#F3A85B] border-[#F3A85B]/20',
    CANCELADO: 'bg-[#DE4B43]/10 text-[#DE4B43] border-[#DE4B43]/20',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="neu-card-lg max-w-md w-full p-6 animate-in" style={{ boxShadow: '16px 16px 32px #d1d9e6, -16px -16px 32px #ffffff' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <VehicleIcon />
            <h2 className="text-xl font-bold text-[#4A5568]">Viaje Asignado</h2>
          </div>
          <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold border ${statusColorMap[traslado.estado] || 'bg-[#718096]/10 text-[#718096] border-[#718096]/20'}`}>
            {traslado.estado}
          </span>
        </div>

        <div className="neu-card-sm p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <RouteIcon />
            <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">Recorrido</span>
          </div>
          <p className="text-sm font-medium text-[#4A5568] mb-1">
            <span className="text-[#718096]">Desde:</span> {traslado.origen}
          </p>
          <p className="text-sm font-medium text-[#4A5568]">
            <span className="text-[#718096]">Hasta:</span> {traslado.destino}
          </p>
        </div>

        <div className="space-y-4 mb-5">
          <h3 className="text-xs font-semibold text-[#718096] uppercase tracking-wider">Chofer Asignado</h3>
          <div className="neu-card-sm p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-[#E36852] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-neu-sm">
              {chofer?.user?.nombre?.[0]}{chofer?.user?.apellido?.[0]}
            </div>
            <div className="flex-1">
              <p className="text-[#4A5568] font-semibold">{chofer?.user?.nombre} {chofer?.user?.apellido}</p>
              <div className="flex items-center gap-1 text-sm text-[#718096]">
                <PhoneIcon />
                <span>{chofer?.user?.correo}</span>
              </div>
            </div>
          </div>
        </div>

        {vehiculo && (
          <div className="space-y-3 mb-5">
            <h3 className="text-xs font-semibold text-[#718096] uppercase tracking-wider">Vehículo</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="neu-card-sm p-3">
                <p className="text-xs text-[#718096]">Marca</p>
                <p className="text-sm text-[#4A5568] font-medium">{vehiculo.marca}</p>
              </div>
              <div className="neu-card-sm p-3">
                <p className="text-xs text-[#718096]">Modelo</p>
                <p className="text-sm text-[#4A5568] font-medium">{vehiculo.modelo}</p>
              </div>
              <div className="neu-card-sm p-3">
                <p className="text-xs text-[#718096]">Color</p>
                <p className="text-sm text-[#4A5568] font-medium">{vehiculo.color}</p>
              </div>
              <div className="neu-card-sm p-3">
                <p className="text-xs text-[#718096]">Placa</p>
                <p className="text-sm text-[#4A5568] font-medium">{vehiculo.placa}</p>
              </div>
            </div>
          </div>
        )}

        <div className="neu-card-sm p-4 mb-5 bg-[#E36852]/5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <DollarIcon />
              <span className="text-sm text-[#718096]">Monto Total</span>
            </div>
            <span className="text-xl font-bold text-[#E36852]">${traslado.monto_total?.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#E36852] hover:bg-[#EA8559] text-white font-bold py-3 px-4 rounded-xl shadow-neu-sm transition-all duration-200 active:shadow-neu-inset-sm active:scale-[0.98]"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
