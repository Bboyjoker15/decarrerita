import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const LIMIT = 15;

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
      // silent
    } finally {
      setLoading(false);
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

  const fetchVehiculos = useCallback(async () => {
    try {
      const perfil = await api.get('/choferes/me');
      const res = await api.get(`/vehiculos/chofer/${perfil.data.data.id}`);
      setVehiculos(res.data.data || []);
    } catch {
      // silent
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
      // silent
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
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

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Panel de Chofer</h1>
        <p className="text-slate-400 text-sm mt-1">Gestiona tu perfil, vehículos y viajes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-lg">
          <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Saldo Acumulado a Favor</p>
          <p className="text-4xl font-bold text-white mt-1">${chofer?.saldo?.toFixed(2) || '0.00'}</p>
        </div>
        <div className={`rounded-2xl p-6 shadow-lg ${
          esApto ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gradient-to-br from-amber-600 to-amber-800'
        }`}>
          <p className="text-white/80 text-sm font-medium uppercase tracking-wider">Estatus de Aptitud</p>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-2xl font-bold ${esApto ? 'text-white' : 'text-white'}`}>
              {esApto ? 'APTO' : 'NO APTO'}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
              esApto ? 'bg-white/20 text-white' : 'bg-white/20 text-white'
            }`}>
              {ultimaPrueba ? `Nota: ${ultimaPrueba.calificacion}` : 'Sin evaluación'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Registro de Cuenta Bancaria</h2>
          {bancoMsg && (
            <div className={`text-sm p-3 rounded-xl mb-4 flex items-center gap-2 ${
              bancoMsg.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              <span>{bancoMsg.text}</span>
            </div>
          )}
          <form onSubmit={handleBancoUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Banco</label>
              <select
                name="banco_id"
                value={bancoForm.banco_id}
                onChange={(e) => setBancoForm((p) => ({ ...p, banco_id: e.target.value }))}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="">Seleccionar banco</option>
                {bancos.map((b) => (
                  <option key={b.id} value={b.id}>{b.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Número de Cuenta</label>
              <input
                type="text"
                value={bancoForm.numero_cuenta}
                onChange={(e) => setBancoForm((p) => ({ ...p, numero_cuenta: e.target.value }))}
                required
                placeholder="0000-0000-00-0000000000"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={bancoLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
            >
              {bancoLoading ? 'Guardando...' : 'Actualizar Cuenta'}
            </button>
          </form>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            Contactos de Emergencia
            <span className="ml-2 text-xs text-slate-400 font-normal">({contactosCount}/2 mín)</span>
          </h2>
          {contactoMsg && (
            <div className={`text-sm p-3 rounded-xl mb-4 flex items-center gap-2 ${
              contactoMsg.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              <span>{contactoMsg.text}</span>
            </div>
          )}
          <div className="space-y-2 mb-4">
            {chofer?.contactos?.map((c) => (
              <div key={c.id} className="flex items-center justify-between bg-slate-900/50 rounded-xl p-3 border border-slate-700">
                <div>
                  <p className="text-sm text-white font-medium">{c.nombre} {c.apellido || ''}</p>
                  <p className="text-xs text-slate-400">{c.telefono} · {c.parentesco}</p>
                </div>
                <button
                  onClick={() => handleDeleteContacto(c.id)}
                  className="text-red-400 hover:text-red-300 transition-colors text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
            {(!chofer?.contactos || chofer.contactos.length === 0) && (
              <p className="text-slate-500 text-sm">No hay contactos registrados</p>
            )}
          </div>
          <form onSubmit={handleContactoSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={contactoForm.nombre}
                  onChange={handleContactoChange}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={contactoForm.apellido}
                  onChange={handleContactoChange}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={contactoForm.telefono}
                  onChange={handleContactoChange}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Parentesco</label>
                <input
                  type="text"
                  name="parentesco"
                  value={contactoForm.parentesco}
                  onChange={handleContactoChange}
                  required
                  placeholder="Hijo, Padre, Cónyuge..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={contactoLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
            >
              {contactoLoading ? 'Agregando...' : 'Agregar Contacto'}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
        <h2 className="text-lg font-bold text-white mb-4">Registro de Vehículo</h2>
        {vehiculoMsg && (
          <div className={`text-sm p-3 rounded-xl mb-4 flex items-center gap-2 ${
            vehiculoMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            <span>{vehiculoMsg.text}</span>
          </div>
        )}
        <form onSubmit={handleVehiculoSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Marca</label>
            <input
              type="text"
              name="marca"
              value={vehiculoForm.marca}
              onChange={handleVehiculoChange}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Modelo</label>
            <input
              type="text"
              name="modelo"
              value={vehiculoForm.modelo}
              onChange={handleVehiculoChange}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Placa</label>
            <input
              type="text"
              name="placa"
              value={vehiculoForm.placa}
              onChange={handleVehiculoChange}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Año</label>
            <input
              type="number"
              name="anio"
              value={vehiculoForm.anio}
              onChange={handleVehiculoChange}
              required
              min="2000"
              max="2030"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Color</label>
            <input
              type="text"
              name="color"
              value={vehiculoForm.color}
              onChange={handleVehiculoChange}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={vehiculoLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
            >
              {vehiculoLoading ? 'Registrando...' : 'Registrar Vehículo'}
            </button>
          </div>
        </form>
      </div>

      {vehiculos.length > 0 && (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Mis Vehículos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehiculos.map((v) => {
              const status = tieneRevision(v);
              return (
                <div key={v.id} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-semibold">{v.marca} {v.modelo}</p>
                      <p className="text-xs text-slate-400">{v.placa}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      status === 'apto' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      status === 'inactivo' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {status === 'apto' ? 'Apto' : status === 'inactivo' ? 'Inactivo' : 'Sin Revisión'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">Año:</span>
                      <span className="text-slate-300 ml-1">{v.anio}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Color:</span>
                      <span className="text-slate-300 ml-1">{v.color}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white">Bitácora de Viajes</h2>
          <select
            value={filtroEstado}
            onChange={(e) => { setFiltroEstado(e.target.value); setTrasladosPage(1); }}
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
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
              <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="text-left p-4 font-semibold">Fecha</th>
                <th className="text-left p-4 font-semibold">Origen</th>
                <th className="text-left p-4 font-semibold">Destino</th>
                <th className="text-right p-4 font-semibold">Monto Total</th>
                <th className="text-right p-4 font-semibold">Ganancia (70%)</th>
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
                  <td colSpan={6} className="p-8 text-center text-slate-500">No hay viajes registrados</td>
                </tr>
              ) : (
                traslados.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 text-slate-300 whitespace-nowrap">{formatDate(t.fecha)}</td>
                    <td className="p-4 text-white max-w-[160px] truncate">{t.origen}</td>
                    <td className="p-4 text-white max-w-[160px] truncate">{t.destino}</td>
                    <td className="p-4 text-emerald-400 font-semibold text-right">${t.monto_total?.toFixed(2)}</td>
                    <td className="p-4 text-blue-400 font-semibold text-right">${t.ganancia_chofer?.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold ${
                        t.estado === 'COMPLETADO' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        t.estado === 'PENDIENTE' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        t.estado === 'PAGADO' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
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
          <div className="flex items-center justify-between p-4 border-t border-slate-700">
            <button
              disabled={trasladosPage <= 1}
              onClick={() => setTrasladosPage((p) => p - 1)}
              className="px-3 py-1.5 text-sm rounded-lg bg-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-600 transition-colors"
            >
              Anterior
            </button>
            <span className="text-sm text-slate-400">Página {trasladosPage} de {trasladosTotalPages}</span>
            <button
              disabled={trasladosPage >= trasladosTotalPages}
              onClick={() => setTrasladosPage((p) => p + 1)}
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
