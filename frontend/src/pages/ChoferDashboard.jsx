import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const LIMIT = 15;

function StatusInfoIcon() {
  return (
    <svg className="w-6 h-6 text-[#E36852]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg className="w-6 h-6 text-[#F3A85B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

export default function ChoferDashboard() {
  const [chofer, setChofer] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bancos, setBancos] = useState([]);
  const [bancoForm, setBancoForm] = useState({ banco_id: '', numero_cuenta: '' });
  const [bancoMsg, setBancoMsg] = useState(null);
  const [bancoLoading, setBancoLoading] = useState(false);

  const [contactos, setContactos] = useState([]);
  const [contactoForm, setContactoForm] = useState({ nombre: '', apellido: '', telefono: '', parentesco: '' });
  const [contactoMsg, setContactoMsg] = useState(null);
  const [contactoLoading, setContactoLoading] = useState(false);

  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoForm, setVehiculoForm] = useState({ marca: '', modelo: '', placa: '', anio: '', color: '' });
  const [vehiculoMsg, setVehiculoMsg] = useState(null);
  const [vehiculoLoading, setVehiculoLoading] = useState(false);

  const [traslados, setTraslados] = useState([]);
  const [trasladosPage, setTrasladosPage] = useState(1);
  const [trasladosTotalPages, setTrasladosTotalPages] = useState(1);
  const [trasladosLoading, setTrasladosLoading] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('');

  const fetchChofer = useCallback(async () => {
    try {
      const res = await api.get('/choferes/me');
      setChofer(res.data.data);
      setBancoForm({
        banco_id: res.data.data.banco_id?.toString() || '',
        numero_cuenta: res.data.data.numero_cuenta || '',
      });
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBancos = useCallback(async () => {
    try {
      const res = await api.get('/bancos');
      setBancos(res.data.data || []);
    } catch {
    }
  }, []);

  const fetchVehiculos = useCallback(async () => {
    try {
      const perfil = await api.get('/choferes/me');
      const res = await api.get(`/vehiculos/chofer/${perfil.data.data.id}`);
      setVehiculos(res.data.data || []);
    } catch {
    }
  }, []);

  const fetchTraslados = useCallback(async (page, estado) => {
    setTrasladosLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (estado) params.append('estado', estado);
      const res = await api.get(`/traslados/chofer/mis-traslados?${params}`);
      setTraslados(res.data.data || []);
      setTrasladosTotalPages(res.data.totalPages || 1);
    } catch {
      setTraslados([]);
    } finally {
      setTrasladosLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChofer();
    fetchBancos();
    fetchVehiculos();
    fetchTraslados(1, filtroEstado);
  }, []);

  useEffect(() => {
    fetchTraslados(trasladosPage, filtroEstado);
  }, [trasladosPage, filtroEstado]);

  const handleBancoUpdate = async (e) => {
    e.preventDefault();
    setBancoMsg(null);
    setBancoLoading(true);
    try {
      await api.put('/choferes/me', {
        banco_id: parseInt(bancoForm.banco_id, 10),
        numero_cuenta: bancoForm.numero_cuenta,
      });
      setBancoMsg({ type: 'success', text: 'Cuenta bancaria actualizada' });
      fetchChofer();
    } catch (err) {
      const text = err.response?.data?.error || 'Error al actualizar cuenta';
      setBancoMsg({ type: 'error', text: Array.isArray(text) ? text.join(', ') : text });
    } finally {
      setBancoLoading(false);
    }
  };

  const handleContactoChange = (e) => {
    setContactoForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContactoSubmit = async (e) => {
    e.preventDefault();
    setContactoMsg(null);
    setContactoLoading(true);
    try {
      await api.post('/choferes/me/contactos', contactoForm);
      setContactoMsg({ type: 'success', text: 'Contacto agregado' });
      setContactoForm({ nombre: '', apellido: '', telefono: '', parentesco: '' });
      fetchChofer();
    } catch (err) {
      const text = err.response?.data?.error || 'Error al agregar contacto';
      setContactoMsg({ type: 'error', text: Array.isArray(text) ? text.join(', ') : text });
    } finally {
      setContactoLoading(false);
    }
  };

  const handleDeleteContacto = async (id) => {
    try {
      await api.delete(`/choferes/me/contactos/${id}`);
      fetchChofer();
    } catch {
    }
  };

  const handleVehiculoChange = (e) => {
    setVehiculoForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVehiculoSubmit = async (e) => {
    e.preventDefault();
    setVehiculoMsg(null);
    setVehiculoLoading(true);
    try {
      await api.post('/vehiculos/me', {
        ...vehiculoForm,
        anio: parseInt(vehiculoForm.anio, 10),
      });
      setVehiculoMsg({ type: 'success', text: 'Vehículo registrado' });
      setVehiculoForm({ marca: '', modelo: '', placa: '', anio: '', color: '' });
      fetchVehiculos();
    } catch (err) {
      const text = err.response?.data?.error || 'Error al registrar vehículo';
      setVehiculoMsg({ type: 'error', text: Array.isArray(text) ? text.join(', ') : text });
    } finally {
      setVehiculoLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#E36852] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const contactosCount = chofer?.contactos?.length || 0;
  const tieneRevision = (vehiculo) => {
    if (!vehiculo.revisiones || vehiculo.revisiones.length === 0) return 'sin_revision';
    const ultima = vehiculo.revisiones[vehiculo.revisiones.length - 1];
    return ultima.calificacion >= 65 ? 'apto' : 'inactivo';
  };
  const ultimaPrueba = chofer?.pruebas?.[chofer.pruebas.length - 1];
  const esApto = ultimaPrueba && ultimaPrueba.calificacion >= 73;

  const statusBadge = (estado) => {
    const map = {
      COMPLETADO: 'bg-[#E36852]/10 text-[#E36852] border-[#E36852]/20',
      PENDIENTE: 'bg-[#F3A85B]/10 text-[#F3A85B] border-[#F3A85B]/20',
      PAGADO: 'bg-[#DE4B43]/10 text-[#DE4B43] border-[#DE4B43]/20',
    };
    return map[estado] || 'bg-[#718096]/10 text-[#718096] border-[#718096]/20';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#4A5568]">Panel de Chofer</h1>
        <p className="text-[#718096] text-sm mt-1">Gestiona tu perfil, vehículos y viajes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="neu-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#718096] text-sm font-medium uppercase tracking-wider">Saldo Acumulado a Favor</p>
            <WalletIcon />
          </div>
          <p className="text-4xl font-bold text-[#4A5568] mt-1">${chofer?.saldo?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="neu-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#718096] text-sm font-medium uppercase tracking-wider">Estatus de Aptitud</p>
            <StatusInfoIcon />
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-2xl font-bold ${esApto ? 'text-[#E36852]' : 'text-[#F3A85B]'}`}>
              {esApto ? 'APTO' : 'NO APTO'}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${esApto ? 'bg-[#E36852]/10 text-[#E36852] border-[#E36852]/20' : 'bg-[#F3A85B]/10 text-[#F3A85B] border-[#F3A85B]/20'
              }`}>
              {ultimaPrueba ? `Nota: ${ultimaPrueba.calificacion}` : 'Sin evaluación'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="neu-card p-6">
          <h2 className="text-lg font-bold text-[#4A5568] mb-4">Registro de Cuenta Bancaria</h2>
          {bancoMsg && (
            <div className={`text-sm p-3 rounded-xl mb-4 flex items-center gap-2 ${bancoMsg.type === 'success' ? 'bg-[#E36852]/10 text-[#E36852]' : 'bg-[#DE4B43]/10 text-[#DE4B43]'
              }`}>
              <span>{bancoMsg.text}</span>
            </div>
          )}
          <form onSubmit={handleBancoUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Banco</label>
              <select
                name="banco_id"
                value={bancoForm.banco_id}
                onChange={(e) => setBancoForm((p) => ({ ...p, banco_id: e.target.value }))}
                required
                className="w-full bg-[#F0F3F8] rounded-xl px-4 py-3 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
              >
                <option value="">Seleccionar banco</option>
                {bancos.map((b) => (
                  <option key={b.id} value={b.id}>{b.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Número de Cuenta</label>
              <input
                type="text"
                value={bancoForm.numero_cuenta}
                onChange={(e) => setBancoForm((p) => ({ ...p, numero_cuenta: e.target.value }))}
                required
                placeholder="0000-0000-00-0000000000"
                className="w-full bg-[#F0F3F8] rounded-xl px-4 py-3 text-[#4A5568] placeholder-[#718096]/50 text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={bancoLoading}
              className="w-full bg-[#E36852] hover:bg-[#EA8559] disabled:bg-[#E36852]/60 text-white font-bold py-3 px-4 rounded-xl shadow-neu-sm transition-all duration-200 active:shadow-neu-inset-sm active:scale-[0.98] text-sm"
            >
              {bancoLoading ? 'Guardando...' : 'Actualizar Cuenta'}
            </button>
          </form>
        </div>

        <div className="neu-card p-6">
          <h2 className="text-lg font-bold text-[#4A5568] mb-4">
            Contactos de Emergencia
            <span className="ml-2 text-xs text-[#718096] font-normal">({contactosCount}/2 mín)</span>
          </h2>
          {contactoMsg && (
            <div className={`text-sm p-3 rounded-xl mb-4 flex items-center gap-2 ${contactoMsg.type === 'success' ? 'bg-[#E36852]/10 text-[#E36852]' : 'bg-[#DE4B43]/10 text-[#DE4B43]'
              }`}>
              <span>{contactoMsg.text}</span>
            </div>
          )}
          <div className="space-y-2 mb-4">
            {chofer?.contactos?.map((c) => (
              <div key={c.id} className="neu-card-sm p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#4A5568] font-medium">{c.nombre} {c.apellido || ''}</p>
                  <p className="text-xs text-[#718096]">{c.telefono} · {c.parentesco}</p>
                </div>
                <button
                  onClick={() => handleDeleteContacto(c.id)}
                  className="text-[#DE4B43] hover:text-[#DE4B43]/80 transition-colors text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>
            ))}
            {(!chofer?.contactos || chofer.contactos.length === 0) && (
              <p className="text-[#718096] text-sm">No hay contactos registrados</p>
            )}
          </div>
          <form onSubmit={handleContactoSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={contactoForm.nombre}
                  onChange={handleContactoChange}
                  required
                  className="w-full bg-[#F0F3F8] rounded-xl px-3 py-2.5 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-1">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={contactoForm.apellido}
                  onChange={handleContactoChange}
                  required
                  className="w-full bg-[#F0F3F8] rounded-xl px-3 py-2.5 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-1">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={contactoForm.telefono}
                  onChange={handleContactoChange}
                  required
                  className="w-full bg-[#F0F3F8] rounded-xl px-3 py-2.5 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-1">Parentesco</label>
                <input
                  type="text"
                  name="parentesco"
                  value={contactoForm.parentesco}
                  onChange={handleContactoChange}
                  required
                  placeholder="Hijo, Padre, Cónyuge..."
                  className="w-full bg-[#F0F3F8] rounded-xl px-3 py-2.5 text-[#4A5568] placeholder-[#718096]/50 text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={contactoLoading}
              className="w-full bg-[#F3A85B] hover:bg-[#EA8559] disabled:bg-[#F3A85B]/60 text-white font-bold py-2.5 px-4 rounded-xl shadow-neu-sm transition-all duration-200 active:shadow-neu-inset-sm active:scale-[0.98] text-sm"
            >
              {contactoLoading ? 'Agregando...' : 'Agregar Contacto'}
            </button>
          </form>
        </div>
      </div>

      <div className="neu-card p-6">
        <h2 className="text-lg font-bold text-[#4A5568] mb-4">Registro de Vehículo</h2>
        {vehiculoMsg && (
          <div className={`text-sm p-3 rounded-xl mb-4 flex items-center gap-2 ${vehiculoMsg.type === 'success' ? 'bg-[#E36852]/10 text-[#E36852]' : 'bg-[#DE4B43]/10 text-[#DE4B43]'
            }`}>
            <span>{vehiculoMsg.text}</span>
          </div>
        )}
        <form onSubmit={handleVehiculoSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Marca</label>
            <input
              type="text"
              name="marca"
              value={vehiculoForm.marca}
              onChange={handleVehiculoChange}
              required
              className="w-full bg-[#F0F3F8] rounded-xl px-4 py-3 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Modelo</label>
            <input
              type="text"
              name="modelo"
              value={vehiculoForm.modelo}
              onChange={handleVehiculoChange}
              required
              className="w-full bg-[#F0F3F8] rounded-xl px-4 py-3 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Placa</label>
            <input
              type="text"
              name="placa"
              value={vehiculoForm.placa}
              onChange={handleVehiculoChange}
              required
              className="w-full bg-[#F0F3F8] rounded-xl px-4 py-3 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Año</label>
            <input
              type="number"
              name="anio"
              value={vehiculoForm.anio}
              onChange={handleVehiculoChange}
              required
              min="2000"
              max="2030"
              className="w-full bg-[#F0F3F8] rounded-xl px-4 py-3 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider mb-2">Color</label>
            <input
              type="text"
              name="color"
              value={vehiculoForm.color}
              onChange={handleVehiculoChange}
              required
              className="w-full bg-[#F0F3F8] rounded-xl px-4 py-3 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={vehiculoLoading}
              className="w-full bg-[#E36852] hover:bg-[#EA8559] disabled:bg-[#E36852]/60 text-white font-bold py-3 px-4 rounded-xl shadow-neu-sm transition-all duration-200 active:shadow-neu-inset-sm active:scale-[0.98] text-sm"
            >
              {vehiculoLoading ? 'Registrando...' : 'Registrar Vehículo'}
            </button>
          </div>
        </form>
      </div>

      {vehiculos.length > 0 && (
        <div className="neu-card p-6">
          <h2 className="text-lg font-bold text-[#4A5568] mb-4">Mis Vehículos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehiculos.map((v) => {
              const status = tieneRevision(v);
              const statusMap = {
                apto: 'bg-[#E36852]/10 text-[#E36852] border-[#E36852]/20',
                inactivo: 'bg-[#DE4B43]/10 text-[#DE4B43] border-[#DE4B43]/20',
                sin_revision: 'bg-[#F3A85B]/10 text-[#F3A85B] border-[#F3A85B]/20',
              };
              const statusLabel = { apto: 'Apto', inactivo: 'Inactivo', sin_revision: 'Sin Revisión' };
              return (
                <div key={v.id} className="neu-card-sm p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[#4A5568] font-semibold">{v.marca} {v.modelo}</p>
                      <p className="text-xs text-[#718096]">{v.placa}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${statusMap[status]}`}>
                      {statusLabel[status]}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#718096]">Año:</span>
                      <span className="text-[#4A5568] ml-1">{v.anio}</span>
                    </div>
                    <div>
                      <span className="text-[#718096]">Color:</span>
                      <span className="text-[#4A5568] ml-1">{v.color}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="neu-card overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[#4A5568]">Bitácora de Viajes</h2>
          <select
            value={filtroEstado}
            onChange={(e) => { setFiltroEstado(e.target.value); setTrasladosPage(1); }}
            className="bg-[#F0F3F8] rounded-xl px-4 py-2 text-[#4A5568] text-sm shadow-neu-inset-sm focus:outline-none focus:shadow-neu-inset transition duration-200"
          >
            <option value="">Todos</option>
            <option value="PENDIENTE">Pendientes por Cancelar</option>
            <option value="COMPLETADO">Completados</option>
            <option value="PAGADO">Cancelados</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F0F3F8] text-[#718096] text-xs uppercase tracking-wider">
                <th className="text-left p-4 font-semibold">Fecha</th>
                <th className="text-left p-4 font-semibold">Origen</th>
                <th className="text-left p-4 font-semibold">Destino</th>
                <th className="text-right p-4 font-semibold">Monto Total</th>
                <th className="text-right p-4 font-semibold">Ganancia (70%)</th>
                <th className="text-center p-4 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {trasladosLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#718096]">Cargando...</td>
                </tr>
              ) : traslados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#718096]">No hay viajes registrados</td>
                </tr>
              ) : (
                traslados.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F0F3F8] transition-colors">
                    <td className="p-4 text-[#718096] whitespace-nowrap">{formatDate(t.fecha)}</td>
                    <td className="p-4 text-[#4A5568] max-w-[160px] truncate">{t.origen}</td>
                    <td className="p-4 text-[#4A5568] max-w-[160px] truncate">{t.destino}</td>
                    <td className="p-4 text-[#E36852] font-semibold text-right">${t.monto_total?.toFixed(2)}</td>
                    <td className="p-4 text-[#F3A85B] font-semibold text-right">${t.ganancia_chofer?.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold border ${statusBadge(t.estado)}`}>
                        {t.estado === 'PAGADO' ? 'Cancelado' : t.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {trasladosTotalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[#E2E8F0]">
            <button
              disabled={trasladosPage <= 1}
              onClick={() => setTrasladosPage((p) => p - 1)}
              className="neu-btn px-3 py-1.5 text-sm text-[#718096] disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-sm text-[#718096]">Página {trasladosPage} de {trasladosTotalPages}</span>
            <button
              disabled={trasladosPage >= trasladosTotalPages}
              onClick={() => setTrasladosPage((p) => p + 1)}
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
